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
 * THE canonical per-payment status view, matching the Payments page exactly
 * (single source of truth). Every surface that shows a payment's status, due
 * date or amount — Payments page, overview Payments card, deals table, deal
 * drawer, This week, calendar, assistant — must derive from this ONE function so
 * nothing can drift. "Overdue" is DERIVED (date passed + not paid), never stored.
 *
 *   - status          normalized pay_status (not_invoiced/invoiced/paid/no_invoice_needed)
 *   - overdue         derived: date passed AND status is not_invoiced or invoiced
 *   - label           the human label the Payments page uses, INCLUDING the
 *                     "Overdue" override when the date has passed
 *   - pillKind        maps to StatusPill kind: "paid"|"late"|"due"|"neutral"
 *   - due             the pay-by date (expected_date) this status is about
 *   - amount          the amount this status describes
 */
export type PaymentStatusView = {
  status: PayStatus;
  overdue: boolean;
  label: string;
  pillKind: "paid" | "late" | "due" | "neutral";
  due: string | null;
  amount: number | null;
};

/** Source contract for the canonical view — the minimal row it needs. */
export type PaymentStatusSource = {
  pay_status?: string | null;
  status?: string | null;
  expected_date?: string | null;
  amount?: number | null;
};

/** Derive the canonical per-payment status view. Defaults pay_status to
 *  not_invoiced and derives overdue (never stored). Label follows the Payments
 *  page's exact switch, including the Overdue override for past-due money. */
export function paymentStatusView(p: PaymentStatusSource): PaymentStatusView {
  const ps = norm(p.pay_status ?? null);
  const overdue = isPayOverdue(ps, p.expected_date ?? null);
  let label: string;
  let pillKind: "paid" | "late" | "due" | "neutral";
  switch (ps) {
    case "paid": label = "Paid"; pillKind = "paid"; break;
    case "no_invoice_needed": label = "No invoice needed"; pillKind = "neutral"; break;
    case "invoiced": label = overdue ? "Overdue" : "Invoiced"; pillKind = overdue ? "late" : "due"; break;
    default: label = overdue ? "Overdue" : "Not invoiced"; pillKind = overdue ? "late" : "due"; break;
  }
  return {
    status: ps, overdue, label, pillKind,
    due: p.expected_date ?? null,
    amount: p.amount ?? null,
  };
}

/**
 * Generate the payment ROWS a structure produces (spec 1b/4c), shared by the
 * new-deal modal preview and the create API so they never disagree.
 * Returns [{ amount, expected_date|null, notes|null }]. For monthly only the
 * method is deterministic (equal split); parts carry their own amounts/dates.
 * Post date drives "when it posts" and Net timing for once/split (post + N days).
 */
