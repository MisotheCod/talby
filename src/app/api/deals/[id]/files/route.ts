import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { userIsReadOnly } from "@/lib/write-access";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BYTES = 20 * 1024 * 1024; // 20 MB, same as contract uploads

/**
 * POST /api/deals/[id]/files  (multipart: "file", "kind")
 *
 * Uploads a file onto a deal from the deal panel's Files tab (or the Invoice
 * row). Returns the saved deal_files row so the board can show it immediately:
 *   -> { id, name, kind, url, date }
 * kind is "auto" when the user left File type on Auto — we decide contract vs
 * invoice vs other from the file name.
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });

  if (await userIsReadOnly(user.id)) {
    return NextResponse.json({ error: "read_only" }, { status: 403 });
  }

  // Ownership barrier: only the deal's owner can add files to it.
  const { data: owned, error: ownErr } = await supabase
    .from("deals").select("id").eq("id", id).eq("user_id", user.id).maybeSingle();
  if (ownErr || !owned) return NextResponse.json({ error: "deal not found" }, { status: 404 });

  const form = await req.formData();
  const file = form.get("file");
  const kindRaw = String(form.get("kind") ?? "auto");
  if (!(file instanceof File)) return NextResponse.json({ error: "bad_type" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "too_big" }, { status: 413 });

  // Resolve kind. "auto" decides from the file name.
  let kind: "contract" | "invoice" | "other";
  if (kindRaw === "contract" || kindRaw === "invoice" || kindRaw === "other") {
    kind = kindRaw;
  } else {
    const n = file.name.toLowerCase();
    kind = /invoice|statement|receipt/.test(n) ? "invoice" : /contract|agreement|sow|terms/.test(n) ? "contract" : "other";
  }

  const safeName = file.name.replace(/[^\w.\- ]+/g, "_");
  const ext = (file.name.split(".").pop() || "bin").toLowerCase().slice(0, 8);
  const path = `${user.id}/${id}/files/${Date.now()}-${safeName}`;

  const up = await supabase.storage
    .from("deal-files")
    .upload(path, file, { upsert: false, contentType: file.type || "application/octet-stream" });
  if (up.error) {
    return NextResponse.json({ error: up.error.message || "Could not store the file." }, { status: 500 });
  }

  const { data: row, error: insErr } = await supabase
    .from("deal_files")
    .insert({ user_id: user.id, deal_id: id, name: file.name, path, mime: file.type || null, size_bytes: file.size, kind })
    .select("id, name, path, kind, created_at")
    .single();
  if (insErr || !row) {
    // best-effort cleanup
    await supabase.storage.from("deal-files").remove([path]);
    return NextResponse.json({ error: insErr?.message || "Could not save the deal_files row." }, { status: 500 });
  }

  const signed = await supabase.storage.from("deal-files").createSignedUrl(path, 3600);
  const extOk = ext; // no-op keep var

  return NextResponse.json({
    id: row.id,
    name: row.name,
    kind: row.kind,
    url: signed.data?.signedUrl ?? path,
    date: (row.created_at ?? "").slice(0, 10),
  });
}
