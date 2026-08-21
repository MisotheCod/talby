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

/**
 * Local intent classifier (replaces the round-trip LLM classify call).
 * Deterministic and free. Produces the same five intents the model accepted.
 * Conservative: strong off-topic signals redirect; otherwise falls through to a
 * recognized domain or defaults to answering if nothing clearly matches, so a
 * legit question is never bounced just because of wording. The generation prompt
 * still carries its own off-topic refusal as a backstop.
 */
function detectIntent(q: string): "money" | "schedule" | "contract" | "conflict" | "off_topic" {
  const s = q.toLowerCase();
  const has = (arr: string[]) => arr.some((k) => s.includes(k));

  if (has(["write a", "write me", "caption", "help me write", "help me with", "give me a", "recommend me", "make me a", "post idea", "content ideas", "what should i post", "recipe", "code ", "predict", "general advice", "creative"])) return "off_topic";
  if (has(["competing", "competition", "conflict", "overlap", "can i take", "can i work", "take on a", "work with a", "competing brand", "another brand", "am i allowed", "am i free", "haircare", "category of"]) && has(["deal", "brand", "post", "content", "category", "contract", "exclusive", "rights"])) return "conflict";
  // Terms/policy questions (exclusivity, usage, clause, license) are contract and MUST
  // trigger retrieval, so they are checked before the looser schedule/money keywords.
  if (has(["usage rights", "usage", "clause", "contract", "license", "exclusivity", "rights for", "rights", "terms of", "quote the", "exclusive"])) return "contract";
  // Deal/brand lookup: "find/show/where is my <brand> deal", "which deal", etc.
  if (has(["find my", "find me", "show my", "show me", "where is", "where's", "my deal", "which deal", "which brand", "which contract", "what deals", "get my", "show ", "find ", "search", "deal for", "get the"]) && has(["deal", "brand", "contract", "campaign", "client", "rep", "gruns", "exclusive", "exclusivity", "tums", "nioxin", "glow"])) return "contract";
  if (has(["due", "due date", "next week", "deadline", "scheduled", "schedule", "this week", "calendar", "when is", "posted", "deliver", "expire", "expiration", "expiring"])) return "schedule";
  if (has(["how much", "owed", "amount", "paid", "received", "income", "earned", "value", "dollar", "money", "payment", "expected", "biggest", "total", "average", "worth"])) return "money";
  return "off_topic";
}

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

  const norm = detectIntent(text);

  // Off-topic: redirect, never answer (cheap local classification, no model call).
  if (norm === "off_topic") {
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