export function generatePaymentsFromStructure(s: {
  structureKind: PaymentStructureKind | null;
  amount: number | null;
  structure_timing?: string | null;
  structure_upfront_pct?: number | null;
  structure_balance_timing?: string | null;
  structure_months?: number | null;
  post_date?: string | null;
  parts?: { name?: string | null; amount?: number | null; date?: string | null }[];
}): { amount: number | null; expected_date: string | null; notes: string | null }[] {
  const amt = s.amount ?? 0;
  const post = s.post_date || null;
  const timingDate = (netKey: string | null | undefined): string | null => {
    const days = netKey ? NET_DAYS[netKey] : undefined;
    if (netKey === "when_posts") return post;
    if (days !== undefined && post) {
      const d = new Date(post + "T00:00:00");
      d.setDate(d.getDate() + days);
      return d.toISOString().slice(0, 10);
    }
    return null;
  };
  switch (s.structureKind) {
    case "split": {
      const up = Math.round((amt * (s.structure_upfront_pct ?? 50)) / 100);
      return [
        { amount: up, expected_date: null, notes: null },                       // upfront
        { amount: amt - up, expected_date: timingDate(s.structure_balance_timing ?? "net_30"), notes: null }, // balance
      ];
    }
    case "monthly": {
      const m = Math.max(1, s.structure_months ?? 3);
      const per = Math.round(amt / m);
      return Array.from({ length: m }, () => ({ amount: per, expected_date: null, notes: null }));
    }
    case "parts":
      return (s.parts ?? []).map((p) => ({ amount: p.amount ?? null, expected_date: p.date || null, notes: p.name?.trim() || null }));
    case "once":
    default:
      return [{ amount: amt, expected_date: timingDate(s.structure_timing ?? "net_30"), notes: null }];
  }
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

/* ============================= RELEASE 1 =============================
 * Payment structures + extras (shared single source).
 * See supabase/migrations/000040_payment_structures.sql.
 * ==================================================================== */

export type PaymentStructureKind = "once" | "split" | "parts" | "monthly";

/** A deal's stored structure shape (fields are null unless the kind uses them). */
export type DealStructure = {
  kind: PaymentStructureKind | null;
  timing?: string | null;              // once: 'when_posts'|'net_15'|'net_30'|'net_45'|'net_60'
  timing_set_date?: string | null;     // once: when timing = a set date
  upfront_pct?: number | null;         // split: 25|30|40|50
  balance_timing?: string | null;      // split: 'when_posts'|'net_15'|'net_30'|'net_60'
  months?: number | null;              // monthly: 3|6|12
  start_date?: string | null;          // monthly
};

/** A bonus or commission on a deal — separate from guaranteed payments. */
export type DealExtra = {
  id: string;
  kind: "bonus" | "commission";
  amount: number | null;
  condition: string | null;
  rate: number | null;
  on_text: string | null;
  earned: boolean;
};

/** Pay terms timing -> Net-days map (mirrors the retired pay_terms set). */
export const NET_DAYS: Record<string, number> = {
  due_on_receipt: 0, net_15: 15, net_30: 30, net_45: 45, net_60: 60, net_90: 90,
};

/** Human label for a structure kind. */
export function structureKindLabel(k: PaymentStructureKind | null | undefined): string {
  switch (k) {
    case "once": return "All at once";
    case "split": return "Upfront + balance";
    case "parts": return "In parts";
    case "monthly": return "Monthly";
    default: return "Not set";
  }
}

/** Human label for a structure timing value. */
export function timingLabel(t: string | null | undefined): string {
  if (!t) return "";
  if (t === "when_posts") return "When it posts";
  if (t === "due_on_receipt") return "Due on receipt";
  const nd = NET_DAYS[t];
  return nd !== undefined ? `Net ${nd}` : t;
}

/**
 * The standard payment LABEL (spec 1c) from the structure + a payment's index.
 *   once      -> "Full payment"
 *   split     -> "1 of 2", "2 of 2", ... (first = upfront, second = balance)
 *   parts     -> "1 of N", "2 of N", ...
 *   monthly   -> "Month X of N"
 * Earned extras use "Bonus" / "Commission" (never passed here).
 */
export function paymentStructureLabel(kind: PaymentStructureKind | null | undefined, index0: number, total: number): string {
  if (kind === "monthly") return `Month ${index0 + 1} of ${total}`;
  if (kind === "once" && total <= 1) return "Full payment";
  if (total <= 1) return "Full payment";
  return `${index0 + 1} of ${total}`;
}

/** A payment row as the structure/shared code needs it. */
type StructPay = {
  id: string;
  amount: number | null;
  pay_status: string | null;
  status: string | null;
  expected_date: string | null;
  notes?: string | null;
};

/**
 * Compute the canonical labels + the NEXT DUE date + totals for a deal
 * (spec 1f shared function). Given the structure, each payment row (the first
 * index0 is upfront for split), and the deal's extras:
 *  - labels: standard label per row
 *  - nextDueDate: due date of the next UNPAID payment (null if all paid / none)
 *  - expectedTotal / outstandingTotal: sum of unpaid CONFIRMED payments, with
 *    PIPELINE/negotiating deals excluded (their money isn't due yet)
 *  - earnedExtrasTotal: sum of earned bonuses + logged commission payouts
 *    (these are NOT in expected/outstanding)
 * This is the ONE function every screen calls so they cannot disagree.
 */
export function dealPaymentView(args: {
  structureKind: PaymentStructureKind | null;
  payments: StructPay[];
  extras: DealExtra[];
  dealStatus: string | null;        // 'active' | 'pipeline' | 'archived' | ...
}) {
  const active = args.dealStatus !== "pipeline" && args.dealStatus !== "archived";
  const rows = args.payments;
  const sorted = [...rows];

  // Next due: first unpaid payment by date (for split, rows come upfront-first).
  const unpaid = sorted
    .filter((p) => norm(p.pay_status) !== "paid")
    .sort((a, b) => (a.expected_date ?? "9999-99-99").localeCompare(b.expected_date ?? "9999-99-99"));
  const nextUnpaid = unpaid[0];

  const paidCount = sorted.filter((p) => norm(p.pay_status) === "paid").length;

  // Labels use the structure; monthly/split/parts index from the payment's
  // position in the deal's own intended sort (rows already ordered).
  const labels = sorted.map((p, i) =>
    // earned-extras become their own tracked payments labeled Bonus/Commission;
    // a plain money row gets the structure label.
    (p.notes === "Bonus" || p.notes === "Commission")
      ? (p.notes as "Bonus" | "Commission")
      : paymentStructureLabel(args.structureKind, i, sorted.length)
  );

  // Totals: only CONFIRMED payments; exclude pipeline/negotiating deals.
  const countIn = active ? sorted : sorted.filter((p) => p.status === "received");
  const expectedTotal = countIn.filter((p) => norm(p.pay_status) !== "paid").reduce((s, p) => s + (p.amount ?? 0), 0);
  const receivedTotal = countIn.filter((p) => norm(p.pay_status) === "paid").reduce((s, p) => s + (p.amount ?? 0), 0);
  const outstandingTotal = expectedTotal;  // money owed but not yet in

  // Extras: unearned bonuses/commission are NOT counted; earned bonus adds its
  // amount to the deal total; commission logs its payouts as paid payments.
  const unearnedExtras = args.extras.filter((e) => !e.earned).reduce((s, e) => s + (e.kind === "bonus" ? (e.amount ?? 0) : 0), 0);
  const earnedBonusTotal = args.extras.filter((e) => e.kind === "bonus" && e.earned).reduce((s, e) => s + (e.amount ?? 0), 0);
  const commissionPct = args.extras.filter((e) => e.kind === "commission").reduce((s, e) => s + (e.rate ?? 0), 0);

  return {
    labels,
    nextUnpaid,
    nextDueDate: nextUnpaid?.expected_date ?? null,
    overdue: nextUnpaid ? isPayOverdue(norm(nextUnpaid.pay_status), nextUnpaid.expected_date) : false,
    paidCount,
    totalCount: sorted.length,
    expectedTotal: Math.round(expectedTotal * 100) / 100,
    receivedTotal: Math.round(receivedTotal * 100) / 100,
    outstandingTotal: Math.round(outstandingTotal * 100) / 100,
    unearnedExtrasTotal: Math.round(unearnedExtras * 100) / 100,   // "up to $X more"
    earnedBonusTotal: Math.round(earnedBonusTotal * 100) / 100,
    commissionPct,
    active,
  };
}

/** Short summary line for a collapsed Payment accordion header, e.g.
 *  "$4,800, upfront + balance" (spec 3a). */
export function paymentHeaderSummary(args: { amount: number | null; structureKind: PaymentStructureKind | null; structureMonths?: number | null; extras: DealExtra[]; payments: StructPay[] }): string {
  const amt = args.amount;
  const kind = args.structureKind;
  const parts: string[] = [];
  if (kind === "split") parts.push("upfront + balance");
  else if (kind === "parts") parts.push(`${args.payments.length} parts`);
  else if (kind === "monthly") parts.push(`${args.structureMonths ?? args.payments.length} months`);
  const base = amt != null ? `$${fmtInt(amt)}` : "";
  if (base && parts.length) return `${base}, ${parts.join(", ")}`;
  if (base) return base;
  return parts.join(", ") || "Not set";
}
function fmtInt(n: number): string {
  const r = Math.round(n * 100) / 100;
  return Number.isInteger(r) ? String(r) : String(r);
}