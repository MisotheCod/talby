const fs = require("fs");
const path = require("path");

// Load .env.local into process.env (simple parser)
const envRaw = fs.readFileSync(path.join(__dirname, "..", ".env.local"), "utf8");
for (const line of envRaw.split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SERVICE_ROLE_KEY");
  process.exit(1);
}

async function main() {
  const email = process.argv[2];
  if (!email) { console.error("usage: node set-pro.js <email>"); process.exit(1); }

  // 1. Find the auth user by email (service role admin API)
  const listRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
    },
  });
  if (!listRes.ok) { console.error("list failed", listRes.status, await listRes.text()); process.exit(1); }
  const { users } = await listRes.json();
  const target = users.find((u) => (u.email || "").toLowerCase() === email.toLowerCase());
  if (!target) { console.error("USER NOT FOUND for", email); process.exit(1); }
  console.log("Found user:", target.id, "| confirmed:", target.email_confirmed_at ? "yes" : "no");

  // 2. Upsert profile plan = paid via service role (bypasses RLS)
  const pRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${target.id}`, {
    method: "PATCH",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({ plan: "paid" }),
  });
  const pBody = await pRes.json();
  if (!pRes.ok) { console.error("profile update failed", pRes.status, JSON.stringify(pBody)); process.exit(1); }
  console.log("Profile plan updated:", JSON.stringify(pBody));

  // 3. Verify
  const vRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${target.id}&select=id,plan,stripe_customer_id`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
  });
  const vBody = await vRes.json();
  console.log("VERIFY:", JSON.stringify(vBody));
}

main().catch((e) => { console.error(e); process.exit(1); });