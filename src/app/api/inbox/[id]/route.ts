import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAccessToken, getMessageAttachments } from "@/lib/gmail-server";

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
    active: false, // pipeline leads never count against active capacity
  };
  if (threaded) insertPayload.links = [emailLink];

  // date fields
  if (lead.post_date) insertPayload.due_date = lead.post_date;
  const comp = Number(lead.compensation);
  if (!Number.isNaN(comp) && comp > 0) insertPayload.value = comp;

  const { data: createdDeal, error } = await supabase.from("deals").insert(insertPayload).select("id").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Auto-attach the contract from the originating email. Best-effort: never
  // fails the deal creation if Gmail/file/ingest hiccups.
  await attachContractAttachment({ userId: user.id, dealId: createdDeal.id, gmailMessageId: lead.gmail_message_id });

  await supabase.from("inbox_leads").update({ status: "added", linked_deal_id: createdDeal.id }).eq("id", id);
  return NextResponse.json({ ok: true, duplicated: false, dealId: createdDeal.id, status: "added" });
}

/** Contract-like attachment extensions we'll pull off the email and store on the deal. */
const CONTRACT_EXT = /\.(pdf|txt|md|docx?|pages)$/i;

/**
 * If the originating inbox email carried a contract file, download it, store it
 * in the deal's private deal-files folder, record a deal_files row, and ingest
 * its text so the assistant can answer about it. Best-effort; swallows errors so
 * adding a deal from the inbox never fails because an attachment couldn't be read.
 */
async function attachContractAttachment({ userId, dealId, gmailMessageId }: {
  userId: string; dealId: string; gmailMessageId: string;
}) {
  try {
    const accessToken = await getAccessToken(userId);
    if (!accessToken || !gmailMessageId) return;

    const attachments = await getMessageAttachments(accessToken, gmailMessageId);
    const contract = attachments.find((a) => CONTRACT_EXT.test(a.filename));
    if (!contract || contract.data.length === 0) return;

    const supabase = await createClient();
    const mime = contract.mimeType?.startsWith("text/") || /\.(txt|md)$/i.test(contract.filename)
      ? "text/plain" : "application/pdf";

    // Store the file under the user's private deal-files bucket.
    const safeName = contract.filename.replace(/[^\w.\- ]+/g, "_").slice(0, 120) || "contract.pdf";
    const path = `${userId}/${dealId}/${Date.now()}-${safeName}`;
    const up = await supabase.storage.from("deal-files").upload(path, new Uint8Array(contract.data), {
      contentType: mime, upsert: true,
    });
    if (up.error) return;

    await supabase.from("deal_files").insert({
      user_id: userId, deal_id: dealId, name: safeName, path, size_bytes: contract.data.length, mime,
    });

    // Extract the text and ingest for the assistant. We do this inline (service
    // side) rather than calling the authed ingest route, which needs the user's
    // session cookies — the inbox route has none.
    let text = "";
    if (/\.pdf$/i.test(contract.filename)) {
      const { extractText } = await import("unpdf");
      const out = await extractText(new Uint8Array(contract.data));
      text = (out.text ?? []).join(" ");
    } else {
      text = contract.data.toString("utf8");
    }
    text = text.replace(/\s+/g, " ").trim().slice(0, 30000);
    if (text) {
      await ingestContractText(supabase, userId, dealId, text);
    }
  } catch {
    // never block adding the deal
  }
}

/** Store a contract's text + embedding chunks under the deal (mirrors the
 *  assistant/ingest route's write path). Uses the user-scoped server client so
 *  RLS passes; ownership is the authenticated user. */
async function ingestContractText(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string, dealId: string, text: string
) {
  const { chunkText, embed } = await import("@/lib/assistant-ai");
  const { EMBED_DIMENSIONS } = await import("@/lib/constants");

  await supabase.from("deal_contracts").delete().eq("deal_id", dealId);
  await supabase.from("deal_contracts").insert({ user_id: userId, deal_id: dealId, text });

  await supabase.from("contract_chunks").delete().eq("deal_id", dealId);
  const chunks = chunkText(text);
  for (let i = 0; i < chunks.length; i++) {
    const vec = await embed(chunks[i]);
    if (!vec.length || vec.length !== EMBED_DIMENSIONS) continue;
    await supabase.from("contract_chunks").insert({
      user_id: userId, deal_id: dealId, chunk_idx: i, content: chunks[i], embedding: vec,
    });
  }
}