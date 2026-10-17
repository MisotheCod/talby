#!/usr/bin/env node
/**
 * Talby parity tool.
 *
 * Renders every board twice: the original .dc.html board with its design
 * runtime, and /talby-preview/<Board> from the running app. Then compares:
 *   1. structure: every element's tag, box (0.01px), text and key computed styles
 *   2. pixels: full page screenshots, pixelmatch threshold 0.02
 *
 * usage:
 *   node tools/talby-parity.cjs --boards ../talby-yomi-handoff/design-source/boards \
 *     --app http://localhost:3000 --fonts node_modules/@fontsource --out e2e/talby-parity \
 *     [--only SDeals,STodos] [--looks] [--workers 2]
 *
 * --looks adds the 10 Overview looks, 5 dark pages and the icon rail (115 cases).
 * Exit code 1 if any board fails.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { PNG } = require('pngjs');
const pm = require('pixelmatch');
const pixelmatch = pm.default || pm;

const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (a.startsWith('--')) { const k = a.slice(2); const v = process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[++i] : true; args[k] = v; }
}
const BOARDS = path.resolve(args.boards || '');
const APP = String(args.app || 'http://localhost:3000').replace(/\/$/, '');
const FONTS = path.resolve(args.fonts || 'node_modules/@fontsource');
const OUT = path.resolve(args.out || 'e2e/talby-parity');
const WORKERS = +(args.workers || 2);
const WAIT = +(args.wait || 3000);
if (!fs.existsSync(path.join(BOARDS, 'canvas.json'))) { console.error('--boards must point at design-source/boards (canvas.json not found)'); process.exit(2); }
fs.mkdirSync(OUT, { recursive: true });

const FAM = { 'Geist': 'geist-sans', 'Inter': 'inter', 'Lexend': 'lexend', 'Fraunces': 'fraunces', 'Playfair Display': 'playfair-display', 'DM Mono': 'dm-mono' };
function fontCss(base) {
  let css = '';
  for (const fam in FAM) for (const w of [400, 500, 600, 700]) {
    const f = `${FAM[fam]}-latin-${w}-normal.woff2`;
    if (fs.existsSync(path.join(FONTS, FAM[fam], 'files', f))) css += `@font-face{font-family:'${fam}';font-style:normal;font-weight:${w};font-display:block;src:url(${base}/fonts/${FAM[fam]}/files/${f}) format('woff2');}\n`;
    else console.warn('missing font file', FAM[fam], w);
  }
  return css;
}
const server = http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]);
  let file = null, type = 'text/html';
  if (u.startsWith('/orig/')) { file = path.join(BOARDS, u.slice(6)); if (u.endsWith('.js')) type = 'text/javascript'; }
  else if (u.startsWith('/fonts/')) { file = path.join(FONTS, u.slice(7)); type = 'font/woff2'; }
  if (!file || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': type, 'access-control-allow-origin': '*' });
  fs.createReadStream(file).pipe(res);
});
const PROPS = ['display', 'position', 'font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'color', 'background-color', 'background-image', 'border-top', 'border-right', 'border-bottom', 'border-left', 'border-radius', 'box-shadow', 'padding', 'margin', 'gap', 'opacity', 'transform', 'white-space', 'text-transform', 'overflow', 'z-index', 'backdrop-filter', 'filter'];

(async () => {
  const port = 4790 + Math.floor(Math.random() * 100);
  await new Promise((r) => server.listen(port, r));
  const base = `http://127.0.0.1:${port}`;
  const canvas = JSON.parse(fs.readFileSync(path.join(BOARDS, 'canvas.json'), 'utf8'));
  const only = args.only ? String(args.only).split(',') : null;
  const all = canvas.order.filter((k) => canvas.boards[k] && ['shadcn', 'devices', 'states'].includes(canvas.boards[k].page));
  const studio = { theme: 'studio', mode: 'light', sidebar: 'expanded' };
  const cases = [];
  for (const f of all) { const n = f.replace('.dc.html', ''); if (!only || only.includes(n)) cases.push({ f, n, look: studio, label: '' }); }
  if (args.looks) {
    for (const th of ['studio', 'sand', 'mac', 'stationery', 'editorial']) for (const md of ['light', 'dark']) cases.push({ f: 'SOverview.dc.html', n: 'SOverview', look: { theme: th, mode: md, sidebar: 'expanded' }, label: th + '-' + md });
    for (const n of ['SDeals', 'SPayments', 'SCalendar', 'SSettings', 'SWelcome']) cases.push({ f: n + '.dc.html', n, look: { theme: 'studio', mode: 'dark', sidebar: 'expanded' }, label: 'studio-dark' });
    cases.push({ f: 'SOverview.dc.html', n: 'SOverview', look: { theme: 'studio', mode: 'light', sidebar: 'icons' }, label: 'sidebar-icons' });
  }
  const browser = await chromium.launch();
  const css = fontCss(base);
  async function render(url, b, look) {
    const ctx = await browser.newContext({ viewport: { width: b.w, height: Math.min(b.h, 2000) }, deviceScaleFactor: 1 });
    await ctx.route('**/*', (route) => {
      const u = route.request().url();
      if (u.startsWith(base) || u.startsWith(APP)) return route.continue();
      if (u.includes('fonts.googleapis.com')) return route.fulfill({ status: 200, contentType: 'text/css', body: css });
      return route.abort();
    });
    await ctx.addInitScript((lk) => { try { localStorage.clear(); localStorage.setItem('talby.look', JSON.stringify(lk)); } catch (e) {} }, look);
    if (args.now) {
      const fixed = new Date(String(args.now)).getTime();
      await ctx.addInitScript((FIXED) => {
        const RealDate = Date;
        function F() {
          var a = arguments;
          return a.length ? new (RealDate.bind.apply(RealDate, [null].concat(Array.prototype.slice.call(a))))() : new RealDate(FIXED);
        }
        F.now = function () { return FIXED; };
        F.parse = RealDate.parse;
        F.UTC = RealDate.UTC;
        F.prototype = RealDate.prototype;
        try { globalThis.Date = F; } catch (e) {}
      }, fixed);
    }
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push(e.message));
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await page.waitForTimeout(WAIT);
    { const full = await page.evaluate(() => Math.ceil(document.documentElement.scrollHeight)); const vp = page.viewportSize(); if (full > vp.height) { await page.setViewportSize({ width: vp.width, height: full }); await page.waitForTimeout(1500); } }
    await page.evaluate(() => { for (const a of document.getAnimations()) { const t = a.effect && a.effect.getTiming ? a.effect.getTiming() : null; if (t && t.iterations === Infinity) { a.pause(); a.currentTime = 0; } else { try { a.finish(); } catch (e) {} } } });
    await page.waitForTimeout(120);
    const dom = await page.evaluate((PROPS) => {
      const root = document.getElementById('dc-root');
      const out = [];
      if (!root) return out;
      const walk = (el) => {
        for (const c of el.children) {
          const tn = c.tagName.toLowerCase();
          if (tn === 'style' || tn === 'script') continue;
          if (c.classList.contains('sc-host')) { walk(c); continue; }
          const r = c.getBoundingClientRect();
          const cs = getComputedStyle(c);
          let own = '';
          for (const n of c.childNodes) if (n.nodeType === 3) own += n.nodeValue;
          out.push({ tn, r: [r.x, r.y, r.width, r.height].map((v) => Math.round(v * 100) / 100).join(','), t: own.replace(/\s+/g, ' ').trim().slice(0, 60), s: PROPS.map((p) => cs.getPropertyValue(p)).join('|') });
          walk(c);
        }
      };
      walk(root);
      return out;
    }, PROPS);
    const png = PNG.sync.read(await page.screenshot({ fullPage: true }));
    await ctx.close();
    return { dom, png, errs };
  }
  const results = [];
  let idx = 0;
  async function worker() {
    while (idx < cases.length) {
      const c = cases[idx++];
      const b = canvas.boards[c.f];
      const [o, p] = await Promise.all([render(`${base}/orig/${c.f}`, b, c.look), render(`${APP}/talby-preview/${c.n}`, b, c.look)]);
      const key = c.n + (c.label ? '__' + c.label : '');
      const issues = [];
      if (o.dom.length !== p.dom.length) issues.push(`element count ${o.dom.length} vs ${p.dom.length}`);
      for (let i = 0; i < Math.min(o.dom.length, p.dom.length) && issues.length < 20; i++) {
        const a = o.dom[i], q = p.dom[i];
        if (a.tn !== q.tn) { issues.push(`#${i} tag ${a.tn} vs ${q.tn}`); break; }
        if (a.r !== q.r) issues.push(`#${i} <${a.tn}> "${a.t}" box ${a.r} vs ${q.r}`);
        if (a.t !== q.t) issues.push(`#${i} <${a.tn}> text "${a.t}" vs "${q.t}"`);
        if (a.s !== q.s) { const sa = a.s.split('|'), sq = q.s.split('|'); issues.push(`#${i} <${a.tn}> "${a.t}" ` + PROPS.filter((_, k) => sa[k] !== sq[k]).map((pp) => `${pp}: ${sa[PROPS.indexOf(pp)]} vs ${sq[PROPS.indexOf(pp)]}`).join('; ')); }
      }
      let pct = 100, px = -1;
      if (o.png.width === p.png.width && o.png.height === p.png.height) {
        const d = new PNG({ width: o.png.width, height: o.png.height });
        px = pixelmatch(o.png.data, p.png.data, d.data, o.png.width, o.png.height, { threshold: 0.02 });
        pct = (100 * px) / (o.png.width * o.png.height);
        if (px > 0) {
          fs.writeFileSync(path.join(OUT, key + '__diff.png'), PNG.sync.write(d));
          fs.writeFileSync(path.join(OUT, key + '__board.png'), PNG.sync.write(o.png));
          fs.writeFileSync(path.join(OUT, key + '__app.png'), PNG.sync.write(p.png));
        }
      } else issues.push(`page size ${o.png.width}x${o.png.height} vs ${p.png.width}x${p.png.height}`);
      const newErrs = p.errs.filter((e) => !o.errs.includes(e));
      if (newErrs.length) issues.push('page error: ' + newErrs[0].slice(0, 160));
      const pass = !issues.length && pct < 0.01;
      results.push({ key, pass, structure: issues.length ? 'diff' : 'same', pixelPct: +pct.toFixed(4), pixels: px, issues });
      console.log(`${pass ? 'PASS' : 'FAIL'} ${key}  structure ${issues.length ? 'DIFF' : 'same'}  pixels ${pct.toFixed(4)}%` + (issues.length ? '\n   ' + issues.slice(0, 6).join('\n   ') : ''));
    }
  }
  await Promise.all(Array.from({ length: WORKERS }, worker));
  results.sort((a, b) => a.key.localeCompare(b.key));
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 1));
  const passed = results.filter((r) => r.pass).length;
  console.log(`\n${passed}/${results.length} pass. Details in ${path.join(OUT, 'results.json')}`);
  await browser.close();
  server.close();
  process.exit(passed === results.length ? 0 : 1);
})();
