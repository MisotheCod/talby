"use client";

// Deal drawer Payment section (spec 3b + revision round):
//  - Amount: money with commas when not focused, raw while typing
//  - Paid dropdown (once / split / parts / monthly) + one companion row
//  - payment rows: standard label, due, amount, status pill; tapping opens
//    labeled Due(date) + Status(select) stacked full-width, Done right-aligned
//  - parts: + Add a part (16px gap), Remove when >2, adds-up-to note
//  - extras rows: dashed "Not earned" pill, Mark as earned / Remove
//  - + Add bonus or commission: flat labeled rows (Type / Amount or Rate /
//    Paid if or On), Cancel + Add right aligned, Add enabled once an amount is in
// Layout: every row a 2-col grid — label 120px, value fills, min 56px, 1px
// divider. Status pill via the shared function (overdue derived), never stored.
// Persistence is the drawer's job; this component only stages state.

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  dealPaymentView, paymentStatusView,
  type PaymentStructureKind, type DealExtra,
} from "@/lib/pay-status";
import { DealInput } from "@/components/deal-input";
import { IconPlus, IconDelete } from "@/components/icons";

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

// Bordered input matching the New deal modal's fields: 1px line2 border,
// 8px radius, 40px (h-10). NOT the drawer's old borderless inline style.
export const drawerFieldCls =
  "w-full bg-card border border-line2 rounded-lg px-3 h-10 text-sm text-ink placeholder:text-inkfaint focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition font-sans";

const rowCls = "grid grid-cols-[120px_1fr] gap-3 items-center min-h-[56px] py-1 border-b border-line last:border-b-0";
const labelCls = "text-[12.5px] font-medium text-ink";

