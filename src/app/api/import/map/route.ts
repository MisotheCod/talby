import { NextResponse } from "next/server";
import { OPENROUTER_API_KEY } from "@/lib/server-config";

export const dynamic = "force-dynamic";

/**
 * AI import-mapping engine.
 * Takes a parsed table (columns + rows) from the user's CSV/Notion export
 * and returns a mapping of source columns -> Talby deal fields, plus
 * per-field confidence so the review step can surface low-confidence rows.
 *
 * Route: POST /api/import/map
 * Body: { columns: string[], rows: Record<string,string>[], sourceName?: string }
 * Response: { mapping, items, lowConfidence }
 *
 * Server-only: uses OPENROUTER_API_KEY, never exposed to the client.
 */
export async function POST(req: Request) {
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json({ error: "Import AI is not configured." }, { status: 500 });
  }
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Expected JSON body." }, { status: 400 });
  }

  const body = await req.json();
  const columns: string[] = Array.isArray(body?.columns) ? body.columns : [];
  const rows: Record<string, string>[] = Array.isArray(body?.rows) ? body.rows : [];
  const sourceName: string = body?.sourceName || "";

  if (!columns.length || !rows.length) {
    return NextResponse.json({ error: "No columns or rows to map." }, { status: 400 });
  }

  // No truncation: pass every row so no deal from the source is ever dropped.
  const allRows = rows;

  const system =
    "You map spreadsheet rows into a creator-brand-deal system with THREE linked destinations: " +
    "the DEAL, its CALENDAR POSTS, and its PAYMENTS. " +
    "Given detected columns and sample rows, return a JSON mapping and per-row extracted data. " +
    "TARGETS — prefix each field with its destination: " +
    "deal.brand (required), deal.value (number), deal.status (one of: active, pipeline, unpaid, paid, archived), " +
    "deal.status (translate source lifecycle statuses only: 'signed'/'signed on my end'/'in progress'/'live'/'closed won' -> active, " +
    "'pipeline'/'negotiation'/'in negotiation'/'proposal'/'draft' -> pipeline, " +
    "'archived'/'cancelled'/'lost'/'dead' -> archived), " +
    "deal.deliverable (string), deal.due_date (YYYY-MM-DD), deal.notes (string), deal.rep_email (email). " +
    "content.event_date (YYYY-MM-DD) for a column holding a post/go-live/publish date, content.title (string), content.platform (e.g. TikTok/Instagram/YouTube). " +
    "payment.expected_date (YYYY-MM-DD) for a column holding a payment/expected/follow-up date, payment.amount (number), payment.status (received if the source says paid/received, else expected). " +
    "RULES: " +
    "Every source column maps to exactly ONE target (use 'deal.<field>' for deal columns). " +
    "When a row has a post/live date, ALSO emit a 'content' object {title,event_date,platform} (title = brand by default). " +
    "When a row has a payment/expected date, ALSO emit a 'payment' object {amount,expected_date,status}. " +
    "Use the same money amount for deal.value and payment.amount. " +
    "Respond ONLY with JSON of the shape: " +
    '{"mapping":{"<sourceColumn>":"deal.field|content.field|payment.field"},"rows":[{' +
    '"brand":"...","value":"...","status":"...","deliverable":"...","due_date":"...","notes":"...","rep_email":"...","confidence":0.0..1.0,' +
    '"content":{"title":"...","event_date":"YYYY-MM-DD","platform":"...|null"},"payment":{"amount":"...","expected_date":"YYYY-MM-DD","status":"expected|received"}' +
    '}]}. ' +
    "Omit 'content' when no post/live date exists for that row; omit 'payment' when no payment date exists. " +
    "confidence < 0.6 means the row is ambiguous and should be flagged for review. " +
    "Ignore empty/header columns. Keep brand from the most brand-like column.";

  const user =
    `Source name: ${sourceName || "spreadsheet"}\n` +
    `Columns: ${JSON.stringify(columns)}\n` +
    `Rows to extract (ALL of them, do not skip any): ${JSON.stringify(allRows)}`;

  try {
    const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        // per import spec: Gemini 3.5 Flash Lite
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "Talby Import",
      },
      body: JSON.stringify({
        model: "google/gemini-3.5-flash-lite",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0,
        response_format: { type: "json_object" },
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text().catch(() => "");
      console.error("OpenRouter map error", resp.status, errText.slice(0, 300));
      return NextResponse.json({ error: `AI mapping failed (${resp.status}).` }, { status: 502 });
    }

    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content ?? "";
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      // Some models return code-fenced JSON.
      const m = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      parsed = JSON.parse(m ? m[1] : content);
    }

    return NextResponse.json({
      mapping: parsed.mapping ?? {},
      items: parsed.rows ?? [],
      lowConfidence: (parsed.rows ?? []).filter(
        (r: { confidence?: number }) => (r.confidence ?? 1) < 0.6
      ).length,
    });
  } catch (e) {
    console.error("Import map error", e);
    return NextResponse.json({ error: "AI mapping errored." }, { status: 500 });
  }
}
