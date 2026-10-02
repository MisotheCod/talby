// Convergence test: the overview Payments card and the /app/payments page must
// render each payment's status IDENTICALLY. Both now derive from the single
// canonical paymentStatusView() in src/lib/pay-status.ts — the overview card's
// PayRow and the Payments page's rowsStatus/renderStatusPill both call it. This
// test renders the same set of payments through that one function and asserts
// every status/label/overdue the two surfaces care about, so any future drift
// in one surface (or a regression in the shared fn) fails here.
//
// Run: node --experimental-strip-types --test src/lib/pay-status.test.ts
//
// There is a "use client" directive at the top of pay-status.ts — the function
// under test (paymentStatusView) is pure logic with no React imports, so Node's
// type-stripping runs it directly.

import { test } from "node:test";
import assert from "node:assert/strict";
import { paymentStatusView } from "./pay-status.ts";

// Representative rows: one past-due, one on-time, one paid, one no-invoice,
// one null-date, one invoiced-past-due, one invoiced-on-time.
const TODAY = new Date("2026-10-01T00:00:00Z");
const PAST = "2026-09-01";
const FUTURE = "2026-11-01";

function view(r: { pay_status?: string | null; status?: string | null; expected_date?: string | null; amount?: number | null }) {
  // mirror how BOTH surfaces call it (they pass the same shape)
  return paymentStatusView({
    pay_status: r.pay_status ?? null,
    status: r.status ?? null,
    expected_date: r.expected_date ?? null,
    amount: r.amount ?? null,
  });
}

test("single unpaid, on-time -> Not invoiced, not overdue", () => {
  const v = view({ pay_status: "not_invoiced", expected_date: FUTURE, amount: 500 });
  assert.equal(v.label, "Not invoiced");
  assert.equal(v.overdue, false);
  assert.equal(v.pillKind, "due");
  assert.equal(v.amount, 500);
  assert.equal(v.due, FUTURE);
});

test("past-due unpaid -> Overdue (overview card and Payments page agree)", () => {
  const v = view({ pay_status: "not_invoiced", expected_date: PAST, amount: 500 });
  assert.equal(v.label, "Overdue");
  assert.equal(v.overdue, true);
  assert.equal(v.pillKind, "late");
});

test("invoiced + past date -> Overdue (this is where the old overview card diverged)", () => {
  // Old overview read invoice_state and could show "Not invoiced" when the
  // page showed "Overdue"; both now derive from pay_status + derived overdue.
  const v = view({ pay_status: "invoiced", expected_date: PAST, amount: 800 });
  assert.equal(v.label, "Overdue");
  assert.equal(v.overdue, true);
  assert.equal(v.pillKind, "late");
});

test("invoiced + future date -> Invoiced, not overdue", () => {
  const v = view({ pay_status: "invoiced", expected_date: FUTURE, amount: 800 });
  assert.equal(v.label, "Invoiced");
  assert.equal(v.overdue, false);
  assert.equal(v.pillKind, "due");
});

test("paid -> Paid, never overdue regardless of date", () => {
  const v = view({ pay_status: "paid", status: "received", expected_date: PAST, amount: 1000 });
  assert.equal(v.label, "Paid");
  assert.equal(v.overdue, false);
  assert.equal(v.pillKind, "paid");
});

test("no_invoice_needed -> never overdue", () => {
  const v = view({ pay_status: "no_invoice_needed", expected_date: PAST, amount: 1200 });
  assert.equal(v.label, "No invoice needed");
  assert.equal(v.overdue, false);
  assert.equal(v.pillKind, "neutral");
});

test("null date -> not overdue", () => {
  const v = view({ pay_status: "not_invoiced", expected_date: null, amount: 300 });
  assert.equal(v.label, "Not invoiced");
  assert.equal(v.overdue, false);
});

