"use strict";
/**
 * run-parity.cjs — the parity gate for the redesign build loop.
 *
 * Captures the LIVE app exactly like tools/shoot-boards.js captures the boards:
 *   viewport = board width x min(board height, 2000), deviceScaleFactor 1,
 *   goto networkidle (fallback domcontentloaded), fonts.ready, 2600ms wait,
 *   fullPage screenshot. Diff vs the handoff reference PNG with pixelmatch
 *   (threshold = map.threshold, default 0.02). PASS only when diff < 0.5%.
 *
 * A case may set `crop:[x,y,w,h]` — the same region is cropped from the
 * reference and from the live fullPage shot (e.g. just the sidebar or top bar
 * cut out of a page board). Shell items compare against PAGE boards, not the
 * standalone component PNGs. Uses only fixture.*@talby.test accounts.
 *
 * Usage: node e2e/run-parity.cjs [--case 15a] [--all]   (BASE_URL env to point elsewhere)
 * Exits 1 if any selected case fails the bar.
 */
const { chromium } = require("playwright");
const { PNG } = require("pngjs");
const pixelmatch = require("pixelmatch");
const fs = require("fs");
const path = require("path");

const map = require("./parity-map.json");
const HANDOFF = map.handoff;
const BAR = map.bar;
const THOLD = map.threshold ?? 0.02;
const BASE = process.env.BASE_URL || map.baseUrl;
const o = process.argv;
const CASE_ID = o.includes("--case") ? o[o.indexOf("--case") + 1] : null;
const outputDir = "/tmp/talby-parity";
fs.mkdirSync(outputDir, { recursive: true });

function cropRegion(png, region) {
  const [x, y, w, h] = region;
  const out = new PNG({ width: w, height: h });
  PNG.bitblt(png, out, x, y, w, h, 0, 0);
  return out;
}

(async () => {
  const cases = CASE_ID ? map.cases.filter((c) => c.id === CASE_ID) : map.cases;
  if (!cases.length) { console.error("no cases to run"); process.exit(2); }
  const results = [];
  const browser = await chromium.launch({ headless: true });

  for (const c of cases) {
    const { crop } = c; // optional [x,y,w,h] region applied to ref AND live
    const refPath = path.join(HANDOFF, c.ref);
    if (!fs.existsSync(refPath)) { console.log(`FAIL ${c.id} ${c.name}: missing reference ${refPath}`); results.push({ id: c.id, pass: false }); continue; }
    const refImg = PNG.sync.read(fs.readFileSync(refPath));
    // Same capture as shoot-boards: viewport = board w x min(board h, 2000).
    const VW = refImg.width;
    const VH = Math.min(refImg.height, 2000);
    const context = await browser.newContext({ viewport: { width: VW, height: VH }, deviceScaleFactor: 1 });
    await context.addInitScript(({ theme, mode }) => {
      try { localStorage.setItem("talby.look", JSON.stringify({ theme, mode, sidebar: "expanded" })); } catch {}
    }, { theme: c.theme, mode: c.mode });
    const page = await context.newPage();
    const acc = map.accounts[c.account];

    try {
      await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded", timeout: 40000 });
      await page.fill("input[type=email]", acc.email);
      await page.fill("input[type=password]", acc.pw);
      await page.locator("button[type=submit]").first().click();
      await page.waitForURL(/\/app/, { timeout: 20000 }).catch(() => {});
      await page.goto(`${BASE}/app${c.route}`, { waitUntil: "networkidle", timeout: 40000 }).catch(async () => {
        await page.goto(`${BASE}/app${c.route}`, { waitUntil: "domcontentloaded", timeout: 40000 });
      });
      await page.evaluate(() => (document.fonts && document.fonts.ready));
      await page.waitForTimeout(c.wait ?? 2600);

      const shot = await page.screenshot({ fullPage: true, animations: "disabled" });
      const B = PNG.sync.read(shot);
      const A = crop ? cropRegion(refImg, crop) : refImg;
      const live = crop ? cropRegion(B, crop) : B;
      const w = Math.min(A.width, live.width), h = Math.min(A.height, live.height);
      const note = (A.width !== live.width || A.height !== live.height)
        ? ` (region ${live.width}x${live.height} vs ${A.width}x${A.height})` : "";
      const ca = new PNG({ width: w, height: h }), cb = new PNG({ width: w, height: h });
      PNG.bitblt(A, ca, 0, 0, w, h, 0, 0);
      PNG.bitblt(live, cb, 0, 0, w, h, 0, 0);
      const diff = new PNG({ width: w, height: h });
      const n = pixelmatch(ca.data, cb.data, diff.data, w, h, { threshold: THOLD });
      const p = (100 * n) / (w * h);
      fs.writeFileSync(path.join(outputDir, `${c.id}-${c.name}-diff.png`), PNG.sync.write(diff));
      results.push({ id: c.id, name: c.name, pct: +p.toFixed(3), pass: p < BAR });
      const label = `${c.id} ${c.name} ${c.theme}-${c.mode}`;
      console.log(`${p < BAR ? "PASS" : "FAIL"} ${label}: ${p.toFixed(3)}%${note} (bar ${BAR}% thr ${THOLD})`);
    } catch (e) {
      results.push({ id: c.id, name: c.name, pct: NaN, pass: false });
      console.log(`FAIL ${c.id} ${c.name}: ERR ${e.message.slice(0, 100)}`);
    } finally {
      await context.close();
    }
  }

  await browser.close();
  const passed = results.filter((r) => r.pass).length;
  console.log(`\n${passed}/${results.length} cases passed the ${BAR}% bar. Diffs in ${outputDir}/.`);
  process.exit(passed === results.length ? 0 : 1);
})().catch((e) => { console.error("FATAL", e.message); process.exit(1); });