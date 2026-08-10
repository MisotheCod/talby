import "server-only";
import { createServiceClient } from "@/lib/supabase/server";
import { getAccessToken, listInboxMessages, getInboxMessage } from "@/lib/gmail-server";
import { hitsSignal, classifyEmail } from "@/lib/inbox-scanner";

/**
 * Shared inbox-scan executor (used by the authenticated route and the
 * periodic cron). All-in-one: list -> signal filter -> LLM -> dedupe -> upsert.
 * Returns counts; never throws the whole batch on one bad message.
 */
export async function scanForUser(userId: string): Promise<{ scanned: number; newLeads: number }> {
  const accessToken = await getAccessToken(userId);
  if (!accessToken) return { scanned: 0, newLeads: 0 };

  const service = createServiceClient();
  const { data: existing } = await service
    .from("inbox_leads")
    .select("gmail_message_id, status")
    .eq("user_id", userId);
  const seen = new Map<string, boolean>();
  (existing ?? []).forEach((r: { gmail_message_id: string }) => seen.set(r.gmail_message_id, true));

  const headers = await listInboxMessages(accessToken, 25);
  const candidates: { msg: { id: string; threadId: string; subject: string; from: string; body: string; snippet: string }; }[] = [];

  for (const h of headers) {
    if (seen.has(h.id)) continue;
    try {
      const full = await getInboxMessage(accessToken, h.id);
      if (hitsSignal(full.subject, full.body, full.snippet)) {
        candidates.push({ msg: { ...full, threadId: h.threadId } });
      }
    } catch {
      // unreadable message, skip
    }
  }

  let newLeads = 0;
  for (const c of candidates.slice(0, 12)) {
    try {
      const verdict = await classifyEmail(c.msg);
      if (!verdict.relevant) {
        await service.from("inbox_leads").upsert({
          user_id: userId,
          gmail_message_id: c.msg.id,
          thread_id: c.msg.threadId,
          subject: c.msg.subject,
          sender_email: extractEmail(c.msg.from),
          snippet: c.msg.snippet,
          status: "not_interested",
          confidence: verdict.confidence,
        }, { onConflict: "user_id,gmail_message_id" });
        continue;
      }
      const ex = verdict.extracted as Record<string, any>;
      await service.from("inbox_leads").upsert({
        user_id: userId,
        gmail_message_id: c.msg.id,
        thread_id: c.msg.threadId,
        subject: c.msg.subject,
        sender_email: extractEmail(c.msg.from),
        snippet: c.msg.snippet,
        body_text: c.msg.body,
        brand_name: ex.brand_name || null,
        agency_name: ex.agency_name || null,
        contact_name: ex.contact_name || null,
        contact_email: ex.contact_email || extractEmail(c.msg.from) || null,
        deal_type: verdict.type || ex.deal_type || "Potential Opportunity / TBD",
        compensation: ex.compensation || null,
        currency: ex.currency || null,
        deliverables: ex.deliverables || null,
        platforms: ex.platforms || null,
        draft_deadline: ex.draft_deadline || null,
        post_date: ex.post_date || null,
        summary: ex.summary || c.msg.snippet || null,
        next_action: ex.next_action || null,
        confidence: verdict.confidence,
        extracted: ex,
        status: "new",
      }, { onConflict: "user_id,gmail_message_id" });
      newLeads++;
    } catch {
      // per-message isolation
    }
  }

  return { scanned: headers.length, newLeads };
}

function extractEmail(from: string): string {
  const m = from.match(/<([^>]+)>/) ?? from.match(/[\w.+-]+@[\w-]+\.[\w.]+/);
  return m ? (m[1] ?? m[0]) : "";
}