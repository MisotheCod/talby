"use client";

import { useState } from "react";
import { formatMoney, cn } from "@/lib/utils";
import { UpgradeModal } from "@/components/upgrade-modal";

/* ---------- types ---------- */
type Payment = {
  id: string; deal_id: string | null; amount: number;
  expected_date: string | null; status: string; invoice_state: string | null; pay_status: string | null;
  deal?: {
    brand: string; deliverable: string | null;
  } | null;
};

type Deal = { id: string; brand: string; value: number | null };

type Range = "month" | "quarter" | "year" | "ytd";
const RANGES: { value: Range; label: string }[] = [
  { value: "ytd", label: "Year to date" },
  { value: "month", label: "Month" },
  { value: "quarter", label: "Quarter" },
  { value: "year", label: "Year" },
];

/** 1099-NEC reporting threshold — flag any brand reaching this in the period. */
const THRESHOLD = 600;

function monthLabel(key: string): string {
  const [y, m] = key.split("-").map(Number);
  if (!y || !m) return key;
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}
function quarterLabel(key: string): string {
  const m = key.match(/^(\d{4})-Q(\d)/);
  return m ? `Q${m[2]} ${m[1].slice(2)}` : key;
}

/** Is a received payment's date within the selected range (defaults YTD)? */
function inRange(iso: string | null, range: Range): boolean {
  if (!iso) return false;
  const now = new Date();
  const y = Number(iso.slice(0, 4));
  if (range === "year") return y === now.getFullYear();
  if (range === "ytd") return y === now.getFullYear();
  if (range === "month") return iso.slice(0, 7) === `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  // quarter
  const q = Math.ceil(Number(iso.slice(5, 7)) / 3);
  return y === now.getFullYear() && q === Math.ceil((now.getMonth() + 1) / 3);
}

function buildCsv(rows: Payment[], label: string): void {
  const header = ["date_received", "brand", "amount", "deal_name", "payment_status", "deliverable"];
  const esc = (s: string) => (s.includes(",") || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s);
  const lines = [header.join(",")];
  for (const p of rows) {
    const brand = p.deal?.brand ?? "";
    lines.push([
      p.expected_date ?? "",
      esc(brand),
      p.amount.toFixed(2),
      esc(brand),
      esc(p.pay_status ?? p.status),
      esc(p.deal?.deliverable ?? ""),
    ].join(","));
  }
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `talby-income-${label}.csv`;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

/** Income Summary — second paid feature. Live, always available, gated to Unlimited. */
export function IncomeSummary({ payments, deals, plan }: {
  payments: Payment[]; deals: Deal[]; plan: "free" | "paid";
}) {
  const [range, setRange] = useState<Range>("ytd");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [csvMsg, setCsvMsg] = useState<string | null>(null);
  const now = new Date();

  // Money that actually arrived this period = payments marked received.
  const received = payments.filter((p) => p.status === "received");
  // Cash: received payments (money arrived this period).
  const cashPmts = received.filter((p) => (p.pay_status ?? "") !== "no_invoice_needed");
  // Gifted: any no-invoice-needed payment (product/swag, not cash). Tracked separately,
  // grouped by date, counted whether or not it was marked received — it carries a value
  // but no money arrives.
  const giftedPmts = payments.filter((p) => (p.pay_status ?? "") === "no_invoice_needed" && inRange(p.expected_date, range));

  const totalReceived = cashPmts.reduce((s, p) => s + p.amount, 0);
  const totalGifted = giftedPmts.reduce((s, p) => s + p.amount, 0);

  /* ---- By brand (cash received) ---- */
  const brandMap = new Map<string, number>();
  for (const p of cashPmts) {
    const b = p.deal?.brand ?? "Unattached payment";
    brandMap.set(b, (brandMap.get(b) ?? 0) + p.amount);
  }
  const brandRows = [...brandMap.entries()]
    .map(([brand, amt]) => ({ brand, amt }))
    .sort((a, b) => b.amt - a.amt);

  /* ---- By month (cash received) ---- */
  const monthMap = new Map<string, number>();
  for (const p of cashPmts) {
    if (!p.expected_date) continue;
    const k = p.expected_date.slice(0, 7);
    monthMap.set(k, (monthMap.get(k) ?? 0) + p.amount);
  }
  const monthRows = [...monthMap.entries()]
    .map(([k, amt]) => ({ key: k, label: monthLabel(k), amt }))
    .sort((a, b) => a.key.localeCompare(b.key));

  /* ---- Deals completed = distinct deals with a received payment in period ---- */
  const completedDeals = new Set(cashPmts.map((p) => p.deal_id).filter(Boolean));

  /* ---- Not counted: deals with no payment record ---- */
  const paidDealIds = new Set(payments.map((p) => p.deal_id).filter(Boolean));
  const noRecordDeals = deals.filter((d) => !paidDealIds.has(d.id));
  const noRecordValue = noRecordDeals.reduce((s, d) => s + (d.value ?? 0), 0);

  const periodLabel = (() => {
    if (range === "ytd") return `ytd-${now.getFullYear()}`;
    if (range === "year") return `${now.getFullYear()}`;
    if (range === "month") return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    return `q${Math.ceil((now.getMonth() + 1) / 3)}-${now.getFullYear()}`;
  })();

  const exportCsv = () => {
    const rows = received.filter((p) => inRange(p.expected_date, range));
    if (!rows.length) { setCsvMsg("No received payments in this period yet."); return; }
    buildCsv(rows, periodLabel);
    setCsvMsg(`Exported ${rows.length} payment${rows.length === 1 ? "" : "s"}.`);
    setTimeout(() => setCsvMsg(null), 4000);
  };

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

  return (
    <div className="space-y-6 fade-up">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold">Income summary</h2>
          <p className="text-xs text-muted mt-0.5">Grouped by the date you marked each payment received.</p>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {RANGES.map((r) => (
            <button key={r.value} onClick={() => setRange(r.value)}
              className={cn("text-sm px-3 py-1.5 rounded-lg border cursor-pointer transition-colors",
                range === r.value ? "border-transparent" : "border-line2 hover:bg-soft")}
              style={range === r.value ? { background: "var(--accent)", color: "var(--onaccent)" } : undefined}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Totals: received, gifted, completed */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="text-sm text-muted">Total received</div>
          <div className="font-head text-2xl font-semibold mt-1 tabular-nums" style={{ color: "var(--green)" }}>{formatMoney(totalReceived)}</div>
        </div>
        <div className="card p-5">
          <div className="text-sm text-muted">Gifted value</div>
          <div className="font-head text-2xl font-semibold mt-1 tabular-nums">{formatMoney(totalGifted)}</div>
          <div className="text-xs text-muted mt-1">Tracked separately — never folded into received.</div>
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
          <b>{noRecordDeals.length} deal{noRecordDeals.length === 1 ? "" : "s"}</b> have no payment record, worth <b>{formatMoney(noRecordValue)}</b>. They are not counted above — fix them to get a complete picture.
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