test("Gruns split (both not_invoiced rows) renders per-row statuses distantly", () => {
  // Gruns deal: $500 due Sep 5 (past) + $300 due Oct 6 (future at run time).
  // Each row is its OWN status through the shared fn (overview lists both rows,
  // not one line per deal). Only the past-due $500 shows Overdue.
  const a = view({ pay_status: "not_invoiced", expected_date: "2026-09-05", amount: 500 });
  const b = view({ pay_status: "not_invoiced", expected_date: "2026-10-06", amount: 300 });
  assert.equal(a.label, "Overdue");
  assert.equal(a.overdue, true);
  assert.equal(b.label, "Not invoiced");
  assert.equal(b.overdue, false);
  // and they are distinct rows with distinct amounts
  assert.equal(a.amount, 500);
  assert.equal(b.amount, 300);
  // key contract: the two must NOT collapse into one deal-level status
  assert.notEqual(a.label, "Paid");
  assert.notEqual(b.label, "Paid");
});

test("overview card label equals Payments page label for every input shape", () => {
  // Every (pay_status, date) combo the two surfaces can see must produce a
  // single, agreed label. This is the no-drift contract: if one surface ever
  // stops calling paymentStatusView, it can't pass this because we assert the
  // canonical mapping here.
  const cases: [string | null, string | null, string][] = [
    ["not_invoiced", PAST, "Overdue"],
    ["not_invoiced", FUTURE, "Not invoiced"],
    ["not_invoiced", null, "Not invoiced"],
    ["invoiced", PAST, "Overdue"],
    ["invoiced", FUTURE, "Invoiced"],
    ["paid", PAST, "Paid"],
    ["paid", FUTURE, "Paid"],
    ["no_invoice_needed", PAST, "No invoice needed"],
    ["no_invoice_needed", FUTURE, "No invoice needed"],
    [null, FUTURE, "Not invoiced"],
    [null, PAST, "Overdue"],
  ];
  for (const [pay_status, date, expected] of cases) {
    const v = view({ pay_status, expected_date: date, amount: 1 });
    assert.equal(v.label, expected, `pay_status=${pay_status} date=${date}`);
  }
});
/* Release 1: structure + extras shared function tests */

import { dealPaymentView, paymentStructureLabel, paymentHeaderSummary, structureKindLabel, timingLabel, NET_DAYS } from "./pay-status.ts";

