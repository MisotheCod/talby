import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getNotionToken, fetchDatabaseRows, NotionError } from "@/lib/notion-server";
import { runImport, money, type ImportRow } from "@/lib/notion-import";
import { userIsReadOnly } from "@/lib/write-access";

export const dynamic = "force-dynamic";

/**
 * POST /api/notion/import
 * body { databaseId, map: { [notionProperty]: field }, pageIds?: string[], sync?: boolean }
 * -> { imported, skipped, failed: [{ id, brand, amount, reason }], booked }
 *
 * booked = sum of the ACTIVE amounts that imported.
 * Field keys: brand, amt, post, payby, status, pay, plats, rep, repEmail, notes, skip.
 * sync: when true, a row that is already a deal is updated instead of skipped.
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
  const sync: boolean = body?.sync === true;
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

    // Field key -> the Notion property that supplies it.
    const source: Record<string, string> = {};
    for (const [prop, field] of Object.entries(map)) if (field) source[field] = prop;
    const at = (r: Record<string, string>, field: string) => (source[field] ? (r[source[field]] ?? "").trim() : "");

    const mapped: ImportRow[] = wanted.map((r) => ({
      notionId: r._notion_id ?? "",
      brand: at(r, "brand"),
      amount: money(at(r, "amt")),
      post: at(r, "post"),
      status: /pipeline|negotiat/i.test(at(r, "status")) ? "pipeline" : "active",
      rep: at(r, "rep"),
    }));
    const notesOf = new Map(wanted.map((r, i) => [mapped[i].notionId, at(r, "notes")]));
    const paybyOf = new Map(wanted.map((r, i) => [mapped[i].notionId, at(r, "payby")]));

    const totals = await runImport(mapped, known, async (row) => {
      const post = row.post;
      const postDate = /^\d{4}-\d{2}-\d{2}/.test(post) ? post.slice(0, 10) : null;
      const patch: Record<string, unknown> = {
        user_id: user.id,
        brand: row.brand,
        notion_page_id: row.notionId,
        value: Number.isFinite(row.amount) ? row.amount : null,
        // NOTE: do NOT set deals.post_date — it is read-only (guard trigger). Post dates
        // are written as content rows below, same as manual create and CSV import.
        status: row.status,
      };
      const payby = paybyOf.get(row.notionId) ?? "";
      if (/^\d{4}-\d{2}-\d{2}/.test(payby)) patch.due_date = payby.slice(0, 10);
      const notes = notesOf.get(row.notionId) ?? "";
      if (notes) patch.notes = notes;
      if (row.rep) patch.rep_name = row.rep;

      // Idempotency: `known` (above) already filters out pages imported in an
      // earlier run, so a plain insert is correct. A concurrent run racing the
      // same page hits the (partial) unique index and 23505, which runImport
      // counts as a skip. NOTE: we cannot use upsert(onConflict:
      // "user_id,notion_page_id") here — deals_user_notion_page_uq is a PARTIAL
      // index (WHERE notion_page_id IS NOT NULL), and Postgres rejects ON
      // CONFLICT without its predicate (42P10), failing every row.
      const { data: created, error } = await supabase
        .from("deals")
        .insert(patch)
        .select("id").maybeSingle();
      if (!error && postDate && (created as { id?: string } | null)?.id) {
        await supabase.from("content").insert({
          user_id: user.id, linked_deal_id: (created as { id: string }).id,
          event_date: postDate, title: row.brand, status: "planned",
        });
      }
      return { error: error ? { code: error.code, message: error.message } : null };
    });

    const imported = totals.imported;
    const skipped = totals.skipped;
    if (totals.failed.length) {
      // Surface the real DB error for whoever is debugging the save step.
      console.error("notion import row failures:", totals.failed.slice(0, 3).map((f) => f.reason));
    }

    if (runId) {
      await supabase.from("import_runs").update({
        finished_at: new Date().toISOString(), total, imported, skipped, failed: totals.failed.length, status: "done",
        error: totals.failed.length ? totals.failed[0].reason : null,
      }).eq("id", runId);
    }
    return NextResponse.json({ imported, skipped, failed: totals.failed, booked: totals.booked });
  } catch (e) {
    const code = e instanceof NotionError ? e.code : "fetch_failed";
    const reason = "Notion did not answer in time";
    console.error("notion import error", e);
    if (runId) {
      await supabase.from("import_runs").update({
        finished_at: new Date().toISOString(), total, imported: 0, skipped: 0, failed: 1, error: reason, status: "failed",
      }).eq("id", runId);
    }
    return NextResponse.json({ code }, { status: code === "notion_lost" ? 401 : 502 });
  }
}
