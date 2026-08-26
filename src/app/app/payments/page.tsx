"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatMoney, isPastDue, cn } from "@/lib/utils";
import { IconPlus, IconMore, IconCheck, IconSend } from "@/components/icons";
import { Button, Input, Select, Spinner, StatusPill, Segmented } from "@/components/ui";

/* ---------- types ---------- */
type Payment = {
  id: string; deal_id: string | null; amount: number;
  expected_date: string | null; status: string;
  invoice_state: string | null;
  deal?: { brand: string } | null;
};
type Deal = {
  id: string; brand: string; value: number | null; deal_type: string | null;
  created_at: string; active: boolean; status: string;
};
type Range = "month" | "quarter" | "year" | "all";
const RANGES: Range[] = ["month", "quarter", "year", "all"];

/* ---------- helpers ---------- */
function fmtMonth(iso: string): string {
  const d = new Date(iso + "-01");
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}
function fmtQuarter(key: string): string {
  const m = key.match(/^(\d{4})-Q(\d)/);
  if (!m) return key;
  return `Q${m[2]} ${m[1].slice(2)}`;
}
function fmtYear(iso: string): string { return iso.slice(0, 4); }

function rowsStatus(p: Payment): "past_due" | "expected" | "received" {
  if (p.status === "received") return "received";
  return isPastDue(p.expected_date) ? "past_due" : "expected";
}

/* Invoice state label + pill kind. null/undefined -> "Not invoiced" so the
   creators can spot a payment approaching that hasn't had an invoice sent. */
function invoiceLabel(s: string | null): string {
  if (s === "invoiced") return "Invoiced";
  if (s === "no_invoice_needed") return "No invoice needed";
  return "Not invoiced";
}
function invoiceKind(s: string | null): "paid" | "due" | "neutral" {
  if (s === "invoiced") return "paid";
  if (s === "no_invoice_needed") return "neutral";
  return "due";
}

/* Year-over-year line helper: given a numeric for this period and a
   function retrieving the same metric for the prior year, produce a
   trend string and arrow direction — only when both values exist. */
function trendLine(current: number, prior: number): string | null {
  if (prior <= 0 || current <= 0) return null;
  const pct = Math.round(((current - prior) / prior) * 100);
  if (pct === 0) return null;
  return `${pct > 0 ? "↑" : "↓"} ${Math.abs(pct)}% vs last year`;
}

