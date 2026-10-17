import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getNotionToken, fetchDatabaseRows, guessField, NotionError } from "@/lib/notion-server";

export const dynamic = "force-dynamic";

/** Guess a property type from its text values (Notion types are flattened upstream). */
function guessType(values: string[]): string {
  const v = values.filter((x) => x.trim() !== "");
  if (!v.length) return "text";
  if (v.every((x) => /^\d{4}-\d{2}-\d{2}/.test(x))) return "date";
  if (v.every((x) => Number.isFinite(Number(x.replace(/[$,]/g, ""))))) return "number";
  return "text";
}

/** Guess the Talby value a column's own value maps to. */
function guessValue(v: string): string {
  const s = v.toLowerCase();
  if (/negotiat|pipeline|talk|lead|prospect|outreach/.test(s)) return "Negotiating";
  if (/active|in progress|live|ongoing|posted|confirmed/.test(s)) return "Active";
  if (/paid|complete|done|closed/.test(s)) return "Paid";
  if (/cancel|archiv|lost|declined/.test(s)) return "Archived";
  return v;
}

/**
 * GET /api/notion/rows?databaseId=
 * -> { props: [{ name, type, values? }], rows: [{ id, brand, post, status, amount, repeat }] }
 * repeat = true when that notion_page_id is already a deal for this user.
 */
export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ code: "notion_lost" }, { status: 401 });

  const databaseId = new URL(req.url).searchParams.get("databaseId") ?? "";
  if (!databaseId) return NextResponse.json({ code: "fetch_failed" }, { status: 400 });

  const token = await getNotionToken(user.id);
  if (!token) return NextResponse.json({ code: "notion_lost" }, { status: 401 });

  try {
    const { columns, rows } = await fetchDatabaseRows(token.access_token, databaseId, "");

    const props = columns.map((name) => {
      const values = Array.from(new Set(rows.map((r) => r[name] ?? "").filter((v) => v.trim() !== "")));
      const type = guessType(values);
      const field = guessField(name);
      const p: { name: string; type: string; field: string; values?: Array<{ from: string; to: string }> } = { name, type, field };
      // Select-like columns carry their distinct values, each with Talby's guess.
      if (type === "text" && values.length > 1 && values.length <= 20) {
        p.values = values.map((v) => ({ from: v, to: guessValue(v) }));
      }
      return p;
    });

    const known = new Set<string>();
    const ids = rows.map((r) => r._notion_id).filter(Boolean);
    if (ids.length) {
      const { data: existing } = await supabase.from("deals").select("notion_page_id").in("notion_page_id", ids);
      for (const x of (existing ?? []) as Array<{ notion_page_id: string | null }>) if (x.notion_page_id) known.add(x.notion_page_id);
    }

    const brandCol = columns.find((c) => /brand|company|client|name/i.test(c)) ?? columns[0] ?? "";
    const dateCol = columns.find((c) => /post|date|publish/i.test(c) && guessType(rows.map((r) => r[c] ?? "")) === "date") ?? "";
    const statusCol = columns.find((c) => /status|stage|state/i.test(c)) ?? "";
    const amountCol = columns.find((c) => /amount|value|fee|total|rate|comp/i.test(c)) ?? "";
    const payCol = columns.find((c) => /paid|payment|terms|schedule|split|installment/i.test(c)) ?? "";

    return NextResponse.json({
      props,
      rows: rows.map((r) => ({
        id: r._notion_id ?? "",
        brand: r[brandCol] ?? "",
        post: dateCol ? (r[dateCol] ?? "").slice(0, 10) : "",
        status: statusCol ? (r[statusCol] ?? "") : "",
        amount: amountCol ? (r[amountCol] ?? "") : "",
        // How the deal is paid, in the board's own two words.
        how: /split|50|half|installment|milestone|upfront|deposit|net/i.test(payCol ? (r[payCol] ?? "") : "") ? "Split" : "All at once",
        repeat: !!(r._notion_id && known.has(r._notion_id)),
      })),
    });
  } catch (e) {
    const code = e instanceof NotionError ? e.code : "fetch_failed";
    console.error("notion rows error", e);
    return NextResponse.json({ code }, { status: code === "notion_lost" ? 401 : 502 });
  }
}
