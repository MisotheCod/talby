import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { makeOnAction } from "./actions.ts";

/** Every action type the boards can fire (from ACTIONS.md), excluding doc noise. */
const CATALOG = [
  "account.delete", "assistant.ask", "billing.open", "data.deleteAll", "data.reload",
  "deal.archive", "deal.create", "deal.delete", "deal.duplicate", "deal.markPaid",
  "deal.restore", "deal.setPayBy", "deal.unarchive", "deal.update", "deals.bulk",
  "deals.import", "event.create", "event.setDone", "idea.create", "idea.delete",
  "idea.restore", "idea.star", "look.update", "notifications.update", "notion.disconnect",
  "password.update", "payment.markPaid", "payment.record", "payment.setDate", "payment.setStatus", "photo.remove", "photo.update",
  "profile.update", "todo.create", "todo.delete", "todo.restore", "todo.setDone",
];
/** Handled before the switch (pre-guard fast paths), so no case needed. */
const PRE_SWITCH = new Set(["look.update", "data.reload"]);

const ROOT = process.cwd();
const src = readFileSync(join(ROOT, "src/lib/talby/actions.ts"), "utf8");
const cases = new Set([...src.matchAll(/case\s+"([a-z]+\.[a-zA-Z]+)":/g)].map((m) => m[1]));

test("every ACTIONS.md action type has a case (or a pre-switch handler)", () => {
  const missing = CATALOG.filter((t) => !cases.has(t) && !PRE_SWITCH.has(t));
  assert.deepEqual(missing, [], "action types with no handler: " + missing.join(", "));
});

test("no app page still defines its own inline onAction", () => {
  const root = join(ROOT, "src/app/app");
  const pages = ["page.tsx", "deals/page.tsx", "calendar/page.tsx", "notes/page.tsx",
    "ideas/page.tsx", "payments/page.tsx", "settings/page.tsx"].map((p) => join(root, p));
  const offenders = pages.filter((p) => existsSync(p) && /const onAction\s*=\s*async/.test(readFileSync(p, "utf8")));
  assert.deepEqual(offenders, [], "pages still defining their own onAction: " + offenders.join(", "));
});

function mockSupabase() {
  const calls: { method: string; args: unknown[] }[] = [];
  const chain = new Proxy({}, {
    get(_, prop) {
      if (prop === "then") return undefined;
      if (typeof prop === "symbol") return undefined;
      return (...args: unknown[]) => { (calls as { method: string; args: unknown[] }[]).push({ method: String(prop), args }); return chain; };
    },
  });
  return {
    supabase: {
      auth: { getUser: async () => ({ data: { user: { id: "u1" } }, error: null }) },
      from: () => chain,
    },
    calls,
  };
}

test("unhandled action REJECTS (board shows error toast), never returns quietly", async () => {
  const { supabase } = mockSupabase();
  const onAction = makeOnAction(supabase as never, async () => {});
  await assert.rejects(
    () => onAction("this.doesNotExist", {}),
    (e) => /Unhandled onAction/.test((e as Error).message),
    "unknown action must reject"
  );
});

test("deal.create maps amt string and display status to DB values", async () => {
  const { supabase } = mockSupabase();
  let posted: unknown = null;
  (globalThis as { fetch?: unknown }).fetch = async (_u: string, opts: { body?: string }) => {
    posted = JSON.parse(opts?.body ?? "{}");
    return { ok: true, json: async () => ({ deal: { id: "d1" } }) };
  };
  const onAction = makeOnAction(supabase as never, async () => {});
  const ok = await onAction("deal.create", {
    kind: "deal", contract: null, plan: [{ label: "Full payment, 30 days after your post date", amount: 2400, date: "2026-11-15" }],
    form: { brand: "B", amt: "2,400", paid: "once", status: "Active", rep: "R", repEmail: "r@x" },
  });
  assert.equal(ok, true);
  const body = posted as { brand: string; payload: Record<string, unknown> };
  assert.equal(body.brand, "B");
  assert.equal(body.payload.value, 2400, "amt '2,400' must parse to 2400");
  assert.equal(body.payload.status, "active", "display 'Active' must map to 'active'");
  assert.equal(body.payload.payment_structure, "once");
});

test("deal.update normalizes the display status value", async () => {
  const { supabase, calls } = mockSupabase();
  const onAction = makeOnAction(supabase as never, async () => {});
  await onAction("deal.update", { id: "1", changes: { brand: "B", status: "Negotiating", value: 100 } });
  const upd = calls.find((c) => c.method === "update");
  assert.ok(upd, "deal.update must call supabase update");
  const patch = (upd.args[0] as Record<string, unknown>);
  assert.equal(patch.status, "pipeline", "display 'Negotiating' must map to the DB value 'pipeline'");
});

test("payment.markPaid resolves by brand+amount when no id (overview Paid button)", () => {
  // The overview "Needs your attention" Paid button emits { brand, amount } with no
  // payment id. If the markPaid case stops resolving by brand/amount, marking a late
  // payment paid from the overview registers nothing. Guard the fallback.
  const src = readFileSync(join(ROOT, "src/lib/talby/actions.ts"), "utf8");
  const m = src.match(/case\s+"payment\.markPaid":\s*\{([\s\S]*?)\n\s*case\s+"payment\.record"/);
  assert.ok(m, "payment.markPaid case must exist");
  const body = m[1];
  assert.match(body, /deal:deals!inner\(brand\)/, "markPaid must resolve the deal brand");
  assert.match(body, /wantAmt/, "markPaid must normalize the amount");
  assert.match(body, /fallback/, "markPaid must fall back to brand-only match");
});

test("deal.update backfills the payment due date from the deal's due date", () => {
  const src = readFileSync(join(import.meta.dirname, "actions.ts"), "utf8");
  assert.match(src, /from\("payments"\)/, "payments must be updated");
  assert.match(src, /expected_date:\s*String\(dealUpdate\.due_date\)/, "inherit the deal due date");
  assert.match(src, /\.is\("expected_date", null\)/, "only fill payments that are empty");
});
