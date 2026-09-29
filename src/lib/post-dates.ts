// Post dates: the single source of truth is the `content` table (rows with a
// non-null linked_deal_id). A deal's post dates are ALL such rows; its "Post
// date" (the column) is the next upcoming one that is not yet marked posted.
// deals.post_date is a read-only legacy column (write-guarded) that will be
// dropped in a later migration — nothing here writes it.
//
// "Posted" = content.status === 'published' (the calendar's delivered marker).
// A row that has gone live is posted; a planned row is not.

export type PostDate = {
  id?: string;        // content row id (present once saved)
  date: string;       // YYYY-MM-DD
  label: string;      // free-form label, e.g. "Story 2" (stored in content.title)
  kind?: string;      // structured kind (Reel/Story/...) -> content.post_type
  posted?: boolean;   // true when this row's content.status === 'published'
  /** Stable client key for React rows, created once when the row is added.
   *  NEVER derived from date/label/index — used as the map key so a keystroke
   *  can't remount the row and drop focus. Not written to the DB. */
  _rowKey?: string;
};

let _postRowSeq = 0;
/** New unsaved post-date row with a stable per-row key. Optionally seeds fields. */
export function newPostDateRow(seed?: Partial<PostDate>): PostDate {
  _postRowSeq += 1;
  return { date: "", label: "", _rowKey: `newpost-${_postRowSeq}`, ...seed };
}

export type ContentPost = {
  id: string;
  event_date: string;
  title: string | null;
  post_type: string | null;
  linked_deal_id?: string | null;
  status?: string | null;
};

/** Derive a deal's post dates from its content rows. NULL rows are skipped;
 *  unlabeled rows collapse to a plain date entry. Sorted by date ascending. */
export function dealPostDates(rows: ContentPost[] | null | undefined): PostDate[] {
  if (!rows) return [];
  const out: PostDate[] = [];
  for (const r of rows) {
    if (!r.event_date) continue;
    out.push({
      id: r.id,
      date: r.event_date.slice(0, 10),
      label: (r.title || "").trim(),
      kind: r.post_type || undefined,
      posted: r.status === "published",
      _rowKey: r.id ? `saved-${r.id}` : undefined,
    });
  }
  return out.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

/**
 * The info the Post date column needs, per the spec:
 *   - row[0] (top line): next upcoming post date NOT yet marked posted.
 *     If that date is in the past, it renders red (overdue), same as Pay by.
 *   - When every post is marked posted: row[0] = the most recent post date,
 *     and line2 = "All posted" (muted green).
 *   - Otherwise, for deals with 2+ dates, line2 = "N of M posted" (muted).
 *   - Single-post deals keep their current single line (no second line).
 */
export function postDateCell(
  rows: ContentPost[] | null | undefined,
  today?: Date
): {
  next: string | null;       // date to show on the top line (null when no dates)
  overdue: boolean;          // top-line date is in the past AND not marked posted
  allPosted: boolean;        // every dated post is marked posted
  line2: { kind: "all" | "progress"; text: string } | null;
  postedCount: number;
  totalCount: number;
  dates: PostDate[];
} {
  const dates = dealPostDates(rows);
  if (!dates.length) {
    return { next: null, overdue: false, allPosted: false, line2: null, postedCount: 0, totalCount: 0, dates: [] };
  }
  const t = (today ?? new Date()).toISOString().slice(0, 10);
  const unposted = dates.filter((d) => !d.posted);
  const postedCount = dates.length - unposted.length;
  const allPosted = unposted.length === 0;

  if (allPosted) {
    // Every post is marked posted → most recent date, "All posted" second line
    // (only when there are 2+, since single-post deals keep their one line).
    const mostRecent = dates[dates.length - 1].date;
    return {
      next: mostRecent, overdue: false, allPosted: true,
      line2: dates.length >= 2 ? { kind: "all", text: "All posted" } : null,
      postedCount, totalCount: dates.length, dates,
    };
  }

  // Next upcoming post date not yet marked posted. If it's already past, that's
  // the overdue (red) case — the next unposted date being behind schedule.
  const nextUnposted = unposted[0].date;
  const overdue = nextUnposted < t;
  return {
    next: nextUnposted, overdue, allPosted: false,
    line2: dates.length >= 2 ? { kind: "progress", text: `${postedCount} of ${dates.length} posted` } : null,
    postedCount, totalCount: dates.length, dates,
  };
}