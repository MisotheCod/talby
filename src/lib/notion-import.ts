/**
 * notion-import.ts — the pure half of the Notion import.
 *
 * Kept free of env/config and of the Supabase client so it can be unit-tested
 * (src/lib/notion-import.test.ts) with a stubbed fetch and an in-memory store
 * that emulates the unique index on (user_id, notion_page_id).
 */

export const NOTION_VERSION = "2022-06-28";

export function notionHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
  };
}

export class NotionError extends Error {
  code: string;
  constructor(code: string, message?: string) {
    super(message ?? code);
    this.code = code;
  }
}

export type RawRow = { id?: string; properties?: Record<string, unknown> };

/**
 * Read EVERY row of a database. Notion caps a query at 100 rows, so walk
 * next_cursor until has_more is false. Guarded so a bad cursor cannot loop.
 */
export async function paginate(
  token: string,
  databaseId: string,
  fetchImpl: typeof fetch = fetch
): Promise<RawRow[]> {
  const out: RawRow[] = [];
  let cursor: string | undefined;
  for (let page = 0; page < 200; page++) {
    const res = await fetchImpl(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: "POST",
      headers: notionHeaders(token),
      body: JSON.stringify({ page_size: 100, ...(cursor ? { start_cursor: cursor } : {}) }),
    });
    if (!res.ok) throw new NotionError(res.status === 401 ? "notion_lost" : "fetch_failed", `Notion query failed (${res.status})`);
    const data = await res.json();
    out.push(...(data?.results ?? []));
    if (!data?.has_more) break;
    cursor = data?.next_cursor ?? undefined;
    if (!cursor) break;
  }
  return out;
}

export type ImportRow = {
  notionId: string;
  brand: string;
  amount: number;
  post: string;
  status: string;
  rep?: string;
};

export type Failed = { id: string; brand: string; amount: number; reason: string };
export type InsertResult = { error?: { code?: string; message?: string } | null };

export type ImportTotals = { imported: number; skipped: number; failed: Failed[]; booked: number };

/**
 * Import mapped rows, skipping anything already known and anything the insert
 * reports as a conflict. `known` is the set of notion ids already stored for the
 * user; `insert` performs the write with ON CONFLICT (user_id, notion_page_id)
 * DO NOTHING, so two runs at once can only ever land one row per page.
 */
export async function runImport(
  rows: ImportRow[],
  known: Set<string>,
  insert: (row: ImportRow) => Promise<InsertResult>
): Promise<ImportTotals> {
  const failed: Failed[] = [];
  let imported = 0;
  let skipped = 0;
  let booked = 0;

  for (const row of rows) {
    if (!row.notionId) {
      failed.push({ id: "", brand: row.brand, amount: row.amount, reason: "That row had no Notion id." });
      continue;
    }
    if (known.has(row.notionId)) {
      skipped++;
      continue;
    }
    if (!row.brand) {
      failed.push({ id: row.notionId, brand: "", amount: row.amount, reason: "No brand name on that row." });
      continue;
    }

    const { error } = await insert(row);
    if (error) {
      // A unique-violation means another run landed it first — that is a skip, not a failure.
      if (error.code === "23505") {
        known.add(row.notionId);
        skipped++;
        continue;
      }
      failed.push({ id: row.notionId, brand: row.brand, amount: row.amount, reason: error.message || "Talby could not save that row." });
      continue;
    }
    known.add(row.notionId);
    imported++;
    if (row.status === "active") booked += row.amount;
  }

  return { imported, skipped, failed, booked };
}

/** Parse "$6,000" / "6000" / "6,000.50" to a number; NaN when it is not one. */
export function money(v: string | undefined): number {
  if (!v) return NaN;
  const n = Number(String(v).replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(n) ? n : NaN;
}
