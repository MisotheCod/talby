import { test } from "node:test";
import assert from "node:assert/strict";
import { runSave } from "./save.ts";

/** Redesign v2, backend upgrade 2: the shared save helper must NEVER let a
 *  write failure go silent — it returns null AND raises the error toast with a
 *  Try-again action (here asserted via the onError seam). Success returns the
 *  Response and no error. */

function abortedFetch(): Promise<Response> {
  return Promise.reject(new TypeError("Failed to fetch"));
}
function jsonResp(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status });
}

test("runSave: network failure → returns null, raises offline toast with Try again", async () => {
  const calls: { msg: string; retry: boolean; ctx: string | undefined }[] = [];
  const out = await runSave(() => abortedFetch(), {
    context: "Creating the deal",
    retry: () => {},
    onError: (msg, retry, ctx) => calls.push({ msg, retry: !!retry, ctx }),
  });
  assert.equal(out, null);
  assert.equal(calls.length, 1);
  assert.match(calls[0].msg, /Could not reach the server/);
  assert.equal(calls[0].retry, true, "a working Try-again action must be attached");
  assert.equal(calls[0].ctx, "Creating the deal");
});

test("runSave: 500 with server message → returns null, raises that message + Try again", async () => {
  const calls: { msg: string; retry: boolean }[] = [];
  const out = await runSave(() => jsonResp(500, { error: "boom" }), {
    retry: () => {},
    onError: (msg, retry) => calls.push({ msg, retry: !!retry }),
  });
  assert.equal(out, null);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].msg, "boom");
  assert.equal(calls[0].retry, true);
});

test("runSave: non-JSON 500 → returns null, raises fallback message", async () => {
  const calls: string[] = [];
  const out = await runSave(() => Promise.resolve(new Response("oops", { status: 500 })), {
    onError: (msg) => calls.push(msg),
  });
  assert.equal(out, null);
  assert.match(calls[0], /Something went wrong/);
});

test("runSave: success → returns the Response and does NOT raise an error toast", async () => {
  let raised = false;
  const ok = await runSave(() => jsonResp(200, { ok: true }), {
    onError: () => { raised = true; },
  });
  assert.equal(ok?.status, 200);
  assert.equal(raised, false, "no toast on success");
});

test("runSave: the attached retry action is handed to the caller to re-run", async () => {
  let attempts = 0;
  let ranRetry = false;
  const retry = () => { ranRetry = true; };
  await runSave(
    () => { attempts++; return Promise.reject(new Error("down")); },
    { retry, onError: (_m, r) => { r?.(); } }
  );
  assert.equal(attempts, 1, "runSave attempted once and returned null");
  assert.equal(ranRetry, true, "the caller's retry action was invoked via the toast");
});
