"use client";

import { useEffect, useRef, useState } from "react";
import { formatMoney, cn } from "@/lib/utils";
import { useIsMobile } from "@/lib/use-is-mobile";
import { UpgradeModal } from "@/components/upgrade-modal";
import { IconCalendar, IconDown, IconCheck } from "@/components/icons";
import {
  buildPeriods, defaultPeriod, keyStr, periodLabel, periodDetail,
  type Period as IncomePeriod, type PeriodKey,
} from "./income-periods";

/* ---------- types ---------- */
type Payment = {
  id: string; deal_id: string | null; amount: number;
  expected_date: string | null; status: string; invoice_state: string | null; pay_status: string | null;
  deal?: { brand: string; deliverable: string | null } | null;
};
type Deal = { id: string; brand: string; value: number | null };

const THRESHOLD = 600;

function buildCsv(rows: Payment[], label: string): void {
  const header = ["date_received", "brand", "amount", "deal_name", "payment_status", "deliverable"];
  const esc = (s: string) => (s.includes(",") || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s);
  const lines = [header.join(",")];
  for (const p of rows) {
    const brand = p.deal?.brand ?? "";
    lines.push([
      p.expected_date ?? "", esc(brand), p.amount.toFixed(2), esc(brand),
      esc(p.pay_status ?? p.status), esc(p.deal?.deliverable ?? ""),
    ].join(","));
  }
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `talby-income-${label}.csv`;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

const GROUP_LABELS: Record<string, string> = {
  quick: "Quick", quarter: "Quarters", month: "Months", year: "Years",
};

export function IncomeSummary({ payments, deals, plan }: {
  payments: Payment[]; deals: Deal[]; plan: "free" | "paid";
}) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [csvMsg, setCsvMsg] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const now = new Date();

  // All received-payment dates drive the period options (cash + gifted, so a
  // period isn't hidden just because it only had gifted value).
  const receivedDates = payments
    .filter((p) => p.status === "received")
    .map((p) => p.expected_date)
    .filter((d): d is string => !!d);

  const [periodKey, setPeriodKey] = useState<PeriodKey>(() => defaultPeriod(receivedDates));

  // Build the period list once from the data. The active key is always included.
  const periods = buildPeriods(receivedDates, periodKey);
  const active = periods.find((p) => keyStr(p.key) === keyStr(periodKey)) ?? periods[0];

  const inActiveRange = (p: Payment): boolean =>
    active ? (p.expected_date ? active.matches(p.expected_date) : false) : true;

  const received = payments.filter((p) => p.status === "received");
  const cashPmts = received.filter((p) => (p.pay_status ?? "") !== "no_invoice_needed" && inActiveRange(p));
  const giftedPmts = payments.filter((p) => (p.pay_status ?? "") === "no_invoice_needed" && (p.expected_date ? active.matches(p.expected_date) : false));

  const totalReceived = cashPmts.reduce((s, p) => s + p.amount, 0);
  const totalGifted = giftedPmts.reduce((s, p) => s + p.amount, 0);

  const brandMap = new Map<string, number>();
  for (const p of cashPmts) {
    const b = p.deal?.brand ?? "Unattached payment";
    brandMap.set(b, (brandMap.get(b) ?? 0) + p.amount);
  }
  const brandRows = [...brandMap.entries()].map(([brand, amt]) => ({ brand, amt })).sort((a, b) => b.amt - a.amt);

  const monthMap = new Map<string, number>();
  for (const p of cashPmts) {
    if (!p.expected_date) continue;
    const k = p.expected_date.slice(0, 7);
    monthMap.set(k, (monthMap.get(k) ?? 0) + p.amount);
  }
  const monthRows = [...monthMap.entries()].map(([k, amt]) => ({ key: k, label: monthLabelOf(k), amt })).sort((a, b) => a.key.localeCompare(b.key));

  const completedDeals = new Set(cashPmts.map((p) => p.deal_id).filter(Boolean));

  const paidDealIds = new Set(payments.map((p) => p.deal_id).filter(Boolean));
  const noRecordDeals = deals.filter((d) => !paidDealIds.has(d.id));
  const noRecordValue = noRecordDeals.reduce((s, d) => s + (d.value ?? 0), 0);

  const csvLabel = periodKeyBtn(periodKey, now);
  const exportCsv = () => {
    const rows = received.filter((p) => inActiveRange(p));
    if (!rows.length) { setCsvMsg("No received payments in this period yet."); return; }
    buildCsv(rows, csvLabel);
    setCsvMsg(`Exported ${rows.length} payment${rows.length === 1 ? "" : "s"}.`);
    setTimeout(() => setCsvMsg(null), 4000);
  };

  const choose = (p: IncomePeriod) => { setPeriodKey(p.key); setOpen(false); };

  // close on outside click (desktop dropdown)
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", esc); };
  }, [open]);

  if (plan !== "paid") {
    return (
      <div className="card p-8 text-center">
        <h2 className="text-lg font-semibold">Income summary</h2>
        <p className="text-sm text-muted mt-2">See income by month, quarter, or year, break it down by brand, and export a tax-ready CSV.</p>
        <p className="text-sm text-muted mt-1">This is an Unlimited feature.</p>
        <button onClick={() => setShowUpgrade(true)} className="btn btn-3d btn-lg mt-5">Go unlimited</button>
        {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
      </div>
    );
  }

  const list = (
    <div className="py-1">
      {(["quick", "quarter", "month", "year"] as const).map((g) => {
        const items = periods.filter((p) => p.group === g);
        if (!items.length) return null;
        return (
          <div key={g}>
            <div className="text-[10.5px] font-semibold uppercase tracking-wider text-inkfaint px-3 pt-1.5 pb-1">{GROUP_LABELS[g]}</div>
            {items.map((p) => (
              <button
                key={keyStr(p.key)}
                onClick={() => choose(p)}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 text-left text-[13.5px] hover:bg-card2 cursor-pointer text-ink",
                  keyStr(p.key) === keyStr(active.key) && "bg-accent-tint text-accentink font-medium"
                )}
              >
                <span className={cn("flex-none w-4 grid place-items-center", keyStr(p.key) === keyStr(active.key) ? "text-accent" : "text-transparent")}>
                  <IconCheck size={14} />
                </span>
                <span className="flex-1 truncate">{p.label}</span>
                {p.detail && <span className="text-[11.5px] text-inkfaint flex-none">{p.detail}</span>}
              </button>
            ))}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6 fade-up">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold">Income summary</h2>
          <p className="text-xs text-muted mt-0.5">Grouped by the date you marked each payment received.</p>
        </div>

        {/* Period selector: dropdown on desktop, bottom sheet on mobile */}
        <div className="relative" ref={wrapRef}>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-label="Income period"
            className="flex items-center gap-2 border border-line2 rounded-lg px-2.5 h-9 text-[13.5px] text-ink bg-card hover:bg-card2 cursor-pointer"
          >
            <IconCalendar size={16} className="text-inksoft flex-none" />
            <span className="min-w-0 truncate flex-1 text-left">{active.label}</span>
            <IconDown size={15} className={cn("text-inksoft flex-none transition-transform", open && "rotate-180")} />
          </button>

          {open && (
            isMobile ? (
              <>
                <div className="fixed inset-0 z-[95] bg-black/25" onClick={() => setOpen(false)} />
                <div role="listbox" className="fixed inset-x-0 bottom-0 z-[96] bg-card rounded-t-2xl shadow-lg border-t border-line fade-up" onClick={(e) => e.stopPropagation()}>
                  <div className="sticky top-0 bg-card px-4 py-2.5 border-b border-line flex items-center justify-between">
                    <span className="font-semibold text-sm">Income period</span>
                    <button onClick={() => setOpen(false)} className="text-[12.5px] text-inksoft hover:text-ink cursor-pointer px-2.5 py-1 rounded-lg">Done</button>
                  </div>
                  <div className="max-h-[55vh] overflow-y-auto px-2">
                    {(["quick", "quarter", "month", "year"] as const).map((g) => {
                      const items = periods.filter((p) => p.group === g);
                      if (!items.length) return null;
                      return (
                        <div key={g}>
                          <div className="text-[10.5px] font-semibold uppercase tracking-wider text-inkfaint px-3 pt-1.5 pb-1">{GROUP_LABELS[g]}</div>
                          {items.map((p) => (
                            <button key={keyStr(p.key)} onClick={() => choose(p)}
                              className={cn("w-full flex items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-card2 cursor-pointer text-ink",
                                keyStr(p.key) === keyStr(active.key) && "bg-accent-tint text-accentink font-medium")}>
                              <span className={cn("flex-none w-4 grid place-items-center", keyStr(p.key) === keyStr(active.key) ? "text-accent" : "text-transparent")}><IconCheck size={14} /></span>
                              <span className="flex-1 truncate">{p.label}</span>
                              {p.detail && <span className="text-[12px] text-inkfaint flex-none">{p.detail}</span>}
                            </button>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                  {active.detail && <p className="text-[11.5px] text-inkfaint text-center py-1.5">{active.detail} · {active.label}</p>}
                </div>
              </>
            ) : (
              <div role="listbox" className="absolute right-0 top-12 z-40 w-56 bg-card border border-line2 rounded-xl shadow-pop py-1 fade-up max-h-80 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                {list}
              </div>
            )
          )}
        </div>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="text-sm text-muted">Total received</div>
          <div className="font-head text-2xl font-semibold mt-1 tabular-nums" style={{ color: "var(--green)" }}>{formatMoney(totalReceived)}</div>
        </div>
        <div className="card p-5">
          <div className="text-sm text-muted">Gifted value</div>
          <div className="font-head text-2xl font-semibold mt-1 tabular-nums">{formatMoney(totalGifted)}</div>
          <div className="text-xs text-muted mt-1">Tracked separately, never folded into received.</div>
        </div>
        <div className="card p-5">
          <div className="text-sm text-muted">Deals completed</div>
          <div className="font-head text-2xl font-semibold mt-1 tabular-nums">{completedDeals.size}</div>
          <div className="text-xs text-muted mt-1">{giftedPmts.length} gifted payment{giftedPmts.length === 1 ? "" : "s"}</div>
        </div>
      </div>

      {/* By brand */}
      <div className="card p-6">
        <h3 className="font-semibold text-[15px] mb-3">By brand</h3>
        {brandRows.length === 0 ? (
          <p className="text-sm text-muted py-3">No received cash payments in this period.</p>
        ) : (
          <div className="divide-y divide-line">
            {brandRows.map((b) => (
              <div key={b.brand} className="flex items-center gap-3 py-2.5">
                <span className="flex-1 truncate text-sm">{b.brand}</span>
                {b.amt >= THRESHOLD && (
                  <span className="text-xs font-semibold rounded-full px-2 py-0.5" style={{ background: "var(--warn-t)", color: "var(--warn)" }}>≥ $600 · 1099</span>
                )}
                <span className="money text-sm font-semibold tabular-nums">{formatMoney(b.amt)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* By month */}
      <div className="card p-6">
        <h3 className="font-semibold text-[15px] mb-3">By month</h3>
        {monthRows.length === 0 ? (
          <p className="text-sm text-muted text-center py-6">No received payments in this period.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {monthRows.map((m) => (
              <div key={m.key} className="p-3 border border-line2 rounded-xl">
                <div className="text-xs text-muted">{m.label}</div>
                <div className="font-semibold tabular-nums mt-1">{formatMoney(m.amt)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Not included */}
      <div className="card p-5 border border-warn/30" style={{ background: "var(--warn-t)" }}>
        <div className="text-sm font-medium">Not included</div>
        <p className="text-xs text-muted mt-1">
          <b>{noRecordDeals.length} deal{noRecordDeals.length === 1 ? "" : "s"}</b> have no payment record, worth <b>{formatMoney(noRecordValue)}</b>. They are not counted above. Add a payment to get a complete picture.
        </p>
        <a href="/app/deals" className="text-xs accent-text hover:underline inline-block mt-2">Review deals →</a>
      </div>

      {/* CSV export */}
      <div className="card p-5 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="text-sm font-medium">CSV export</div>
          <p className="text-xs text-muted mt-0.5">One row per payment. Respects the current filter; the filename includes the period.</p>
        </div>
        <div className="flex items-center gap-3">
          {csvMsg && <span className="text-xs text-muted">{csvMsg}</span>}
          <button onClick={exportCsv} className="btn btn-3d">Export CSV</button>
        </div>
      </div>

      <p className="text-[11px] text-muted text-center">This is a record of payments you marked as received in Talby. It is not a tax document.</p>
    </div>
  );
}

function monthLabelOf(key: string): string {
  const [y, m] = key.split("-").map(Number);
  if (!y || !m) return key;
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

/** Filename-safe period slug. */
function periodKeyBtn(k: PeriodKey, now: Date): string {
  switch (k.kind) {
    case "ytd": return `ytd-${now.getFullYear()}`;
    case "this_quarter": return `q${Math.ceil((now.getMonth() + 1) / 3)}-${now.getFullYear()}`;
    case "this_month": return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    case "all": return "all-time";
    case "quarter": return `q${k.q}-${k.year}`;
    case "month": return `${k.year}-${String(k.month).padStart(2, "0")}`;
    case "year": return `${k.year}`;
  }
}