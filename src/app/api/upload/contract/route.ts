import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { OPENROUTER_API_KEY } from "@/lib/server-config";
import { userIsReadOnly } from "@/lib/write-access";
import { readContractText, extractDealFields, ownerIdentityOf } from "@/lib/contract-extract";
import { shapeContract } from "@/lib/contract-shape";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/upload/contract  (multipart form data, field "file")
 * 20 MB direct upload. Reads the contract, stores the file, and returns the
 * deal form's shape plus what was found.
 * -> { fileId, pages, fields, found: [4 strings], count, few, extras }
 * -> { code } on failure: too_big | bad_type | unreadable | empty
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ code: "unreadable" }, { status: 401 });

  if (await userIsReadOnly(user.id)) return NextResponse.json({ code: "unreadable" }, { status: 403 });
  if (!OPENROUTER_API_KEY) return NextResponse.json({ code: "unreadable" }, { status: 500 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ code: "bad_type" }, { status: 400 });

  const read = await readContractText(file);
  if ("code" in read) {
    const status = read.code === "too_big" ? 413 : read.code === "bad_type" ? 415 : 422;
    return NextResponse.json({ code: read.code }, { status });
  }

  // Keep the file itself: the id comes back as `contract` on deal.create.
  let fileId = "";
  try {
    const ext = (file.name.split(".").pop() || "bin").toLowerCase().slice(0, 8);
    const path = `${user.id}/contracts/${Date.now()}.${ext}`;
    const up = await supabase.storage
      .from("contracts")
      .upload(path, file, { upsert: false, contentType: file.type || "application/octet-stream" });
    if (!up.error) fileId = path;
  } catch (err) {
    console.error("upload/contract store error:", err instanceof Error ? err.message : err);
  }

  let f: Record<string, unknown>;
  try {
    f = await extractDealFields(read.text, ownerIdentityOf(user));
  } catch (err) {
    console.error("upload/contract field error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ code: "unreadable" }, { status: 502 });
  }

  // ---- the deal form's own shape + what was found --------------------------
  const { fields, found, count, few, extras } = shapeContract(f);

  return NextResponse.json({ fileId, pages: read.pages, fields, found, count, few, extras });
}
