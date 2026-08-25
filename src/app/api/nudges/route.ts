import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";
import { buildNudge } from "@/lib/nudges";
import { getAccessToken, createGmailDraft, sendGmail } from "@/lib/gmail-server";
import { DEFAULT_NUDGE_DAYS_OVERDUE } from "@/lib/constants";

export const dynamic = "force-dynamic";

type NudgeBody = {
  deal_id: string;
  payment_id: string;
  action: "draft" | "send" | "copy"; // copy = open-in-email-client fallback
};

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });

  async function customTemplates() {
    const p = await supabase.from("profiles").select("nudge_templates").eq("id", userId).single();
    return (p.data as unknown as { nudge_templates?: { step: number; body: string }[] | null } | null)?.nudge_templates ?? undefined;
  }
  const userId = user.id;

  // Paid-tier gate for the nudge feature.
  const prof = await supabase.from("profiles").select("plan").eq("id", user.id).single();
  const plan = (prof.data as unknown as { plan: string } | null)?.plan ?? "free";
  if (plan !== "paid") {
    return NextResponse.json({ error: "paid_required", message: "Nudges are part of the paid plan." }, { status: 402 });
  }

  const { deal_id, payment_id, action } = (await req.json()) as NudgeBody;
  if (!deal_id || !payment_id) return NextResponse.json({ error: "missing ids" }, { status: 400 });

  // --- HARD STOP #1: re-check received AT SEND TIME, fresh from the DB ---
  const { data: payRow } = await supabase
    .from("payments")
    .select("id, status, amount, expected_date, user_id")
    .eq("id", payment_id)
    .eq("user_id", user.id)
    .single();
  const payment = payRow as unknown as {
    id: string; status: string; amount: number; expected_date: string | null; user_id: string;
  } | null;
  if (!payment) return NextResponse.json({ error: "payment not found" }, { status: 404 });
  if (payment.status === "received") {
    return NextResponse.json({ error: "already_paid", message: "This payment is already received, so no nudge will be sent." }, { status: 409 });
  }

  // Deal + rep contact.
  const { data: dealRow } = await supabase
    .from("deals")
    .select("id, brand, deliverable, value, due_date, rep_name, rep_email, nudge_mode, user_id")
    .eq("id", deal_id)
    .eq("user_id", user.id)
    .single();
  const deal = dealRow as unknown as {
    id: string; brand: string; deliverable: string | null; value: number | null;
    due_date: string | null; rep_name: string | null; rep_email: string | null;
    nudge_mode: string; user_id: string;
  } | null;
  if (!deal) return NextResponse.json({ error: "deal not found" }, { status: 404 });

  // Guardrail #4: never without a rep email.
  if (!deal.rep_email?.trim()) {
    return NextResponse.json({ error: "no_rep_email", message: "Add a rep email to nudge this one." }, { status: 400 });
  }

  // Determine sequence step from existing nudges for this payment.
  const { data: existing } = await supabase
    .from("nudges").select("sequence_step, status").eq("payment_id", payment.id).eq("user_id", user.id);
  const sentCount = (existing ?? []).filter((n) => n.status === "sent").length;
  const step = Math.min(3, sentCount + 1);

  const daysOverdue = payment.expected_date
    ? Math.max(0, Math.floor((Date.now() - new Date(payment.expected_date + "T00:00:00").getTime()) / 86400000))
    : DEFAULT_NUDGE_DAYS_OVERDUE;

  const nudge = buildNudge(step, {
    rep_name: deal.rep_name,
    brand: deal.brand,
    deliverable: deal.deliverable,
    amount: deal.value,
    due_date: payment.expected_date ? new Date(payment.expected_date + "T00:00:00") : null,
    days_overdue: daysOverdue,
  }, await customTemplates());

  const subject = nudge.subject;
  const body = nudge.body;

  // Store a nudge row so history + dedupe work.
  const row = {
    user_id: user.id,
    deal_id: deal.id,
    payment_id: payment.id,
    sequence_step: step,
    subject,
    body,
    status: "draft",
  };

  if (action === "copy") {
    // No Gmail needed: return text for the user to send themselves.
    await supabase.from("nudges").insert(row);
    return NextResponse.json({ mode: "copy", subject, body, step, sent: false });
  }

  // Gmail required for draft/send.
  const token = await getAccessToken(user.id);
  if (!token) {
    // Return the text + guidance; no nudge row persisted (nothing sent).
    return NextResponse.json({ mode: "copy", subject, body, step, sent: false, needsConnection: true });
  }

  if (action === "draft") {
    const draft = await createGmailDraft(token, deal.rep_email, subject, body!);
    const inserted = await supabase.from("nudges").insert({ ...row, status: "draft" }).select().single();
    const rec = inserted.data as unknown as { id: string } | null;
    return NextResponse.json({ mode: "draft", gmailDraftId: draft.id, nudgeId: rec?.id ?? null, subject, body, step, sent: false });
  }

  if (action === "send") {
    const sent = await sendGmail(token, deal.rep_email, subject, body!);
    const inserted = await supabase.from("nudges").insert({
      ...row, status: "sent", sent_at: new Date().toISOString(),
    }).select().single();
    const rec = inserted.data as unknown as { id: string } | null;
    return NextResponse.json({ mode: "send", gmailMessageId: sent.id, nudgeId: rec?.id ?? null, subject, body, step, sent: true });
  }

  return NextResponse.json({ error: "bad action" }, { status: 400 });
}
