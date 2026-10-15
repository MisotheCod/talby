import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { userIsReadOnly } from "@/lib/write-access";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * DELETE /api/deals/[id]
 *
 * Permanently removes a deal AND everything attached to it so nothing is
 * orphaned and no stale data corrupts analytics or the assistant's retrieval:
 *  - payments, deal_checklist, deal_files (rows + objects in the deal-files
 *    storage bucket)
 *  - content rows linked to it (calendar deliverables disappear with it)
 *  - deal_contracts and contract_chunks (so the assistant can never retrieve
 *    or cite a deleted deal's contract)
 *  - deal_extras and checklist
 *  - inbox_leads are unlinked (linked_deal_id -> null), not deleted.
 *
 * Storage objects are removed FIRST (storage can't run inside SQL); then the
 * row deletion happens ATOMICALLY through the `delete_deal` Postgres RPC
 * (000051) — all tables + the deal in one transaction, so a mid-way failure
 * leaves no partial deal. Ownership is enforced server-side by resolving the
 * deal through the caller's RLS-scoped client first, and again by RLS on
 * every statement inside the RPC (security invoker).
 */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });

  // Read-only gate.
  if (await userIsReadOnly(user.id)) {
    return NextResponse.json(
      { error: "read_only", message: "Your free trial has ended. Subscribe to keep editing." },
      { status: 403 }
    );
  }

  // Ownership check via the user's own (RLS-scoped) client. 404s for anyone
  // who doesn't own this deal — this is the anti-cross-user barrier.
  const { data: owned, error: ownErr } = await supabase
    .from("deals")
    .select("brand")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  if (ownErr || !owned) {
    return NextResponse.json({ error: "deal not found" }, { status: 404 });
  }

  const dealId = id;

  // 1. Storage objects first (best-effort; the rows are the source of truth).
  //    A remove failure orphans a stale object, never a deal.
  const admin = createServiceClient();
  try {
    const { data: fileRows } = await admin.from("deal_files").select("path").eq("deal_id", dealId);
    const paths = (fileRows ?? []).map((f) => f.path).filter(Boolean);
    if (paths.length) await admin.storage.from("deal-files").remove(paths);
  } catch { /* non-fatal */ }

  // 2. Atomic row deletion through the RPC. RLS enforces ownership + access.
  const { error: rpcErr } = await supabase.rpc("delete_deal", { p_deal_id: dealId });
  if (rpcErr) {
    return NextResponse.json({ error: rpcErr.message || "Could not delete the deal." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
