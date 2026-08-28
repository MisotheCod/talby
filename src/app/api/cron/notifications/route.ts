import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

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
 * in-app notification. Ready drafted reminders ("needs a nudge") are surfaced
 * here too so a past-due payment with a prepared reminder is not missed.
 * Idempotent — skips events already notified today. Guarded by CRON_SECRET.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const service = createServiceClient();
  const iso = todayISO();

  const { data: profiles } = await service
    .from("profiles")
    .select("id, notify_calendar_inapp");

  let created = 0;

  for (const prof of (profiles ?? []) as { id: string; notify_calendar_inapp: boolean }[]) {
    const userId = prof.id;
    const inapp = prof.notify_calendar_inapp !== false;

    const events: NotificationRow[] = [];

    const [content, payments, deals, reminders] = await Promise.all([
      service.from("content").select("title, platform").eq("user_id", userId).eq("event_date", iso),
      service.from("payments").select("amount, expected_date, status, deal:deals(brand)").eq("user_id", userId).eq("expected_date", iso),
      service.from("deals").select("brand, due_date, deliverable").eq("user_id", userId).eq("due_date", iso),
      service.from("nudges").select("id, subject, deal_id, payment_id").eq("user_id", userId).eq("status", "ready"),
    ]);

    for (const c of (content.data ?? []) as { title: string; platform: string | null }[]) {
      events.push({ user_id: userId, kind: "calendar", title: `${c.title} is today`, body: c.platform ? `Post on ${c.platform}.` : "Scheduled post.", link: "/app/calendar" });
    }
    for (const p of (payments.data ?? []) as { amount: number; expected_date: string; status: string; deal: { brand: string }[] | null }[]) {
      if (p.status === "received") continue;
      const amt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(p.amount);
      const brand = (p.deal?.[0]?.brand) || "Payment";
      events.push({ user_id: userId, kind: "payment", title: `${amt} payment expected today`, body: `From ${brand}. Don't forget to chase it.`, link: "/app/payments" });
    }
    for (const d of (deals.data ?? []) as { brand: string; due_date: string; deliverable: string | null }[]) {
      events.push({ user_id: userId, kind: "deliverable", title: `${d.brand} deliverable due today`, body: d.deliverable ? d.deliverable : "Check the deal for details.", link: "/app/deals" });
    }
    for (const r of (reminders.data ?? []) as { id: string; subject: string; deal_id: string; payment_id: string }[]) {
      events.push({
        user_id: userId, kind: "nudge", title: "A payment reminder is ready", body: r.subject || "Copy or send it from Payments.",
        link: r.payment_id ? `/app/payments?reminder=${r.id}` : "/app/payments",
      });
    }

    if (events.length === 0) continue;

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

    created += fresh.length;
  }

  return NextResponse.json({ iso, notificationsCreated: created });
}