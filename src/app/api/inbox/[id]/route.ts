import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Act on a detected inbox lead:
 *   POST /api/inbox/[id]  { action: "add" | "not_interested" }
 *
 * "add": create a Pipeline-stage deal from the extracted fields, auto-fill
 *   the brand, deliverables, dates, value, notes, and rep_name/rep_email
 *   (the nudge contact). Dedupe: if a deal for that brand (or no brand but a
 *   matching sender) already exists, attach the email to it as a note instead
 *   of creating a duplicate.
 * "not_interested": mark suppressed so it never re-surfaces.
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const action: string = body?.action || "add";

  const { data: lead } = await supabase
    .from("inbox_leads")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  if (!lead) return NextResponse.json({ error: "lead not found" }, { status: 404 });

  if (action === "not_interested") {
    await supabase.from("inbox_leads").update({ status: "not_interested" }).eq("id", id);
    return NextResponse.json({ ok: true, status: "not_interested" });
  }

  // --- Add to deals ------------------------------------------------
  // Dedupe: does a deal already exist for this brand / sender?
  const brand = (lead.brand_name ?? "").toString().trim();
  let existingDeal = null;
  if (brand) {
    const { data: dup } = await supabase
      .from("deals")
      .select("id, brand, notes")
      .eq("user_id", user.id)
      .ilike("brand", `%${brand}%`)
      .limit(1);
    existingDeal = dup?.[0] ?? null;
  }

  // Resolve contact: extracted contact takes precedence, else the sender.
  const contactEmail = (lead.contact_email || lead.sender_email || "").toString().trim();
  const contactName = (lead.contact_name || lead.sender_name || "").toString().trim();

  if (existingDeal) {
    // Attach the email as a note on the existing deal instead of a duplicate.
    const prior = (existingDeal.notes ?? "") as string;
    const note = lead.summary?.toString()?.trim() || lead.subject?.toString()?.trim() || "";
    const notes = [prior, note].filter(Boolean).join("\n\n");
    await supabase.from("deals").update({ notes }).eq("id", existingDeal.id);
    await supabase.from("inbox_leads").update({ status: "added", linked_deal_id: existingDeal.id }).eq("id", id);
    return NextResponse.json({ ok: true, duplicated: true, dealId: existingDeal.id, status: "added" });
  }

  const insertPayload: Record<string, unknown> = {
    user_id: user.id,
    brand: brand || (lead.subject?.toString()?.slice(0, 60) || "New lead"),
    status: "pipeline",
    deliverable: (lead.deliverables as string) || (lead.summary as string) || null,
    notes: (lead.summary as string) || (lead.next_action as string) || null,
    deal_type: (lead.deal_type as string) || "Potential Opportunity / TBD",
    rep_name: contactName || null,
    rep_email: contactEmail || null,
    active: false, // pipeline leads never count against active capacity
  };

  // date fields
  if (lead.post_date) insertPayload.due_date = lead.post_date;
  const comp = Number(lead.compensation);
  if (!Number.isNaN(comp) && comp > 0) insertPayload.value = comp;

  const { data: createdDeal, error } = await supabase.from("deals").insert(insertPayload).select("id").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("inbox_leads").update({ status: "added", linked_deal_id: createdDeal.id }).eq("id", id);
  return NextResponse.json({ ok: true, duplicated: false, dealId: createdDeal.id, status: "added" });
}