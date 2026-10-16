import { TalbyDates } from "@/components/talby/_data";
import type { OverviewData, OverviewDealStatus, AccountData, SearchData, ISODate } from "@/components/talby/_data";
import type { DealRow, PaymentRow, ContentRow, TodoRow, NoteRow, ProfileRow as Profile } from "@/lib/talby/queries";

/**
 * to-board.ts — map real Supabase rows into each board's exact data shape.
 * Typed with the types in src/components/talby/_data.ts so tsc flags any field
 * the board needs that we forgot. Dates are YYYY-MM-DD in the user's time zone;
 * amounts are whole dollars. The boards format everything themselves.
 */

/* ----------------------------- Overview ----------------------------- */

export function toOverviewData(p: {
  deals: DealRow[]; payments: PaymentRow[]; content: ContentRow[];
  todos: TodoRow[]; today: ISODate;
}): OverviewData {
  const { deals, payments, content, todos, today } = p;
  const active = deals.filter((d) => d.active && d.status !== "archived");
  const byDeal = new Map<string, PaymentRow[]>();
  for (const pm of payments.filter((x) => x.deal_id)) {
    const arr = byDeal.get(pm.deal_id!) ?? [];
    arr.push(pm);
    byDeal.set(pm.deal_id!, arr);
  }

  const outDeals: OverviewData["deals"] = [];
  const overdue: OverviewData["overdue"] = [];
  let receivedSum = 0, receivedCount = 0;
  let owedSum = 0, owedCount = 0;

  for (const d of active) {
    const ps = byDeal.get(d.id) ?? [];
    const amount = d.value ?? 0;
    const unpaid = ps.filter((x) => x.status !== "received" && x.pay_status !== "paid");
    const paidRows = ps.filter((x) => x.status === "received" || x.pay_status === "paid");
    let status: OverviewDealStatus = "not";
    let date: ISODate | "" = "";
    const due = unpaid[0]?.expected_date ?? d.due_date ?? "";
    if (d.status === "pipeline" || d.status === "negotiating") {
      status = "neg";
    } else if (paidRows.length && ps.length && paidRows.length >= ps.length) {
      status = "paid"; receivedSum += amount; receivedCount++;
      date = paidRows[0].expected_date || d.created_at.slice(0, 10);
    } else {
      owedSum += amount; owedCount++;
      if (unpaid.some((x) => x.pay_status === "invoiced")) status = "inv";
      date = due;
      if (due && due < today) { status = "over"; overdue.push([d.brand, amount, due]); }
    }
    outDeals.push([d.brand, status, date, amount]);
  }

  const needsPayBy: OverviewData["needsPayBy"] = content
    .filter((c) => c.event_date && c.event_date <= today)
    .map((c) => ({ brand: c.title, liveOn: c.event_date! }));

  const noPayDates = active.filter((d) => {
    const ps = byDeal.get(d.id) ?? [];
    return ps.length === 0 || !ps.some((x) => x.expected_date);
  });
  const noPayBy = { count: noPayDates.length, amount: noPayDates.reduce((s, d) => s + (d.value ?? 0), 0) };

  const week: OverviewData["week"] = [];
  for (let i = -TalbyDates.weekday(today); i < 7 - TalbyDates.weekday(today); i++) {
    const date = TalbyDates.iso(TalbyDates.num(today) + i);
    for (const pm of payments.filter((x) => x.expected_date === date && x.status !== "received" && x.pay_status !== "paid"))
      week.push({ date, kind: "late", title: `${pm.deal?.brand ?? "Payment"} payment`, brand: pm.deal?.brand, amount: pm.amount });
    for (const pm of payments.filter((x) => x.expected_date === date && (x.status === "received" || x.pay_status === "paid")))
      week.push({ date, kind: "paid", title: `${pm.deal?.brand ?? "Payment"} paid`, brand: pm.deal?.brand, amount: pm.amount });
    for (const c of content.filter((x) => x.event_date === date))
      week.push({ date, kind: c.status === "posted" ? "posted" : "post", title: c.title });
  }

  const horizon = TalbyDates.num(today) + 60;
  const upcoming: OverviewData["upcoming"] = payments
    .filter((x) => x.status !== "received" && x.pay_status !== "paid" && x.expected_date
      && TalbyDates.num(x.expected_date) > TalbyDates.num(today) && TalbyDates.num(x.expected_date) <= horizon)
    .sort((a, b) => (a.expected_date! < b.expected_date! ? -1 : 1))
    .map((x) => [x.deal?.brand ?? "Payment", x.expected_date!, x.amount]);

  return {
    today,
    deals: outDeals, overdue, needsPayBy, noPayBy, week, upcoming,
    booked: { amount: active.reduce((s, d) => s + (d.value ?? 0), 0), deals: active.length },
    received: { amount: receivedSum, count: receivedCount },
    owed: { amount: owedSum, count: owedCount },
    todos: todos.filter((t) => !t.done).map((t) => ({ id: t.id, text: t.title, deal: "", done: false })),
  };
}

/* ------------------------------ Account ------------------------------ */

export function toAccountData(p: {
  profile: Profile;
  today: ISODate;
  counts: { deals: number; late: number; ideas: number; todos: number };
  dealsThisYear: number;
  notifications: AccountData["notifications"];
  search?: SearchData;
  trialTotalDays?: number;
}): AccountData {
  const { profile, counts, dealsThisYear, notifications, search, today } = p;
  const total = p.trialTotalDays ?? 14;
  let trial: AccountData["trial"] = { endsOn: today, daysLeft: 0, usedPct: 0 };
  if (profile.trial_end) {
    const endsOn = profile.trial_end.slice(0, 10);
    const daysLeft = Math.max(0, TalbyDates.diff(today, endsOn));
    trial = { endsOn, daysLeft, usedPct: Math.max(0, Math.min(100, Math.round(((total - daysLeft) / total) * 100))) };
  }
  const base = (profile.handler ?? "").replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    name: base.split(" ")[0] || "there",
    displayName: base || "Creator",
    handle: profile.handler ?? "",
    email: "",
    dealsThisYear,
    counts,
    trial,
    pastDueBy: today,
    notifications,
    ...(search ? { search } : {}),
  };
}
