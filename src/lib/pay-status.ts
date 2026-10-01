"use client";

// Pay-status consolidation (PR one).
//
// `pay_status` lives on payments, one of:
//   not_invoiced | invoiced | paid | no_invoice_needed
// The deal shows a DERIVED rollup, never a stored field:
//   - zero payments            -> not_invoiced
//   - single payment           -> that payment's pay_status
//   - multiple payments        -> paid only if ALL are paid, else the status
//                                 of the earliest-unpaid payment (by date)
// This answers "does this deal need attention," not "has anything landed."
//
// Also exposes the count for the "3 of 12 paid" progress line.

export type PayStatus = "not_invoiced" | "invoiced" | "paid" | "no_invoice_needed";

export type PayStatusSource = {
  pay_status: string | null;
  expected_date: string | null;
};

export type DealRollup = {
  status: PayStatus;
  paidCount: number;
  totalCount: number;
};

const VALID: PayStatus[] = ["not_invoiced", "invoiced", "paid", "no_invoice_needed"];

function norm(s: string | null): PayStatus {
  return (VALID as string[]).includes(s as string) ? (s as PayStatus) : "not_invoiced";
}

/** Roll a deal's payments into a single status + progress counts. */
export function dealPayRollup(payments: PayStatusSource[]): DealRollup {
  if (!payments.length) return { status: "not_invoiced", paidCount: 0, totalCount: 0 };
  const totalCount = payments.length;
  const paidCount = payments.filter((p) => norm(p.pay_status) === "paid").length;

  if (totalCount === 1) return { status: norm(payments[0].pay_status), paidCount, totalCount };

  // Paid only when every payment is paid; else the earliest-unpaid payment.
  if (paidCount === totalCount) return { status: "paid", paidCount, totalCount };
  const unpaid = payments
    .filter((p) => norm(p.pay_status) !== "paid")
    .sort((a, b) => (a.expected_date ?? "9999").localeCompare(b.expected_date ?? "9999"));
  return { status: norm(unpaid[0]?.pay_status), paidCount, totalCount };
}

/** Label for a pay-status value (logic shared across every surface). */
export function payStatusLabel(s: PayStatus): string {
  switch (s) {
    case "paid": return "Paid";
    case "invoiced": return "Invoiced";
    case "no_invoice_needed": return "No invoice needed";
    default: return "Not invoiced";
  }
}

/** Whether a payment row is a confirmed bonus (or not a bonus at all, i.e. it
 *  counts toward Booked/Outstanding). NULL/absent = confirmed (not a bonus). */
export function isConfirmed(p: { bonus_confirmed?: boolean | null }): boolean {
  return p.bonus_confirmed !== false;
}

/**
 * Amber guardrail: does the SUM of a deal's CONFIRMED payments differ from the
 * deal amount? Unconfirmed bonus payments are excluded from the sum. Returns
 * null when they match (or there are no confirmed payments), else a short
 * human line like "Payments total $800. The deal is $500." and the numbers.
 */
export function paymentMismatch(
  payments: { amount: number | null; bonus_confirmed?: boolean | null }[],
  dealAmount: number | null
): { confirmedTotal: number; dealAmount: number; note: string } | null {
  const deal = dealAmount ?? 0;
  const total = payments
    .filter((p) => isConfirmed(p) && p.amount != null)
    .reduce((s, p) => s + (p.amount ?? 0), 0);
  if (Math.abs(total - deal) < 0.005) return null;
  return {
    confirmedTotal: total,
    dealAmount: deal,
    note: `Payments total $${formatAmt(total)}. The deal is $${formatAmt(deal)}.`,
  };
}

function formatAmt(n: number): string {
  const whole = Math.round(n * 100) / 100;
  return Number.isInteger(whole) ? String(whole) : String(whole);
}

/** A payment row as the deals table needs it (mirrors ContentPost for posts). */
export type PaymentRow = {
  id: string;
  amount: number | null;
  status: string | null;          // lifecycle: expected / received
  invoice_state: string | null;
  pay_status: string | null;
  expected_date: string | null;
  notes?: string | null;
};

