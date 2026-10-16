import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { OPENROUTER_API_KEY } from "@/lib/server-config";
import { userIsReadOnly } from "@/lib/write-access";
import { readContractText, extractDealFields, ownerIdentityOf } from "@/lib/contract-extract";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** "6000" -> "6,000" (the board shows the amount with a thousands separator). */
function grouped(n: unknown): string {
  const v = Number(n);
  if (!Number.isFinite(v)) return "";
  return v.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

/**
 * POST /api/upload/contract  (multipart form data, field "file")
 * 20 MB direct upload. Returns the deal form's shape plus what was found:
 * -> { fields: { brand, post, plats, amt, paid, rep, repEmail }, found: [[label, value]] }
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

  let f: Record<string, unknown>;
  try {
    f = await extractDealFields(read.text, ownerIdentityOf(user));
  } catch (err) {
    console.error("upload/contract field error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ code: "unreadable" }, { status: 502 });
  }

  const postDates = Array.isArray(f.post_dates) ? (f.post_dates as Array<{ date?: string }>) : [];
  const post = postDates.map((p) => p?.date ?? "").find((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)) ?? "";

  const plats: Record<string, boolean> = {};
  for (const p of String(f.platforms ?? "").split(/[,/]/).map((s) => s.trim()).filter(Boolean)) plats[p] = true;

  const structure = (f.payment_structure ?? null) as { kind?: string } | null;
  const paid = ["once", "split", "parts", "monthly"].includes(String(structure?.kind)) ? String(structure?.kind) : "once";

  const fields = {
    brand: (f.brand as string) ?? "",
    post,
    plats,
    amt: grouped(f.value_total),
    paid,
    rep: (f.rep_name as string) ?? "",
    repEmail: (f.rep_email as string) ?? "",
  };

  // What the reader actually found, in label/value pairs the board lists.
  const found: Array<[string, string]> = [];
  if (fields.brand) found.push(["Brand", fields.brand]);
  if (fields.amt) found.push(["Amount", "$" + fields.amt]);
  if (fields.post) found.push(["First post", fields.post]);
  if (Object.keys(plats).length) found.push(["Platforms", Object.keys(plats).join(", ")]);
  found.push(["Paid", paid === "once" ? "All at once" : paid === "split" ? "Split" : paid === "parts" ? "In parts" : "Monthly"]);
  if (fields.rep) found.push(["Rep", fields.rep]);
  if (fields.repEmail) found.push(["Rep email", fields.repEmail]);

  return NextResponse.json({ fields, found });
}
