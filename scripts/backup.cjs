#!/usr/bin/env node
/**
 * Backup Talby's production data — read-only export.
 *
 * Reads Supabase credentials from .env.local IN PROCESS (never printed),
 * pulls every tracked public table via the REST API with the service-role key,
 * and writes backups/talby_backup_<utc>.json as { taken_at, tables: {...} }.
 *
 * Usage: node scripts/backup.cjs            # production (the .env.local URL)
 */
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "..", ".env.local");
if (!fs.existsSync(envPath)) { console.error("no .env.local"); process.exit(2); }
const env = {};
for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)="?([^"]*)"?$/);
  if (m) env[m[1]] = m[2];
}
const URL = env.NEXT_PUBLIC_SUPABASE_URL || "";
const KEY = env.SUPABASE_SERVICE_ROLE_KEY || "";
if (!URL || !KEY || !URL.startsWith("https://")) { console.error("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing"); process.exit(2); }
console.log("Backing up from:", URL, "(service-role, read-only)");

const TABLES = [
  "profiles", "deals", "payments", "content", "deal_extras", "deal_checklist",
  "deal_files", "deal_contracts", "contract_chunks", "inbox_leads",
  "import_runs", "import_uploads", "notion_syncs", "notion_connections",
  "stripe_events", "todos", "ideas",
];

function fetchTable(t) {
  return fetch(`${URL}/rest/v1/${t}?select=*&limit=100000`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
  }).then(async (r) => {
    if (r.status === 404) return null; // table not present
    if (!r.ok) throw new Error(`${t}: HTTP ${r.status}`);
    return r.json();
  });
}

(async () => {
  const tables = {};
  for (const t of TABLES) {
    try { const rows = await fetchTable(t); tables[t] = rows || []; }
    catch (e) { console.error("  error", e.message); tables[t] = []; }
  }
  const taken_at = new Date().toISOString();
  const stamp = taken_at.replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z").replace(/[TZ]/g, "_");
  const file = path.join(__dirname, "..", "backups", `talby_backup_${taken_at.replace(/[-:T]/g, "").replace(/\.\d+Z$/, "")}.json`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify({ taken_at, tables }, null, 2));
  const sizes = Object.entries(tables).map(([k, v]) => `${k}:${v.length}`).join(" ");
  console.log("WROTE", path.basename(file), "|", sizes);
  console.log("TAKEN_AT", taken_at);
})().catch((e) => { console.error("backup failed", e.message); process.exit(1); });