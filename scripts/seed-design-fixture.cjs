#!/usr/bin/env node
/**
 * Seed the design-fixture test accounts (BUILD_CHECKLIST item 10).
 * Creates one account per plan state so the parity harness and screens can be
 * checked in every state: sample (active, with a few deals), empty (fresh),
 * trial, past due, canceled, read only. NEVER touches real accounts.
 *
 * Uses Supabase Auth signup for each email then the service role to set
 * plan_status / trial_end. Requires the same env as .env.local
 * (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
 * SUPABASE_SERVICE_ROLE_KEY).
 *
 * Usage: node scripts/seed-design-fixture.cjs [--clean]
 */

const fs = require("fs");
const path = require("path");
const envPath = path.join(__dirname, "..", ".env.local");
for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
  const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
  if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].trim();
}

const { createClient } = require("@supabase/supabase-js");
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !ANON || !SERVICE) {
  console.error("Missing Supabase env (URL / ANON / SERVICE_ROLE).");
  process.exit(1);
}

const anon = createClient(URL, ANON);
const admin = createClient(URL, SERVICE, { auth: { persistSession: false, autoRefreshToken: false } });

const FIXTURES = [
  { key: "sample", email: "fixture.sample@talby.test", pw: "Shot123!x", plan: "active", deals: 3 },
  { key: "empty", email: "fixture.empty@talby.test", pw: "Shot123!x", plan: "none" },
  { key: "trial", email: "fixture.trial@talby.test", pw: "Shot123!x", plan: "trialing", days: 9 },
  { key: "pastdue", email: "fixture.pastdue@talby.test", pw: "Shot123!x", plan: "past_due", days: 4 },
  { key: "canceled", email: "fixture.canceled@talby.test", pw: "Shot123!x", plan: "canceled" },
  { key: "readonly", email: "fixture.readonly@talby.test", pw: "Shot123!x", plan: "none" },
];

async function main() {
  const clean = process.argv.includes("--clean");
  if (clean) {
    for (const f of FIXTURES) {
      const { data } = await anon.auth.signInWithPassword({ email: f.email, password: f.pw }).catch(() => ({ data: null }));
      if (data?.user) {
        await admin.auth.admin.deleteUser(data.user.id);
        console.log("deleted", f.key);
      }
    }
  }

  for (const f of FIXTURES) {
    const { data, error } = await anon.auth.signUp({ email: f.email, password: f.pw });
    if (error && !/already registered/i.test(error.message)) { console.error(f.key, "signup:", error.message); continue; }
    const uid = data?.user?.id;
    if (!uid) { console.error(f.key, "no user id"); continue; }
    const patch = { plan_status: f.plan };
    if (f.days) {
      const d = new Date(); d.setDate(d.getDate() + f.days);
      patch.trial_end = d.toISOString();
    }
    const { error: upErr } = await admin.from("profiles").update(patch).eq("id", uid);
    if (upErr) console.error(f.key, "profile:", upErr.message); else console.log("seeded", f.key, f.plan, f.days ? `(${f.days}d)` : "");
    // seed a couple of deals for the sample account
    if (f.key === "sample") {
      for (let i = 0; i < 3; i++) {
        try {
          await admin.from("deals").insert({ user_id: uid, brand: `Fixture Brand ${i + 1}`, value: 1000 * (i + 1), status: "active", deliverable: "1 Reel" });
        } catch { /* non-fatal */ }
      }
    }
  }
  console.log("done. Emails: " + FIXTURES.map((f) => f.email).join(", "));
}

main().catch((e) => { console.error(e); process.exit(1); });
