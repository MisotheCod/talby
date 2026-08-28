import "server-only";
import { createServiceClient } from "@/lib/supabase/server";
import { buildNudge } from "@/lib/nudges";
import { DEFAULT_NUDGE_DAYS_OVERDUE } from "@/lib/constants";

/**
 * Rules engine for drafted reminders (per-deal `auto` mode only, explicitly
 * opted in). Runs on a daily schedule. Talby NEVER sends on the user's behalf;
 * a rule firing GENERATES a reminder row the user copies or starts from their
 * own mail client. The engine is only gated by:
 *  - the payment is still `expected` (re-checked fresh), and
 *  - the deal has a rep email, and
 *  - the user is on the paid plan, and
 *  - the reminder count for that payment is below the user's max.
 * One reminder per rule-fire; a fresh reminder is not re-emitted until the
 * user handles it or the cadence elapses from the last generated one.
 */
export async function runAutoNudgeEngine(now: Date = new Date()) {
  const supabase = createServiceClient();
  const emitted: { userId: string; paymentId: string; step: number }[] = [];

  // 1. Fetch auto-mode deals with their rep contact + settings context.
  const { data: deals } = await supabase
    .from("deals")
    .select("id, user_id, brand, deliverable, value, due_date, rep_name, rep_email, nudge_mode")
    .eq("nudge_mode", "auto");

  const autoDeals = (deals ?? []) as unknown as {
    id: string; user_id: string; brand: string; deliverable: string | null;
    value: number | null; due_date: string | null; rep_name: string | null;
    rep_email: string | null; nudge_mode: string;
  }[];

  // 2. Load per-user settings + plan in bulk.
  const userIds = [...new Set(autoDeals.map((d) => d.user_id))];
  const settingsMap = new Map<string, { daysOverdue: number; cadence: number; max: number; paid: boolean; templates?: { step: number; body: string }[] }>();
  if (userIds.length) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, plan, nudge_days_overdue, nudge_cadence_days, nudge_max_count, nudge_templates")
      .in("id", userIds);
    for (const p of (profiles ?? []) as unknown as {
      id: string; plan: string; nudge_days_overdue: number; nudge_cadence_days: number; nudge_max_count: number; nudge_templates?: { step: number; body: string }[] | null;
    }[]) {
      settingsMap.set(p.id, {
        daysOverdue: p.nudge_days_overdue ?? DEFAULT_NUDGE_DAYS_OVERDUE,
        cadence: p.nudge_cadence_days ?? 6,
        max: p.nudge_max_count ?? 3,
        paid: p.plan === "paid",
        templates: p.nudge_templates ?? undefined,
      });
    }
  }

  // 3. Build the set of payments to consider.
  const dealPayments = new Map<string, { id: string; amount: number; expected_date: string | null }[]>();
  const paymentLookup = new Map<string, { id: string; amount: number; expected_date: string | null; deal_id: string }>();

  for (const d of autoDeals) {
    const { data: pays } = await supabase
      .from("payments")
      .select("id, amount, expected_date, status, deal_id")
      .eq("deal_id", d.id);
    dealPayments.set(d.id, (pays ?? []) as unknown as { id: string; amount: number; expected_date: string | null }[]);
    for (const p of (pays ?? []) as unknown as { id: string; amount: number; expected_date: string | null; deal_id: string }[]) {
      paymentLookup.set(p.id, { ...p, deal_id: d.id });
    }
  }

  // 4. For each auto deal + each expected payment, apply the rules.
  for (const d of autoDeals) {
    const settings = settingsMap.get(d.user_id);
    if (!settings || !settings.paid) continue; // paid-tier gate
    if (!d.rep_email?.trim()) continue; // never without rep email

    const pays = dealPayments.get(d.id) ?? [];
    for (const pay of pays) {
      const pd = paymentLookup.get(pay.id);
      if (!pd) continue;

      // HARD STOP: never draft a reminder for a received payment.
      const { data: livePay } = await supabase
        .from("payments").select("id, status").eq("id", pay.id).single();
      const liveStatus = (livePay as unknown as { status: string } | null)?.status ?? "";
      if (liveStatus === "received") continue;

      if (!pay.expected_date) continue;
      const due = new Date(pay.expected_date + "T00:00:00");
      const daysOverdue = Math.floor((now.getTime() - due.getTime()) / 86400000);
      if (daysOverdue < settings.daysOverdue) continue; // not yet due per user rule

      // Existing reminders for this payment (sequence + count + cadence).
      const { data: existing } = await supabase
        .from("nudges").select("sequence_step, status, sent_at").eq("payment_id", pay.id);
      const handled = (existing ?? []).filter((n) => n.status === "handled") as unknown as {
        sequence_step: number; sent_at: string | null;
      }[];
      const ready = (existing ?? []).filter((n) => n.status === "ready") as unknown as {
        sequence_step: number; sent_at: string | null;
      }[];
      if (handled.length + ready.length >= settings.max) continue; // cap

      // Cadence: measure from the most recent reminder (handled or ready).
      const recents = [...handled, ...ready];
      if (recents.length > 0) {
        const last = recents[recents.length - 1];
        if (last.sent_at) {
          const diffDays = Math.floor((now.getTime() - new Date(last.sent_at).getTime()) / 86400000);
          if (diffDays < settings.cadence) continue;
        }
      }

      const step = Math.min(3, handled.length + 1);
      const nudge = buildNudge(step, {
        rep_name: d.rep_name,
        brand: d.brand,
        deliverable: d.deliverable,
        amount: pay.amount ?? d.value,
        due_date: due,
        days_overdue: daysOverdue,
      }, settings.templates);

      await supabase.from("nudges").insert({
        user_id: d.user_id,
        deal_id: d.id,
        payment_id: pay.id,
        sequence_step: step,
        subject: nudge.subject,
        body: nudge.body,
        rep_email: d.rep_email.trim(),
        status: "ready",
        sent_at: now.toISOString(),
      });
      emitted.push({ userId: d.user_id, paymentId: pay.id, step });
    }
  }

  return { ranAt: now.toISOString(), reminders: emitted.length, emitted };
}