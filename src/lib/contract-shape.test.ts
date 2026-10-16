import test from "node:test";
import assert from "node:assert/strict";
import { shapeContract, grouped } from "./contract-shape.ts";

/** A full contract, as the reader returns it. */
const FULL = {
  brand: "Haleon Centrum",
  deliverable: "2 Instagram Reels + 3 Stories",
  value_total: 6000,
  post_dates: [{ date: "2026-11-02", label: "Reel" }, { date: "2026-11-09", label: "Story" }],
  rep_name: "Ana Ruiz",
  rep_email: "ana@haleon.com",
  platforms: "Instagram, TikTok",
  payment_structure: { kind: "split", upfront_pct: 50 },
  exclusivity_days: 30,
  extras: [
    { kind: "bonus", amount: 1000, condition: "the Reel passes 100K views" },
    { kind: "commission", rate: 10, on: "sales with code CAMBO10" },
  ],
};

test("the four found lines are in the required order", () => {
  const { found } = shapeContract(FULL);
  assert.equal(found.length, 4, "exactly four lines");
  assert.match(found[0], /Haleon Centrum/, "1st = brand and rep");
  assert.match(found[0], /Ana Ruiz/);
  assert.match(found[1], /\$6,000/, "2nd = amount and terms");
  assert.match(found[1], /Split/);
  assert.match(found[2], /2026-11-02/, "3rd = post date and deliverables");
  assert.match(found[2], /2 Instagram Reels/);
  assert.match(found[3], /100K views/, "4th = bonus and commission");
  assert.match(found[3], /CAMBO10/);
});

test("missing lines come back as '' not as a placeholder", () => {
  const { found, count, few } = shapeContract({});
  assert.deepEqual(found, ["", "", "", ""]);
  assert.equal(count, 0);
  assert.equal(few, true, "nothing found is 'only a few'");
});

test("fields are the deal form's own shape", () => {
  const { fields } = shapeContract(FULL);
  assert.equal(fields.brand, "Haleon Centrum");
  assert.equal(fields.post, "2026-11-02", "post is the FIRST stated date, as an ISODate");
  assert.deepEqual(fields.plats, { Instagram: true, TikTok: true });
  assert.equal(fields.amt, "6,000", "amt is grouped with a comma");
  assert.equal(fields.paid, "split");
  assert.equal(fields.rep, "Ana Ruiz");
  assert.equal(fields.repEmail, "ana@haleon.com");
});

test("amount with no cents and with cents both group correctly", () => {
  assert.equal(grouped(6000), "6,000");
  assert.equal(grouped(1234567), "1,234,567");
  assert.equal(grouped(6000.5), "6,000.5");
  assert.equal(grouped(null), "", "no amount -> ''");
  assert.equal(grouped("nonsense"), "", "unparseable -> ''");
});

test("paid falls back to 'once' when the contract does not state a structure", () => {
  assert.equal(shapeContract({ brand: "X" }).fields.paid, "once");
  assert.equal(shapeContract({ payment_structure: null }).fields.paid, "once");
  assert.equal(shapeContract({ payment_structure: { kind: "monthly" } }).fields.paid, "monthly");
  assert.equal(shapeContract({ payment_structure: { kind: "whenever" } }).fields.paid, "once", "an unknown kind is not trusted");
});

test("extras carry [tag, text, value] for Bonus, Commission, Deliverables and Usage", () => {
  const { extras } = shapeContract(FULL);
  const tags = extras.map(([tag]) => tag);
  assert.ok(tags.includes("Bonus"));
  assert.ok(tags.includes("Commission"));
  assert.ok(tags.includes("Deliverables"));
  assert.ok(tags.includes("Usage"));
  const bonus = extras.find(([tag]) => tag === "Bonus")!;
  assert.equal(bonus[1], "the Reel passes 100K views", "text says what triggers it");
  assert.equal(bonus[2], "$1,000", "value is the money");
  const commission = extras.find(([tag]) => tag === "Commission")!;
  assert.equal(commission[2], "10%");
  const usage = extras.find(([tag]) => tag === "Usage")!;
  assert.match(usage[1], /30 days/);
});

test("count adds up the details and few is only true for a thin contract", () => {
  const full = shapeContract(FULL);
  assert.ok(full.count >= 8, `a rich contract finds many details (got ${full.count})`);
  assert.equal(full.few, false);

  const thin = shapeContract({ brand: "Acme" });
  assert.equal(thin.count, 1);
  assert.equal(thin.few, true);
});

test("a stated deliverable counts once, and is not double counted by its extra row", () => {
  const withDeliv = shapeContract({ brand: "Acme", deliverable: "1 Reel" });
  const without = shapeContract({ brand: "Acme" });
  assert.equal(withDeliv.count, without.count + 1, "the deliverable is one detail, counted in line 3");
  // It appears as an extra row too, but that row must not be counted again.
  assert.equal(withDeliv.extras.filter(([tag]) => tag === "Deliverables").length, 1);
  assert.equal(without.extras.filter(([tag]) => tag === "Deliverables").length, 0);
});

test("a bad post date is ignored rather than passed through", () => {
  assert.equal(shapeContract({ brand: "X", post_dates: [{ date: "sometime" }] }).fields.post, "");
  assert.equal(shapeContract({ brand: "X", post_dates: [] }).fields.post, "");
  assert.equal(shapeContract({ brand: "X", post_dates: "nope" }).fields.post, "");
});
