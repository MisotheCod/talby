import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { complete, embed, type AssistantMsg } from "@/lib/assistant-ai";
import { OPENROUTER_API_KEY } from "@/lib/config";

/**
 * POST /api/assistant  { message }
 * Talby Assistant (paid tier). Answers questions about the user's OWN deals,
 * payments, contracts, and calendar from retrieved data only. It is not a
 * general assistant; off-topic requests are redirected.
 *
 * Boundary:
 * - Every data fetch is through the user's session client (RLS). No service-role
 *   read of user data happens on this path.
 * - Contract retrieval is semantic over the user's OWN contract_chunks.
 * - Conflict questions return quoted exclusivity clauses + links, never a verdict.
 * - Unknown answers say so; the model must never guess a term.
 * - Free users are hard-blocked (402) before any model call.
 */
type Row = Record<string, unknown>;

const INTENT_SYSTEM = [
  'You classify a question about a creator\'s own brand-deal data into exactly one intent.',
  'Return ONLY a single token, no prose: "money" | "schedule" | "contract" | "conflict" | "off_topic".',
  "money = owed/paid/income/deal value/amount",
  "schedule = content calendar, due dates, deliverables deadlines, what's due next week",
  "contract = a specific contract's terms (usage rights, exclusivity dates, payment terms), quote clauses",
  "conflict = whether the creator can take another brand in a category, competing / overlapping deals",
  "off_topic = anything unrelated to the user's own Talby data (caption writing, general advice, etc.)",
  "A question about a brand's category fit or a competing brand is 'conflict', not 'contract'.",
].join("\n");

