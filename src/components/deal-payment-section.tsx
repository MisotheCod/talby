"use client";

// Deal drawer Payment card, split into groups (per spec):
//   a. Settings: Amount, Paid, and Upfront or For (or When) as normal field rows
//   b. Schedule: gray heading, then the payments in a bordered list of two-line
//      rows (line 1: label + amount; line 2: due + status pill), 4px between
//      lines, 12px vertical padding, divider between rows, none after last.
//      Tapping a row opens its edit state (due date + status).
//   c. Extras: gray heading, then bonuses/commission in their own dashed list
//      (line 1: "Bonus"/"Commission" + amount; line 2: condition + pill). Under
//      the list "+ Add bonus or commission". Only the heading + link when empty.
//      Tapping opens Mark as earned + Remove.
//   d. Invoice: unchanged (owned by the drawer outside this component).
//
// Rules: label column 100px; no text ever wraps (truncate); selects use the
// same IconDown chevron as the section headers (native arrow hidden), 14px from
// the right edge with 40px right padding. Persistence is the drawer's job.

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  dealPaymentView, paymentStatusView,
  type PaymentStructureKind, type DealExtra,
} from "@/lib/pay-status";
import { DealInput } from "@/components/deal-input";
import { IconPlus, IconDown } from "@/components/icons";

type EditorPayment = {
  id: string;
  amount: number | null;
  expected_date: string | null;
  status: string;
  pay_status: string | null;
  invoice_state?: string | null;
  notes?: string | null;
};

type PStruct = {
  payment_structure: PaymentStructureKind | null;
  structure_timing: string | null;
  structure_timing_set_date: string | null;
  structure_upfront_pct: number | null;
  structure_balance_timing: string | null;
  structure_months: number | null;
  structure_start_date: string | null;
};

const KINDS: { value: PaymentStructureKind; label: string }[] = [
  { value: "once", label: "All at once" },
  { value: "split", label: "Upfront + balance" },
  { value: "parts", label: "In parts" },
  { value: "monthly", label: "Monthly" },
];
const NET_OPTS = [
  ["when_posts", "When it posts"], ["net_15", "Net 15"], ["net_30", "Net 30"],
  ["net_45", "Net 45"], ["net_60", "Net 60"],
] as const;
const PAYS = [
  ["not_invoiced", "Not invoiced"], ["invoiced", "Invoiced"], ["paid", "Paid"],
  ["no_invoice_needed", "No invoice needed"],
] as const;

// Drawer input/select base: 1px line2 border, 8px radius, 36px (h-9) tall,
// 14px (text-sm) text, 10px horizontal padding. Never wraps.
export const drawerFieldCls =
  "w-full bg-card border border-line2 rounded-lg px-2.5 h-9 text-sm text-ink placeholder:text-inkfaint focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition font-sans whitespace-nowrap overflow-hidden text-ellipsis";

/** A select styled as a drawer field, with our chevron icon overlaid at the
 *  right (14px from the edge, 40px right padding) and the native arrow hidden. */
