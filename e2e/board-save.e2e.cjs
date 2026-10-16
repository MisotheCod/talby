const { chromium } = require("playwright");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const EMAIL = "branch.1792134261069@talby.test", PW = "Shot123!x";

// Cam #4 board tests: click Create deal on each route, assert a POST /api/deals fires
// with the right brand. run via: node e2e/board-save.e2e.cjs
async function createOnRoute(p, route, brand) {
  await p.goto(`http://localhost:3000${route}`, { waitUntil: "domcontentloaded" }); await sleep(3500);
  await p.locator('button:has-text("Add deal")').first().click({ timeout: 4000 }).catch(() => {});
  await sleep(900);
  if (!(await p.getByRole("dialog").count())) {
    await p.getByRole("menuitem", { name: /new deal|add one by hand|start from scratch/i }).first().click({ timeout: 3000 }).catch(() => {});
    await sleep(1000);
  }
  const dlg = p.getByRole("dialog").first();
  await dlg.locator("#ad-brand").fill(brand, { timeout: 5000 });
  await dlg.locator("#ad-amt").fill("900");
  await sleep(300);
  await dlg.getByRole("button", { name: "Create deal" }).click({ timeout: 5000 });
  await sleep(3000);
}

(async () => {
  const b = await chromium.launch({ headless: true });
  const p = await (await b.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();
  p.setDefaultTimeout(15000);
  const posts = [];
  p.on("request", (r) => { if (r.method() === "POST" && r.url().includes("/api/deals")) { try { const j = JSON.parse(r.postData() || "{}"); posts.push((j.brand || "") + "|val=" + (j.payload?.value ?? "")); } catch {} } });

  await p.goto("http://localhost:3000/login", { waitUntil: "domcontentloaded" }); await sleep(1200);
  await p.fill('input[type="email"]', EMAIL); await p.fill('input[type="password"]', PW);
  await p.locator('button[type="submit"]').first().click(); await sleep(6000);
  await p.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" }); await sleep(600);
  await p.evaluate(() => localStorage.clear());

  await createOnRoute(p, "/app", "BoardOverviewBrand");
  await createOnRoute(p, "/app/deals", "BoardDealsBrand");
  await createOnRoute(p, "/app/calendar", "BoardCalendarBrand");
  await createOnRoute(p, "/app/notes", "BoardNotesBrand");

  console.log("POST_DEALS:"); console.log(posts.join("\n") || "(none)");
  await b.close();
})().catch((e) => { console.error("FATAL", e.message); process.exit(1); });