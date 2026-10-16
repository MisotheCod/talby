import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { OPENROUTER_API_KEY } from "@/lib/server-config";
import { userIsReadOnly } from "@/lib/write-access";
import { readContractText, extractDealFields, ownerIdentityOf } from "@/lib/contract-extract";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const PAID_LABEL: Record<string, string> = {
  once: "All at once", split: "Split", parts: "In parts", monthly: "Monthly",
};

/** "6000" -> "6,000" (the board shows the amount with a thousands separator). */
function grouped(n: unknown): string {
  const v = Number(n);
  if (!Number.isFinite(v)) return "";
  return v.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

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
      .from("deal-files")
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

  // ---- the deal form's own shape ------------------------------------------
  const postDates = Array.isArray(f.post_dates) ? (f.post_dates as Array<{ date?: string }>) : [];
  const post = postDates.map((p) => p?.date ?? "").find((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)) ?? "";
  const deliverable = String(f.deliverable ?? "").trim();

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

  // ---- what was read, as the four checklist lines --------------------------
  const extrasIn = (Array.isArray(f.extras) ? f.extras : []) as Array<Record<string, unknown>>;
  const describe = (x: Record<string, unknown>) => {
    const amount = grouped(x.amount);
    return [String(x.condition ?? x.on ?? "").trim(), amount ? `$${amount}` : x.rate ? `${x.rate}%` : ""]
      .filter(Boolean).join(" · ");
  };
  const bonusLine = extrasIn.filter((x) => String(x.kind) !== "commission").map(describe).filter(Boolean);
  const commissionLine = extrasIn.filter((x) => String(x.kind) === "commission").map(describe).filter(Boolean);

  const line1 = [fields.brand, fields.rep].filter(Boolean).join(" · ");
  const line2 = [fields.amt ? `$${fields.amt}` : "", fields.amt ? PAID_LABEL[paid] ?? "" : ""].filter(Boolean).join(" · ");
  const line3 = [post, deliverable].filter(Boolean).join(" · ");
  const line4 = [bonusLine[0], commissionLine[0]].filter(Boolean).join(" · ");

  const found: [string, string, string, string] = [line1, line2, line3, line4];

  // ---- "Also in the contract" ---------------------------------------------
  const extras: [string, string, string][] = [];
  for (const x of extrasIn) {
    if (String(x.kind) === "commission") extras.push(["Commission", String(x.on ?? "").trim(), x.rate ? `${x.rate}%` : ""]);
    else extras.push(["Bonus", String(x.condition ?? "").trim(), grouped(x.amount) ? `$${grouped(x.amount)}` : ""]);
  }
  if (deliverable) extras.push(["Deliverables", deliverable, ""]);
  const usageDays = Number(f.exclusivity_days);
  if (Number.isFinite(usageDays) && usageDays > 0) extras.push(["Usage", `${usageDays} days of exclusivity`, ""]);

  // How many details were found in all: the four lines, each extra, the platforms, the rep email.
  const count =
    found.filter(Boolean).length +
    (extras.length - (deliverable ? 1 : 0)) +
    Object.keys(plats).length +
    (fields.repEmail ? 1 : 0);
  const few = count <= 3;

  return NextResponse.json({ fileId, pages: read.pages, fields, found, count, few, extras });
}