const GROUND_SYSTEM = [
  "You are Talby Assistant, grounded solely in the user's own Talby data below (deals, payments, content, to-dos, and contract clauses).",
  "Answer ONLY from that data. Do arithmetic when needed. NEVER answer from general knowledge.",
  "When quoting a contract clause, quote it verbatim. Do not paraphrase it away.",
  "If the data does not contain the answer, say plainly: I don't see that in your Talby data. Never guess.",
  "For conflict questions: quote the relevant exclusivity clauses verbatim and name which deal each applies to. Do NOT give a blanket yes/no; present the clauses and let the creator decide.",
  "",
  "=== USER'S DATA ===",
].join("\n");

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });

  const prof = await supabase.from("profiles").select("plan").eq("id", user.id).single();
  if ((prof.data as unknown as { plan?: string } | null)?.plan !== "paid") {
    return NextResponse.json({ error: "paid_required" }, { status: 402 });
  }
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json({ error: "Assistant AI is not configured." }, { status: 500 });
  }

  const body = (await req.json().catch(() => null)) as { text?: string } | null;
  const text = body?.text?.trim();
  if (!text) return NextResponse.json({ error: "text required" }, { status: 400 });

  const intent = await complete({
    messages: [
      { role: "system", content: INTENT_SYSTEM },
      { role: "user", content: text },
    ],
    max_tokens: 8,
  }).catch(() => "off_topic");
  const norm = intent.trim().toLowerCase();

  // Off-topic: redirect, never answer.
  if (norm === "off_topic" || (["money", "schedule", "contract", "conflict"] as const).every((k) => !norm.includes(k))) {
    return NextResponse.json({
      ok: true, intent: "off_topic",
      answer: "I can only answer about your own Talby data: deals, payments, contracts, and calendar. Ask me something like how much you're owed, when something is due, or a contract clause.",
      citations: [],
    });
  }

  // ---- load the USER's OWN data (RLS) ----
  const deals = ((await supabase.from("deals")
    .select("id, brand, status, value, deliverable, pay_terms, exclusivity_days, due_date, notes, active")
    .eq("user_id", user.id)).data ?? []) as Row[];
  const payments = ((await supabase.from("payments")
    .select("id, amount, status, expected_date, deal:deals(brand)")
    .eq("user_id", user.id)).data ?? []) as Row[];
  const calendar = ((await supabase.from("content")
    .select("id, title, event_date, platform, post_type, linked_deal_id")
    .eq("user_id", user.id).order("event_date", { ascending: true })).data ?? []) as Row[];
  const todos = ((await supabase.from("todos")
    .select("id, title, due_date, done").eq("user_id", user.id)).data ?? []) as Row[];

  const activeDeals = deals.filter((d) => (d.active as boolean) !== false);

  // ---- build grounded context ----
  const dealsBlock = deals.map((d) =>
    `- ${d.brand} | ${d.status} | value ${d.value ?? "n/a"} | ${d.deliverable ?? "no deliverable"} | due ${d.due_date ?? "n/a"} | pay ${d.pay_terms ?? "n/a"}` +
    (d.exclusivity_days != null ? ` | exclusivity ${d.exclusivity_days} days` : "") +
    (d.notes ? ` | ${d.notes}` : "")
  ).join("\n");

  const payBlock = payments.map((p) => {
    const brand = (p.deal as Row | null)?.brand ?? "no deal";
    return `- ${brand} | ${p.status} | ${p.amount} | ${p.expected_date ?? "no date"}`;
  }).join("\n") || "(no payments)";

  const calBlock = calendar.map((c) => `- [${c.event_date}] ${c.title}`).join("\n") || "(no content)";
  const todoBlock = todos.map((t) => `- ${t.title} (due ${t.due_date ?? "n/a"}, done ${t.done})`).join("\n") || "(no to-dos)";

  const expected = payments.filter((p) => p.status !== "received").reduce((s, p) => s + Number(p.amount || 0), 0);
  const received = payments.filter((p) => p.status === "received").reduce((s, p) => s + Number(p.amount || 0), 0);
  const biggest = [...deals].sort((a, b) => Number(b.value || 0) - Number(a.value || 0))[0];
  const computed = `today: ${new Date().toISOString().slice(0, 10)}\ntotal expected: ${expected}\ntotal received: ${received}\nbiggest deal: ${biggest?.brand ?? "none"} (${biggest?.value ?? 0})`;

  // ---- contract / conflict retrieval over the user's OWN chunks ----
  let clauseCtx = "";
  if (norm.includes("contract") || norm.includes("conflict")) {
    const qEmbed = await embed(text).catch(() => []);
    let lines: string[] = [];
    // Retrieve enough to cover a broad conflict (a category question can span many
    // contracts). 10 chunks (~2-10 contracts) balances cost vs recall for this stress.
    if (qEmbed.length) {
      const hits = ((await supabase.rpc("match_contract_chunks", {
        query_embedding: qEmbed as number[], match_user_id: user.id, match_count: 10,
      }) as { data?: Row[] }).data ?? []) as Row[];
      lines = hits.map((h) => {
        const d = deals.find((x) => x.id === h.deal_id);
        return `[${(d?.brand as string) ?? "Contract"}]\n${h.content}`;
      });
    }
    if (!lines.length) {
      const all = ((await supabase.from("contract_chunks")
        .select("content, deal_id").eq("user_id", user.id)).data ?? []) as Row[];
      lines = all.map((h) => {
        const d = deals.find((x) => x.id === h.deal_id);
        return `[${(d?.brand as string) ?? "Contract"}]\n${h.content}`;
      });
    }
    // Coverage accounting: how many total deal-contracts exist vs how many we fetched.
    // If the query's answer needs a clause we didn't retrieve, we must say the picture
    // may be incomplete rather than present a partial set as complete.
    const { count: totalContracts } = (await supabase.from("deal_contracts")
      .select("deal_id", { count: "exact", head: true }).eq("user_id", user.id)) as { count: number };
    const seenDeals = new Set(lines.map((l) => { const m = l.match(/^\[(.+?)\]/); return m ? m[1] : ""; }));
    const coveredCount = lines.filter((l) => l.startsWith("[")).length;
    const brands = activeDeals.map((d) => d.brand as string).join("; ");
    clauseCtx = [
      `Active deals: ${brands || "(none)"}`,
      "Clauses from the user's own contracts (quote verbatim):",
      lines.length ? lines.join("\n\n") : "(no contract clauses stored)",
      "",
      `Coverage note: you are seeing ${coveredCount ? seenDeals.size + " of " + (totalContracts || 0) + " contract(s)" : "0 of " + (totalContracts || 0) + " contracts"}. If the question needs a contract you do not see listed, say so plainly rather than guessing its terms.`,
    ].join("\n\n");
  }

  const userContent: AssistantMsg[] = [
    { role: "system", content: GROUND_SYSTEM },
    { role: "system", content: dealsBlock ? `Deals:\n${dealsBlock}` : "Deals: (none)" },
    { role: "system", content: `Payments:\n${payBlock}` },
    { role: "system", content: `Content calendar:\n${calBlock}` },
    { role: "system", content: `To-dos:\n${todoBlock}` },
    { role: "system", content: `Computed:\n${computed}` },
  ];
  if (clauseCtx) userContent.push({ role: "system", content: `Contract clauses:\n${clauseCtx}` });
  userContent.push({
    role: "user",
    content: [
      text,
      "",
      "Answer using only the data above.",
      "For a conflict question, do NOT give a blanket yes or no. Quote every relevant exclusivity clause verbatim, name which deal each applies to, and let the creator decide. If a clause or brand isn't present in the data, say you don't see it.",
      "If the data does not contain the answer, say plainly that you don't see it in their Talby data.",
      "After your answer, on its own line, output: CITATIONS: <comma-separated deal brand names you actually used, or NONE>",
    ].join("\n"),
  });

  const answerRaw = await complete({ messages: userContent });
  const [body0, citeLine = ""] = answerRaw.split(/CITATIONS?:/i);
  const answer = (body0 || answerRaw).trim();
  const citedBrands = citeLine.split(",").map((s) => s.trim()).filter(Boolean);
  const citations = citedBrands
    .map((b) => deals.find((d) => (d.brand as string).toLowerCase() === b.toLowerCase()))
    .filter((d): d is Row => !!d)
    .map((d) => ({ dealId: d.id as string, brand: d.brand as string }));

  return NextResponse.json({ ok: true, intent: norm, answer, citations, hasContracts: !!clauseCtx });
}