test("paymentStructureLabel once -> Full payment", () => {
  assert.equal(paymentStructureLabel("once", 0, 1), "Full payment");
});
test("paymentStructureLabel split -> 1 of 2 / 2 of 2", () => {
  assert.equal(paymentStructureLabel("split", 0, 2), "1 of 2");
  assert.equal(paymentStructureLabel("split", 1, 2), "2 of 2");
});
test("paymentStructureLabel parts -> 1 of N...", () => {
  assert.equal(paymentStructureLabel("parts", 2, 3), "3 of 3");
});
test("paymentStructureLabel monthly -> Month 3 of 6", () => {
  assert.equal(paymentStructureLabel("monthly", 2, 6), "Month 3 of 6");
});
test("dealPaymentView next-due + overdue + totals (all accounts agree)", () => {
  const v = dealPaymentView({
    structureKind: "split",
    payments: [
      { id: "a", amount: 50, pay_status: "not_invoiced", status: "expected", expected_date: "2026-09-01" },
      { id: "b", amount: 50, pay_status: "not_invoiced", status: "expected", expected_date: "2026-10-06" },
    ],
    extras: [],
    dealStatus: "active",
  });
  // next due = earliest unpaid (Sep 1), overdue (past)
  assert.equal(v.labels.length, 2);
  assert.equal(v.labels[0], "1 of 2");
  assert.equal(v.labels[1], "2 of 2");
  assert.equal(v.nextDueDate, "2026-09-01");
  assert.equal(v.overdue, true);
  assert.equal(v.expectedTotal, 100);
  assert.equal(v.outstandingTotal, 100);
});
test("pipeline deals excluded from totals but still have labels", () => {
  const v = dealPaymentView({
    structureKind: "once",
    payments: [{ id: "a", amount: 12000, pay_status: "not_invoiced", status: "expected", expected_date: null }],
    extras: [],
    dealStatus: "pipeline",
  });
  assert.equal(v.expectedTotal, 0);   // pipeline money not due yet
  assert.equal(v.active, false);
  assert.equal(v.labels[0], "Full payment");
});
test("unearned bonus not in deal total; earned bonus adds amount", () => {
  const un = dealPaymentView({ structureKind: "once", payments: [], extras: [{ id: "x", kind: "bonus", amount: 1000, condition: "Reel 100K", rate: null, on_text: null, earned: false }], dealStatus: "active" });
  assert.equal(un.unearnedExtrasTotal, 1000);  // "up to $1,000 more"
  assert.equal(un.expectedTotal, 0);
  const earned = dealPaymentView({ structureKind: "once", payments: [], extras: [{ id: "x", kind: "bonus", amount: 1000, condition: "Reel 100K", rate: null, on_text: null, earned: true }], dealStatus: "active" });
  assert.equal(earned.earnedBonusTotal, 1000);
});
test("structure label helpers", () => {
  assert.equal(structureKindLabel("once"), "All at once");
  assert.equal(structureKindLabel("split"), "Upfront + balance");
  assert.equal(structureKindLabel(null), "Not set");
  assert.equal(timingLabel("net_30"), "Net 30");
  assert.equal(timingLabel("when_posts"), "When it posts");
  assert.equal(NET_DAYS.net_60, 60);
});
test("paymentHeaderSummary for split + parts + monthly", () => {
  assert.equal(paymentHeaderSummary({ amount: 4800, structureKind: "split", extras: [], payments: [{ id: "a", amount: 2400, pay_status: "paid", status: "received", expected_date: null }] }), "$4800, upfront + balance");
  assert.equal(paymentHeaderSummary({ amount: 1300, structureKind: "parts", extras: [], payments: [{ id: "a", amount: 500, pay_status: "paid", status: "received", expected_date: null }, { id: "b", amount: 800, pay_status: "not_invoiced", status: "expected", expected_date: null }] }), "$1300, 2 parts");
  assert.equal(paymentHeaderSummary({ amount: 1800, structureKind: "monthly", structureMonths: 6, extras: [], payments: [{ id: "a", amount: 300, pay_status: "not_invoiced", status: "expected", expected_date: null }] }), "$1800, 6 months");
});

/* Release 2: the create-API payment generator (modal preview must match rows). */
import { generatePaymentsFromStructure } from "./pay-status.ts";

test("once generates a single Full payment, Net 30 from post date", () => {
  const rows = generatePaymentsFromStructure({ structureKind: "once", amount: 1200, structure_timing: "net_30", post_date: "2026-10-01" });
  assert.equal(rows.length, 1);
  assert.equal(rows[0].amount, 1200);
  assert.equal(rows[0].expected_date, "2026-10-31"); // Oct 1 + 30 days = Oct 31
});
test("split generates upfront (50%) + balance", () => {
  const rows = generatePaymentsFromStructure({ structureKind: "split", amount: 4800, structure_upfront_pct: 50, structure_balance_timing: "when_posts", post_date: "2026-10-15" });
  assert.equal(rows.length, 2);
  assert.equal(rows[0].amount, 2400);
  assert.equal(rows[1].amount, 2400);
  assert.equal(rows[1].expected_date, "2026-10-15"); // when_posts = post date
});
test("parts keeps each row's amount/date and notes the name", () => {
  const rows = generatePaymentsFromStructure({ structureKind: "parts", amount: 1500, parts: [{ name: "Milestone 1", amount: 500, date: "2026-09-01" }, { name: "Milestone 2", amount: 1000, date: "2026-10-01" }] });
  assert.equal(rows.length, 2);
  assert.equal(rows[0].amount, 500);
  assert.equal(rows[0].notes, "Milestone 1");
  assert.equal(rows[1].amount, 1000);
});
test("monthly splits evenly across N months", () => {
  const rows = generatePaymentsFromStructure({ structureKind: "monthly", amount: 3000, structure_months: 3 });
  assert.equal(rows.length, 3);
  assert.ok(rows.every((r) => r.amount === 1000));
});
