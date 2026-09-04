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