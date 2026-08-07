import { NextResponse } from "next/server";
import { OPENROUTER_API_KEY } from "@/lib/config";

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

  // Truncate to a representative sample for mapping (protect token/cost).
  const sampleRows = rows.slice(0, 20);

  const system =
    "You map spreadsheet rows into a creator-brand-deal system. " +
    "Given detected columns and sample rows, return a JSON mapping. " +
    "Talby deal fields: brand (required), value (number), status " +
    "(one of: active, pipeline, unpaid, paid, archived), deliverable (string), " +
    "due_date (YYYY-MM-DD), notes (string). " +
    "Respond ONLY with JSON of the shape: " +
    '{"mapping":{"<sourceColumn>":"<talbyField>"},"rows":[{"brand":"...","value":"...","status":"...",' +
    '"deliverable":"...","due_date":"...","notes":"...","confidence":0.0..1.0}]}. ' +
    "confidence < 0.6 means the row is ambiguous and should be flagged for review. " +
    "Ignore empty/header columns. Keep brand from the most brand-like column.";

  const user =
    `Source name: ${sourceName || "spreadsheet"}\n` +
    `Columns: ${JSON.stringify(columns)}\n` +
    `Sample rows (max 20): ${JSON.stringify(sampleRows.slice(0, 20))}`;

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
