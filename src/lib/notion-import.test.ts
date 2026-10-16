import test from "node:test";
import assert from "node:assert/strict";
import { paginate, runImport, type ImportRow, type InsertResult } from "./notion-import.ts";

/** A fake Notion database of `total` rows, served in pages of 100 with has_more. */
function stubNotion(total: number) {
  const calls: Array<{ start?: string }> = [];
  const fetchImpl = (async (_url: string, init: { body: string }) => {
    const body = JSON.parse(init.body) as { page_size: number; start_cursor?: string };
    calls.push({ start: body.start_cursor });
    const from = body.start_cursor ? Number(body.start_cursor) : 0;
    const slice = Array.from({ length: Math.min(100, total - from) }, (_, i) => {
      const n = from + i;
      return { id: `page-${n}`, properties: {} };
    });
    const next = from + slice.length;
    return {
      ok: true,
      status: 200,
      json: async () => ({ results: slice, has_more: next < total, next_cursor: next < total ? String(next) : null }),
    };
  }) as unknown as typeof fetch;
  return { fetchImpl, calls };
}

/** Emulates the deals table + its unique index on (user_id, notion_page_id). */
function makeStore() {
  const keys = new Set<string>();
  const insert = (userId: string) => async (row: ImportRow): Promise<InsertResult> => {
    await new Promise((r) => setTimeout(r, 0)); // let concurrent runs interleave
    const key = `${userId}|${row.notionId}`;
    if (keys.has(key)) return { error: { code: "23505" } }; // ON CONFLICT DO NOTHING
    keys.add(key);
    return { error: null };
  };
  const knownFor = (userId: string) =>
    new Set([...keys].filter((k) => k.startsWith(`${userId}|`)).map((k) => k.split("|")[1]));
  return { keys, insert, knownFor, count: () => keys.size };
}

function rowsFor(total: number): ImportRow[] {
  return Array.from({ length: total }, (_, i) => ({
    notionId: `page-${i}`,
    brand: `Brand ${i}`,
    amount: 1000,
    post: "2026-11-01",
    status: "active",
  }));
}

test("150 rows over 2 pages are all read (pagination walks has_more)", async () => {
  const { fetchImpl, calls } = stubNotion(150);
  const rows = await paginate("token", "db1", fetchImpl);
  assert.equal(rows.length, 150, "every row comes back, not just the first 100");
  assert.equal(calls.length, 2, "two requests: 100 rows, then the remaining 50");
  assert.equal(calls[0].start, undefined);
  assert.equal(calls[1].start, "100");
});

test("first import takes all 150", async () => {
  const store = makeStore();
  const out = await runImport(rowsFor(150), store.knownFor("u1"), store.insert("u1"));
  assert.equal(out.imported, 150);
  assert.equal(out.skipped, 0);
  assert.equal(out.failed.length, 0);
  assert.equal(out.booked, 150 * 1000);
  assert.equal(store.count(), 150);
});

test("running it again imports 0 and skips all 150", async () => {
  const store = makeStore();
  await runImport(rowsFor(150), store.knownFor("u1"), store.insert("u1"));
  const again = await runImport(rowsFor(150), store.knownFor("u1"), store.insert("u1"));
  assert.equal(again.imported, 0);
  assert.equal(again.skipped, 150);
  assert.equal(again.failed.length, 0);
  assert.equal(store.count(), 150, "no repeats were created");
});

test("two imports at the same time still leave 150 deals, not 300", async () => {
  const store = makeStore();
  // Both start from an EMPTY picture of what exists — the worst case.
  const [a, b] = await Promise.all([
    runImport(rowsFor(150), new Set<string>(), store.insert("u1")),
    runImport(rowsFor(150), new Set<string>(), store.insert("u1")),
  ]);
  assert.equal(a.imported + b.imported, 150, "between them they landed exactly 150");
  assert.equal(a.imported + b.imported + a.skipped + b.skipped, 300, "every row was accounted for");
  assert.equal(store.count(), 150);
  assert.equal(a.failed.length + b.failed.length, 0, "the losing side skips, it does not fail");
});
