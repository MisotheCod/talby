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
// Chart window: trailing months (received income vs expected) shown in the rail.
const CHART_MONTHS = 6;

function rowStatus(p: Payment): "past_due" | "expected" | "received" {
  if (p.status === "received") return "received";
  return isPastDue(p.expected_date) ? "past_due" : "expected";
}

type MonthBucket = { key: string; label: string; expected: number; received: number; expectedRows: { brand: string; amount: number }[]; receivedRows: { brand: string; amount: number }[] };

function monthBuckets(payments: Payment[], months: number): MonthBucket[] {
  const now = new Date();
  const buckets: MonthBucket[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`, label: d.toLocaleDateString("en-US", { month: "short" }), expected: 0, received: 0, expectedRows: [], receivedRows: [] });
  }
  for (const p of payments) {
    if (!p.expected_date) continue;
    const key = p.expected_date.slice(0, 7);
    const b = buckets.find((x) => x.key === key);
    if (!b) continue;
    const brand = p.deal?.brand ?? "Payment";
    if (p.status === "received") { b.received += p.amount; b.receivedRows.push({ brand, amount: p.amount }); }
    else { b.expected += p.amount; b.expectedRows.push({ brand, amount: p.amount }); }
  }
  return buckets;
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

  // Live, RLS-scoped chart data: trailing months of received vs expected.
  const buckets = monthBuckets(payments, CHART_MONTHS);

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

      {/* Two columns, mirroring Overview: timeline left, chart rail right */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.65fr_1fr] gap-5 items-start">
        {/* Left: unified timeline (primary surface) */}
        <div className="min-w-0">
          <div className="card p-5">
            {/* Filter chips, inside the payments card */}
            <div className="flex gap-1.5 flex-wrap mb-4">
              {FILTERS.map((f) => <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>{f}</Chip>)}
            </div>

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
            <p className={cn("text-xs mt-3", nudgeMsg.kind === "ok" ? "text-ok" : "text-warn")}>{nudgeMsg.text}</p>
          )}
        </div>

        {/* Right rail: chart cards */}
        <div className="min-w-0">
          <div className="rcard">
            <h3>Income over time</h3>
            <IncomeChart buckets={buckets} />
          </div>
          <div className="rcard">
            <h3>Expected vs received</h3>
            <CompareChart buckets={buckets} />
          </div>
        </div>
      </div>

      {showAdd && (
        <AddPaymentModal deals={deals} onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); load(); }} />
      )}
    </div>
  );
}

/* One unified timeline row. Actions shorten to icon-only on narrow widths so the
   row never wraps. */
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
  const dateLabel = p.expected_date
    ? (isPast ? "Past due " : isRecv ? "Received " : "Expected ") + formatDate(p.expected_date)
    : isRecv ? "Received" : isPast ? "Past due" : "Expected";

  return (
    <li className="flex items-center gap-3 py-2.5 border-b border-line last:border-0">
      <span className={cn("w-1 self-stretch rounded-full shrink-0", barColor)} />
      <div className="min-w-0 flex-1">
        <div className="font-medium truncate">{p.deal?.brand ?? "Payment"}</div>
        <div className={cn("text-xs font-medium", textColor)}>{dateLabel}</div>
      </div>
      <span className={cn("font-semibold tabular-nums shrink-0", amountColor)}>{formatMoney(p.amount)}</span>
      {!isRecv && (
        <div className="flex items-center gap-1 shrink-0">
          {isPast && (
            <Button size="sm" variant="ghost" onClick={() => onNudge(p)} disabled={nudgeBusy === p.id} title="Send a nudge">
              <NudgeSendIcon /><span className="hidden min-[540px]:inline">Send a nudge</span>
            </Button>
          )}
          <Button size="sm" variant="secondary" onClick={() => onMarkReceived(p.id)} title="Mark received">
            <IconCheck size={14} /><span className="hidden min-[540px]:inline">Mark received</span>
          </Button>
        </div>
      )}
    </li>
  );
}

/* Income over time: received totals by month, accent-tinted (live re-tint).
   Taller bars for legibility; hovering a bar shows which deals make it up. */
function IncomeChart({ buckets }: { buckets: MonthBucket[] }) {
  const hasData = buckets.some((b) => b.received > 0);
  if (!hasData) {
    return <p className="text-[13px] text-inksoft py-8 text-center">No income received yet. Mark payments received to see your growth.</p>;
  }
  const max = Math.max(...buckets.map((b) => b.received), 1);
  return (
    <div className="flex gap-3 items-end h-[240px]">
      {buckets.map((b) => {
        const h = Math.max(6, Math.round((b.received / max) * 200));
        return (
          <div key={b.key} className="flex-1 flex flex-col items-center min-w-0 group">
            <div className="relative w-full flex items-end justify-center flex-1">
              <div className="w-10 sm:w-12 rounded-t-md transition-all group-hover:opacity-90" style={{ height: `${h}px`, background: "var(--accent)" }} />
              {b.received > 0 && (
                <Tooltip title={`${b.label} income`} rows={b.receivedRows} total={b.received} />
              )}
            </div>
            <span className="text-[10px] font-medium text-inksoft mt-2">{b.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* Expected vs received by month: two bars per month, fixed status colors.
   Hovering a month shows both the expected and received deals for it. */
function CompareChart({ buckets }: { buckets: MonthBucket[] }) {
  const hasData = buckets.some((b) => b.expected > 0 || b.received > 0);
  if (!hasData) {
    return <p className="text-[13px] text-inksoft py-8 text-center">No payment history yet. Your expected vs received will show here.</p>;
  }
  const max = Math.max(...buckets.map((b) => Math.max(b.expected, b.received)), 1);
  return (
    <div>
      <div className="flex gap-3 items-end h-[240px]">
        {buckets.map((b) => {
          const exp = Math.max(6, Math.round((b.expected / max) * 200));
          const rec = Math.max(6, Math.round((b.received / max) * 200));
          return (
            <div key={b.key} className="flex-1 flex flex-col items-center min-w-0 group relative">
              <div className="flex items-end justify-center gap-1.5 flex-1">
                <div className="w-5 sm:w-6 rounded-t-md" title={`${b.label}: expected ${formatMoney(b.expected)}`} style={{ height: `${exp}px`, background: "var(--due)" }} />
                <div className="w-5 sm:w-6 rounded-t-md" title={`${b.label}: received ${formatMoney(b.received)}`} style={{ height: `${rec}px`, background: "var(--paid)" }} />
              </div>
              <span className="text-[10px] font-medium text-inksoft mt-2">{b.label}</span>
              {(b.expected > 0 || b.received > 0) && (
                <Tooltip
                  title={`${b.label} payments`}
                  rows={[
                    ...b.expectedRows.map((r) => ({ ...r, kind: "expected" as const })),
                    ...b.receivedRows.map((r) => ({ ...r, kind: "received" as const })),
                  ]}
                  total={b.expected + b.received}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-3 text-[11px] text-inksoft">
        <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm inline-block" style={{ background: "var(--due)" }} />Expected</span>
        <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm inline-block" style={{ background: "var(--paid)" }} />Received</span>
      </div>
    </div>
  );
}

/* Hover tooltip for a chart bar: lists the deals (brand + amount) that make up
   the bar's total. Follows the cursor via the bar's absolute container. */
function Tooltip({ title, rows, total }: {
  title: string;
  rows: { brand: string; amount: number; kind?: "expected" | "received" }[];
  total: number;
}) {
  return (
    <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 hidden group-hover:block">
      <div className="w-52 bg-ink text-white text-[11px] rounded-lg px-3 py-2.5 shadow-pop">
        <div className="font-semibold mb-1">{title} · {formatMoney(total)}</div>
        {rows.map((r, i) => (
          <div key={i} className="flex items-center justify-between gap-3 py-0.5">
            <span className="truncate flex-1">{r.brand}</span>
            {r.kind && <span className={r.kind === "received" ? "text-[9px] font-semibold" : "text-[9px] font-semibold"} style={{ color: r.kind === "received" ? "var(--paid)" : "var(--due)" }}>{r.kind === "received" ? "received" : "expected"}</span>}
            <span className="tabular-nums font-medium">{formatMoney(r.amount)}</span>
          </div>
        ))}
      </div>
    </div>
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
