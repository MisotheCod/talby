"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatMoney, formatDate, isPastDue, cn } from "@/lib/utils";
import { IconCheck, IconPlus } from "@/components/icons";
import { Button, Input, Select, Spinner, Chip } from "@/components/ui";

type Payment = {
  id: string; deal_id: string | null; amount: number;
  expected_date: string | null; status: string;
  deal?: { brand: string } | null;
};
type Deal = { id: string; brand: string };

const FILTERS = ["All", "Past due", "Expected", "Received"] as const;
type Filter = (typeof FILTERS)[number];

// Recent window so the timeline doesn't become an endless scroll; "View all"
// lifts it. Received rows sort most-recent-first.
const DEFAULT_WINDOW = 20;

function rowStatus(p: Payment): "past_due" | "expected" | "received" {
  if (p.status === "received") return "received";
  return isPastDue(p.expected_date) ? "past_due" : "expected";
}

export default function PaymentsPage() {
  const supabase = createClient();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [nudgeBusy, setNudgeBusy] = useState<string | null>(null);
  const [nudgeMsg, setNudgeMsg] = useState<{ paymentId: string; kind: "ok" | "warn"; text: string } | null>(null);
  const [filter, setFilter] = useState<Filter>("All");
  const [showAll, setShowAll] = useState(false);

  const load = useCallback(async () => {
    const [p, d] = await Promise.all([
      supabase.from("payments").select("*, deal:deals(brand)").order("expected_date", { ascending: true }),
      supabase.from("deals").select("id, brand"),
    ]);
    setPayments((p.data ?? []) as unknown as Payment[]);
    setDeals((d.data ?? []) as unknown as Deal[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const income = payments.reduce((s, p) => s + p.amount, 0);
  const expected = payments.filter((p) => p.status !== "received").reduce((s, p) => s + p.amount, 0);
  const received = payments.filter((p) => p.status === "received").reduce((s, p) => s + p.amount, 0);

  // Unified timeline: past due first (oldest due first), then expected by date,
  // then received most-recent-first (newest at top).
  const pastDue = payments
    .filter((p) => rowStatus(p) === "past_due")
    .sort((a, b) => (b.expected_date ?? "").localeCompare(a.expected_date ?? ""));
  const expectedList = payments
    .filter((p) => rowStatus(p) === "expected")
    .sort((a, b) => (a.expected_date ?? "").localeCompare(b.expected_date ?? ""));
  const receivedList = payments
    .filter((p) => rowStatus(p) === "received")
    .sort((a, b) => (b.expected_date ?? "").localeCompare(a.expected_date ?? ""));

  const filtered = filter === "All" ? [...pastDue, ...expectedList, ...receivedList]
    : filter === "Past due" ? pastDue
    : filter === "Expected" ? expectedList
    : receivedList;

  const truncated = !showAll;
  const visible = truncated ? filtered.slice(0, DEFAULT_WINDOW) : filtered;
  const hasMore = filtered.length > DEFAULT_WINDOW;

  const markReceived = async (id: string) => {
    await supabase.from("payments").update({ status: "received" }).eq("id", id);
    load();
  };

  const nudgePayment = async (p: Payment) => {
    const dealId = p.deal_id;
    let repEmail: string | null = null;
    let nudgeMode = "draft";
    if (dealId) {
      const d = await supabase.from("deals").select("rep_email, nudge_mode").eq("id", dealId).single();
      const row = (d.data ?? {}) as unknown as { rep_email?: string | null; nudge_mode?: string };
      repEmail = row.rep_email ?? null;
      nudgeMode = row.nudge_mode ?? "draft";
    }
    if (!repEmail) { setNudgeMsg({ paymentId: p.id, kind: "warn", text: "Add a rep email to nudge this one (edit the deal)." }); return; }
    setNudgeBusy(p.id); setNudgeMsg(null);
    try {
      const res = await fetch("/api/nudges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deal_id: dealId, payment_id: p.id, action: "draft" }),
      });
      const data = await res.json();
      if (data.error === "already_paid") setNudgeMsg({ paymentId: p.id, kind: "ok", text: "Already received, no nudge will be sent." });
      else if (data.error === "paid_required") setNudgeMsg({ paymentId: p.id, kind: "warn", text: "Nudges are on the paid plan. Chasing this? Go unlimited and Talby drafts the follow-up for you." });
      else if (data.mode === "draft") setNudgeMsg({ paymentId: p.id, kind: "ok", text: `Draft ready in Gmail: ${data.subject}. Review and send.` });
      else if (data.mode === "copy") setNudgeMsg({ paymentId: p.id, kind: "ok", text: `Nudge prepared: ${data.subject}. Connect Gmail to send, or copy it.` });
      else setNudgeMsg({ paymentId: p.id, kind: "warn", text: data.message || data.error || "Could not prepare the nudge." });
    } catch { setNudgeMsg({ paymentId: p.id, kind: "warn", text: "Could not reach the nudge service." }); }
    setNudgeBusy(null);
  };

  if (loading) return <div className="space-y-4"><div className="skeleton h-10 w-56" /><div className="grid grid-cols-3 gap-4"><div className="skeleton h-24" /><div className="skeleton h-24" /><div className="skeleton h-24" /></div></div>;

  return (
    <div className="space-y-6 fade-up">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Payments</h1>
          <p className="text-muted text-sm mt-1">Your money at a glance.</p>
        </div>
        <Button onClick={() => setShowAdd(true)}><IconPlus size={16} /> Add expected payment</Button>
      </div>

      {/* Summary (unchanged, live totals) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Summary label="Income (booked)" value={income} />
        <Summary label="Expected" value={expected} tone="warn" />
        <Summary label="Received" value={received} tone="ok" />
      </div>

      {/* Filter chips (same active styling as deals) */}
      <div className="flex gap-1.5 flex-wrap">
        {FILTERS.map((f) => <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>{f}</Chip>)}
      </div>

      {/* Unified timeline */}
      <div className="card p-5">
        {visible.length === 0 ? (
          <p className="text-sm text-muted py-8 text-center">{filter === "All" ? "No payments yet." : `No ${filter.toLowerCase()} payments.`}</p>
        ) : (
          <ul className="space-y-1">
            {visible.map((p) => <TimelineRow key={p.id} p={p} nudgeBusy={nudgeBusy} onMarkReceived={markReceived} onNudge={nudgePayment} />)}
          </ul>
        )}
        {hasMore && (
          <button onClick={() => setShowAll((s) => !s)} className="mt-4 w-full text-sm font-medium accent-text hover:underline cursor-pointer">
            {truncated ? `View all ${filtered.length} payments` : "Show fewer"}
          </button>
        )}
      </div>

      {nudgeMsg && (
        <p className={cn("text-xs", nudgeMsg.kind === "ok" ? "text-ok" : "text-warn")}>{nudgeMsg.text}</p>
      )}

      {showAdd && (
        <AddPaymentModal deals={deals} onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); load(); }} />
      )}
    </div>
  );
}

