// Post dates: the single source of truth is the `content` table (rows with a
// non-null linked_deal_id). A deal's post dates are ALL such rows; its "Post
// date" is the earliest upcoming one. deals.post_date is a read-only legacy
// column (write-guarded) that will be dropped in a later migration — nothing
// here writes it.

export type PostDate = {
  id?: string;        // content row id (present once saved)
  date: string;       // YYYY-MM-DD
  label: string;      // free-form label, e.g. "Story 2" (stored in content.title)
  kind?: string;      // structured kind (Reel/Story/...) -> content.post_type
};

export type ContentPost = {
  id: string;
  event_date: string;
  title: string | null;
  post_type: string | null;
};

/** Derive a deal's post dates from its content rows. NULL rows are skipped;
 *  unlabeled rows collapse to a plain date entry. */
export function dealPostDates(rows: ContentPost[] | null | undefined): PostDate[] {
  if (!rows) return [];
  const out: PostDate[] = [];
  for (const r of rows) {
    if (!r.event_date) continue;
    out.push({ id: r.id, date: r.event_date.slice(0, 10), label: (r.title || "").trim(), kind: r.post_type || undefined });
  }
  return out.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

/** Earliest upcoming post date (>= today). If every date is past, returns the
 *  latest one so the column never silently empties (a past date is usually a
 *  post that already went live, not a liability). Returns null when no dates. */
export function nextPostDate(rows: ContentPost[] | null | undefined, today?: Date): string | null {
  const dates = dealPostDates(rows);
  if (!dates.length) return null;
  const t = (today ?? new Date()).toISOString().slice(0, 10);
  const upcoming = dates.filter((d) => d.date >= t);
  const chosen = upcoming.length ? upcoming[0] : dates[dates.length - 1];
  return chosen.date;
}

/** "N of M"-style summary for the table column: returns the next date plus a
 *  "+N" count when there are additional dates. */
export function postDateSummary(rows: ContentPost[] | null | undefined, today?: Date): { next: string | null; extra: number } {
  const dates = dealPostDates(rows);
  const next = nextPostDate(rows, today);
  return { next, extra: next && dates.length > 1 ? dates.length - 1 : 0 };
}