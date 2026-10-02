#!/usr/bin/env node
/*
 * Create a throwaway test user for the revisions feature and seed two deals:
 *  - Halcyon (2 revisions included, 1 used)   -> under limit
 *  - Meadowlark (1 revision included, 3 used) -> OVER limit (amber)
 * Use the service role key from .env.local. Cleans up its own data first so it's re-runnable.
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env.local") });
const { createClient } = require("@supabase/supabase-js");

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) { console.error("missing env"); process.exit(1); }
const sb = createClient(URL, KEY, { auth: { autoRefreshToken: false, persistSession: false }});

const EMAIL = "revisions-tester@talby.build";
const PASSWORD = "RevTester123!";

async function main() {
  // 1. clear any prior run
  const { data: existing } = await sb.auth.admin.listUsers();
  const prior = (existing?.users ?? []).find((u) => u.email === EMAIL);
  if (prior) {
    const { data: deals } = await sb.from("deals").select("id").eq("user_id", prior.id);
    for (const d of deals || []) await sb.from("deals").delete().eq("id", d.id);
    // payments + content cascade via linkage; delete explicit to be safe
    await sb.from("payments").delete().eq("user_id", prior.id);
    await sb.from("content").delete().eq("user_id", prior.id);
    await sb.auth.admin.deleteUser(prior.id);
  }

  // 2. create user
  const { data: created, error: cErr } = await sb.auth.admin.createUser({
    email: EMAIL, password: PASSWORD, email_confirm: true,
  });
  if (cErr) { console.error("create user failed", cErr.message); process.exit(1); }
  const uid = created.user.id;
  console.log("created user", uid, EMAIL);

  // 3. seed two deals with revisions
  const d1 = await sb.from("deals").insert({
    user_id: uid, brand: "Halcyon Skincare", deliverable: "1 Reel + 3 Stories", value: 5500,
    status: "active", active: true, pay_terms: "net_30", exclusivity_days: 60,
    revisions_included: "2", revisions_used: 1,
  }).select("id").single();
  const d2 = await sb.from("deals").insert({
    user_id: uid, brand: "Meadowlark Tea", deliverable: "2 TikToks", value: 3900,
    status: "active", active: true, pay_terms: "net_60", exclusivity_days: 30,
    revisions_included: "1", revisions_used: 3,
  }).select("id").single();
  const d3 = await sb.from("deals").insert({
    user_id: uid, brand: "Basewear Co.", deliverable: "1 YouTube integration", value: 9800,
    status: "active", active: true, pay_terms: "net_45", exclusivity_days: 90,
    revisions_included: "Unlimited", revisions_used: 5,
  }).select("id").single();
  console.log("seeded deals:", JSON.stringify({ d1: d1.data?.id, d2: d2.data?.id, d3: d3.data?.id }));
  console.log("EMAIL=", EMAIL);
  console.log("DONE");
}
main().catch((e) => { console.error(e); process.exit(1); });