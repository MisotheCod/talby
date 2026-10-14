#!/usr/bin/env node
/** Verify mobile drawer (solid bg, full-height, 50% black backdrop) and
 *  Payments stat cards (shared .statcard, 2x2 on phone) at 390px, light + dark. */
const ENGINE = { chromium: require('/opt/homebrew/lib/node_modules/playwright').chromium,
  webkit: require('/opt/homebrew/lib/node_modules/playwright').webkit }[process.env.PW_BROWSER || 'chromium'];
const fs = require('fs');
const envPath = require('path').join('/Users/miso/talby', '.env.local');
for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) { const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/); if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].trim(); }
const BASE = (process.env.BASE_URL || 'http://localhost:3100').replace(/\/$/, '');
const PW = 'MobileFix123!x'; const TS = Date.now();
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
let pass = 0, fail = 0;
const ck = (n, ok, x) => { ok ? pass++ : fail++; console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${n}${x ? '  [' + x + ']' : ''}`); };

(async () => {
  const browser = await ENGINE.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const email = `mobilefix.${TS}@talby.test`;
  try {
    await page.goto(`${BASE}/signup`, { waitUntil: 'networkidle' });
    await page.fill('input[type=email]', email);
    await page.fill('input[type=password]', PW);
    if (await page.locator('input[type=text]').count()) await page.locator('input[type=text]').first().fill('mobilefix');
    await page.locator('button[type=submit]').first().click();
    await sleep(6500);
    await page.goto(`${BASE}/app`, { waitUntil: 'networkidle' });
    await sleep(2500);

    for (const mode of ['light', 'dark']) {
      await page.evaluate((m) => m === 'dark' ? document.documentElement.setAttribute('data-theme', 'dark') : document.documentElement.removeAttribute('data-theme'), mode);
      await sleep(300);
      console.log(`\n=== MODE: ${mode} (390×844) ===`);

      // --- Task 1: mobile drawer ---
      await page.click('.hamb');
      await sleep(450);
      const d = await page.evaluate(() => {
        const side = document.querySelector('.side');
        const bd = document.querySelector('.backdrop');
        const s = side.getBoundingClientRect();
        const cs = getComputedStyle(side);
        const cbd = getComputedStyle(bd);
        return {
          top: s.top, bottom: s.bottom, vh: window.innerHeight, width: s.width,
          bg: cs.backgroundColor, bgContainsAlpha: /rgba\b/.test(cs.backgroundColor),
          backdropBg: cbd.backgroundColor, backdropOpacity: cbd.opacity,
        };
      });
      ck(`${mode}: drawer full-height (top≈0, bottom≈vh)`, d.top <= 1 && Math.abs(d.bottom - d.vh) <= 1, `top=${d.top.toFixed(1)} bottom=${d.bottom.toFixed(1)} vh=${d.vh}`);
      ck(`${mode}: drawer bg solid (no alpha)`, !d.bgContainsAlpha, d.bg);
      ck(`${mode}: backdrop is black ~50%`, /rgba\(0, 0, 0, 0\.5/.test(d.backdropBg) || /rgba\(0, 0, 0, 0\.5/.test(d.backdropBg.replace(/\s/g, '')), d.backdropBg);
      ck(`${mode}: backdrop visible when open`, d.backdropOpacity === '1', `opacity=${d.backdropOpacity}`);

      // tap the backdrop to close (x=320 is right of the 266px drawer, inside
      // the backdrop, clear of WebKit headless's classic-scrollbar edge)
      await page.mouse.click(320, 400);
      await sleep(400);
      const closed = await page.evaluate(() => document.querySelector('.side').getBoundingClientRect().left < 0);
      ck(`${mode}: tapping backdrop closes drawer`, closed, '');

      // --- Task 2: payments stat cards ---
      await page.evaluate(() => { const a = [...document.querySelectorAll('a')].find(x => x.getAttribute('href') === '/app/payments'); if (a) a.click(); });
      await sleep(2600);
      const cards = await page.evaluate(() => {
        const grid = document.querySelector('.stats');
        const cs = getComputedStyle(grid);
        const cards = [...grid.querySelectorAll('.statcard')];
        const labels = cards.map(c => c.querySelector('.lbl')?.textContent?.trim());
        const vals = cards.map(c => c.querySelector('.val')?.textContent?.trim());
        const subs = cards.map(c => c.querySelector('.sub')?.textContent?.trim());
        const lblStyle = cards[0] ? getComputedStyle(cards[0].querySelector('.lbl')) : null;
        return { cols: cs.gridTemplateColumns.split(' ').length, count: cards.length, labels, vals, subs,
          lblUppercase: lblStyle.textTransform, lblColor: lblStyle.color };
      });
      ck(`${mode}: 4 stat cards present`, cards.count === 4, `count=${cards.count}`);
      ck(`${mode}: 2-column grid on phone`, cards.cols === 2, `cols=${cards.cols}`);
      ck(`${mode}: label uppercase`, cards.lblUppercase === 'uppercase', cards.lblUppercase);
      ck(`${mode}: labels present`, JSON.stringify(cards.labels) === JSON.stringify(['Earned this year', 'Expected', 'Avg deal value', 'Best month']), JSON.stringify(cards.labels));
      ck(`${mode}: sub 'received this year'`, cards.subs[0] === 'received this year', cards.subs[0]);
      ck(`${mode}: sub 'across … deal'`, /^across \d+ deal/.test(cards.subs[2] || ''), cards.subs[2]);
    }

    console.log(`\n=== RESULT: ${pass}/${pass + fail} passed ===`);
    if (fail) process.exitCode = 1;
  } catch (e) { console.error('FATAL', e.message); process.exitCode = 1; }
  finally {
    try {
      const dbBase = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
      const uid = await page.evaluate(async ({ dbBase, key, email }) => {
        const h = { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' };
        const w = await fetch(dbBase + '/rest/v1/profiles?select=id&email=eq.' + encodeURIComponent(email), { headers: h }).then(r => r.json());
        return w && w[0] && w[0].id;
      }, { dbBase, key, email });
      if (uid) await page.evaluate(async ({ dbBase, key, uid }) => {
        const h = { apikey: key, Authorization: 'Bearer ' + key };
        const del = (p) => fetch(dbBase + '/rest/v1/' + p, { method: 'DELETE', headers: h });
        const deals = await fetch(dbBase + '/rest/v1/deals?select=id&user_id=eq.' + uid, { headers: h }).then(r => r.json());
        await Promise.all([...(deals || []).map(d => del('deals?id=eq.' + d.id)), del('payments?user_id=eq.' + uid), del('content?user_id=eq.' + uid), del('profiles?id=eq.' + uid)]);
      }, { dbBase, key, uid }).catch(() => {});
    } catch {}
    await browser.close();
  }
})().catch(e => { console.error('FATAL', e.message); process.exitCode = 1; });