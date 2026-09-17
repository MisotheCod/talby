import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { OPENROUTER_API_KEY } from "@/lib/server-config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Max upload: 6 MB. */
const MAX_BYTES = 6 * 1024 * 1024;

/**
 * Invoice upload -> auto-pulled pay-by.
 * POST /api/deals/extract-invoice  (multipart form data, field "file")
 *
 * Extracts text from an invoice PDF/text, runs the same OpenRouter engine as
 * the contract extractor, and returns the invoice's money + timing facts so
 * the client can set pay status to invoiced and derive the expected (pay-by)
 * date. Two-phase, NON-destructive: the client shows extracted vs current and
 * lets the user accept or keep — never a silent overwrite. If extraction finds
 * no usable date/terms, it says so and the client leaves pay-by alone.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });

  const prof = await supabase.from("profiles").select("plan").eq("id", user.id).single();
  const plan = (prof.data as unknown as { plan?: string } | null)?.plan ?? "free";
  if (plan !== "paid") {
    return NextResponse.json({ error: "Invoice extraction is on the paid plan." }, { status: 403 });
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
      const { extractText } = await import("unpdf");
      const data = new Uint8Array(await file.arrayBuffer());
      const out = await extractText(data);
      text = (out.text ?? []).join(" ");
    } catch {
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

  const fields = await extractInvoiceFields(text);
  return NextResponse.json({ ok: true, ...fields });
}

const SYSTEM = [
  "You are Talby's invoice parser. You read an invoice or bill sent to a creator for a brand collaboration and extract the money and due-date facts into structured JSON.",
  "",
  "Extract EXACTLY these fields. For anything absent or unstated, set that field to null — NEVER invent values.",
  "- invoice_date: the invoice issue date in YYYY-MM-DD; null if not stated.",
  "- due_date: the payment due date in YYYY-MM-DD if the invoice states one explicitly; null if only terms are stated.",
  "- net_terms: one of 'due_on_receipt','net_15','net_30','net_45','net_60','net_90' when the invoice states payment terms (e.g. 'Net 30'), else null.",
  "- amount: the total amount on the invoice as a number (USD); null if not stated.",
  "- brand: the company/payee on the invoice; null if unclear.",
  "If the invoice states BOTH an explicit due date AND terms, return the explicit due date in due_date and the terms in net_terms. Do not compute due_date from terms yourself — the client does that with the invoice_date.",
  "",
  "Respond with STRICT JSON only:",
  '{"invoice_date":..., "due_date":..., "net_terms":..., "amount":..., "brand":...}',
].join("\n");

async function extractInvoiceFields(text: string): Promise<{
  invoice_date: string | null;
  due_date: string | null;
  net_terms: string | null;
  amount: number | null;
  brand: string | null;
}> {
  const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      "X-Title": "Talby Invoice",
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
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(content);
  } catch {
    const m = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    parsed = JSON.parse(m ? m[1] : "{}");
  }
  return {
    invoice_date: typeof parsed.invoice_date === "string" ? parsed.invoice_date : null,
    due_date: typeof parsed.due_date === "string" ? parsed.due_date : null,
    net_terms: typeof parsed.net_terms === "string" ? parsed.net_terms : null,
    amount: typeof parsed.amount === "number" ? parsed.amount : (parsed.amount != null ? Number(parsed.amount) : null),
    brand: typeof parsed.brand === "string" ? parsed.brand : null,
  };
}