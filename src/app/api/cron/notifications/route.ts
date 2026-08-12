import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getAccessToken, sendGmail } from "@/lib/gmail-server";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const pad = (n: number) => String(n).padStart(2, "0");
const todayISO = () => {
  // UTC date (crons run at a fixed UTC time; use UTC to stay consistent).
  const d = new Date();
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
};

type NotificationRow = { user_id: string; kind: string; title: string; body: string; link: string };

/**
 * Daily notification dispatch: for every user, find calendar events happening
 * today (content posts, expected payments, deal deliverables) and emit an
 * in-app notification. If the user has email notifications on AND a connected
 * Gmail, also send an email. Idempotent — skips events already notified today.
 * Guarded by CRON_SECRET.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const service = createServiceClient();
  const iso = todayISO();

  // All users with notification prefs.
  const { data: profiles } = await service
    .from("profiles")
    .select("id, notify_calendar_inapp, notify_calendar_email");

  let created = 0;
  let emailed = 0;

  for (const prof of (profiles ?? []) as { id: string; notify_calendar_inapp: boolean; notify_calendar_email: boolean }[]) {
    const userId = prof.id;
    const inapp = prof.notify_calendar_inapp !== false;
    const emailOn = prof.notify_calendar_email === true;

    // Gather today's events from the three calendar sources.
    const events: NotificationRow[] = [];

    const [content, payments, deals] = await Promise.all([
      service.from("content").select("title, platform").eq("user_id", userId).eq("event_date", iso),
      service.from("payments").select("amount, expected_date, status").eq("user_id", userId).eq("expected_date", iso),
      service.from("deals").select("brand, due_date, deliverable").eq("user_id", userId).eq("due_date", iso),
    ]);

    for (const c of (content.data ?? []) as { title: string; platform: string | null }[]) {
      events.push({ user_id: userId, kind: "calendar", title: `${c.title} is today`, body: c.platform ? `Post on ${c.platform}.` : "Scheduled post.", link: "/app/calendar" });
    }
    for (const p of (payments.data ?? []) as { amount: number; expected_date: string; status: string }[]) {
      if (p.status === "received") continue;
      const amt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(p.amount);
      events.push({ user_id: userId, kind: "payment", title: `${amt} payment expected today`, body: "Don't forget to chase it.", link: "/app/payments" });
    }
    for (const d of (deals.data ?? []) as { brand: string; due_date: string; deliverable: string | null }[]) {
      events.push({ user_id: userId, kind: "deliverable", title: `${d.brand} deliverable due today`, body: d.deliverable ? d.deliverable : "Check the deal for details.", link: "/app/deals" });
    }

    if (events.length === 0) continue;

    // Dedupe: skip events with the same kind+title already notified today.
    const { data: existing } = await service
      .from("notifications")
      .select("kind, title")
      .eq("user_id", userId)
      .gte("created_at", `${iso}T00:00:00Z`);

    const seen = new Set((existing ?? []).map((e: { kind: string; title: string }) => `${e.kind}|${e.title}`));
    const fresh = events.filter((e) => !seen.has(`${e.kind}|${e.title}`));

    if (inapp && fresh.length) {
      await service.from("notifications").insert(fresh);
    }

    if (emailOn && fresh.length) {
      const token = await getAccessToken(userId);
      if (token) {
        const { data: conn } = await service.from("gmail_connections").select("email").eq("user_id", userId).single();
        const to = (conn as { email: string | null } | null)?.email;
        for (const e of fresh) {
          if (!to) break;
          try {
            await sendGmail(
              token,
              to,
              `Today in Talby: ${e.title}`,
              `${e.body}\n\nView it: https://www.talby.io${e.link}`
            );
            emailed++;
          } catch {
            // skip failed sends
          }
        }
      }
    }

    created += fresh.length;
  }

  return NextResponse.json({ iso, notificationsCreated: created, emailsSent: emailed });
}