import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildNudge } from "@/lib/nudges";
import { DEFAULT_NUDGE_DAYS_OVERDUE } from "@/lib/constants";

export const dynamic = "force-dynamic";

type NudgeBody = {
  deal_id: string;
  payment_id: string;
  action: "generate" | "copy" | "open" | "handle" | "dismiss";
  reminder_id?: string;
};

/**
 * Drafted reminders — Talby never sends on the user's behalf.
 *
 *  action "generate": build/return the reminder text for a past-due payment
 *    (no row is required; the auto-engine also pre-generates 'ready' rows).
 *  action "copy" | "open": returns subject/body + the rep address so the
 *    client can copy to clipboard or open a mailto: link. Also flips any
 *    matching 'ready' reminder to 'handled' if one exists.
 *  action "handle": mark a specific reminder handled (user sent from phone,
 *    used their own drafts, or just wants it cleared).
 *
 * The received hard-stop still applies: no reminder for a payment marked received.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });

  // Paid-tier gate.
  const prof = await supabase.from("profiles").select("plan").eq("id", user.id).single();
  const plan = (prof.data as unknown as { plan: string } | null)?.plan ?? "free";
  if (plan !== "paid") {
    return NextResponse.json({ error: "paid_required", message: "Reminders are part of the paid plan." }, { status: 402 });
  }

  const { deal_id, payment_id, action, reminder_id } = (await req.json()) as NudgeBody;
  if (payment_id) {
    const { data: payRow } = await supabase
      .from("payments")
      .select("id, status, amount, expected_date")
      .eq("id", payment_id)
      .eq("user_id", user.id)
      .single();
    const payment = payRow as unknown as {
      id: string; status: string; amount: number; expected_date: string | null;
    } | null;
    if (!payment) return NextResponse.json({ error: "payment not found" }, { status: 404 });
    // Received hard-stop: no reminder for paid.
    if (payment.status === "received") {
      return NextResponse.json({ error: "already_paid", message: "This payment is already received, so no reminder is needed." }, { status: 409 });
    }
    // Need the deal + rep contact to build the email body.
    if (deal_id) {
      const { data: dealRow } = await supabase
        .from("deals")
        .select("id, brand, deliverable, value, due_date, rep_name, rep_email")
        .eq("id", deal_id)
        .eq("user_id", user.id)
        .single();
      const deal = dealRow as unknown as {
        id: string; brand: string; deliverable: string | null; value: number | null;
        due_date: string | null; rep_name: string | null; rep_email: string | null;
      } | null;
      if (!deal) return NextResponse.json({ error: "deal not found" }, { status: 404 });
      if (!deal.rep_email?.trim()) {
        return NextResponse.json({ error: "no_rep_email", message: "Add a rep email to prepare this reminder." }, { status: 400 });
      }

      const { data: existing } = await supabase
        .from("nudges").select("sequence_step, status").eq("payment_id", payment.id).eq("user_id", user.id);
      const handledCount = (existing ?? []).filter((n) => n.status === "handled").length;
      const step = Math.min(3, handledCount + 1);
      const daysOverdue = payment.expected_date
        ? Math.max(0, Math.floor((Date.now() - new Date(payment.expected_date + "T00:00:00").getTime()) / 86400000))
        : DEFAULT_NUDGE_DAYS_OVERDUE;

      const tpl = await supabase.from("profiles").select("nudge_templates").eq("id", user.id).single();
      const templates = (tpl.data as unknown as { nudge_templates?: { step: number; body: string }[] | null } | null)?.nudge_templates ?? undefined;

      const nudge = buildNudge(step, {
        rep_name: deal.rep_name,
        brand: deal.brand,
        deliverable: deal.deliverable,
        amount: deal.value,
        due_date: payment.expected_date ? new Date(payment.expected_date + "T00:00:00") : null,
        days_overdue: daysOverdue,
      }, templates);

      // If a matching 'ready' reminder exists, return it (so the sequence step
      // and cadence stay consistent with what the auto-engine created).
      const readyRow = (existing ?? []).find((n) => n.status === "ready") as unknown as
        | { id: string; sequence_step: number }
        | null;
      const row = readyRow ?? null;

      // copy / open: mark the ready reminder handled (user is acting on it now).
      if (action === "copy" || action === "open") {
        if (row) {
          await supabase.from("nudges").update({ status: "handled", handled_at: new Date().toISOString() }).eq("id", row.id).eq("user_id", user.id);
        } else {
          await insertReminder(supabase, user.id, deal_id, payment.id, step, nudge.subject, nudge.body, deal.rep_email);
        }
        return NextResponse.json({ mode: action, subject: nudge.subject, body: nudge.body, rep_email: deal.rep_email, step, handled: true });
      }

      // generate: return the text; do not auto-create a handled state, but do
      // persist a 'ready' row so it surfaces under "Needs a nudge".
      if (action === "generate" || !action) {
        if (!row) {
          await insertReminder(supabase, user.id, deal_id, payment.id, step, nudge.subject, nudge.body, deal.rep_email);
        }
        return NextResponse.json({ mode: "ready", subject: nudge.subject, body: nudge.body, rep_email: deal.rep_email, step, handled: false });
      }
    }
  }

  // handle / dismiss by reminder id.
  if (action === "handle" || action === "dismiss") {
    if (!reminder_id) {
      // No id provided but payment_id + deal_id supplied -> treat as handled.
      if (payment_id && deal_id) {
        await supabase.from("nudges").update({ status: "handled", handled_at: new Date().toISOString() }).eq("payment_id", payment_id).eq("user_id", user.id);
        return NextResponse.json({ ok: true, handled: true });
      }
      return NextResponse.json({ error: "missing reminder id" }, { status: 400 });
    }
    await supabase.from("nudges").update({
      status: action === "handle" ? "handled" : "skipped",
      handled_at: action === "handle" ? new Date().toISOString() : undefined,
    }).eq("id", reminder_id).eq("user_id", user.id);
    return NextResponse.json({ ok: true, handled: action === "handle" });
  }

  return NextResponse.json({ error: "bad action" }, { status: 400 });
}

async function insertReminder(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string, dealId: string, paymentId: string, step: number,
  subject: string, body: string, repEmail: string
) {
  const { error } = await supabase.from("nudges").insert({
    user_id: userId, deal_id: dealId, payment_id: paymentId, sequence_step: step,
    subject, body, rep_email: repEmail, status: "ready",
  });
  if (error) throw new Error(error.message);
}