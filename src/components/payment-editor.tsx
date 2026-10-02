"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { isConfirmed, paymentMismatch } from "@/lib/pay-status";
import { DealInput } from "@/components/deal-input";
import { Select } from "@/components/select";
import { IconPlus, IconDelete, IconCheck } from "@/components/icons";

/** A staged payment row the editor manages (not yet necessarily persisted). */
export type EditorPayment = {
  id: string;                       // real id or "new-..." for unsaved
  amount: number | null;
  expected_date: string | null;
  status: string;
  pay_status: string | null;
  invoice_state: string | null;
  notes?: string | null;
  bonus_confirmed?: boolean | null;
  kind?: "split" | "bonus" | null;
};

const PAYS_OPTIONS: { value: string; label: string }[] = [
  { value: "not_invoiced", label: "Not invoiced" },
  { value: "invoiced", label: "Invoiced" },
  { value: "paid", label: "Paid" },
  { value: "no_invoice_needed", label: "No invoice needed" },
];

/** Split the deal amount into two equal payments (first absorbs any rounding). */
export function splitPayments(dealAmount: number | null): { half: number; first: number } {
  const whole = dealAmount ?? 0;
  const half = Math.round(whole * 50) / 100;
  return { half, first: Math.round((whole - half) * 100) / 100 };
}

