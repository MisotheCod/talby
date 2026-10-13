import { NextResponse } from "next/server";
import { Resend } from "resend";
import { render } from "@react-email/components";
import { createClient } from "@/lib/supabase/server";
import { TrialEmail } from "@/emails/trial";

export const dynamic = "force-dynamic";

/**
 * POST /api/trial/welcome
 * Sends the welcome email immediately after signup. Idempotent: if the
 * profile already has trial_email_welcome_sent, this is a no-op.
 */
export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });

  const { data: prof } = await supabase
    .from("profiles")
    .select("id, handler, email, plan_status, trial_email_welcome_sent")
    .eq("id", user.id)
    .single();
  const p = prof as unknown as {
    id: string; handler: string | null; email: string | null;
    plan_status: string | null; trial_email_welcome_sent: string | null;
  } | null;
  if (!p) return NextResponse.json({ ok: true, skipped: "no_profile" });
  if (p.plan_status !== "trialing" || p.trial_email_welcome_sent) {
    return NextResponse.json({ ok: true, skipped: "not_trialing_or_already_sent" });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ error: "resend not configured" }, { status: 503 });
  const to = p.email;
  if (!to) return NextResponse.json({ ok: true, skipped: "no_email" });

  const appUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.talby.io";
  const subscribeUrl = `${appUrl}/app/trial`;

  const resend = new Resend(key);
  const html = await render(
    TrialEmail({ kind: "welcome", handler: p.handler ?? "there", subscribeUrl, appUrl })
  );

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM || "Talby <digest@talby.io>",
    to: [to],
    subject: "Welcome to Talby. Your free trial has started.",
    html,
  });

  if (error) {
    console.error("trial welcome send error", error, to);
    return NextResponse.json({ error: "send failed" }, { status: 500 });
  }

  await supabase.from("profiles").update({ trial_email_welcome_sent: new Date().toISOString() }).eq("id", user.id);
  return NextResponse.json({ ok: true, sent: true });
}