export const Sel = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(function Sel({ className, children, ...props }, ref) {
  return (
    <div className="relative flex-1 min-w-0">
      <select
        ref={ref}
        className={cn(
          "w-full bg-card border border-line2 rounded-lg px-2.5 h-9 text-sm text-ink appearance-none focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition font-sans whitespace-nowrap overflow-hidden text-ellipsis pr-[40px]",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <IconDown size={14} className="pointer-events-none absolute right-[14px] top-1/2 -translate-y-1/2 text-inksoft shrink-0" />
    </div>
  );
});

const rowCls = "grid grid-cols-[100px_1fr] gap-3 items-center min-h-[56px] py-3 border-b border-line last:border-b-0";
const labelCls = "text-[12.5px] font-medium text-ink truncate whitespace-nowrap";

function statusPill(p: EditorPayment) {
  const v = paymentStatusView({ pay_status: p.pay_status ?? null, status: p.status ?? null, expected_date: p.expected_date ?? null, amount: p.amount ?? null });
  const pill = v.pillKind === "paid" ? <span className="pill pill-paid shrink-0">{v.label}</span>
    : v.pillKind === "late" ? <span className="pill pill-due bg-[var(--late)]/10 text-[var(--late)] border-[var(--late)]/30 shrink-0">{v.label}</span>
    : v.pillKind === "neutral" ? <span className="pill pill-pipe shrink-0">{v.label}</span>
    : <span className="pill pill-due shrink-0">{v.label}</span>;
  return { pill, view: v };
}

function moneyRaw(s: string): string {
  return s.replace(/[^0-9.]/g, "").replace(/^0+(?=\d)/, "");
}

/** Money input: shows "$10,500" when not focused, raw "10500" while typing. */
function MoneyInput({ value, onCommit, placeholder, ariaLabel }: { value: string; onCommit: (v: string) => void; placeholder?: string; ariaLabel?: string }) {
  const [focused, setFocused] = useState(false);
  const local = useRef(value);
  const [text, setText] = useState(value ? (Number(moneyRaw(value)) ? `$${Number(moneyRaw(value)).toLocaleString()}` : value) : "");
  const commit = (raw: string) => { local.current = raw; onCommit(raw.replace(/[^0-9.]/g, "").replace(/^0+(?=\d)/, "")); };
  return (
    <input
      type="text"
      inputMode="decimal"
      aria-label={ariaLabel}
      placeholder={placeholder}
      className={`${drawerFieldCls} money`}
      value={focused ? local.current : text}
      onFocus={() => { setFocused(true); }}
      onChange={(e) => { local.current = e.target.value; setText(e.target.value); }}
      onBlur={() => {
        setFocused(false);
        const raw = moneyRaw(local.current);
        local.current = raw;
        setText(raw ? `$${Number(raw).toLocaleString()}` : "");
        onCommit(raw);
      }}
    />
  );
}

export function DealPaymentSection({
  value,
  onValueCommit,
  struct, setStruct,
  payments, setPayments,
  extras, setExtras,
  dealStatus,
}: {
  value: string;
  onValueCommit: (v: string) => void;
  struct: PStruct;
  setStruct: (s: PStruct) => void;
  payments: EditorPayment[];
  setPayments: (p: EditorPayment[]) => void;
  extras: DealExtra[];
  setExtras: (e: DealExtra[]) => void;
  dealStatus: string | null;
}) {
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [openExtra, setOpenExtra] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [exType, setExType] = useState<"bonus" | "commission">("bonus");
  const [exAmt, setExAmt] = useState("");
  const [exCond, setExCond] = useState("");
  const [exRate, setExRate] = useState("");
  const [exOn, setExOn] = useState("");

  const kind = struct.payment_structure;
  const dealValueNum = moneyRaw(value) ? Number(moneyRaw(value)) : 0;

  const patchPay = (id: string, fn: (p: EditorPayment) => EditorPayment) =>
    setPayments(payments.map((p) => (p.id === id ? fn(p) : p)));

  const view = dealPaymentView({ structureKind: kind, payments, extras, dealStatus });

  const addPart = () => {
    setPayments([...payments, {
      id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      amount: null, expected_date: null, status: "expected", pay_status: "not_invoiced",
    }]);
    setOpenRow(null);
  };
  const removePart = (id: string) => {
    if (payments.length <= 2) return;
    setPayments(payments.filter((p) => p.id !== id));
    setOpenRow(null);
  };
  const partsSum = payments.reduce((s, p) => s + (p.amount ?? 0), 0);
  const partsMismatch = kind === "parts" && Math.abs(partsSum - dealValueNum) > 0.005;

  const addExtra = () => {
    if (exType === "bonus") {
      const amt = Number(moneyRaw(exAmt));
      setExtras([...extras, { id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, kind: "bonus", amount: Number.isFinite(amt) && exAmt !== "" ? amt : null, condition: exCond.trim() || null, rate: null, on_text: null, earned: false }]);
    } else {
      const rate = Number(moneyRaw(exRate));
      setExtras([...extras, { id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, kind: "commission", amount: null, condition: null, rate: Number.isFinite(rate) && exRate !== "" ? rate : null, on_text: exOn.trim() || null, earned: false }]);
    }
    setExAmt(""); setExCond(""); setExRate(""); setExOn(""); setAdding(false);
  };
  const removeExtra = (id: string) => setExtras(extras.filter((e) => e.id !== id));
  const markEarned = (id: string) => setExtras(extras.map((e) => (e.id === id ? { ...e, earned: true } : e)));

  const groupHead = (t: string) => <div className="text-[11px] font-semibold uppercase tracking-wide text-inksoft whitespace-nowrap mt-1">{t}</div>;

  return (
    <div className="space-y-0">
      {/* ===== a. Settings ===== */}
      <div className={rowCls}>
        <span className={labelCls}>Amount</span>
        <MoneyInput value={value} onCommit={onValueCommit} placeholder="$0" ariaLabel="Deal amount" />
      </div>
      <div className={rowCls}>
        <span className={labelCls}>Paid</span>
        <Sel value={kind ?? "once"} onChange={(e) => setStruct({ ...struct, payment_structure: e.target.value as PaymentStructureKind })} aria-label="How you get paid">
          {KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
        </Sel>
      </div>
      {kind === "split" && (
        <div className={rowCls}>
          <span className={labelCls}>Upfront</span>
          <Sel value={String(struct.structure_upfront_pct ?? 50)} onChange={(e) => setStruct({ ...struct, structure_upfront_pct: Number(e.target.value) })} aria-label="Upfront percent">
            {[25, 30, 40, 50].map((n) => <option key={n} value={n}>{n}% upfront</option>)}
          </Sel>
        </div>
      )}
      {kind === "monthly" && (
        <div className={rowCls}>
          <span className={labelCls}>For</span>
          <Sel value={String(struct.structure_months ?? 3)} onChange={(e) => setStruct({ ...struct, structure_months: Number(e.target.value) })} aria-label="Months">
            {[3, 6, 12].map((n) => <option key={n} value={n}>{n} months</option>)}
          </Sel>
        </div>
      )}
      {kind === "once" && (
        <>
          <div className={rowCls}>
            <span className={labelCls}>When</span>
            <Sel value={struct.structure_timing ?? "net_30"} onChange={(e) => setStruct({ ...struct, structure_timing: e.target.value })} aria-label="Timing">
              {[...NET_OPTS, ["set_date", "On a set date"] as const, ["due_on_receipt", "Due on receipt"] as const].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </Sel>
          </div>
          {struct.structure_timing === "set_date" && (
            <div className={rowCls}>
              <span className={labelCls}>Date</span>
              <DealInput type="date" value={struct.structure_timing_set_date ?? ""} onCommit={(v) => setStruct({ ...struct, structure_timing_set_date: v || null })} className={`${drawerFieldCls} deal-date-input`} ariaLabel="Set date" />
            </div>
          )}
        </>
      )}

      {/* ===== b. Schedule ===== */}
      {groupHead("Schedule")}
      <div className="mt-1 rounded-[10px] border border-line bg-card">
        {payments.length === 0 ? (
          <div className="px-3.5 py-3 text-[12.5px] text-inksoft whitespace-nowrap">No payments yet.</div>
        ) : (
          <div className="divide-y divide-line">
            {payments.map((p, i) => {
              const isOpen = openRow === p.id;
              const label = view.labels[i] ?? `Payment ${i + 1}`;
              const dueTxt = p.expected_date ? `Due ${formatShort(p.expected_date)}` : "No due date";
              const overdue = overdueView(p).view.overdue;
              const { pill } = statusPill(p);
              return (
                <div key={p.id} className={cn(isOpen && "bg-card2/40")}>
                  <button type="button" onClick={() => setOpenRow(isOpen ? null : p.id)} className="w-full flex flex-col items-start px-3.5 py-3 text-left cursor-pointer">
                    <span className="flex w-full items-baseline justify-between">
                      <span className="min-w-0 text-[13px] font-medium text-ink truncate whitespace-nowrap flex-1">{label}</span>
                      <span className="shrink-0 money text-[13px] font-medium tabular-nums whitespace-nowrap">{p.amount != null ? fmtMoney(p.amount) : "—"}</span>
                    </span>
                    <span className="flex w-full items-baseline justify-between mt-1">
                      <span className={cn("min-w-0 text-[12px] truncate whitespace-nowrap flex-1", overdue ? "text-late" : "text-inksoft")}>{dueTxt}</span>
                      {pill}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="grid grid-cols-[100px_1fr] gap-x-3 gap-y-2 px-3.5 py-2 border-t border-line">
                      {kind === "parts" && (
                        <>
                          <span className={labelCls}>Amount</span>
                          <MoneyInput value={p.amount != null ? String(p.amount) : ""} onCommit={(v) => patchPay(p.id, (x) => ({ ...x, amount: v === "" ? null : Number(v) }))} placeholder="Amount" ariaLabel="Payment amount" />
                        </>
                      )}
                      <span className={labelCls}>Due</span>
                      <DealInput type="date" value={p.expected_date ?? ""} onCommit={(v) => patchPay(p.id, (x) => ({ ...x, expected_date: v || null }))} className={`${drawerFieldCls} deal-date-input`} placeholder="Due date" ariaLabel="Due date" />
                      <span className={labelCls}>Status</span>
                      <Sel value={p.pay_status ?? "not_invoiced"} onChange={(e) => patchPay(p.id, (x) => ({ ...x, pay_status: e.target.value, status: e.target.value === "paid" ? "received" : "expected" }))} aria-label="Status">
                        {PAYS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </Sel>
                      <span />
                      <div className="flex items-center gap-2 justify-end">
                        {kind === "parts" && payments.length > 2 && (
                          <button type="button" onClick={() => removePart(p.id)} className="text-[12px] text-late hover:underline cursor-pointer whitespace-nowrap">Remove</button>
                        )}
                        <button type="button" onClick={() => setOpenRow(null)} className="px-3 h-9 rounded-lg text-[12.5px] font-medium bg-[var(--accent)] text-onaccent hover:brightness-95 cursor-pointer">Done</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {kind === "parts" && (
          <div className="pt-1 pb-3 px-3.5">
            {partsMismatch && (
              <div className="mb-2 rounded-md px-2.5 py-2 text-[12px] text-late bg-[var(--late)]/5 border border-[var(--late)]/30 whitespace-nowrap">
                The parts add up to {fmtMoney(partsSum)}. The deal is {fmtMoney(dealValueNum)}.
              </div>
            )}
            <button type="button" onClick={addPart} className="inline-flex items-center gap-1 text-[12.5px] text-accent font-medium hover:underline cursor-pointer whitespace-nowrap">
              <IconPlus size={14} /> Add a part
            </button>
          </div>
        )}
      </div>

      {/* ===== c. Extras ===== */}
      {groupHead("Extras")}
      {extras.length > 0 && (
        <div className="mt-1 rounded-[10px] border border-dashed border-line bg-card">
          <div className="divide-y divide-line">
            {extras.map((e) => {
              const isOpen = openExtra === e.id;
              const head = e.kind === "bonus" ? "Bonus" : "Commission";
              const line2 = e.kind === "bonus"
                ? (e.condition ? `If ${e.condition}` : null)
                : (e.on_text ? `On ${e.on_text}` : (e.rate != null ? `${e.rate}%` : null));
              const amountLabel = e.kind === "bonus"
                ? (e.amount != null ? fmtMoney(e.amount) : "")
                : (e.rate != null ? `${e.rate}%` : "");
              return (
                <div key={e.id} className={cn(isOpen && "bg-card2/40")}>
                  <button type="button" onClick={() => setOpenExtra(isOpen ? null : e.id)} className="w-full flex flex-col items-start px-3.5 py-3 text-left cursor-pointer">
                    <span className="flex w-full items-baseline justify-between">
                      <span className="min-w-0 text-[13px] font-medium text-ink truncate whitespace-nowrap flex-1">{head}</span>
                      <span className="shrink-0 money text-[13px] font-medium tabular-nums whitespace-nowrap">{amountLabel}</span>
                    </span>
                    <span className="flex w-full items-baseline justify-between mt-1">
                      <span className="min-w-0 text-[12px] text-inksoft truncate whitespace-nowrap flex-1">{line2 ?? "—"}</span>
                      {e.earned ? <span className="pill pill-paid shrink-0">Earned</span> : <span className="pill pill-pipe shrink-0">Not earned</span>}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="grid grid-cols-[100px_1fr] gap-x-3 gap-y-2 px-3.5 py-2 border-t border-line">
                      <span />
                      <div className="flex items-center gap-2 justify-end">
                        <button type="button" onClick={() => markEarned(e.id)} className="text-[12.5px] text-accent hover:underline cursor-pointer whitespace-nowrap">Mark as earned</button>
                        <button type="button" onClick={() => { removeExtra(e.id); setOpenExtra(null); }} className="text-[12.5px] text-late hover:underline cursor-pointer whitespace-nowrap">Remove</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add bonus or commission (also shown when there are no extras) */}
      {adding ? (
        <div className="rounded-[10px] border border-line bg-card mt-1 space-y-0 divide-y divide-line">
          <div className={rowCls}>
            <span className={labelCls}>Type</span>
            <Sel value={exType} onChange={(e) => setExType(e.target.value as "bonus" | "commission")} aria-label="Extra type">
              <option value="bonus">Bonus</option>
              <option value="commission">Commission</option>
            </Sel>
          </div>
          {exType === "bonus" ? (
            <>
              <div className={rowCls}>
                <span className={labelCls}>Amount</span>
                <MoneyInput value={exAmt} onCommit={setExAmt} placeholder="Amount" ariaLabel="Bonus amount" />
              </div>
              <div className={rowCls}>
                <span className={labelCls}>Paid if</span>
                <DealInput value={exCond} onCommit={setExCond} className={drawerFieldCls} placeholder="Condition, e.g. the Reel passes 100K views" ariaLabel="Bonus condition" />
              </div>
            </>
          ) : (
            <>
              <div className={rowCls}>
                <span className={labelCls}>Rate</span>
                <div className="relative flex-1 min-w-0">
                  <input type="number" inputMode="numeric" value={exRate} onChange={(e) => setExRate(e.target.value)} className={cn(drawerFieldCls, "pr-7")} placeholder="Rate" aria-label="Commission rate" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-inksoft pointer-events-none whitespace-nowrap">%</span>
                </div>
              </div>
              <div className={rowCls}>
                <span className={labelCls}>On</span>
                <DealInput value={exOn} onCommit={setExOn} className={drawerFieldCls} placeholder="What it's on, e.g. sales with code CAMBO10" ariaLabel="Commission applies to" />
              </div>
            </>
          )}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={() => setAdding(false)} className="px-3 h-9 rounded-lg text-[12.5px] text-inksoft hover:text-ink cursor-pointer whitespace-nowrap">Cancel</button>
            <button type="button" onClick={addExtra} disabled={exType === "bonus" ? !exAmt : !exRate} className="px-3.5 h-9 rounded-lg text-[12.5px] font-medium bg-[var(--accent)] text-onaccent hover:brightness-95 cursor-pointer disabled:opacity-50">Add</button>
          </div>
        </div>
      ) : (
        <div className="pt-2">
          <button type="button" onClick={() => setAdding(true)} className="inline-flex items-center gap-1 text-[12.5px] text-accent font-medium hover:underline cursor-pointer whitespace-nowrap">
            <IconPlus size={14} /> Add bonus or commission
          </button>
        </div>
      )}
    </div>
  );
}

function formatShort(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function overdueView(p: EditorPayment) {
  const v = paymentStatusView({ pay_status: p.pay_status ?? null, status: p.status ?? null, expected_date: p.expected_date ?? null, amount: p.amount ?? null });
  return { view: v };
}
function fmtMoney(n: number): string {
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}