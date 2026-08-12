import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import { Resend } from "resend";
import { render } from "@react-email/components";
import { createServiceClient } from "@/lib/supabase/server";
import { DailyDigestEmail } from "@/emails/daily-digest";
import { getDayItems, isoFor, isoForLocal, summaryLine } from "@/lib/digest";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

/**
 * Daily digest: once each morning, email opted-in users who have items that day
 * (payments due, deliverables, scheduled posts, dated to-dos). Never emails a
 * user with nothing, and never emails a user who hasn't opted in. Guarded by
 * CRON_SECRET.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
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

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM || "Talby <digest@talby.io>",
      to: [to],
      subject: summaryLine(items.total, prof.handler ?? "there"),
      html,
    });
    if (error) {
      console.error("digest send error", error, to);
      continue;
    }
    sent++;
  }

  return NextResponse.json({ dateLabel, iso: isoForLocal(now), considered, withItems, sent, skippedNoItems });
}