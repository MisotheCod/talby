import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { userIsReadOnly } from "@/lib/write-access";

export const dynamic = "force-dynamic";

const MAX_BYTES = 20 * 1024 * 1024;

type Failed = { id: string; brand: string; amount: number; reason: string };

/** Minimal CSV parser: quoted fields, escaped quotes, CRLF. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c !== "\r") field += c;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((x) => x.trim() !== ""));
}

function money(v: string | undefined): number {
  if (!v) return NaN;
  const n = Number(String(v).replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(n) ? n : NaN;
}

/**
 * POST /api/import/csv
 * Step one  { csv }                      -> { cols: [{ name, sample }], rows: [{ brand, post, status, amount, repeat }], total, repeats }
 * Step two  { csv, map: { column: field } } -> same shape as /api/notion/import
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ code: "unreadable" }, { status: 401 });

  if (await userIsReadOnly(user.id)) return NextResponse.json({ code: "denied" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const csv: string = typeof body?.csv === "string" ? body.csv : "";
  const map: Record<string, string> = body?.map && typeof body.map === "object" ? body.map : {};
  if (!csv.trim()) return NextResponse.json({ code: "empty" }, { status: 400 });
  if (csv.length > MAX_BYTES) return NextResponse.json({ code: "too_big" }, { status: 413 });

  const table = parseCsv(csv);
  if (table.length < 2) return NextResponse.json({ code: "empty" }, { status: 422 });

  const header = table[0].map((h) => h.trim());
  const dataRows = table.slice(1);

  // ---- Step one: describe the columns + preview the rows -------------------
  if (!Object.keys(map).length) {
    const cols = header.map((name, i) => ({
      name,
      sample: (dataRows.find((r) => (r[i] ?? "").trim() !== "") ?? [])[i] ?? "",
    }));

    const brandIdx = header.findIndex((h) => /brand|company|client|name/i.test(h));
    const dateIdx = header.findIndex((h) => /post|date|publish/i.test(h));
    const statusIdx = header.findIndex((h) => /status|stage|state/i.test(h));
    const amountIdx = header.findIndex((h) => /amount|value|fee|total|rate|comp/i.test(h));

    const preview = dataRows.map((r, i) => {
      const brand = brandIdx >= 0 ? (r[brandIdx] ?? "").trim() : "";
      const post = dateIdx >= 0 ? (r[dateIdx] ?? "").trim().slice(0, 10) : "";
      const amount = amountIdx >= 0 ? (r[amountIdx] ?? "").trim() : "";
      return { id: `csv-${i}`, brand, post, status: statusIdx >= 0 ? (r[statusIdx] ?? "").trim() : "", amount, repeat: false };
    });

    // Repeats = a brand + amount we already hold for this user.
    const { data: deals } = await supabase.from("deals").select("brand, value");
    const seen = new Set(((deals ?? []) as Array<{ brand: string | null; value: number | null }>).map((d) => `${(d.brand ?? "").toLowerCase()}|${d.value ?? ""}`));
    let repeats = 0;
    for (const r of preview) {
      const key = `${r.brand.toLowerCase()}|${Number.isFinite(money(r.amount)) ? money(r.amount) : ""}`;
      if (r.brand && seen.has(key)) { r.repeat = true; repeats++; }
    }

    return NextResponse.json({ cols, rows: preview, total: preview.length, repeats });
  }

  // ---- Step two: save with the chosen mapping ------------------------------
  const source: Record<string, string> = {};
  for (const [column, field] of Object.entries(map)) if (field) source[field] = column;
  const at = (r: string[], field: string) => {
    const col = source[field];
    const i = col ? header.indexOf(col) : -1;
    return i >= 0 ? (r[i] ?? "").trim() : "";
  };

  const { data: run } = await supabase
    .from("import_runs")
    .insert({ user_id: user.id, source: "csv", started_at: new Date().toISOString() })
    .select("id").single();
  const runId = (run as { id?: string } | null)?.id ?? null;

  const failed: Failed[] = [];
  let imported = 0, skipped = 0, booked = 0;

  const { data: deals } = await supabase.from("deals").select("brand, value");
  const seen = new Set(((deals ?? []) as Array<{ brand: string | null; value: number | null }>).map((d) => `${(d.brand ?? "").toLowerCase()}|${d.value ?? ""}`));

  try {
    for (const [i, r] of dataRows.entries()) {
      const brand = at(r, "brand");
      const amount = money(at(r, "amount"));
      if (!brand) { failed.push({ id: `csv-${i}`, brand: "", amount: Number.isFinite(amount) ? amount : 0, reason: "No brand name on that row." }); continue; }
      const key = `${brand.toLowerCase()}|${Number.isFinite(amount) ? amount : ""}`;
      if (seen.has(key)) { skipped++; continue; }

      const post = at(r, "post");
      const status = at(r, "status");
      const row: Record<string, unknown> = {
        user_id: user.id,
        brand,
        value: Number.isFinite(amount) ? amount : null,
        post_date: /^\d{4}-\d{2}-\d{2}/.test(post) ? post.slice(0, 10) : null,
        status: /pipeline|negotiat/i.test(status) ? "pipeline" : "active",
      };
      const rep = at(r, "rep");
      if (rep) row.rep_name = rep;

      const { error } = await supabase.from("deals").insert(row);
      if (error) { failed.push({ id: `csv-${i}`, brand, amount: Number.isFinite(amount) ? amount : 0, reason: "Talby could not save that row." }); continue; }
      seen.add(key);
      imported++;
      if (row.status === "active" && Number.isFinite(amount)) booked += amount;
    }

    if (runId) {
      await supabase.from("import_runs").update({
        finished_at: new Date().toISOString(), total: dataRows.length, imported, skipped, failed: failed.length,
      }).eq("id", runId);
    }
    return NextResponse.json({ imported, skipped, failed, booked });
  } catch (e) {
    console.error("csv import error", e);
    if (runId) {
      await supabase.from("import_runs").update({
        finished_at: new Date().toISOString(), total: dataRows.length, imported, skipped, failed: failed.length + 1,
        error: "Talby could not read that file.",
      }).eq("id", runId);
    }
    return NextResponse.json({ code: "unreadable" }, { status: 502 });
  }
}
