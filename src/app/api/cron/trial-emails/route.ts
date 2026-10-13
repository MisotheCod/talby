import { NextResponse } from "next/server";
import { Resend } from "resend";
import { render } from "@react-email/components";
import { createServiceClient } from "@/lib/supabase/server";
import { TrialEmail } from "@/emails/trial";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

/**
 * GET /api/cron/trial-emails
 * Daily sweep for the two scheduled trial emails:
 *   - reminder: 3 days before trial_end (plan_status=trialing, not yet sent)
 *   - ended:    trial_end has passed but account is still 'trialing'
 *               (they never subscribed; read-only already enforced by
 *               hasFullAccess + RLS from trial_end — no DB flip needed)
 * Idempotent via trial_email_reminder_sent / trial_email_ended_sent.
 * Guarded by CRON_SECRET (fails closed).
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ error: "resend not configured" }, { status: 503 });

  const service = createServiceClient();
  const resend = new Resend(key);
  const now = new Date();
  const nowIso = now.toISOString();
  const inThreeDays = new Date(now.getTime() + 3 * 86400_000);

  const { data: trials } = await service
    .from("profiles")
    .select("id, handler, email, trial_end, trial_email_reminder_sent, trial_email_ended_sent")
    .eq("plan_status", "trialing")
    .not("email", "is", null);

  const appUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.talby.io";

  let reminders = 0;
  let ended = 0;
  let reminderErrors = 0;
  let endedErrors = 0;

  for (const p of (trials ?? []) as {
    id: string; handler: string | null; email: string | null;
    trial_end: string | null; trial_email_reminder_sent: string | null;
    trial_email_ended_sent: string | null;
  }[]) {
    const to = p.email;
    const te = p.trial_end ? new Date(p.trial_end) : null;
    if (!to || !te) continue;
    const subscribeUrl = `${appUrl}/app/trial`;
    const handler = p.handler ?? "there";

    // --- ended: trial_end has passed (allow a little skew: send if within 2 days past, still trialing) ---
    if (!p.trial_email_ended_sent && te.getTime() <= now.getTime()) {
      const html = await render(TrialEmail({ kind: "ended", handler, subscribeUrl, appUrl }));
      const { error } = await resend.emails.send({
        from: process.env.RESEND_FROM || "Talby <digest@talby.io>",
        to: [to],
        subject: "Your Talby trial has ended",
        html,
      });
      if (error) { console.error("trial ended send error", error, to); endedErrors++; continue; }
      await service.from("profiles").update({ trial_email_ended_sent: nowIso }).eq("id", p.id);
      ended++;
      continue;
    }

    // --- reminder: trial ends within the next 3 days ---
    if (!p.trial_email_reminder_sent && te.getTime() > now.getTime() && te.getTime() <= inThreeDays.getTime()) {
      const html = await render(TrialEmail({ kind: "reminder", handler, subscribeUrl, appUrl }));
      const { error } = await resend.emails.send({
        from: process.env.RESEND_FROM || "Talby <digest@talby.io>",
        to: [to],
        subject: "Your Talby trial ends in 3 days",
        html,
      });
      if (error) { console.error("trial reminder send error", error, to); reminderErrors++; continue; }
      await service.from("profiles").update({ trial_email_reminder_sent: nowIso }).eq("id", p.id);
      reminders++;
    }
  }

  return NextResponse.json({ reminders, ended, reminderErrors, endedErrors });
}