function newRow(suffix: string): EditorPayment {
  return {
    id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 6)}-${suffix}`,
    amount: null, expected_date: null, status: "expected", pay_status: "not_invoiced",
    invoice_state: null,
  };
}

const inputCls = "w-full bg-transparent border border-transparent rounded-lg px-2 py-1.5 text-[13.5px] text-ink hover:bg-card2 focus:bg-card focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-tint)] outline-none transition";

/**
 * Full payment-row editor shared by the drawer and the create/edit modal.
 *
 * Manages every payment row: edit amount, due date, and pay status in place;
 * delete a row (with a confirm step); add a payment via Split or Bonus
 * shortcuts; confirm an unconfirmed bonus. A deal always keeps one payment.
 *
 * Staged model: calls setPayments(next) on every change; the parent owns
 * persistence (drawer Save reconciles; create form sends on submit). Rows keep
 * a stable id so they never remount mid-edit; amounts/dates use DealInput
 * (uncontrolled, commit on blur).
 */
export function PaymentRowsEditor({
  payments,
  setPayments,
  dealAmount,
  showGuardrail,
  onEditDealAmount,
  onConfirmBonus,
}: {
  payments: EditorPayment[];
  setPayments: (next: EditorPayment[]) => void;
  dealAmount: number | null;
  showGuardrail?: boolean;
  onEditDealAmount?: (confirmedTotal: number) => void;
  onConfirmBonus?: (p: EditorPayment, confirmed: boolean) => void;
}) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [adding, setAdding] = useState<null | "split" | "bonus">(null);
  const [bonusAmount, setBonusAmount] = useState("");
  const [bonusNote, setBonusNote] = useState("");

  const mismatch = showGuardrail ? paymentMismatch(payments, dealAmount) : null;

  const patch = (id: string, fn: (p: EditorPayment) => EditorPayment) =>
    setPayments(payments.map((p) => (p.id === id ? fn(p) : p)));

  const remove = (id: string) => {
    if (payments.length <= 1) return; // a deal must keep at least one payment
    setPayments(payments.filter((p) => p.id !== id));
    setDeleteId(null);
  };

  // Split: turn the current single-row payment list into two equal rows.
  const applySplit = () => {
    setAdding(null);
    const { first, half } = splitPayments(dealAmount);
    if (payments.length === 1) {
      const only = payments[0];
      setPayments([
        { ...only, amount: first, kind: "split" },
        { ...newRow("s2"), amount: half, expected_date: only.expected_date, kind: "split" },
      ]);
    } else {
      setPayments(payments.map((p) => ({ ...p, ...(p === payments[payments.length - 1] ? { amount: half, kind: "split" } : {}) })));
    }
  };

  // Bonus: append an unconfirmed bonus payment (excluded from Booked/Outstanding).
  const applyBonus = () => {
    setAdding(null);
    const amt = Number(bonusAmount);
    setPayments([...payments, { ...newRow("bonus"), amount: Number.isFinite(amt) && bonusAmount !== "" ? amt : dealAmount, notes: bonusNote.trim(), bonus_confirmed: false, kind: "bonus" }]);
    setBonusAmount(""); setBonusNote("");
  };

  const confirm = (p: EditorPayment, v: boolean) => {
    setPayments(payments.map((x) => (x.id === p.id ? { ...x, bonus_confirmed: v } : x)));
    onConfirmBonus?.(p, v);
  };

  return (
    <div className="space-y-2">
      {/* Amber guardrail: confirmed payments don't equal the deal amount. */}
      {mismatch && (
        <div className="rounded-lg border border-[var(--warn)]/35 bg-[var(--warn-bg)] px-2.5 py-2 text-[12px] flex items-center justify-between gap-2">
          <span className="text-ink min-w-0">{mismatch.note} <span className="text-inksoft/80">Unconfirmed bonuses not counted.</span></span>
          {onEditDealAmount && (
            <button type="button" onClick={() => onEditDealAmount?.(mismatch.confirmedTotal)} className="shrink-0 text-[11.5px] px-2 h-6 rounded-md border border-line2 bg-card text-inksoft hover:text-ink cursor-pointer">
              Update deal amount
            </button>
          )}
        </div>
      )}

      {payments.map((p) => {
        const amtStr = p.amount == null ? "" : String(p.amount);
        const isBonus = p.kind === "bonus" || p.bonus_confirmed === false;
        const unconfirmed = isBonus && !isConfirmed(p);
        const deleting = deleteId === p.id;
        return (
          <div key={p.id} className={cn("flex items-center gap-2 py-1.5 border-b border-line last:border-b-0", unconfirmed && "bg-[var(--warn-bg)]/50")}>
            {unconfirmed && <span className="shrink-0 text-[10px] font-semibold text-due mr-1">BONUS</span>}
            <DealInput
              type="number" min={0} value={amtStr}
              onCommit={(v) => patch(p.id, (x) => ({ ...x, amount: v === "" ? null : Number(v) }))}
              className={cn(inputCls, "money w-24")}
              ariaLabel="Payment amount"
            />
            <DealInput
              type="date" value={p.expected_date ?? ""}
              onCommit={(v) => patch(p.id, (x) => ({ ...x, expected_date: v || null }))}
              className={cn(inputCls, "deal-date-input w-36")}
              ariaLabel="Payment due date"
            />
            <Select value={p.pay_status ?? "not_invoiced"} onChange={(e) => patch(p.id, (x) => ({ ...x, pay_status: e.target.value }))} className={cn("w-40", inputCls)} aria-label="Payment status">
              {PAYS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </Select>
            {unconfirmed && (
              <button
                type="button"
                onClick={() => confirm(p, true)}
                className="shrink-0 inline-flex items-center gap-1 text-[11px] text-due font-semibold hover:underline cursor-pointer"
                title="Confirm this bonus so it counts toward Booked/Outstanding"
              ><IconCheck size={13} /> Confirm</button>
            )}
            {!deleting ? (
              <button
                type="button"
                onClick={() => setDeleteId(p.id)}
                disabled={payments.length <= 1}
                title={payments.length <= 1 ? "A deal must keep at least one payment" : "Delete payment"}
                aria-label="Delete payment"
                className="shrink-0 p-1 text-inksoft hover:text-late cursor-pointer disabled:opacity-40 disabled:cursor-default"
              ><IconDelete size={14} /></button>
            ) : (
              <span className="shrink-0 flex items-center gap-1">
                <button type="button" onClick={() => remove(p.id)} className="text-[11px] text-late font-medium cursor-pointer">Delete</button>
                <button type="button" onClick={() => setDeleteId(null)} className="text-[11px] text-inksoft cursor-pointer">Keep</button>
              </span>
            )}
          </div>
        );
      })}

      {/* Add another payment — Split / Bonus shortcuts only (Recurring stays out). */}
      {adding === null && (
        <button type="button" onClick={() => setAdding("split")} className="inline-flex items-center gap-1 text-[11.5px] text-accent font-medium hover:underline cursor-pointer">
          <IconPlus size={13} /> Add another payment
        </button>
      )}
      {adding === "split" && (
        <div className="flex items-center gap-2 text-[12px] flex-wrap">
          <span className="text-inksoft">Split{dealAmount == null ? "" : ` ${formatN(dealAmount)} into two`}: 50% upfront, 50% on completion.</span>
          <button type="button" onClick={applySplit} className="text-[11.5px] px-2 h-6 rounded-md bg-[var(--accent)] text-onaccent cursor-pointer">Apply split</button>
          <button type="button" onClick={() => setAdding("bonus")} className="text-[11.5px] text-accent hover:underline cursor-pointer">Bonus</button>
          <button type="button" onClick={() => setAdding(null)} className="text-[11.5px] text-inksoft cursor-pointer">Cancel</button>
        </div>
      )}
      {adding === "bonus" && (
        <div className="flex items-center gap-2 flex-wrap text-[12px]">
          <span className="text-inksoft">Bonus</span>
          <DealInput type="number" value={bonusAmount} onCommit={(v) => setBonusAmount(v)} className={cn(inputCls, "money w-24")} ariaLabel="Bonus amount" placeholder="Amount" />
          <DealInput value={bonusNote} onCommit={(v) => setBonusNote(v)} className={cn(inputCls, "flex-1")} placeholder="Condition (e.g. if views exceed 100k)" ariaLabel="Bonus condition" />
          <button type="button" onClick={applyBonus} className="shrink-0 text-[11.5px] px-2 h-6 rounded-md bg-[var(--accent)] text-onaccent cursor-pointer">Add bonus</button>
          <button type="button" onClick={() => setAdding("split")} className="text-[11.5px] text-accent hover:underline cursor-pointer">Split</button>
          <button type="button" onClick={() => setAdding(null)} className="text-[11.5px] text-inksoft cursor-pointer">Cancel</button>
        </div>
      )}
    </div>
  );
}

function formatN(n: number): string {
  return Number.isInteger(n) ? String(n) : String(Math.round(n * 100) / 100);
}