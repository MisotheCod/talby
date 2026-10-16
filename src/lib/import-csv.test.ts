import test from "node:test";
import assert from "node:assert/strict";
import { parseCsv, buildPreview, selectRows, applyMap, knownKeys, dealKey } from "./csv-import.ts";
import { guessField } from "./import-fields.ts";

const CSV = [
  "Brand,Post date,Status,Amount,Rep email",
  'Glow Co,2026-11-02,Active,"6,000",ana@glow.com',
  "Peak Tea,2026-11-15,Negotiating,2500,sam@peak.com",
  '"Bright, Co",2026-12-01,Active,1200,lee@bright.com',
].join("\r\n");

test("parseCsv handles quoted fields, commas inside quotes and CRLF", () => {
  const table = parseCsv(CSV);
  assert.equal(table.length, 4);
  assert.deepEqual(table[0], ["Brand", "Post date", "Status", "Amount", "Rep email"]);
  assert.equal(table[1][3], "6,000", "a comma inside quotes stays part of the value");
  assert.equal(table[3][0], "Bright, Co", "a quoted brand keeps its comma");
});

test("guessField picks the right Talby field for each column", () => {
  assert.equal(guessField("Brand"), "brand");
  assert.equal(guessField("Post date"), "post");
  assert.equal(guessField("Status"), "status");
  assert.equal(guessField("Amount"), "amt");
  assert.equal(guessField("Rep email"), "repEmail");
  assert.equal(guessField("Pay by"), "payby");
  assert.equal(guessField("Platforms"), "plats");
  assert.equal(guessField("Notes"), "notes");
  assert.equal(guessField("Random"), "skip");
});

test("step one returns uploadId-shaped cols with a sample and a field guess", () => {
  const p = buildPreview(parseCsv(CSV), new Set());
  assert.equal(p.total, 3);
  assert.equal(p.cols[0].name, "Brand");
  assert.equal(p.cols[0].sample, "Glow Co");
  assert.equal(p.cols[0].field, "brand");
  assert.equal(p.cols[3].field, "amt");
  assert.equal(p.cols[3].sample, "6,000");
  assert.equal(p.rows.length, 3);
  assert.equal(p.rows[0].id, "2", "row ids are 1-based and count the header row");
  assert.equal(p.rows[0].amount, 6000, "the amount is a number, not a string");
  assert.equal(p.rows[0].post, "2026-11-02");
  assert.equal(p.issues.length, 0);
});

test("a row with no brand is left out and gets a plain issue sentence", () => {
  const csv = ["Brand,Post date,Amount", "Glow Co,2026-11-02,6000", ",2026-11-03,900"].join("\n");
  const p = buildPreview(parseCsv(csv), new Set());
  assert.equal(p.total, 2, "total still counts every data row");
  assert.equal(p.rows.length, 1, "but the brandless row is not offered");
  assert.equal(p.issues.length, 1);
  assert.match(p.issues[0], /Row 3 has no brand, so it stays out\./);
});

test("a row with no readable post date is flagged as an issue", () => {
  const csv = ["Brand,Post date,Amount", "Glow Co,soon,6000"].join("\n");
  const p = buildPreview(parseCsv(csv), new Set());
  assert.equal(p.rows[0].noDate, true);
  assert.match(p.issues[0], /Row 2 has no post date/);
});

test("repeat is true when we already hold the same brand and post date", () => {
  const known = knownKeys([{ brand: "Glow Co", post_date: "2026-11-02" }]);
  const p = buildPreview(parseCsv(CSV), known);
  assert.equal(p.rows[0].repeat, true, "Glow Co on 2026-11-02 is already a deal");
  assert.equal(p.rows[1].repeat, false, "Peak Tea is new");
});

test("skipRepeats off keeps repeats in the run", () => {
  const p = buildPreview(parseCsv(CSV), knownKeys([{ brand: "Glow Co", post_date: "2026-11-02" }]));
  assert.equal(selectRows(p.rows, { skipRepeats: true }).skipped, 1);
  assert.equal(selectRows(p.rows, { skipRepeats: true }).todo.length, 2);
  assert.equal(selectRows(p.rows, { skipRepeats: false }).todo.length, 3);
  assert.equal(selectRows(p.rows, { skipRepeats: false }).skipped, 0);
});

test("Try again with rowIds retries only those rows, and totals add up across tries", () => {
  const p = buildPreview(parseCsv(CSV), new Set());
  const first = selectRows(p.rows, { rowIds: null, skipRepeats: true });
  assert.equal(first.todo.length, 3, "the first run takes every row");

  // Two of the three failed on the server; Try again sends only those ids back.
  const retry = selectRows(p.rows, { rowIds: ["2", "4"], skipRepeats: true });
  assert.equal(retry.todo.length, 2);
  assert.deepEqual(retry.todo.map((r) => r.id), ["2", "4"]);
});

test("applyMap reads a raw row through the user's mapping", () => {
  const table = parseCsv(CSV);
  const f = applyMap(table[1], table[0], { Brand: "brand", "Post date": "post", Amount: "amt", "Rep email": "repEmail" });
  assert.equal(f.brand, "Glow Co");
  assert.equal(f.post, "2026-11-02");
  assert.equal(f.amt, 6000);
  assert.equal(f.rep, "", "a column mapped to repEmail does not fill rep");
});

test("dealKey is case and whitespace insensitive", () => {
  assert.equal(dealKey(" Glow Co ", "2026-11-02"), dealKey("glow co", "2026-11-02"));
});
