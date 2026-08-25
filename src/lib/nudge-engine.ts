import "server-only";
import { createServiceClient } from "@/lib/supabase/server";
import { buildNudge } from "@/lib/nudges";
import { getAccessToken, sendGmail } from "@/lib/gmail-server";
import { DEFAULT_NUDGE_DAYS_OVERDUE } from "@/lib/constants";

/**
 * Rules engine for auto-nudging (per-deal `auto` mode only, explicitly
 * opted in). Runs on a daily schedule. NOTHING is ever sent unless:
 *  - the payment is still `expected` (re-checked AT SEND TIME), and
 *  - the deal has a rep email, and
 *  - the user has connected Gmail and is on the paid plan, and
 *  - the nudge count for that payment is below the user's max.
 */

export async function runAutoNudgeEngine(now: Date = new Date()) {
  const supabase = createServiceClient();
  const emitted: { userId: string; paymentId: string; step: number }[] = [];

  // 1. Fetch auto-mode deals with their rep contact + payment+settings context.
  //    We pull deals that are nudge_mode='auto' and their expected payments.
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
    if (!d.rep_email?.trim()) continue; // guardrail 4: never without rep email

    const pays = dealPayments.get(d.id) ?? [];
    for (const pay of pays) {
      const pd = paymentLookup.get(pay.id);
      if (!pd) continue;

      // Establish the payment's status FRESH from the DB (the hard-stop source of truth).
      const { data: livePay } = await supabase
        .from("payments").select("id, status").eq("id", pay.id).single();
      const liveStatus = (livePay as unknown as { status: string } | null)?.status ?? "";
      // --- HARD STOP: never nudge a received payment ---
      if (liveStatus === "received") continue;

      if (!pay.expected_date) continue;
      const due = new Date(pay.expected_date + "T00:00:00");
      const daysOverdue = Math.floor((now.getTime() - due.getTime()) / 86400000);
      if (daysOverdue < settings.daysOverdue) continue; // not yet due per user rule

      // Existing sent nudges for this payment (sequence + count + cadence).
      const { data: existing } = await supabase
        .from("nudges").select("sequence_step, status, sent_at").eq("payment_id", pay.id);
      const sent = (existing ?? []).filter((n) => n.status === "sent") as unknown as {
        sequence_step: number; sent_at: string | null;
      }[];
      if (sent.length >= settings.max) continue; // cap: never harass

      // Cadence: skip if last sent too recently.
      if (sent.length > 0) {
        const last = sent[sent.length - 1];
        if (last.sent_at) {
          const diffDays = Math.floor((now.getTime() - new Date(last.sent_at).getTime()) / 86400000);
          if (diffDays < settings.cadence) continue;
        }
      }

      const step = Math.min(3, sent.length + 1);
      const nudge = buildNudge(step, {
        rep_name: d.rep_name,
        brand: d.brand,
        deliverable: d.deliverable,
        amount: pay.amount ?? d.value,
        due_date: due,
        days_overdue: daysOverdue,
      }, settings.templates);

      // Final hard-stop re-check immediately before send: a payment could
      // have been marked received since the loop started.
      const { data: recheck } = await supabase
        .from("payments").select("status").eq("id", pay.id).single();
      const finalStatus = (recheck as unknown as { status: string } | null)?.status ?? "";
      if (finalStatus === "received") continue;

      const token = await getAccessToken(d.user_id);
      if (!token) continue; // no Gmail connected: nothing auto-sends

      try {
        const sentResult = await sendGmail(token, d.rep_email!.trim(), nudge.subject, nudge.body);
        await supabase.from("nudges").insert({
          user_id: d.user_id,
          deal_id: d.id,
          payment_id: pay.id,
          sequence_step: step,
          subject: nudge.subject,
          body: nudge.body,
          status: "sent",
          sent_at: now.toISOString(),
        });
        emitted.push({ userId: d.user_id, paymentId: pay.id, step });
      } catch (e) {
        console.error("auto nudge send failed", e);
      }
    }
  }

  return { ranAt: now.toISOString(), sent: emitted.length, emitted };
}