/**
 * The info the Pay-by + Payment columns need, mirroring postDateCell for posts.
 *   - Payment column pill = the NEXT UNPAID payment's status ("Paid" when every
 *     payment is paid).
 *   - Pay-by column = that same next-unpaid payment's date (red when past due);
 *     when all paid, show the most recent payment's date.
 *   - Second line for 2+ payments: "N of M paid" muted; "All paid" when done.
 *   - Single-payment deals show exactly what they show today (no second line).
 */
export function paymentCell(
  payments: (PaymentRow | PayStatusSource)[] | null | undefined,
  today?: Date
): {
  next_payby: string | null;      // the date to show (next unpaid, else most recent)
  next_status: PayStatus;         // pill status: next unpaid's, else "paid"
  overdue: boolean;               // next unpaid's date is in the past
  allPaid: boolean;
  line2: { kind: "all" | "progress"; text: string } | null;
  paidCount: number;
  totalCount: number;
  payments: PaymentRow[];         // sorted ascending by date for the popover
} {
  const rows = (payments ?? []).filter((p): p is PaymentRow =>
    p && typeof p === "object" && "id" in p
  );
  if (!rows.length) {
    return { next_payby: null, next_status: "not_invoiced", overdue: false, allPaid: false, line2: null, paidCount: 0, totalCount: 0, payments: [] };
  }
  const t = (today ?? new Date()).toISOString().slice(0, 10);
  const sorted = [...rows].sort((a, b) =>
    (a.expected_date ?? "9999").localeCompare(b.expected_date ?? "9999"));
  const paidCount = sorted.filter((s) => norm(s.pay_status) === "paid").length;
  const allPaid = paidCount === sorted.length;
  const unpaid = sorted.filter((s) => norm(s.pay_status) !== "paid");

  if (allPaid) {
    // Most recent date; "All paid" second line only for 2+ (single stays as-is).
    const mostRecent = (sorted[sorted.length - 1].expected_date ?? "").slice(0, 10);
    return {
      next_payby: mostRecent || null, next_status: "paid", overdue: false, allPaid: true,
      line2: sorted.length >= 2 ? { kind: "all", text: "All paid" } : null,
      paidCount, totalCount: sorted.length, payments: sorted,
    };
  }
  const next = unpaid[0];
  const date = (next.expected_date ?? "").slice(0, 10);
  const status = norm(next.pay_status);
  return {
    next_payby: date || null, next_status: status,
    overdue: date ? isPayOverdue(status, date, (s?: string | null) => !!s && s < t) : false,
    allPaid: false,
    line2: sorted.length >= 2 ? { kind: "progress", text: `${paidCount} of ${sorted.length} paid` } : null,
    paidCount, totalCount: sorted.length, payments: sorted,
  };
}

/**
 * Derived overdue flag. A deal's payment is overdue only when its pay-by date
 * has passed AND its pay status is not_invoiced or invoiced (money expected but
 * not yet in). paid and no_invoice_needed are never overdue.
 */
export function isPayOverdue(status: PayStatus, payBy?: string | null, isPastDue?: (s?: string | null) => boolean): boolean {
  if (status === "paid" || status === "no_invoice_needed") return false;
  if (status !== "not_invoiced" && status !== "invoiced") return false;
  if (!payBy) return false;
  return isPastDue ? isPastDue(payBy) : (payBy || "9999") < new Date().toISOString().slice(0, 10);
}

/**
 * Conflicting source row? A row whose lifecycle says "paid" but whose payment
 * object carries NO amount, status, or date. The importer would create the deal
 * and leave it not_invoiced (there is no received payment to back a paid status),
 * so this must be surfaced on the review screen instead of silently resolved.
 * Returns a short reason when it is a conflict, null otherwise.
 */
export function paidPaymentGap(r: {
  status?: string | null;
  payment?: { amount?: string | null; status?: string | null; expected_date?: string | null } | null;
}): string | null {
  const lifePaid = /paid/i.test(r.status ?? "");
  if (!lifePaid) return null;
  const pm = r.payment;
  const hasAmount = !!pm?.amount && String(pm.amount).trim() !== "";
  const hasStatus = !!pm?.status && String(pm.status).trim() !== "";
  const hasDate = !!pm?.expected_date && String(pm.expected_date).trim() !== "";
  if (hasAmount || hasStatus || hasDate) return null;
  return "Source marks this deal paid, but there is no payment amount, status, or date to back it. Talby will create the deal as Not invoiced with no payment record. Add the missing payment details or change the status before importing.";
}