import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import { Resend } from "resend";
import { render } from "@react-email/components";
import { createServiceClient } from "@/lib/supabase/server";
import { DailyDigestEmail, type DigestItem } from "@/emails/daily-digest";
import { getDayItems, isoFor, isoForLocal, summaryLine } from "@/lib/digest";
import type { DayDigest } from "@/lib/digest";
import { sendAlert } from "@/lib/talby/push";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

/** Plain-text body for the daily digest. One short line per item, a footer
 *  with talby.io and the unsubscribe link. No em dashes (use a comma or full
 *  stop), matching the brand copy rule. */
function buildPlainText(summary: string, dateLabel: string, items: DayDigest, unsubscribeUrl: string): string {
  const lines: string[] = [summary, `For ${dateLabel}.`, ""];
  const push = (label: string, extra?: string) => lines.push(extra ? `${label} (${extra})` : label);

  for (const p of items.payments) {
    const pm = p as Extract<DigestItem, { kind: "payment" }>;
    push(`${pm.brand}: ${pm.label}`, `$${pm.amount.toLocaleString("en-US")}`);
  }
  for (const d of items.deliverables) {
    const dl = d as Extract<DigestItem, { kind: "deliverable" }>;
    push(dl.label, dl.detail);
  }
  for (const po of items.posts) {
    const pt = po as Extract<DigestItem, { kind: "post" }>;
    push(pt.label, pt.platform);
  }
  for (const t of items.todos) {
    push(t.label, "");
  }

  lines.push("", "Sent by Talby. Manage your brand deals, payments, and calendar in one place.", "talby.io", "", "Unsubscribe from the daily digest:", unsubscribeUrl);
  return lines.join("\n");
}

/**
 * Daily digest: once each morning, email opted-in users who have items that day
 * (payments due, deliverables, scheduled posts, dated to-dos). Never emails a
 * user with nothing, and never emails a user who hasn't opted in. Guarded by
 * CRON_SECRET.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  // Fail closed: if CRON_SECRET isn't set, or the bearer token doesn't match,
  // reject. Vercel sends CRON_SECRET as an Authorization bearer header on real
  // cron invocations, so this lets scheduled runs through and blocks everyone
  // else. (The old `if (secret && ...)` silently opened the route when the env
  // var was absent — anyone could trigger a digest.)
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ error: "resend not configured" }, { status: 503 });

  const service = createServiceClient();
  const resend = new Resend(key);

  // v1: fixed morning send time in the server's timezone (UTC). No per-user TZ yet.
  const now = new Date();
  const iso = isoFor(now);
  const dateLabel = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" });

  const { data: profiles } = await service
    .from("profiles")
    .select("id, handler, digest_enabled, email");

  let considered = 0;
  let withItems = 0;
  let sent = 0;
  let skippedNoItems = 0;

  for (const prof of (profiles ?? []) as { id: string; handler: string | null; digest_enabled: boolean; email: string | null }[]) {
    if (!prof.digest_enabled) continue;
    considered++;
    const items = await getDayItems(prof.id, iso);
    if (items.total === 0) { skippedNoItems++; continue; }
    withItems++;

    // Send push alerts for payments due today, late payments, and posts due tomorrow
    // 1. Payments DUE TODAY
    const { data: paymentsDueToday } = await service
      .from('payments')
      .select('id, amount, deal:deals(brand)')
      .eq('user_id', prof.id)
      .eq('expected_date', iso)
      .neq('status', 'received');
    
    for (const payment of (paymentsDueToday ?? []) as Array<{ id: string; amount: number; deal: Array<{ brand: string }> | null }>) {
      const brand = payment.deal?.[0]?.brand;
      if (!brand) continue;
      try {
        await sendAlert(service, prof.id, {
          title: `${brand} payment is due today`,
          body: `$${payment.amount.toLocaleString('en-US')}`,
          url: '/app/payments',
          tag: payment.id,
        });
      } catch (e) {
        console.error('sendAlert error (payment due today)', e);
      }
    }

    // 2. LATE payments
    const { data: latePayments } = await service
      .from('payments')
      .select('id, amount, expected_date, deal:deals(brand)')
      .eq('user_id', prof.id)
      .lt('expected_date', iso)
      .neq('status', 'received')
      .neq('pay_status', 'paid');
    
    for (const payment of (latePayments ?? []) as Array<{ id: string; amount: number; expected_date: string; deal: Array<{ brand: string }> | null }>) {
      const brand = payment.deal?.[0]?.brand;
      if (!brand) continue;
      const daysLate = Math.max(1, Math.round((Date.parse(iso) - Date.parse(payment.expected_date)) / 86400000));
      if (daysLate <= 0) continue;
      try {
        await sendAlert(service, prof.id, {
          title: `${brand} payment is ${daysLate} days late`,
          body: `$${payment.amount.toLocaleString('en-US')}`,
          url: '/app/payments',
          tag: payment.id,
        });
      } catch (e) {
        console.error('sendAlert error (late payment)', e);
      }
    }

    // 3. POSTS DUE TOMORROW
    const tomorrowDate = new Date(Date.parse(iso) + 86400000);
    const tomorrow = isoFor(tomorrowDate);
    const { data: postsDueTomorrow } = await service
      .from('content')
      .select('id, title, platform')
      .eq('user_id', prof.id)
      .eq('event_date', tomorrow);
    
    for (const post of (postsDueTomorrow ?? []) as Array<{ id: string; title: string; platform: string | null }>) {
      try {
        await sendAlert(service, prof.id, {
          title: `${post.title} post is due tomorrow`,
          body: post.platform || '',
          url: '/app/calendar',
          tag: post.id,
        });
      } catch (e) {
        console.error('sendAlert error (post due tomorrow)', e);
      }
    }

    const to = prof.email;
    if (!to) continue;

    const secret = process.env.RESEND_API_KEY || process.env.CRON_SECRET || "";
    const sig = createHmac("sha256", secret).update(`${prof.id}|${to}`).digest("hex");
    const unsubscribeUrl = `https://www.talby.io/api/digest/unsubscribe?uid=${prof.id}&sig=${sig}`;

    const html = await render(
      DailyDigestEmail({
        handler: prof.handler ?? "there",
        dateLabel,
        summary: summaryLine(items.total, prof.handler ?? "there"),
        payments: items.payments,
        deliverables: items.deliverables,
        posts: items.posts,
        todos: items.todos,
        manageUrl: unsubscribeUrl,
      })
    );

    const text = buildPlainText(summaryLine(items.total, prof.handler ?? "there"), dateLabel, items, unsubscribeUrl);

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM || "Talby <digest@talby.io>",
      to: [to],
      subject: summaryLine(items.total, prof.handler ?? "there"),
      html,
      text,
    });
    if (error) {
      console.error("digest send error", error, to);
      continue;
    }
    sent++;
  }

  return NextResponse.json({ dateLabel, iso: isoForLocal(now), considered, withItems, sent, skippedNoItems });
}