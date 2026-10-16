import test from "node:test";
import assert from "node:assert/strict";
import { showWelcome, deriveIdentity } from "./account-gate.ts";

/* ------------------------------- Welcome gate ------------------------------- */

test("an account with deals and no tour_seen lands on Overview, not Welcome", () => {
  assert.equal(showWelcome({ deals: 26, tourSeen: false }), false);
  assert.equal(showWelcome({ deals: 1, tourSeen: null }), false);
  assert.equal(showWelcome({ deals: 33, tourSeen: undefined }), false);
});

test("Welcome shows only for a genuinely new account", () => {
  assert.equal(showWelcome({ deals: 0, tourSeen: false }), true);
  assert.equal(showWelcome({ deals: 0, tourSeen: null }), true);
  assert.equal(showWelcome({ deals: 0, tourSeen: undefined }), true);
});

test("a new account that has seen the tour goes straight to Overview", () => {
  assert.equal(showWelcome({ deals: 0, tourSeen: true }), false);
});

/* ------------------------------ Identity fallback --------------------------- */

test("the profile handler wins when it is set", () => {
  const id = deriveIdentity({ handler: "chanelica.r", email: "chanelicarobinson@gmail.com" });
  assert.equal(id.handle, "chanelica.r");
  assert.equal(id.name, "Chanelica");
});

test("no handler falls back to the account's display name, not a sample", () => {
  const id = deriveIdentity({ handler: "", fullName: "Ana Ruiz", email: "ana@brand.com" });
  assert.equal(id.handle, "ana.ruiz");
  assert.equal(id.name, "Ana");
  assert.notEqual(id.name.toLowerCase(), "junobakes");
});

test("no handler and no display name falls back to the email name", () => {
  const id = deriveIdentity({ handler: null, fullName: null, email: "jordan.lee@brand.com" });
  assert.equal(id.handle, "jordan.lee");
  assert.equal(id.name, "Jordan");
});

test("a timestamped test email still yields a human name", () => {
  const id = deriveIdentity({ email: "shot.1791956719868@talby.test" });
  assert.equal(id.handle, "shot");
  assert.equal(id.name, "Shot");
});

test("it never returns a design sample name", () => {
  for (const input of [
    {},
    { handler: "", fullName: "", email: "" },
    { handler: "junobakes" },
    { handler: "demo.creator" },
    { fullName: "Creator" },
  ]) {
    const id = deriveIdentity(input);
    assert.ok(!["junobakes", "demo.creator", "demo", "creator"].includes(id.handle), `handle leaked a sample: ${id.handle}`);
    assert.ok(!["junobakes", "demo.creator", "demo", "creator"].includes(id.name.toLowerCase()), `name leaked a sample: ${id.name}`);
  }
});

test("a real email always produces a non-empty handle", () => {
  const id = deriveIdentity({ handler: null, fullName: null, email: "cambo@example.com" });
  assert.ok(id.handle.length > 0);
  assert.ok(id.name.length > 0);
});

test("sample names are skipped in favour of a later, real source", () => {
  const id = deriveIdentity({ handler: "junobakes", email: "real.person@brand.com" });
  assert.equal(id.name, "Real", "the design sample is ignored, the email name is used");
});
