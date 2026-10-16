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
  const raw = (profile.handler ?? "").trim();
  const disp = raw ? raw.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "";
  const displayName = disp || "Creator";
  const firstName = disp ? disp.split(" ")[0] : "";
  return {
    name: firstName || displayName.split(" ")[0] || "there",
    displayName,
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

/* ------------------------------ Deals ------------------------------ */

import type { DealsData, DealRow as BoardDealRow, PayState, PaymentsData, PaymentRow as BoardPaymentRow, CalendarData, CalendarEvent, TodosData, IdeasData } from "@/components/talby/_data";

const PAY_LABEL: Record<string, string> = { once: "All at once", split: "Split", parts: "In parts", monthly: "Monthly" };

function platformsOf(d: DealRow): string[] {
  const p = (d as unknown as { platforms?: unknown }).platforms;
  if (Array.isArray(p) && p.length) return p as string[];
  const m = /platforms?:\s*([^.;\n]+)/i.exec(d.notes ?? "");
  if (m) return m[1].split(/[,/]/).map((s) => s.trim()).filter(Boolean);
  return [];
}

function payStateOf(d: DealRow, paid: boolean, unpaidInv: boolean, overdue: boolean): PayState {
  if (paid) return "paid";
  if (overdue) return "over";
  if (unpaidInv) return "inv";
  return "not";
}

export function toDealsData(p: { deals: DealRow[]; payments: PaymentRow[]; content: ContentRow[]; today: ISODate }): DealsData {
  const { deals, payments, content, today } = p;
  const byDeal = new Map<string, PaymentRow[]>();
  for (const x of payments.filter((y) => y.deal_id)) { const a = byDeal.get(x.deal_id!) ?? []; a.push(x); byDeal.set(x.deal_id!, a); }
  const postByDeal = new Map<string, string>();
  for (const c of content.filter((x) => x.linked_deal_id && x.event_date)) postByDeal.set(c.linked_deal_id!, c.event_date!);

  const rows: BoardDealRow[] = deals.map((d) => {
    const ps = byDeal.get(d.id) ?? [];
    const paid = ps.length > 0 && ps.every((x) => x.status === "received" || x.pay_status === "paid");
    const unpaid = ps.filter((x) => x.status !== "received" && x.pay_status !== "paid");
    const due = unpaid[0]?.expected_date ?? d.due_date ?? "";
    const overdue = !!due && due < today;
    const state = payStateOf(d, paid, unpaid.some((x) => x.pay_status === "invoiced"), overdue);
    const payBy = state === "paid" ? (ps.find((x) => x.status === "received" || x.pay_status === "paid")?.expected_date ?? "") : due;
    const negotiated = d.status === "pipeline" || d.status === "negotiating";
    const archived = d.status === "archived";
    const out: BoardDealRow = {
      id: d.id,
      brand: d.brand,
      status: negotiated ? "Negotiating" : "Active",
      pay: state,
      post: postByDeal.get(d.id) ?? (d.post_date ?? ""),
      payBy: payBy || "",
      amount: d.value ?? 0,
      how: PAY_LABEL[d.payment_structure ?? "once"] ?? "All at once",
      platforms: platformsOf(d),
      type: d.deliverable ?? "",
      rep: d.rep_name ?? "",
      created: (d.created_at ?? "").slice(0, 10),
    };
    if (archived) out.archived = true;
    if (ps.length > 1) {
      out.payments = ps.map((x, i) => ({
        label: `Payment ${i + 1} of ${ps.length}`,
        amount: x.amount,
        date: x.expected_date ?? "",
        state: payStateOf(d, x.status === "received" || x.pay_status === "paid", x.pay_status === "invoiced", !!x.expected_date && x.expected_date < today),
      }));
    }
    return out;
  });
  return { today, deals: rows };
}

/* ---------------------------- Payments ---------------------------- */

export function toPaymentsData(p: { payments: PaymentRow[]; deals: DealRow[]; today: ISODate }): PaymentsData {
  const { payments, deals, today } = p;
  const rows: BoardPaymentRow[] = payments.map((x, i, arr) => {
    const paid = x.status === "received" || x.pay_status === "paid";
    const overdue = !paid && !!x.expected_date && x.expected_date < today;
    const state: PayState = paid ? "paid" : overdue ? "over" : x.pay_status === "invoiced" ? "inv" : "not";
    const forDeal = arr.filter((y) => y.deal_id === x.deal_id);
    const part = forDeal.length > 1 ? `Payment ${forDeal.indexOf(x) + 1} of ${forDeal.length}` : "Full payment";
    return { id: x.id, date: x.expected_date ?? "", brand: x.deal?.brand ?? "Payment", part, state, amount: x.amount, invoice: paid };
  });
  const negotiating = deals.filter((d) => d.status === "pipeline" || d.status === "negotiating");
  const paidCount = rows.filter((r) => r.state === "paid").length;
  return {
    today,
    payments: rows,
    negotiating: { count: negotiating.length, amount: negotiating.reduce((s, d) => s + (d.value ?? 0), 0) },
    dealsCompleted: paidCount,
    dealsOpen: rows.filter((r) => r.state !== "paid").length,
    gifted: { amount: 0, count: 0 },
  };
}

/* ---------------------------- Calendar ---------------------------- */

export function toCalendarData(p: { content: ContentRow[]; payments: PaymentRow[]; todos: TodoRow[]; today: ISODate }): CalendarData {
  const { content, payments, todos, today } = p;
  const events: CalendarEvent[] = [];
  for (const c of content.filter((x) => x.event_date)) events.push({ id: c.id, date: c.event_date!, kind: "post", title: c.title });
  for (const x of payments.filter((y) => y.expected_date)) {
    const paid = x.status === "received" || x.pay_status === "paid";
    events.push({ id: x.id, date: x.expected_date!, kind: "pay", title: x.deal?.brand ?? "Payment", amount: x.amount, overdue: !paid && x.expected_date! < today });
  }
  for (const t of todos.filter((x) => x.due_date)) events.push({ id: t.id, date: t.due_date!, kind: "del", title: t.title, done: t.done });
  return { today, events };
}

/* ------------------------------ To-dos ------------------------------ */

export function toTodosData(p: { todos: TodoRow[]; deals: DealRow[]; today: ISODate }): TodosData {
  const { todos, deals, today } = p;
  return {
    today,
    todos: todos.map((t) => ({ id: t.id, text: t.title, deal: "", due: t.due_date ?? "", done: !!t.done })),
    deals: deals.map((d) => [d.brand, d.value ?? 0] as [string, number]),
  };
}

/* ------------------------------ Ideas ------------------------------ */

export function toIdeasData(p: { ideas: Array<{ id: string; title: string; created_at: string; status: string }>; today: ISODate }): IdeasData {
  const { ideas, today } = p;
  return {
    today,
    ideas: ideas.filter((x) => x.status !== "archived").map((x) => ({ id: x.id, text: x.title, created: (x.created_at ?? "").slice(0, 10), starred: false })),
  };
}

/* ------------------------------ Settings ------------------------------ */

import type { SettingsData } from "@/components/talby/_data";

export function toSettingsData(p: {
  profile: Profile | null;
  notion: { workspace_name: string | null } | null;
  today: ISODate;
}): SettingsData {
  const { profile, notion, today } = p;
  const trialEnd = profile?.trial_end ? profile.trial_end.slice(0, 10) : today;
  return {
    billing: {
      nextPaymentOn: trialEnd,
      endedOn: profile?.plan_status === "canceled" ? trialEnd : "",
      declinedOn: profile?.plan_status === "past_due" ? trialEnd : "",
      card: null,
      invoices: [],
    },
    notion: { status: notion ? "connected" : "none", database: notion?.workspace_name ?? "" },
  };
}