/* One unified timeline row. */
function TimelineRow({ p, nudgeBusy, onMarkReceived, onNudge }: {
  p: Payment; nudgeBusy: string | null;
  onMarkReceived: (id: string) => void; onNudge: (p: Payment) => void;
}) {
  const st = rowStatus(p);
  const isPast = st === "past_due";
  const isRecv = st === "received";

  const barColor = isRecv ? "bg-ok" : isPast ? "bg-late" : "bg-due";
  const textColor = isRecv ? "text-ok" : isPast ? "text-late" : "text-due";
  const amountColor = isRecv ? "text-ok" : isPast ? "text-late" : "text-ink";
  const badge = isRecv ? "Received" : isPast ? "Past due" : "Expected";
  const dateLabel = p.expected_date
    ? (isPast ? "Past due " : isRecv ? "Received " : "Expected ") + formatDate(p.expected_date)
    : badge;

  return (
    <li className="flex items-center gap-3 py-2.5 border-b border-line last:border-0">
      <span className={cn("w-1 self-stretch rounded-full", barColor)} />
      <div className="min-w-0 flex-1">
        <div className="font-medium truncate">{p.deal?.brand ?? "Payment"}</div>
        <div className={cn("text-xs font-medium", textColor)}>{dateLabel}</div>
      </div>
      <span className={cn("font-semibold tabular-nums shrink-0", amountColor)}>{formatMoney(p.amount)}</span>
      {!isRecv && (
        <div className="flex items-center gap-2 shrink-0">
          {isPast && (
            <Button size="sm" variant="ghost" onClick={() => onNudge(p)} disabled={nudgeBusy === p.id}><NudgeSendIcon /> Send a nudge</Button>
          )}
          <Button size="sm" variant="secondary" onClick={() => onMarkReceived(p.id)}><IconCheck size={14} /> Mark received</Button>
        </div>
      )}
    </li>
  );
}

function Summary({ label, value, tone = "neutral" }: { label: string; value: number; tone?: "neutral" | "warn" | "ok" }) {
  return (
    <div className="card p-5">
      <div className="text-sm text-muted font-medium">{label}</div>
      <div className={cn("text-2xl font-semibold mt-1 tabular-nums", tone === "ok" && "text-ok", tone === "warn" && "text-warn")}>
        {formatMoney(value)}
      </div>
    </div>
  );
}

function AddPaymentModal({ deals, onClose, onSaved }: { deals: Deal[]; onClose: () => void; onSaved: () => void }) {
  const supabase = createClient();
  const [dealId, setDealId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!amount) { setError("Enter an amount."); return; }
    setSaving(true); setError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not signed in."); setSaving(false); return; }
    const { error } = await supabase.from("payments").insert({
      user_id: user.id, deal_id: dealId || null, amount: Number(amount), expected_date: date || null,
    });
    setSaving(false);
    if (error) { setError(error.message); return; }
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <div className="card w-full max-w-md p-6 fade-up" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <h2 className="text-lg font-semibold mb-4">Add expected payment</h2>
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium block mb-1.5">Deal (optional)</span>
            <Select value={dealId} onChange={(e) => setDealId(e.target.value)}>
              <option value="">No linked deal</option>
              {deals.map((d) => <option key={d.id} value={d.id}>{d.brand}</option>)}
            </Select>
          </label>
          <label className="block">
            <span className="text-sm font-medium block mb-1.5">Amount ($)</span>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="1500" autoFocus />
          </label>
          <label className="block">
            <span className="text-sm font-medium block mb-1.5">Expected date</span>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          {error && <p className="text-sm text-bad" role="alert">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={submit} disabled={saving}>{saving ? <Spinner /> : "Add payment"}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NudgeSendIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" /></svg>;
}
