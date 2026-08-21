import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { OPENROUTER_API_KEY } from "@/lib/config";

export const dynamic = "force-dynamic";
// Contract text extraction is CPU/IO bound; Node runtime keeps unpdf's worker happy.
export const runtime = "nodejs";

/** Max upload: 6 MB. */
const MAX_BYTES = 6 * 1024 * 1024;

/**
 * Contract upload -> auto-pulled deal.
 * POST /api/deals/extract-contract  (multipart form data, field "file")
 * Extracts text from the PDF/text, runs the same OpenRouter engine as the
 * import/inbox features, and returns structured deal fields so the client can
 * prefill the DealForm. Paid-tier gated.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });

  const prof = await supabase.from("profiles").select("plan").eq("id", user.id).single();
  const plan = (prof.data as unknown as { plan?: string } | null)?.plan ?? "free";
  if (plan !== "paid") {
    return NextResponse.json({ error: "Contract auto-fill is on the paid plan." }, { status: 403 });
  }
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json({ error: "Extraction AI is not configured." }, { status: 500 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 6 MB)." }, { status: 413 });
  }

  const name = file.name.toLowerCase();
  const isPdf = name.endsWith(".pdf");
  const isText = name.endsWith(".txt") || name.endsWith(".md") || file.type.startsWith("text/");

  let text = "";
  if (isPdf) {
    try {
      // Extract text via `unpdf` — a pdfjs wrapper built for Node/edge runtimes
      // that bundles its own worker, so it works on serverless without DOM
      // globals or worker-file tracing issues.
      const { extractText } = await import("unpdf");
      const data = new Uint8Array(await file.arrayBuffer());
      const out = await extractText(data);
      text = (out.text ?? []).join(" ");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("extract-contract pdf error:", msg);
      return NextResponse.json({ error: "Couldn't read the PDF. It may be a scanned image with no selectable text." }, { status: 422 });
    }
  } else if (isText) {
    text = await file.text();
  } else {
    return NextResponse.json({ error: "Please upload a PDF or text file." }, { status: 415 });
  }

  text = text.slice(0, 30000);
  if (!text.trim()) {
    return NextResponse.json({ error: "Couldn't read any text from that file." }, { status: 422 });
  }
  const fields = await extractDealFields(text);
  // Return the extracted text too (additive) so the client can hand it to the
  // assistant ingest route for chunking + embedding. Extraction itself is unchanged.
  return NextResponse.json({ ok: true, fields, text });
}

const SYSTEM = [
  "You are Talby's contract parser. You read a creator-influencer brand-deal contract or SOW and extract the deal's key terms into structured JSON.",
  "",
  "Extract EVERY field below. For anything absent or unstated, set it to null — NEVER invent values.",
  "- brand: the company/brand commissioning the work (from the contract, not the filer).",
  "- deliverable: the content/deliverables requested, e.g. '2 Instagram Reels + 3 Stories'.",
  "- value_total: the total compensation as a number (USD). Combine fees if multiple line items.",
  "- pay_terms: map payment timing to one of exactly: 'due_on_receipt','net_15','net_30','net_45','net_60','net_90','milestone'. If a Net term or due-on-receipt is stated, use it; if payment is split into installments/milestones, use 'milestone'; if nothing stated, null.",
  "- exclusivity_days: number of days of exclusivity (no competing brand posts), as an integer; if only dates are given, compute the approximate day count; if none, null.",
  "- due_date: the deadline for final deliverables in YYYY-MM-DD; null if unstated.",
  "- rep_name: the human representative's name; null if unknown.",
  "- rep_email: the representative's email; null if unknown.",
  "- platforms: comma-separated platforms (Instagram, TikTok, YouTube...); null if none.", "",
  "Respond with STRICT JSON only:",
  '{"brand":..., "deliverable":..., "value_total":<number|null>, "pay_terms":..., "exclusivity_days":<int|null>, "due_date":..., "rep_name":..., "rep_email":..., "platforms":...}',
].join("\n");

async function extractDealFields(text: string): Promise<Record<string, unknown>> {
  const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      "X-Title": "Talby Contract",
    },
    body: JSON.stringify({
      model: "google/gemini-3.5-flash-lite",
      messages: [{ role: "system", content: SYSTEM }, { role: "user", content: text }],
      temperature: 0,
      response_format: { type: "json_object" },
    }),
  });
  if (!resp.ok) throw new Error("OpenRouter extraction failed: " + resp.status);
  const data = await resp.json();
  const content = data?.choices?.[0]?.message?.content ?? "";
  try {
    return JSON.parse(content);
  } catch {
    const m = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    return JSON.parse(m ? m[1] : "{}");
  }
}