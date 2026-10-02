"use client";

// Release 1: the deal drawer's Payment section content (spec 3b).
// Self-contained given staged state so the drawer stays reviewable:
//  - Amount
//  - Paid dropdown (once / split / parts / monthly) + one companion row
//  - payment rows: label (1c), "Due <date>", amount, status pill; tap to edit
//    date + status (+amount for parts), one row open at a time, Done to close
//  - In parts: "+ Add a part", Remove when >2, red note if parts don't sum
//  - Monthly: first 3 months, then one summary row
//  - Extras: "Not earned" dashed pill, tap to Mark as earned / Remove
//  - "+ Add bonus or commission" small form
// Persistence is the drawer's job; this component only stages state.

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  dealPaymentView, paymentHeaderSummary, structureKindLabel, timingLabel,
  type PaymentStructureKind, type DealExtra,
} from "@/lib/pay-status";
import { DealInput } from "@/components/deal-input";
import { IconPlus, IconDelete, IconCheck } from "@/components/icons";

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

const inputCls = "w-full bg-transparent border border-transparent rounded-lg px-2 py-1.5 text-[13px] text-ink hover:bg-card2 focus:bg-card focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-tint)] outline-none transition";

function statusPill(s: string | null) {
  const ps = s ?? "not_invoiced";
  if (ps === "paid") return <span className="pill pill-paid">Paid</span>;
  if (ps === "invoiced") return <span className="pill pill-due">Invoiced</span>;
  if (ps === "no_invoice_needed") return <span className="pill pill-pipe">No invoice needed</span>;
  return <span className="pill pill-due">Not invoiced</span>;
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
  const dealValueNum = Number(value) || 0;

  const patchPay = (id: string, fn: (p: EditorPayment) => EditorPayment) =>
    setPayments(payments.map((p) => (p.id === id ? fn(p) : p)));

  // labels + next due + totals via the shared function (both screens agree)
  const view = dealPaymentView({
    structureKind: kind,
    payments,
    extras,
    dealStatus,
  });

  const addPart = () => {
    const slot = payments.length + 1;
    setPayments([...payments, {
      id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      amount: null, expected_date: null, status: "expected", pay_status: "not_invoiced",
    }]);
    setOpenRow(`new-last-${payments.length}`);
    void slot;
  };
  const removePart = (id: string) => {
    if (payments.length <= 2) return; // parts keeps at least 2
    setPayments(payments.filter((p) => p.id !== id));
    setOpenRow(null);
  };
  const partsSum = payments.reduce((s, p) => s + (p.amount ?? 0), 0);
  const partsMismatch = kind === "parts" && Math.abs(partsSum - dealValueNum) > 0.005;

  const addExtra = () => {
    if (exType === "bonus") {
      const amt = Number(exAmt);
      setExtras([...extras, { id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, kind: "bonus", amount: Number.isFinite(amt) && exAmt !== "" ? amt : null, condition: exCond.trim() || null, rate: null, on_text: null, earned: false }]);
    } else {
      const rate = Number(exRate);
      setExtras([...extras, { id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, kind: "commission", amount: null, condition: null, rate: Number.isFinite(rate) && exRate !== "" ? rate : null, on_text: exOn.trim() || null, earned: false }]);
    }
    setExAmt(""); setExCond(""); setExRate(""); setExOn(""); setAdding(false);
  };
  const removeExtra = (id: string) => setExtras(extras.filter((e) => e.id !== id));
  const markEarned = (id: string) => setExtras(extras.map((e) => (e.id === id ? { ...e, earned: true } : e)));

  return (
    <div className="space-y-2.5">
      {/* Amount */}
      <div className="flex items-center gap-2 py-1.5 border-b border-line">
        <span className="w-[92px] flex-none text-[12px] text-inksoft">Amount</span>
        <DealInput type="number" inputMode="decimal" value={value} onCommit={onValueCommit} className={`${inputCls} money flex-1`} placeholder="$0" ariaLabel="Deal amount" />
      </div>

      {/* Paid dropdown + companion row */}
      <div className="flex items-center gap-2 py-1.5 border-b border-line">
        <span className="w-[92px] flex-none text-[12px] text-inksoft">Paid</span>
        <select value={kind ?? "once"} onChange={(e) => setStruct({ ...struct, payment_structure: e.target.value as PaymentStructureKind })} className={`${inputCls} cursor-pointer flex-1`} aria-label="How you get paid">
          {KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
        </select>
      </div>

      {kind === "split" && (
        <div className="flex items-center gap-2 py-1.5 border-b border-line">
          <span className="w-[92px] flex-none text-[12px] text-inksoft">Upfront</span>
          <select value={String(struct.structure_upfront_pct ?? 50)} onChange={(e) => setStruct({ ...struct, structure_upfront_pct: Number(e.target.value) })} className={`${inputCls} cursor-pointer flex-1`} aria-label="Upfront percent">
            {[25, 30, 40, 50].map((n) => <option key={n} value={n}>{n}% upfront</option>)}
          </select>
        </div>
      )}
      {kind === "monthly" && (
        <div className="flex items-center gap-2 py-1.5 border-b border-line">
          <span className="w-[92px] flex-none text-[12px] text-inksoft">For</span>
          <select value={String(struct.structure_months ?? 3)} onChange={(e) => setStruct({ ...struct, structure_months: Number(e.target.value) })} className={`${inputCls} cursor-pointer flex-1`} aria-label="Months">
            {[3, 6, 12].map((n) => <option key={n} value={n}>{n} months</option>)}
          </select>
        </div>
      )}
      {kind === "once" && (
        <div className="flex items-center gap-2 py-1.5 border-b border-line">
          <span className="w-[92px] flex-none text-[12px] text-inksoft">When</span>
          <select value={struct.structure_timing ?? "net_30"} onChange={(e) => setStruct({ ...struct, structure_timing: e.target.value })} className={`${inputCls} cursor-pointer flex-1`} aria-label="Timing">
            {[...NET_OPTS, ["due_on_receipt", "Due on receipt"] as const].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
      )}

      {/* Payment rows */}
      {payments.length === 0 ? (
        <div className="py-2 text-[12px] text-inksoft/70">No payments yet.</div>
      ) : (
        <div className="divide-y divide-line">
          {payments.map((p, i) => {
            const isOpen = openRow === p.id;
            const label = view.labels[i] ?? `Payment ${i + 1}`;
            const dueTxt = p.expected_date ? formatShort(p.expected_date) : "No due date";
            return (
              <div key={p.id} className={cn("py-1", isOpen && "bg-card2/40 rounded-md px-1")}>
                <button type="button" onClick={() => setOpenRow(isOpen ? null : p.id)} className="w-full flex items-center gap-2 text-left cursor-pointer py-1">
                  <span className="w-[92px] flex-none text-[12.5px] text-ink font-medium truncate">{label}</span>
                  <span className={cn("flex-1 min-w-0 text-[12px]", overdue(p) ? "text-late" : "text-inksoft")}>{dueTxt}</span>
                  <span className="shrink-0 money text-[13px] tabular-nums">{p.amount != null ? fmtMoney(p.amount) : "—"}</span>
                  <span className="shrink-0">{statusPill(p.pay_status)}</span>
                </button>
                {isOpen && (
                  <div className="flex items-center gap-2 flex-wrap mt-1 pb-1 pl-[92px]">
                    {kind === "parts" && (
                      <DealInput type="number" inputMode="decimal" value={p.amount == null ? "" : String(p.amount)} onCommit={(v) => patchPay(p.id, (x) => ({ ...x, amount: v === "" ? null : Number(v) }))} className={`${inputCls} money w-24`} placeholder="Amount" ariaLabel="Payment amount" />
                    )}
                    <DealInput type="date" value={p.expected_date ?? ""} onCommit={(v) => patchPay(p.id, (x) => ({ ...x, expected_date: v || null }))} className={`${inputCls} deal-date-input w-36`} placeholder="Due date" ariaLabel="Due date" />
                    <select value={p.pay_status ?? "not_invoiced"} onChange={(e) => patchPay(p.id, (x) => ({ ...x, pay_status: e.target.value }))} className={`${inputCls} cursor-pointer w-36`} aria-label="Status">
                      {PAYS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                    <button type="button" onClick={() => setOpenRow(null)} className="text-[11.5px] px-2 h-6 rounded-md border border-line2 bg-card text-inksoft hover:text-ink cursor-pointer">Done</button>
                    {kind === "parts" && payments.length > 2 && (
                      <button type="button" onClick={() => removePart(p.id)} className="text-[11.5px] px-2 h-6 rounded-md text-late hover:underline cursor-pointer">Remove</button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Parts mismatch note */}
      {kind === "parts" && partsMismatch && (
        <div className="rounded-md px-2.5 py-1.5 text-[11.5px] text-late bg-[var(--late)]/5 border border-[var(--late)]/30">
          The parts add up to {fmtMoney(partsSum)}. The deal is {fmtMoney(dealValueNum)}.
        </div>
      )}
      {kind === "parts" && (
        <button type="button" onClick={addPart} className="inline-flex items-center gap-1 text-[11.5px] text-accent font-medium hover:underline cursor-pointer">
          <IconPlus size={13} /> Add a part
        </button>
      )}

      {/* Extras */}
      {extras.map((e) => {
        const extraLabel = e.kind === "bonus"
          ? `Bonus${e.amount != null ? ` · ${fmtMoney(e.amount)}` : ""}${e.condition ? ` · ${e.condition}` : ""}`
          : `Commission${e.rate != null ? ` · ${e.rate}%` : ""}${e.on_text ? ` · ${e.on_text}` : ""}`;
        return (
          <div key={e.id} className="flex items-center gap-2 py-1.5 border-b border-dashed border-line">
            <span className="flex-1 min-w-0 text-[12.5px] text-ink truncate">{extraLabel}</span>
            {e.earned ? (
              <span className="pill pill-paid shrink-0">Earned</span>
            ) : (
              <span className="pill pill-pipe shrink-0">Not earned</span>
            )}
            <button type="button" onClick={() => e.kind === "bonus" ? markEarned(e.id) : markEarned(e.id)} className="text-[11px] text-accent hover:underline cursor-pointer shrink-0">Mark as earned</button>
            <button type="button" onClick={() => removeExtra(e.id)} aria-label="Remove extra" className="shrink-0 p-1 text-inksoft hover:text-late cursor-pointer"><IconDelete size={14} /></button>
          </div>
        );
      })}

      {/* Add bonus or commission */}
      {adding ? (
        <div className="rounded-lg border border-line2 bg-card2/40 px-2.5 py-2 space-y-1.5">
          <select value={exType} onChange={(e) => setExType(e.target.value as "bonus" | "commission")} className={cn(inputCls, "cursor-pointer w-full")} aria-label="Extra type">
            <option value="bonus">Bonus</option>
            <option value="commission">Commission</option>
          </select>
          {exType === "bonus" ? (
            <>
              <DealInput type="number" inputMode="decimal" value={exAmt} onCommit={setExAmt} className={`${inputCls} money w-full`} placeholder="Amount" ariaLabel="Bonus amount" />
              <DealInput value={exCond} onCommit={setExCond} className={`${inputCls} w-full`} placeholder="Condition, e.g. the Reel passes 100K views" ariaLabel="Bonus condition" />
            </>
          ) : (
            <>
              <DealInput type="number" inputMode="decimal" value={exRate} onCommit={setExRate} className={`${inputCls} w-full`} placeholder="Rate (%)" ariaLabel="Commission rate" />
              <DealInput value={exOn} onCommit={setExOn} className={`${inputCls} w-full`} placeholder="On what, e.g. sales with code CAMBO10" ariaLabel="Commission applies to" />
            </>
          )}
          <div className="flex items-center gap-2 justify-end">
            <button type="button" onClick={() => setAdding(false)} className="text-[11.5px] px-2 h-6 text-inksoft hover:text-ink cursor-pointer">Cancel</button>
            <button type="button" onClick={addExtra} disabled={(exType === "bonus" ? !exAmt : !exRate)} className="text-[11.5px] px-2.5 h-6 rounded-md bg-[var(--accent)] text-onaccent cursor-pointer disabled:opacity-50">Add</button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => setAdding(true)} className="inline-flex items-center gap-1 text-[11.5px] text-accent font-medium hover:underline cursor-pointer">
          <IconPlus size={13} /> Add bonus or commission
        </button>
      )}
    </div>
  );
}

function formatShort(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function overdue(p: EditorPayment): boolean {
  if (p.pay_status === "paid") return false;
  if (!p.expected_date) return false;
  return p.expected_date < new Date().toISOString().slice(0, 10);
}
function fmtMoney(n: number): string {
  const whole = Math.round(n * 100) / 100;
  return Number.isInteger(whole) ? `$${whole}` : `$${whole.toFixed(2)}`;
}