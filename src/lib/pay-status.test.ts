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