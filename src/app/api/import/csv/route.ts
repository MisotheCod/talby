import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { userIsReadOnly } from "@/lib/write-access";
import { parseCsv, buildPreview, selectRows, applyMap, dealKey, knownKeys, type CsvPreviewRow } from "@/lib/csv-import";
import type { ImportField } from "@/lib/import-fields";

export const dynamic = "force-dynamic";

const MAX_BYTES = 20 * 1024 * 1024;

/**
 * POST /api/import/csv — two steps.
 *
 * Step one:  multipart/form-data, field "file" (the real CSV the user picked).
 *            Parses it, keeps it server side, returns
 *            { uploadId, cols: [{ name, sample, field }], rows, total, issues }.
 * Step two:  application/json { uploadId, map, skipRepeats, rowIds }
 *            Saves the rows and returns { imported, skipped, booked, failed }.
 *
 * Errors are JSON { code } with one of: too_big, bad_type, unreadable, empty.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ code: "unreadable" }, { status: 401 });

  if (await userIsReadOnly(user.id)) return NextResponse.json({ code: "unreadable" }, { status: 403 });

  const type = req.headers.get("content-type") ?? "";
  return type.includes("multipart/form-data") ? stepOne(req, supabase, user.id) : stepTwo(req, supabase, user.id);
}

type Supa = Awaited<ReturnType<typeof createClient>>;

/** Step one — read the uploaded file and describe it. */
async function stepOne(req: Request, supabase: Supa, userId: string) {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ code: "bad_type" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ code: "too_big" }, { status: 413 });

  const name = file.name.toLowerCase();
  const text = await file.text();
  if (!name.endsWith(".csv") && !name.endsWith(".txt") && !file.type.startsWith("text/")) {
    return NextResponse.json({ code: "bad_type" }, { status: 415 });
  }
  if (!text.trim()) return NextResponse.json({ code: "empty" }, { status: 400 });

  const table = parseCsv(text);
  if (table.length < 2) return NextResponse.json({ code: "empty" }, { status: 422 });

  // What we already hold, so repeats can be marked and skipped.
  const { data: deals } = await supabase.from("deals").select("brand, post_date");
  const known = knownKeys((deals ?? []) as Array<{ brand: string | null; post_date: string | null }>);

  const preview = buildPreview(table, known);

  const { data: upload, error } = await supabase
    .from("import_uploads")
    .insert({
      user_id: userId,
      source: "csv",
      file_name: file.name,
      payload: { header: (table[0] ?? []).map((h) => h.trim()), rows: table.slice(1), preview: preview.rows },
    })
    .select("id")
    .single();
  if (error || !upload) {
    console.error("csv upload store error", error);
    return NextResponse.json({ code: "unreadable" }, { status: 502 });
  }

  return NextResponse.json({
    uploadId: (upload as { id: string }).id,
    cols: preview.cols,
    rows: preview.rows,
    total: preview.total,
    issues: preview.issues,
  });
}

/** Step two — save the previewed rows with the user's column mapping. */
async function stepTwo(req: Request, supabase: Supa, userId: string) {
  const body = await req.json().catch(() => ({}));
  const uploadId: string = body?.uploadId || "";
  const map: Record<string, ImportField> = body?.map && typeof body.map === "object" ? body.map : {};
  const skipRepeats: boolean = body?.skipRepeats !== false;
  const rowIds: (string | number)[] | null = Array.isArray(body?.rowIds) ? body.rowIds : null;
  if (!uploadId) return NextResponse.json({ code: "empty" }, { status: 400 });

  const { data: upload } = await supabase
    .from("import_uploads")
    .select("payload, file_name")
    .eq("id", uploadId)
    .eq("user_id", userId)
    .maybeSingle();
  if (!upload) return NextResponse.json({ code: "empty" }, { status: 404 });

  const payload = (upload as { payload: { header: string[]; rows: string[][]; preview: CsvPreviewRow[] } }).payload;
  const header = payload?.header ?? [];
  const rawRows = payload?.rows ?? [];
  let preview = payload?.preview ?? [];

  if (!preview.length && rawRows.length) {
    const { data: deals } = await supabase.from("deals").select("brand, post_date");
    preview = buildPreview([header, ...rawRows], knownKeys((deals ?? []) as Array<{ brand: string | null; post_date: string | null }>)).rows;
  }

  const { todo, skipped: skippedByRepeat } = selectRows(preview, { rowIds, skipRepeats });

  // Open the run row first, so a failure still leaves a record.
  const { data: run } = await supabase
    .from("import_runs")
    .insert({ user_id: userId, source: "csv", started_at: new Date().toISOString() })
    .select("id").single();
  const runId = (run as { id?: string } | null)?.id ?? null;

  const failed: { id: string; brand: string; amount: number; reason: string }[] = [];
  let imported = 0;
  let skipped = skippedByRepeat;
  let booked = 0;

  try {
    const { data: deals } = await supabase.from("deals").select("brand, post_date");
    const seen = knownKeys((deals ?? []) as Array<{ brand: string | null; post_date: string | null }>);

    for (const row of todo) {
      const raw = rawRows[Number(row.id) - 2] ?? [];
      const f = applyMap(raw, header, map);
      const brand = f.brand || row.brand;
      const amount = Number.isFinite(f.amt) ? f.amt : row.amount;

      if (!brand) {
        failed.push({ id: row.id, brand: "", amount, reason: "No brand name on that row." });
        continue;
      }
      const post = f.post || row.post;
      const key = dealKey(brand, post);
      if (skipRepeats && seen.has(key)) { skipped++; continue; }

      const patch: Record<string, unknown> = {
        user_id: userId,
        brand,
        value: Number.isFinite(amount) ? amount : null,
        post_date: post || null,
        status: /pipeline|negotiat/i.test(f.status) ? "pipeline" : "active",
      };
      if (f.rep) patch.rep_name = f.rep;
      if (f.notes) patch.notes = f.notes;

      const { error } = await supabase.from("deals").insert(patch);
      if (error) {
        failed.push({ id: row.id, brand, amount, reason: "Talby could not save that row." });
        continue;
      }
      seen.add(key);
      imported++;
      if (patch.status === "active" && Number.isFinite(amount)) booked += amount;
    }

    if (runId) {
      await supabase.from("import_runs").update({
        finished_at: new Date().toISOString(), total: preview.length, imported, skipped, failed: failed.length, status: "done",
      }).eq("id", runId);
    }
    return NextResponse.json({ imported, skipped, booked, failed });
  } catch (e) {
    console.error("csv import error", e);
    if (runId) {
      await supabase.from("import_runs").update({
        finished_at: new Date().toISOString(), total: preview.length, imported, skipped,
        failed: failed.length + 1, error: "Talby could not read that file.", status: "failed",
      }).eq("id", runId);
    }
    return NextResponse.json({ code: "unreadable" }, { status: 502 });
  }
}
