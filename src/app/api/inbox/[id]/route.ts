import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Act on a detected inbox lead:
 *   POST /api/inbox/[id]  { action: "add" | "not_interested" }
 *
 * "add": create a Pipeline-stage deal from the extracted fields, auto-fill
 *   the brand, deliverables, dates, value, notes, deal_type, and rep_name/
 *   rep_email (the nudge contact). Dedupe: if a deal for that brand already
 *   exists, attach the email to it as a note and ensure the email thread is
 *   linked, instead of creating a duplicate.
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
  const brand = (lead.brand_name ?? "").toString().trim();
  const subject = (lead.subject ?? "").toString().trim();
  const threaded = !!lead.thread_id;
  // The email thread link label, shown on the deal so the originating
  // conversation is always reachable.
  const emailLink = {
    url: `mailto:${((lead.sender_email || lead.contact_email) ?? "").toString().trim()}`,
    label: subject ? `From inbox: ${subject}` : "From inbox",
  };

  let existingDeal = null;
  if (brand) {
    const { data: dup } = await supabase
      .from("deals")
      .select("id, brand, notes, links")
      .eq("user_id", user.id)
      .ilike("brand", `%${brand}%`)
      .limit(1);
    existingDeal = dup?.[0] ?? null;
  }

  // Resolve contact: extracted contact takes precedence, else the sender.
  const contactEmail = (lead.contact_email || lead.sender_email || "").toString().trim();
  const contactName = (lead.contact_name || lead.sender_name || "").toString().trim();

  // Build the email summary that lands in the deal notes when the deal is
  // first created (so "everything extracted" is visible, not just brand).
  const summaryBits = [
    lead.summary?.toString().trim(),
    lead.deliverables ? `Deliverables: ${lead.deliverables}` : "",
    lead.compensation ? `Value: ${lead.compensation}${lead.currency ? " " + lead.currency : ""}` : "",
    lead.next_action ? `Next: ${lead.next_action}` : "",
    lead.post_date ? `Post date: ${lead.post_date}` : "",
    lead.draft_deadline ? `Draft due: ${lead.draft_deadline}` : "",
  ].filter(Boolean);
  const summary = summaryBits.join("\n");

  // Attach the email thread link to a deal (create or reuse).
  const attachThread = async (dealId: string) => {
    const { data: cur } = await supabase
      .from("deals")
      .select("links")
      .eq("id", dealId)
      .eq("user_id", user.id)
      .single();
    const existing = (cur?.links as { url: string; label?: string }[] ?? []);
    if (!existing.some((l) => l.label === emailLink.label && l.url === emailLink.url)) {
      await supabase
        .from("deals")
        .update({ links: [...existing, emailLink] })
        .eq("id", dealId)
        .eq("user_id", user.id);
    }
  };

  if (existingDeal) {
    // Attach the email as a note + thread link on the existing deal instead
    // of a duplicate. Fill rep contact only if currently empty.
    const prior = (existingDeal.notes ?? "") as string;
    const note = lead.summary?.toString()?.trim() || subject;
    const notes = [prior, summary || note].filter(Boolean).join("\n\n");
    const patch: Record<string, unknown> = { notes };
    if (threaded) await attachThread(existingDeal.id);
    await supabase.from("deals").update(patch).eq("id", existingDeal.id);
    await supabase.from("inbox_leads").update({ status: "added", linked_deal_id: existingDeal.id }).eq("id", id);
    return NextResponse.json({ ok: true, duplicated: true, dealId: existingDeal.id, status: "added" });
  }

  const insertPayload: Record<string, unknown> = {
    user_id: user.id,
    brand: brand || (subject.slice(0, 60) || "New lead"),
    status: "pipeline",
    deliverable: (lead.deliverables as string) || (lead.summary as string) || null,
    notes: summary || (lead.next_action as string) || null,
    deal_type: (lead.deal_type as string) && (lead.deal_type as string) !== "Potential Opportunity / TBD"
      ? (lead.deal_type as string)
      : (lead.deal_type as string) || null,
    rep_name: contactName || null,
    rep_email: contactEmail || null,
    active: true, // detected deals are real, actionable opportunities; they count
                  // against the free active-deal cap (enforced by the DB trigger)
  };
  if (threaded) insertPayload.links = [emailLink];

  // date fields
  if (lead.post_date) insertPayload.due_date = lead.post_date;
  const comp = Number(lead.compensation);
  if (!Number.isNaN(comp) && comp > 0) insertPayload.value = comp;

  const { data: createdDeal, error } = await supabase.from("deals").insert(insertPayload).select("id").single();
  if (error) {
    // The DB-level active-deal-cap trigger raises when a free user is at the
    // limit. Surface a clear, deal-tied upgrade prompt rather than a cryptic
    // error. The detected deal itself is NOT deleted or hidden — it stays in
    // the inbox so the user can come back once they free a slot or upgrade.
    if (/limited to \d+ active deals/i.test(error.message)) {
      return NextResponse.json(
        { error: "active_cap", message: `${brand || "This deal"} is ready in your inbox. You've hit the free plan's active-deal limit, so it can't be added until you archive a deal or go unlimited.` },
        { status: 402 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from("inbox_leads").update({ status: "added", linked_deal_id: createdDeal.id }).eq("id", id);
  return NextResponse.json({ ok: true, duplicated: false, dealId: createdDeal.id, status: "added" });
}