function statusPill(p: EditorPayment) {
  const v = paymentStatusView({ pay_status: p.pay_status ?? null, status: p.status ?? null, expected_date: p.expected_date ?? null, amount: p.amount ?? null });
  const pill = v.pillKind === "paid" ? <span className="pill pill-paid">{v.label}</span>
    : v.pillKind === "late" ? <span className="pill pill-due bg-[var(--late)]/10 text-[var(--late)] border-[var(--late)]/30">{v.label}</span>
    : v.pillKind === "neutral" ? <span className="pill pill-pipe">{v.label}</span>
    : <span className="pill pill-due">{v.label}</span>;
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
      className={drawerFieldCls}
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

  return (
    <div className="space-y-0">
      {/* Amount */}
      <div className={rowCls}>
        <span className={labelCls}>Amount</span>
        <MoneyInput value={value} onCommit={onValueCommit} placeholder="$0" ariaLabel="Deal amount" />
      </div>

      {/* Paid dropdown + companion */}
      <div className={rowCls}>
        <span className={labelCls}>Paid</span>
        <select value={kind ?? "once"} onChange={(e) => setStruct({ ...struct, payment_structure: e.target.value as PaymentStructureKind })} className={`${drawerFieldCls} cursor-pointer`} aria-label="How you get paid">
          {KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
        </select>
      </div>

      {kind === "split" && (
        <div className={rowCls}>
          <span className={labelCls}>Upfront</span>
          <select value={String(struct.structure_upfront_pct ?? 50)} onChange={(e) => setStruct({ ...struct, structure_upfront_pct: Number(e.target.value) })} className={`${drawerFieldCls} cursor-pointer`} aria-label="Upfront percent">
            {[25, 30, 40, 50].map((n) => <option key={n} value={n}>{n}% upfront</option>)}
          </select>
        </div>
      )}
      {kind === "monthly" && (
        <div className={rowCls}>
          <span className={labelCls}>For</span>
          <select value={String(struct.structure_months ?? 3)} onChange={(e) => setStruct({ ...struct, structure_months: Number(e.target.value) })} className={`${drawerFieldCls} cursor-pointer`} aria-label="Months">
            {[3, 6, 12].map((n) => <option key={n} value={n}>{n} months</option>)}
          </select>
        </div>
      )}
      {kind === "once" && (
        timingRow()
      )}

      {/* Payment rows */}
      {payments.length === 0 ? (
        <div className={cn(rowCls, "min-h-0 py-2")}>
          <span className={labelCls}>Payment</span>
          <span className="text-[12.5px] text-inksoft">No payments yet.</span>
        </div>
      ) : (
        <div className="divide-y divide-line">
          {payments.map((p, i) => {
            const isOpen = openRow === p.id;
            const label = view.labels[i] ?? `Payment ${i + 1}`;
            const dueTxt = p.expected_date ? formatShort(p.expected_date) : "No due date";
            const { pill } = statusPill(p);
            return (
              <div key={p.id} className={cn("divide-y divide-line", isOpen && "bg-card2/40")}>
                <div className={rowCls}>
                  <span className={cn(labelCls, "truncate")}>{label}</span>
                  <button type="button" onClick={() => setOpenRow(isOpen ? null : p.id)} className="w-full flex items-center gap-3 text-left cursor-pointer min-h-[56px]">
                    <span className={cn("flex-1 min-w-0 text-[13px] tabular-nums", overdueView(p).view.overdue ? "text-late font-medium" : "text-ink")}>{dueTxt}</span>
                    <span className="shrink-0 money text-[13px] font-medium tabular-nums">{p.amount != null ? fmtMoney(p.amount) : "—"}</span>
                    {pill}
                  </button>
                </div>
                {isOpen && (
                  <div className="grid grid-cols-[120px_1fr] gap-x-3 gap-y-2 py-2">
                    {kind === "parts" && (
                      <>
                        <span className={labelCls}>Amount</span>
                        <MoneyInput value={p.amount != null ? String(p.amount) : ""} onCommit={(v) => patchPay(p.id, (x) => ({ ...x, amount: v === "" ? null : Number(v) }))} placeholder="Amount" ariaLabel="Payment amount" />
                      </>
                    )}
                    <span className={labelCls}>Due</span>
                    <DealInput type="date" value={p.expected_date ?? ""} onCommit={(v) => patchPay(p.id, (x) => ({ ...x, expected_date: v || null }))} className={`${drawerFieldCls} deal-date-input`} placeholder="Due date" ariaLabel="Due date" />
                    <span className={labelCls}>Status</span>
                    <select value={p.pay_status ?? "not_invoiced"} onChange={(e) => patchPay(p.id, (x) => ({ ...x, pay_status: e.target.value, status: e.target.value === "paid" ? "received" : "expected" }))} className={`${drawerFieldCls} cursor-pointer`} aria-label="Status">
                      {PAYS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                    <span />
                    <div className="flex items-center gap-2 justify-end">
                      {kind === "parts" && payments.length > 2 && (
                        <button type="button" onClick={() => removePart(p.id)} className="text-[12px] text-late hover:underline cursor-pointer">Remove</button>
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

      {/* Parts: adds-up-to note + Add a part (16px gap above) */}
      {kind === "parts" && (
        <div className="pt-4">
          {partsMismatch && (
            <div className="mb-2 rounded-md px-2.5 py-2 text-[12px] text-late bg-[var(--late)]/5 border border-[var(--late)]/30">
              The parts add up to {fmtMoney(partsSum)}. The deal is {fmtMoney(dealValueNum)}.
            </div>
          )}
          <button type="button" onClick={addPart} className="inline-flex items-center gap-1 text-[12.5px] text-accent font-medium hover:underline cursor-pointer">
            <IconPlus size={14} /> Add a part
          </button>
        </div>
      )}

      {/* Extras */}
      {extras.map((e) => {
        const extraLabel = e.kind === "bonus"
          ? `Bonus${e.amount != null ? ` · ${fmtMoney(e.amount)}` : ""}${e.condition ? ` · ${e.condition}` : ""}`
          : `Commission${e.rate != null ? ` · ${e.rate}%` : ""}${e.on_text ? ` · ${e.on_text}` : ""}`;
        return (
          <div key={e.id} className={cn(rowCls, "border-b border-dashed border-line")}>
            <span className={cn(labelCls, "truncate")}>{e.kind === "bonus" ? "Bonus" : "Commission"}</span>
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex-1 min-w-0 text-[12.5px] text-ink truncate">{extraLabel}</span>
              {e.earned ? <span className="pill pill-paid shrink-0">Earned</span> : <span className="pill pill-pipe shrink-0">Not earned</span>}
              <button type="button" onClick={() => markEarned(e.id)} className="text-[12px] text-accent hover:underline cursor-pointer shrink-0">Mark as earned</button>
              <button type="button" onClick={() => removeExtra(e.id)} aria-label="Remove extra" className="shrink-0 p-1 text-inksoft hover:text-late cursor-pointer"><IconDelete size={14} /></button>
            </div>
          </div>
        );
      })}

      {/* Add bonus or commission: 16px gap above, flat labeled rows, divider above
          is owned by the drawer's Invoice row. */}
      {adding ? (
        <div className="space-y-0 divide-y divide-line pt-4">
          <div className={rowCls}>
            <span className={labelCls}>Type</span>
            <select value={exType} onChange={(e) => setExType(e.target.value as "bonus" | "commission")} className={`${drawerFieldCls} cursor-pointer`} aria-label="Extra type">
              <option value="bonus">Bonus</option>
              <option value="commission">Commission</option>
            </select>
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
                <div className="relative">
                  <input type="number" inputMode="numeric" value={exRate} onChange={(e) => setExRate(e.target.value)} className={cn(drawerFieldCls, "pr-7")} placeholder="Rate" aria-label="Commission rate" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-inksoft pointer-events-none">%</span>
                </div>
              </div>
              <div className={rowCls}>
                <span className={labelCls}>On</span>
                <DealInput value={exOn} onCommit={setExOn} className={drawerFieldCls} placeholder="What it's on, e.g. sales with code CAMBO10" ariaLabel="Commission applies to" />
              </div>
            </>
          )}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={() => setAdding(false)} className="px-3 h-9 rounded-lg text-[12.5px] text-inksoft hover:text-ink cursor-pointer">Cancel</button>
            <button type="button" onClick={addExtra} disabled={exType === "bonus" ? !exAmt : !exRate} className="px-3.5 h-9 rounded-lg text-[12.5px] font-medium bg-[var(--accent)] text-onaccent hover:brightness-95 cursor-pointer disabled:opacity-50">Add</button>
          </div>
        </div>
      ) : (
        <div className="pt-4">
          <button type="button" onClick={() => setAdding(true)} className="inline-flex items-center gap-1 text-[12.5px] text-accent font-medium hover:underline cursor-pointer">
            <IconPlus size={14} /> Add bonus or commission
          </button>
        </div>
      )}
    </div>
  );

  function timingRow() {
    const isSet = struct.structure_timing === "set_date";
    return (
      <>
        <div className={rowCls}>
          <span className={labelCls}>When</span>
          <select value={struct.structure_timing ?? "net_30"} onChange={(e) => setStruct({ ...struct, structure_timing: e.target.value })} className={`${drawerFieldCls} cursor-pointer`} aria-label="Timing">
            {[...NET_OPTS, ["set_date", "On a set date"] as const, ["due_on_receipt", "Due on receipt"] as const].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        {isSet && (
          <div className={rowCls}>
            <span className={labelCls}>Date</span>
            <DealInput type="date" value={struct.structure_timing_set_date ?? ""} onCommit={(v) => setStruct({ ...struct, structure_timing_set_date: v || null })} className={`${drawerFieldCls} deal-date-input`} ariaLabel="Set date" />
          </div>
        )}
      </>
    );
  }
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