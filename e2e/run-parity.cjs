"use strict";
/**
 * run-parity.cjs — the parity gate for the redesign build loop.
 * For every case (or a --case 15a filter) it signs in as the case's seeded
 * fixture account, sets theme+mode, renders the live screen full-page, and
 * pixelmatches against the handoff reference PNG (threshold 0.1). A case
 * passes only when diff < bar (0.5%). This is the "<0.5% against its listed
 * screenshots" check the checklist demands. Uses only fixture.*@talby.test
 * accounts — never real accounts, never THE user's login.
 *
 * Usage (local dev server on :3111):
 *   node e2e/run-parity.cjs [--case 15a] [--base http://localhost:3111]
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
const BASE = process.env.BASE_URL || (process.argv.find((a) => a === "--base") ? process.argv[process.argv.indexOf("--base") + 1] : map.baseUrl);
const CASE_ID = process.argv.includes("--case") ? process.argv[process.argv.indexOf("--case") + 1] : null;
const outputDir = "/tmp/talby-parity";
fs.mkdirSync(outputDir, { recursive: true });

function pct(bytes) { return PNG.sync.read(bytes); }

(async () => {
  const cases = CASE_ID ? map.cases.filter((c) => c.id === CASE_ID) : map.cases;
  if (!cases.length) { console.error("no cases to run"); process.exit(2); }
  const results = [];
  const browser = await chromium.launch({ headless: true });

  for (const c of cases) {
    const { clip } = c; // optional [x,y,w,h] region capture for component refs
    const context = await browser.newContext({
      viewport: { width: c.viewport[0], height: c.viewport[1] },
    });
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
      await page.goto(`${BASE}/app${c.route}`, { waitUntil: "domcontentloaded", timeout: 40000 });
      await page.waitForTimeout(2500);

      const shot = clip
        ? await page.screenshot({ clip: { x: clip[0], y: clip[1], width: clip[2], height: clip[3] }, animations: "disabled" })
        : await page.screenshot({ fullPage: true, animations: "disabled" });
      const refPath = path.join(HANDOFF, "screenshots", c.ref);
      if (!fs.existsSync(refPath)) throw new Error(`missing reference ${refPath}`);
      const A = PNG.sync.read(fs.readFileSync(refPath));
      const B = PNG.sync.read(shot);
      const w = Math.min(A.width, B.width), h = Math.min(A.height, B.height);
      const sizeNote = (A.width !== B.width || A.height !== B.height) ? ` (size ${B.width}x${B.height} vs ${A.width}x${A.height})` : "";
      // pixelmatch needs both buffers shaped (w,h); crop both to the overlap.
      const ca = new PNG({ width: w, height: h }), cb = new PNG({ width: w, height: h });
      PNG.bitblt(A, ca, 0, 0, w, h, 0, 0);
      PNG.bitblt(B, cb, 0, 0, w, h, 0, 0);
      const diff = new PNG({ width: w, height: h });
      const n = pixelmatch(ca.data, cb.data, diff.data, w, h, { threshold: map.threshold ?? 0.02 });
      const p = (100 * n) / (w * h);
      fs.writeFileSync(path.join(outputDir, `${c.id}-${c.name}-diff.png`), PNG.sync.write(diff));
      results.push({ id: c.id, name: c.name, pct: +p.toFixed(3), pass: p < BAR, sizeNote });
      console.log(`${c.pass ? "PASS" : "FAIL"} ${c.id} ${c.name} ${c.theme}-${c.mode}: ${p.toFixed(3)}%${sizeNote} (bar ${BAR}%)`);
    } catch (e) {
      results.push({ id: c.id, name: c.name, pct: NaN, pass: false, sizeNote: `ERR ${e.message.slice(0, 80)}` });
      console.log(`FAIL ${c.id} ${c.name}: ERR ${e.message.slice(0, 80)}`);
    } finally {
      await context.close();
    }
  }

  await browser.close();
  const passed = results.filter((r) => r.pass).length;
  console.log(`\n${passed}/${results.length} cases passed the ${BAR}% bar. Diffs in ${outputDir}/.`);
  process.exit(passed === results.length ? 0 : 1);
})().catch((e) => { console.error("FATAL", e.message); process.exit(1); });

function png(buf) { return PNG.sync.read(buf); }