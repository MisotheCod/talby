"use client";

/* Period model for the income summary.
   A period is a stable key + a matches() predicate. Options are derived from
   the received payment dates so only periods containing data are offered. */

export type PeriodKey =
  | { kind: "ytd" }
  | { kind: "this_quarter" }
  | { kind: "this_month" }
  | { kind: "all" }
  | { kind: "quarter"; year: number; q: number } // q: 1-4
  | { kind: "month"; year: number; month: number } // month: 1-12
  | { kind: "year"; year: number };

export type Period = {
  key: PeriodKey;
  label: string;   // primary label (list + trigger)
  detail?: string; // muted right text, e.g. "Jul to Sep"
  group: "quick" | "quarter" | "month" | "year";
  matches: (iso: string) => boolean;
};

export function keyStr(k: PeriodKey): string {
  switch (k.kind) {
    case "ytd": return "ytd";
    case "this_quarter": return "this-quarter";
    case "this_month": return "this-month";
    case "all": return "all";
    case "quarter": return `q${k.q}-${k.year}`;
    case "month": return `${k.year}-${String(k.month).padStart(2, "0")}`;
    case "year": return `${k.year}`;
  }
}

function monName(m: number): string {
  return new Date(2020, m - 1, 1).toLocaleDateString("en-US", { month: "short" });
}
function qLabel(q: number, year: number): string { return `Q${q} ${year}`; }
function qRange(q: number, year: number): string {
  const first = monName((q - 1) * 3 + 1);
  const last = monName((q - 1) * 3 + 3);
  return `${first} to ${last}`;
}
function monthLabel(year: number, month: number): string {
  return new Date(year, month - 1, 1).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function periodLabel(k: PeriodKey): string {
  switch (k.kind) {
    case "ytd": return "Year to date";
    case "this_quarter": return "This quarter";
    case "this_month": return "This month";
    case "all": return "All time";
    case "quarter": return qLabel(k.q, k.year);
    case "month": return monthLabel(k.year, k.month);
    case "year": return `${k.year}`;
  }
}

export function periodDetail(k: PeriodKey): string | undefined {
  return k.kind === "quarter" ? qRange(k.q, k.year) : undefined;
}

function quarterOf(d: string): { q: number; year: number } {
  return { q: Math.ceil(Number(d.slice(5, 7)) / 3), year: Number(d.slice(0, 4)) };
}

/** Newest-first helper. */
function desc<T extends string | number>(arr: T[]): T[] {
  return [...arr].sort((a, b) => (typeof a === "number" ? b as number : Number(b)) - (typeof a === "number" ? a as number : Number(a)));
}

/** Build the full option list from the received payment dates. Only periods
    containing data are offered; the current year-to-date (default) is always
    included so the trigger's active item is never missing from the menu. */
export function buildPeriods(dates: string[], defaultKey: PeriodKey): Period[] {
  const year = new Date().getFullYear();
  const mon = new Date().getMonth() + 1;
  const qNow = Math.ceil(mon / 3);
  const mStr = (y: number, m: number) => `${y}-${String(m).padStart(2, "0")}`;

  const monthsWithData = new Set<string>();
  const yearsWithData = new Set<number>();
  const quartersWithData = new Set<string>();
  for (const d of dates) {
    monthsWithData.add(d.slice(0, 7));
    yearsWithData.add(Number(d.slice(0, 4)));
    const { q, year: y } = quarterOf(d);
    quartersWithData.add(`${y}-Q${q}`);
  }

  const ytdMatch = (iso: string) => iso.startsWith(String(year));
  const tqMatch = (iso: string) => { const q = quarterOf(iso); return q.year === year && q.q === qNow; };
  const tmMatch = (iso: string) => iso.slice(0, 7) === mStr(year, mon);
  const allMatch = () => true;

  const out: Period[] = [];

  // Quick group. "This month" and "This quarter" are current-period anchors and
  // always show (a creator navigates to them to see the current window even if
  // nothing has landed yet). Only HISTORICAL periods are gated on having data —
  // someone who started in August shouldn't see Q1. "Year to date" and
  // "All time" are always present (default + catch-all).
  out.push({ key: { kind: "ytd" }, label: "Year to date", group: "quick", matches: ytdMatch });
  out.push({ key: { kind: "this_month" }, label: "This month", detail: monthLabel(year, mon), group: "quick", matches: tmMatch });
  out.push({ key: { kind: "this_quarter" }, label: "This quarter", detail: qRange(qNow, year), group: "quick", matches: tqMatch });
  out.push({ key: { kind: "all" }, label: "All time", group: "quick", matches: allMatch });

  // Quarters, newest first
  for (const qk of desc([...quartersWithData])) {
    // qk is "YYYY-Qq" — split on "-Q" so the number never includes the "Q"
    // letter (Number("Q3") = NaN, which produced "Invalid Date" ranges).
    const dashQ = qk.indexOf("-Q");
    const y = Number(qk.slice(0, dashQ));
    const qq = Number(qk.slice(dashQ + 2));
    const m = (iso: string) => { const c = quarterOf(iso); return c.year === y && c.q === qq; };
    out.push({ key: { kind: "quarter", year: y, q: qq }, label: qLabel(qq, y), detail: qRange(qq, y), group: "quarter", matches: m });
  }

  // Months, newest first
  for (const mk of desc([...monthsWithData])) {
    const [y, m] = mk.split("-").map(Number);
    out.push({ key: { kind: "month", year: y, month: m }, label: monthLabel(y, m), group: "month", matches: (iso) => iso.slice(0, 7) === mk });
  }

  // Years, newest first
  for (const y of desc([...yearsWithData])) {
    out.push({ key: { kind: "year", year: y }, label: `${y}`, group: "year", matches: (iso) => iso.slice(0, 4) === String(y) });
  }

  // Ensure the active (default) period is always present even if it has no data.
  const present = new Set(out.map((p) => keyStr(p.key)));
  if (!present.has(keyStr(defaultKey))) {
    const label = periodLabel(defaultKey);
    let matches: (iso: string) => boolean;
    switch (defaultKey.kind) {
      case "ytd": matches = ytdMatch; break;
      case "this_quarter": matches = tqMatch; break;
      case "this_month": matches = tmMatch; break;
      case "quarter": { const { year: y, q } = defaultKey; matches = (iso) => { const c = quarterOf(iso); return c.year === y && c.q === q; }; break; }
      case "month": { const { year: y, month } = defaultKey; matches = (iso) => iso.slice(0, 7) === mStr(y, month); break; }
      default: matches = allMatch;
    }
    out.unshift({ key: defaultKey, label, group: "quick", matches });
  }

  return out;
}

/** Resolve the initial period: year to date if it has data, else newest period. */
export function defaultPeriod(dates: string[]): PeriodKey {
  const year = new Date().getFullYear();
  if (dates.some((d) => d.startsWith(String(year)))) return { kind: "ytd" };
  if (dates.length) {
    const newest = desc(dates)[0];
    if (newest.length > 7) return { kind: "month", year: Number(newest.slice(0, 4)), month: Number(newest.slice(5, 7)) };
    return { kind: "year", year: Number(newest.slice(0, 4)) };
  }
  return { kind: "all" };
}