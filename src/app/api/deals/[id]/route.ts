import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

/**
 * DELETE /api/deals/[id]
 *
 * Permanently deletes a deal AND everything attached to it so nothing is
 * orphaned and no stale data corrupts analytics or the assistant's retrieval:
 *  - payments, deal_checklist, deal_files (rows + objects in the deal-files
 *    storage bucket)
 *  - content rows linked to it (calendar deliverables disappear with it)
 *  - deal_contracts and contract_chunks (so the assistant can never retrieve
 *    or cite a deleted deal's contract)
 *  - inbox_leads are unlinked (their linked_deal_id -> null), not deleted — a
 *    lead is still a lead.
 *
 * Ownership is enforced server-side: we resolve the deal through the caller's
 * (RLS-scoped) client with .eq("user_id", user.id).single(). A second user
 * cannot delete someone else's deal — the ownership select 404s first. All
 * destructive writes then go through the service client scoped to that
 * already-verified deal id.
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

  const admin = createServiceClient();
  const dealId = id;

  // 1. Storage files: remove the objects from the bucket, then the rows.
  const { data: fileRows } = await admin
    .from("deal_files")
    .select("path")
    .eq("deal_id", dealId);
  const paths = (fileRows ?? []).map((f) => f.path).filter(Boolean);
  if (paths.length) {
    await admin.storage.from("deal-files").remove(paths);
  }
  await admin.from("deal_files").delete().eq("deal_id", dealId);

  // 2. Child rows.
  await admin.from("payments").delete().eq("deal_id", dealId);
  await admin.from("deal_checklist").delete().eq("deal_id", dealId);
  // Calendar deliverables / posts tied to the deal disappear with it.
  await admin.from("content").delete().eq("linked_deal_id", dealId);

  // 3. Contract + embedded chunks — assistant can never cite this deal again.
  await admin.from("deal_contracts").delete().eq("deal_id", dealId);
  await admin.from("contract_chunks").delete().eq("deal_id", dealId);

  // 4. Unlink converted inbox leads (keep the lead itself).
  await admin.from("inbox_leads").update({ linked_deal_id: null }).eq("linked_deal_id", dealId);

  // 5. The deal row itself (scoped to user for safety).
  await admin.from("deals").delete().eq("id", dealId).eq("user_id", user.id);

  return NextResponse.json({ ok: true });
}