/* ---------- page component ---------- */
export default function PaymentsPage() {
  const supabase = createClient();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [nudgeBusy, setNudgeBusy] = useState<string | null>(null);
  const [nudgeMsg, setNudgeMsg] = useState<{ paymentId: string; kind: "ok" | "warn"; text: string } | null>(null);
  const [listFilter, setListFilter] = useState<"All" | "Expected" | "Received" | "Not invoiced">("All");
  const [range, setRange] = useState<Range>("month");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  /* Close ⋮ menu on outside click */
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const load = useCallback(async () => {
    const [p, d] = await Promise.all([
      supabase.from("payments").select("*, deal:deals(brand)").order("expected_date", { ascending: true }),
      supabase.from("deals").select("id, brand, value, deal_type, created_at, active, status").order("created_at", { ascending: true }),
    ]);
    setPayments((p.data ?? []) as unknown as Payment[]);
    setDeals((d.data ?? []) as unknown as Deal[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  /* ---------- derived stats ---------- */
  const now = new Date();
  const thisYear = now.getFullYear();
  const lastYear = thisYear - 1;

  const received = payments.filter((p) => p.status === "received");
  const pending = payments.filter((p) => p.status !== "received");

  const receivedYtd = received.filter((p) => p.expected_date?.startsWith(String(thisYear)));
  const receivedYtdTotal = receivedYtd.reduce((s, p) => s + p.amount, 0);
  const receivedLastYtd = received.filter((p) => p.expected_date?.startsWith(String(lastYear)));
  const receivedLastYtdTotal = receivedLastYtd.reduce((s, p) => s + p.amount, 0);

  const expectedTotal = pending.reduce((s, p) => s + p.amount, 0);
  const expectedCount = pending.length;

  const activeDeals = deals.filter((d) => d.active && d.status !== "archived" && d.brand?.trim());
  const dealValues = activeDeals.map((d) => d.value).filter((v): v is number => v !== null && v > 0);
  const avgDealValue = dealValues.length
    ? Math.round(dealValues.reduce((a, b) => a + b, 0) / dealValues.length)
    : null;

  // Monthly received for the best-month stat
  const monthlyReceived: Record<string, number> = {};
  for (const p of received) {
    if (!p.expected_date) continue;
    const key = p.expected_date.slice(0, 7);
    monthlyReceived[key] = (monthlyReceived[key] || 0) + p.amount;
  }
  const entries = Object.entries(monthlyReceived);
  const bestMonthEntry = entries.length ? entries.sort((a, b) => b[1] - a[1])[0] : null;
  const bestMonthName = bestMonthEntry ? fmtMonth(bestMonthEntry[0]) : null;
  const bestMonthAmount = bestMonthEntry ? bestMonthEntry[1] : null;

  // Trend for avg deal value vs prior year deals
  const priorDeals = deals.filter((d) => d.created_at?.startsWith(String(lastYear)));
  const priorDealValues = priorDeals.map((d) => d.value).filter((v): v is number => v !== null && v > 0);
  const priorAvg = priorDealValues.length
    ? Math.round(priorDealValues.reduce((a, b) => a + b, 0) / priorDealValues.length)
    : null;

  /* ---------- income over time (hero chart) ---------- */
  const incomeBuckets = useMemo(() => {
    if (!received.length) return [];
    if (range === "all") {
      const allYears = [...new Set(received.map((p) => p.expected_date?.slice(0, 4) || "").filter(Boolean))].sort();
      return allYears.map((y) => {
        const total = received.filter((p) => p.expected_date?.startsWith(y)).reduce((s, p) => s + p.amount, 0);
        return { key: y, label: y, value: total };
      });
    }
    const map: Record<string, number> = {};
    for (const p of received) {
      if (!p.expected_date) continue;
      const key = range === "month" ? p.expected_date.slice(0, 7)
        : range === "quarter" ? `${p.expected_date.slice(0, 4)}-Q${Math.ceil(Number(p.expected_date.slice(5, 7)) / 3)}`
        : p.expected_date.slice(0, 4);
      map[key] = (map[key] || 0) + p.amount;
    }
    const keys = Object.keys(map).sort();
    return keys.map((k) => {
      const label = range === "quarter" ? fmtQuarter(k) : range === "month" ? fmtMonth(k) : k;
      return { key: k, label, value: map[k] };
    });
  }, [received, range]);

  const incomeMax = Math.max(...incomeBuckets.map((b) => b.value), 1);

  /* ---------- deals-by-month (deals signed per month) ---------- */
  // Full trailing-12-month series so the chart always has all month labels,
  // with empty months sitting at zero instead of disappearing.
  const dealsByMonth = useMemo(() => {
    const map: Record<string, number> = {};
    for (const d of activeDeals) {
      const m = d.created_at?.slice(0, 7);
      if (m) map[m] = (map[m] || 0) + 1;
    }
    const now = new Date();
    const out: { key: string; label: string; value: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      out.push({ key, label: fmtMonth(key), value: map[key] || 0 });
    }
    return out;
  }, [activeDeals]);

  const dealsMax = Math.max(...dealsByMonth.map((b) => b.value), 1);

  /* Seasonality takeaway: only show with ~1yr of data (≥10 active months) */
  const showTakeaway = dealsByMonth.filter((b) => b.value > 0).length >= 10;
  const takeaway = useMemo(() => {
    if (!showTakeaway || dealsByMonth.length < 10) return null;
    // Sum deal volume by calendar month name across the trailing year.
    const counts: Record<string, number> = {};
    for (const d of dealsByMonth) counts[d.label.slice(0, 3)] = (counts[d.label.slice(0, 3)] || 0) + d.value;
    const ranked = Object.entries(counts).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
    if (!ranked.length) return null;
    const top = ranked.filter(([, v]) => v === ranked[0][1]);
    // Only claim a pattern if the busiest month clearly stands out.
    if (top.length > 1) return null;
    const [busyMonth] = ranked[0];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const idx = monthNames.indexOf(busyMonth);
    const pitchMonth = idx <= 0 ? monthNames[11] : monthNames[idx - 1];
    return { busy: busyMonth, pitch: pitchMonth };
  }, [showTakeaway, dealsByMonth]);

  /* ---------- coming up list ---------- */
  const listItems = (() => {
    const base = listFilter === "All" ? payments
      : listFilter === "Expected" ? pending
      : listFilter === "Received" ? received
      : payments.filter((p) => (p.invoice_state ?? "not_invoiced") === "not_invoiced");
    // Payments with NO expected date don't fit a month bucket — surface them in
    // their own "Upcoming" group so they're never hidden.
    const undated = base.filter((p) => !p.expected_date);
    // Group the dated ones by month (expected_date)
    const groups: Record<string, Payment[]> = {};
    for (const p of base) {
      const m = (p.expected_date || "").slice(0, 7);
      if (!m) continue;
      if (!groups[m]) groups[m] = [];
      groups[m].push(p);
    }
    // Sort months most-recent-first for received, upcoming-first for expected
    const months = Object.keys(groups).sort((a, b) => {
      if (listFilter === "Received") return b.localeCompare(a);
      // For All/Expected: expected first, then received at end
      const aRecv = groups[a].every((p) => p.status === "received");
      const bRecv = groups[b].every((p) => p.status === "received");
      if (aRecv && !bRecv) return 1; if (!aRecv && bRecv) return -1;
      return a.localeCompare(b);
    });
    const output = months.map((m) => ({
      month: m,
      label: fmtMonth(m),
      payments: groups[m].sort((a, b) => {
        // Past due first, then by date
        const sa = rowsStatus(a), sb = rowsStatus(b);
        if (sa === "past_due" && sb !== "past_due") return -1;
        if (sa !== "past_due" && sb === "past_due") return 1;
        return (a.expected_date || "").localeCompare(b.expected_date || "");
      }),
    }));
    if (undated.length) output.unshift({ month: "upcoming", label: "Upcoming", payments: undated });
    return output;
  })();

  /* ---------- actions ---------- */
  const markReceived = async (id: string) => {
    await supabase.from("payments").update({ status: "received" }).eq("id", id);
    setMenuOpen(null);
    load();
  };
  const setInvoice = async (id: string, state: string) => {
    await supabase.from("payments").update({ invoice_state: state }).eq("id", id);
    setMenuOpen(null);
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
    setMenuOpen(null);
  };

  if (loading) return <div className="space-y-4"><div className="skeleton h-10 w-56" /><div className="grid grid-cols-4 gap-4"><div className="skeleton h-24" /><div className="skeleton h-24" /><div className="skeleton h-24" /><div className="skeleton h-24" /></div></div>;

  return (
    <div className="space-y-6 fade-up">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Payments</h1>
          <p className="text-muted text-sm mt-1">Your money at a glance.</p>
        </div>
        <Button onClick={() => setShowAdd(true)}><IconPlus size={16} /> Add expected payment</Button>
      </div>

      {/* === 1. Four stat cards === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Earned this year" value={formatMoney(receivedYtdTotal)} color="text-ok"
          trend={trendLine(receivedYtdTotal, receivedLastYtdTotal)} />
        <StatCard label="Expected" value={formatMoney(expectedTotal)} color="text-warn"
          trend={`${expectedCount} payment${expectedCount === 1 ? "" : "s"}`} />
        <StatCard label="Avg deal value" value={avgDealValue ? formatMoney(avgDealValue) : "–"} color="text-ink"
          trend={priorAvg ? trendLine(avgDealValue || 0, priorAvg) : null} />
        <StatCard label="Best month" value={bestMonthName || "–"} color="text-ink"
          trend={bestMonthAmount ? formatMoney(bestMonthAmount) : "Not enough data yet"} />
      </div>

      {/* === 2 & 3. Income over time (left) + Deals signed per month (right) === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Income over time */}
        <div className="card p-6">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
            <div>
              <h2 className="font-semibold text-[15px]">Income over time</h2>
              <p className="text-xs text-muted mt-0.5">Received payments only</p>
            </div>
            <Segmented options={RANGES} value={range} onChange={setRange}
              getLabel={(r) => r === "month" ? "Month" : r === "quarter" ? "Quarter" : r === "year" ? "Year" : "All"} />
          </div>
          {incomeBuckets.length === 0 ? (
            <p className="text-sm text-muted py-10 text-center">No received payments yet. Mark payments received to see your income trend.</p>
          ) : (
            <BarChart data={incomeBuckets} max={incomeMax} h={220} hMax={190} color="var(--accent)" />
          )}
        </div>

        {/* Deals signed per month */}
        <div className="card p-6">
          <h2 className="font-semibold text-[15px] mb-2">Deals signed per month</h2>
          {dealsByMonth.every((b) => b.value === 0) ? (
            <p className="text-sm text-muted py-10 text-center">Add deals with a created date to see your signing patterns.</p>
          ) : (
            <>
              <LineChart data={dealsByMonth} max={dealsMax} h={220} />
              {showTakeaway && takeaway && (
                <p className="text-xs text-muted mt-3">
                  {takeaway.busy} is your busiest signing month. Pitch in {takeaway.pitch} to lock in work.
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* === 4. Coming up list === */}
      <div>
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <h2 className="font-semibold text-[15px]">Coming up</h2>
          <div className="flex gap-1.5">
            <Segmented options={(["All", "Expected", "Received", "Not invoiced"] as const)} value={listFilter} onChange={setListFilter} />
          </div>
        </div>
        {listItems.length === 0 ? (
          <p className="text-sm text-muted text-center py-10">No payments yet.</p>
        ) : (
          <div className="space-y-6">
            {listItems.map((group) => (
              <div key={group.month}>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">{group.label}</div>
                <div className="card divide-y divide-line">
                  {group.payments.map((p) => {
                    const st = rowsStatus(p);
                    const isRecv = st === "received";
                    const isPast = st === "past_due";
                    const day = p.expected_date ? Number(p.expected_date.slice(8)) : null;
                    return (
                      <div key={p.id} className="flex items-center gap-3 px-5 py-3">
                        <span className={cn("w-8 shrink-0 text-sm font-semibold tabular-nums text-center", isRecv ? "text-muted" : isPast ? "text-late" : "text-ink")}>
                          {day ?? "–"}
                        </span>
                        <span className={cn("flex-1 min-w-0 truncate text-sm", isRecv ? "text-muted" : "font-medium")}>
                          {p.deal?.brand ?? "Payment"}
                        </span>
                        <span className="shrink-0">
                          {isRecv ? (
                            <StatusPill size="sm" kind="paid">Paid</StatusPill>
                          ) : isPast ? (
                            <StatusPill size="sm" kind="late">Past due</StatusPill>
                          ) : (
                            <StatusPill size="sm" kind="due">Expected</StatusPill>
                          )}
                        </span>
                        <span className="shrink-0">
                          <StatusPill size="sm" kind={invoiceKind(p.invoice_state)}>{invoiceLabel(p.invoice_state)}</StatusPill>
                        </span>
                        <span className={cn("shrink-0 text-sm font-semibold tabular-nums w-20 text-right", isRecv ? "text-ok" : "text-ink")}>
                          {formatMoney(p.amount)}
                        </span>
                        {!isRecv && (
                          <div className="relative shrink-0">
                            <button onClick={() => setMenuOpen(menuOpen === p.id ? null : p.id)} aria-label="Actions" className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-card2 cursor-pointer">
                              <IconMore size={16} />
                            </button>
                            {menuOpen === p.id && (
                              <div ref={menuRef} className="absolute right-0 top-7 z-20 w-48 bg-card border border-line2 rounded-xl shadow-pop py-1 fade-up">
                                <button onClick={() => setInvoice(p.id, "invoiced")} className="w-full text-left px-3.5 py-2 text-sm hover:bg-card2 cursor-pointer">Mark invoiced</button>
                                <button onClick={() => setInvoice(p.id, "not_invoiced")} className="w-full text-left px-3.5 py-2 text-sm hover:bg-card2 cursor-pointer" disabled={(p.invoice_state ?? "not_invoiced") === "not_invoiced"}>Mark not invoiced</button>
                                <button onClick={() => setInvoice(p.id, "no_invoice_needed")} className="w-full text-left px-3.5 py-2 text-sm hover:bg-card2 cursor-pointer">No invoice needed</button>
                                <div className="my-1 h-px bg-line" />
                                <button onClick={() => markReceived(p.id)} className="w-full text-left px-3.5 py-2 text-sm hover:bg-card2 cursor-pointer flex items-center gap-2">
                                  <IconCheck size={14} /> Mark as paid
                                </button>
                                {isPast && (
                                  <button onClick={() => { setMenuOpen(null); nudgePayment(p); }} disabled={nudgeBusy === p.id} className="w-full text-left px-3.5 py-2 text-sm hover:bg-card2 cursor-pointer flex items-center gap-2">
                                    <IconSend size={14} /> Send a nudge
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {nudgeMsg && (
        <p className={cn("text-xs", nudgeMsg.kind === "ok" ? "text-ok" : "text-warn")}>{nudgeMsg.text}</p>
      )}

      {showAdd && (
        <AddPaymentModal deals={deals.map((d) => ({ id: d.id, brand: d.brand }))} onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); load(); }} />
      )}
    </div>
  );
}

/* ---------- sub-components ---------- */

function StatCard({ label, value, color, trend }: { label: string; value: string; color: string; trend: string | null }) {
  return (
    <div className="card p-5">
      <div className="text-sm text-muted font-medium">{label}</div>
      <div className={cn("font-head text-2xl font-semibold mt-1 tabular-nums", color)}>{value}</div>
      {trend && <div className="text-xs text-muted mt-1">{trend}</div>}
    </div>
  );
}

function BarChart({ data, max, h, hMax, color }: {
  data: { key: string; label: string; value: number }[];
  max: number; h: number; hMax: number;
  color?: string;
}) {
  return (
    <div>
      <div className="flex gap-3 items-end relative" style={{ height: `${h}px` }}>
        {/* Baseline so bars sit on a chart line, not floating */}
        <div className="absolute left-0 right-0 bottom-0 border-t border-line" />
        {data.map((b) => {
          const barH = b.value > 0 ? Math.max(4, Math.round((b.value / max) * hMax)) : 2;
          return (
            <div key={b.key} className="flex-1 flex flex-col items-center justify-end min-w-0 group h-full">
              {/* Hover label: reused theme-tip surface (dark + light text in both modes) */}
              <div className="hidden group-hover:flex absolute -top-2 z-10 px-2 py-0.5 rounded-md text-[10px] whitespace-nowrap theme-tip shadow-sm pointer-events-none">
                <span className="tabular-nums">{formatMoney(b.value)}</span>
                <span> · {b.label}</span>
              </div>
              <div
                className="w-full max-w-10 sm:max-w-12 rounded-t-sm transition-all group-hover:opacity-85"
                style={{ height: `${barH}px`, background: color || "var(--accent)" }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-3 mt-2">
        {data.map((b) => (
          <span key={b.key} className="flex-1 text-[9px] text-inksoft text-center truncate">{b.label}</span>
        ))}
      </div>
    </div>
  );
}

/* Line graph — shows the trend of a series over time. Renders a connected
   polyline with a soft same-hue glow area, a baseline, and a label for every
   point (including empty months at zero). */
function LineChart({ data, max, h }: {
  data: { key: string; label: string; value: number }[];
  max: number; h: number;
}) {
  const W = 640;
  const H = h;
  const padL = 8, padR = 8, padT = 16, padB = 26;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const n = data.length;
  const pts = data.map((d, i) => {
    const x = n === 1 ? W / 2 : padL + (i / (n - 1)) * innerW;
    const y = padT + innerH - (d.value / max) * innerH;
    return { x, y, ...d };
  });
  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L ${(pts[n - 1]?.x ?? W / 2).toFixed(1)} ${(padT + innerH).toFixed(1)} L ${(pts[0]?.x ?? W / 2).toFixed(1)} ${(padT + innerH).toFixed(1)} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Deals signed per month">
      {/* baseline */}
      <line x1={padL} y1={padT + innerH} x2={W - padR} y2={padT + innerH} stroke="var(--line)" strokeWidth="1" />
      {/* soft area fill */}
      <path d={areaPath} fill="var(--accent)" opacity="0.08" />
      {/* line */}
      <path d={linePath} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* points + labels (every month, empty at zero) */}
      {pts.map((p) => (
        <g key={p.key}>
          <circle cx={p.x} cy={p.y} r={p.value > 0 ? 3.5 : 1.5} fill="var(--accent)" />
          <text x={p.x} y={H - 8} textAnchor="middle" fontSize="9" fill="var(--ink-soft)">{p.label}</text>
        </g>
      ))}
    </svg>
  );
}

function AddPaymentModal({ deals, onClose, onSaved }: { deals: { id: string; brand: string }[]; onClose: () => void; onSaved: () => void }) {
  const supabase = createClient();
  const [dealId, setDealId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [invoiceState, setInvoiceState] = useState("not_invoiced");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!amount) { setError("Enter an amount."); return; }
    setSaving(true); setError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not signed in."); setSaving(false); return; }
    const { error } = await supabase.from("payments").insert({
      user_id: user.id, deal_id: dealId || null, amount: Number(amount), expected_date: date || null,
      invoice_state: invoiceState,
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
          <label className="block">
            <span className="text-sm font-medium block mb-1.5">Invoice</span>
            <Select value={invoiceState} onChange={(e) => setInvoiceState(e.target.value)}>
              <option value="not_invoiced">Not invoiced</option>
              <option value="invoiced">Invoiced</option>
              <option value="no_invoice_needed">No invoice needed</option>
            </Select>
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