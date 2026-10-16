import test from "node:test";
import assert from "node:assert/strict";
import { resolveLook, parseStored, DEFAULT_LOOK } from "./look.ts";

test("an old localStorage value does not beat the profile", () => {
  const got = resolveLook({ theme: "sand", mode: "dark" }, { theme: "editorial", mode: "light" });
  assert.equal(got.theme, "editorial", "the profile wins");
  assert.equal(got.mode, "light");
});

test("no localStorage at all still loads the profile theme", () => {
  const got = resolveLook(null, { theme: "mac", mode: "dark", sidebar: "icons" });
  assert.deepEqual(got, { theme: "mac", mode: "dark", sidebar: "icons" });
});

test("no localStorage and no profile falls back to Studio", () => {
  assert.deepEqual(resolveLook(null, null), DEFAULT_LOOK);
  assert.deepEqual(resolveLook(undefined, undefined), { theme: "studio", mode: "light", sidebar: "expanded" });
});

test("an unknown theme falls back to Studio", () => {
  assert.equal(resolveLook(null, { theme: "neon" }).theme, "studio");
  assert.equal(resolveLook({ theme: "neon" }, null).theme, "studio");
  assert.equal(resolveLook(null, { theme: "" }).theme, "studio");
  assert.equal(resolveLook(null, { theme: 42 }).theme, "studio");
});

test("the legacy 'midnight' theme maps to dark mode with the previous theme", () => {
  const got = resolveLook({ theme: "midnight", prev: "sand" }, null);
  assert.equal(got.theme, "sand");
  assert.equal(got.mode, "dark");
});

test("'midnight' with no usable previous theme lands on Studio, still dark", () => {
  const got = resolveLook({ theme: "midnight" }, null);
  assert.equal(got.theme, "studio");
  assert.equal(got.mode, "dark");
});

test("an unknown mode or sidebar falls back, not through", () => {
  const got = resolveLook(null, { theme: "sand", mode: "sepia", sidebar: "wide" });
  assert.equal(got.mode, "light");
  assert.equal(got.sidebar, "expanded");
});

test("malformed stored JSON never throws", () => {
  assert.deepEqual(parseStored("{not json"), {});
  assert.deepEqual(parseStored(""), {});
  assert.deepEqual(parseStored(null), {});
  assert.deepEqual(parseStored('"a string"'), {}, "a non-object JSON value is ignored");
  assert.deepEqual(resolveLook(parseStored("{not json"), { theme: "studio" }, null).theme, "studio");
});

test("every valid theme round-trips", () => {
  for (const t of ["studio", "sand", "mac", "stationery", "editorial"]) {
    assert.equal(resolveLook(null, { theme: t }).theme, t);
  }
});
