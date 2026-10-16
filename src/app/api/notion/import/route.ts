import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getNotionToken, fetchDatabaseRows, NotionError } from "@/lib/notion-server";
import { userIsReadOnly } from "@/lib/write-access";

export const dynamic = "force-dynamic";

type Failed = { id: string; brand: string; amount: number; reason: string };

/** Parse "$6,000" / "6000" / "6,000.50" to a number; NaN when not a number. */
function money(v: string | undefined): number {
  if (!v) return NaN;
  const n = Number(String(v).replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(n) ? n : NaN;
}

/**
 * POST /api/notion/import
 * body { databaseId, map: { [notionProperty]: field }, pageIds?: string[] }
 * -> { imported, skipped, failed: [{ id, brand, amount, reason }], booked }
 *
 * booked = sum of the ACTIVE amounts that imported.
 * One import_runs row per run — written even when the run fails, with the error.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ code: "notion_lost" }, { status: 401 });

  if (await userIsReadOnly(user.id)) {
    return NextResponse.json({ code: "notion_denied" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const databaseId: string = body?.databaseId || "";
  const map: Record<string, string> = body?.map && typeof body.map === "object" ? body.map : {};
  const pageIds: string[] = Array.isArray(body?.pageIds) ? body.pageIds : [];
  if (!databaseId) return NextResponse.json({ code: "fetch_failed" }, { status: 400 });

  const token = await getNotionToken(user.id);
  if (!token) return NextResponse.json({ code: "notion_lost" }, { status: 401 });

  // Open the run row first so a failure still leaves a record.
  const { data: run } = await supabase
    .from("import_runs")
    .insert({ user_id: user.id, source: "notion", started_at: new Date().toISOString() })
    .select("id")
    .single();
  const runId = (run as { id?: string } | null)?.id ?? null;

  const failed: Failed[] = [];
  let imported = 0;
  let skipped = 0;
  let booked = 0;
  let total = 0;

  try {
    const { rows } = await fetchDatabaseRows(token.access_token, databaseId, "");

    // Only the pages the client asked for (or all when none were named).
    const wanted = pageIds.length ? rows.filter((r) => pageIds.includes(r._notion_id ?? "")) : rows;
    total = wanted.length;

    // Everything already imported for this user, so repeats are skipped up front.
    const ids = wanted.map((r) => r._notion_id).filter(Boolean);
    const known = new Set<string>();
    if (ids.length) {
      const { data: existing } = await supabase.from("deals").select("notion_page_id").in("notion_page_id", ids);
      for (const x of (existing ?? []) as Array<{ notion_page_id: string | null }>) if (x.notion_page_id) known.add(x.notion_page_id);
    }

    // Field name -> the Notion property that supplies it.
    const source: Record<string, string> = {};
    for (const [prop, field] of Object.entries(map)) if (field) source[field] = prop;

    for (const r of wanted) {
      const nid = r._notion_id ?? "";
      const brand = (r[source.brand ?? ""] ?? "").trim();
      const amountRaw = r[source.amount ?? ""] ?? "";
      const amount = money(amountRaw);

      if (!nid) { failed.push({ id: "", brand, amount: Number.isFinite(amount) ? amount : 0, reason: "That row had no Notion id." }); continue; }
      if (known.has(nid)) { skipped++; continue; }
      if (!brand) { failed.push({ id: nid, brand: "", amount: Number.isFinite(amount) ? amount : 0, reason: "No brand name on that row." }); continue; }

      const postRaw = (r[source.post ?? ""] ?? "").trim();
      const statusRaw = (r[source.status ?? ""] ?? "").trim();
      const row: Record<string, unknown> = {
        user_id: user.id,
        brand,
        notion_page_id: nid,
        value: Number.isFinite(amount) ? amount : null,
        post_date: /^\d{4}-\d{2}-\d{2}/.test(postRaw) ? postRaw.slice(0, 10) : null,
        status: /active/i.test(statusRaw) ? "active" : /pipeline|negotiat/i.test(statusRaw) ? "pipeline" : "active",
      };
      if (source.rep) { const rep = (r[source.rep] ?? "").trim(); if (rep) row.rep_name = rep; }

      // ON CONFLICT (user_id, notion_page_id) DO NOTHING — two runs at once cannot duplicate.
      const { error } = await supabase
        .from("deals")
        .upsert(row, { onConflict: "user_id,notion_page_id", ignoreDuplicates: true });

      if (error) {
        failed.push({ id: nid, brand, amount: Number.isFinite(amount) ? amount : 0, reason: "Talby could not save that row." });
        continue;
      }
      imported++;
      if (row.status === "active" && Number.isFinite(amount)) booked += amount;
    }

    if (runId) {
      await supabase.from("import_runs").update({
        finished_at: new Date().toISOString(), total, imported, skipped, failed: failed.length,
      }).eq("id", runId);
    }
    return NextResponse.json({ imported, skipped, failed, booked });
  } catch (e) {
    const code = e instanceof NotionError ? e.code : "fetch_failed";
    const reason = code === "notion_lost" ? "Notion did not answer in time" : "Notion did not answer in time";
    console.error("notion import error", e);
    if (runId) {
      await supabase.from("import_runs").update({
        finished_at: new Date().toISOString(), total, imported, skipped, failed: failed.length + 1, error: reason,
      }).eq("id", runId);
    }
    return NextResponse.json({ code }, { status: code === "notion_lost" ? 401 : 502 });
  }
}
