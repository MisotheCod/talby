/**
 * to-board.ts — map real Supabase rows into each board's exact sample shape.
 *
 * One function per page. Field names, formatted strings (`$4,000`, `Pay by Oct 19`)
 * and array shapes must match what the board's renderVals() builds, so the board
 * can render real data without touching render(). Each function returns the shape
 * the board reads from `this.props.data`. The board keeps its sample as the
 * fallback when `data` is absent (the preview route passes none).
 *
 * === SOverview sample shape (from renderVals, item C) ===
 *  deals:  [brand, statusKey, dateISO, amount][]   statusKey: over|inv|not|paid|neg
 *  late:   Record<brand, daysLate>                 for 'over' rows
 *  over:   [brand, amount, dueISO][]               overdue (drives Late tile + attn)
 *  attn:   {pay rows: brand/amt/days} + {date row} + {link row}
 *  week:   Sun..Sat strip (7)                       (weekItems: payment/post rows)
 *  upcoming: [brand, dateISO, amount, whenLabel][] "In N days"
 *  stats:  [{label, value:'$..', line:'Across N signed deals', fg, warn}]  x4 (Booked/Received/Still owed/Late)
 *  todos:  [{text, deal, done}]
 *  name:   greeting first name; handle for the sidebar user block
 */

/** Number formatting the boards use: '$' + toLocaleString(). */
export function fmt(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-US");
}

const MS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** 'YYYY-MM-DD' -> 'Oct 19' (empty stays empty). */
export function md(iso?: string | null): string {
  return iso ? MS[+iso.slice(5, 7) - 1] + " " + +iso.slice(8, 10) : "";
}

export type StatusKey = "over" | "inv" | "not" | "paid" | "neg";
export type OverviewDeal = [string, StatusKey, string, number];

interface DBDeal {
  id: string; brand: string; value: number | null; status: string; active: boolean;
  due_date: string | null; created_at: string;
}
interface DBPayment {
  id: string; deal_id: string | null; amount: number; status: string; pay_status: string | null;
  expected_date: string | null; deal?: { brand: string } | { id: string; brand: string } | null;
}
interface DBTodo { id: string; title: string; done: boolean; due_date: string | null }

/**
 * Map deals + payments into the SOverview `D` list and its derived pieces.
 * statusKey: prev/past-due -> 'over', paid/'received' -> 'paid', invoiced -> 'inv',
 * negotiating/pipeline -> 'neg', else 'not'. dateISO = expected_date for unpaid,
 * paid date for paid (fall back to created_at).
 */
export function toOverview(
  deals: DBDeal[], payments: DBPayment[], todos: DBTodo[], now = new Date()
): {
  deals: OverviewDeal[]; late: Record<string, number>; over: [string, number, string][];
  stats: { label: string; value: string; line: string; fg: string; warn: boolean }[];
  todos: { text: string; deal: string; done: boolean }[];
} {
  const today = now.toISOString().slice(0, 10);
  const byDeal = new Map<string, DBPayment[]>();
  for (const p of payments.filter((x) => x.deal_id)) {
    const arr = byDeal.get(p.deal_id!) ?? [];
    arr.push(p);
    byDeal.set(p.deal_id!, arr);
  }
  const late: Record<string, number> = {};
  const over: [string, number, string][] = [];
  const dealsOut: OverviewDeal[] = [];
  let receivedSum = 0;
  let outstandingSum = 0;
  let expectedCount = 0;

  for (const d of deals) {
    const ps = byDeal.get(d.id) ?? [];
    const amount = d.value ?? 0;
    let key: StatusKey = "not";
    let dateISO = "";
    const unpaid = ps.filter((p) => p.status !== "received" && p.pay_status !== "paid");
    const paidRs = ps.filter((p) => p.status === "received" || p.pay_status === "paid");
    if (d.status === "pipeline" || d.status === "negotiating" || d.status === "neg") key = "neg";
    else if (paidRs.length >= (ps.length || 1)) { key = "paid"; receivedSum += amount; dateISO = paidRs[0].expected_date || d.created_at; }
    else {
      receivedSum += amount * 0; // not received
      outstandingSum += amount;
      expectedCount++;
      if (unpaid.some((p) => p.pay_status === "invoiced")) key = "inv";
      const due = (unpaid[0]?.expected_date ?? d.due_date ?? "");
      dateISO = due;
      if (due && due < today) {
        key = "over";
        late[d.brand] = Math.max(0, Math.round((+new Date(today) - +new Date(due)) / 86400000));
        over.push([d.brand, amount, due]);
      }
    }
    dealsOut.push([d.brand, key, dateISO, amount]);
  }

  const live = deals.filter((d) => d.active && d.status !== "archived");
  const stats = [
    { label: "Booked this year", value: fmt(live.reduce((s, d) => s + (d.value ?? 0), 0)), line: `Across ${live.length} signed deals`, fg: "#0A0A0A", warn: false },
    { label: "Received", value: fmt(receivedSum), line: `${paidCount(payments)} payments this year`, fg: "#0A0A0A", warn: false },
    { label: "Still owed", value: fmt(outstandingSum), line: `${expectedCount} payments expected`, fg: "#0A0A0A", warn: false },
    { label: "Late", value: fmt(over.reduce((s, o) => s + o[1], 0)), line: over.length ? `${over.length} payment${over.length === 1 ? "" : "s"} past due` : "Nothing is late", fg: over.length ? "#DC2626" : "#0A0A0A", warn: over.length > 0 },
  ];

  return {
    deals: dealsOut, late, over, stats,
    todos: todos.map((t) => ({ text: t.title, deal: "No deal", done: t.done })),
  };
}

function paidCount(payments: DBPayment[]): number {
  return payments.filter((p) => p.status === "received" || p.pay_status === "paid").length;
}
