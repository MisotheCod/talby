#!/usr/bin/env node
/** Verify: row menus portal'd + hide status, total-row amount, trial-banner
 *  secondary button, extras chip (+hover) & monthly second line. 390px + desktop. */
const ENGINE = { chromium: require('/opt/homebrew/lib/node_modules/playwright').chromium,
  webkit: require('/opt/homebrew/lib/node_modules/playwright').webkit }[process.env.PW_BROWSER || 'chromium'];
const fs = require('fs');
const envPath = require('path').join('/Users/miso/talby', '.env.local');
for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) { const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/); if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].trim(); }
const BASE = (process.env.BASE_URL || 'http://localhost:3100').replace(/\/$/, '');
const PW = 'RowMenu123!x'; const TS = Date.now();
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
let pass = 0, fail = 0;
const ck = (n, ok, x) => { ok ? pass++ : fail++; console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${n}${x ? '  [' + x + ']' : ''}`); };

(async () => {
  const browser = await ENGINE.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const email = `rowmenu.${TS}@talby.test`;
  const brandExtra = `ExtDeal${TS.toString().slice(-7)}`;
  const brandMonthly = `MonDeal${TS.toString().slice(-7)}`;
  const dbBase = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  try {
    await page.goto(`${BASE}/signup`, { waitUntil: 'networkidle' });
    await page.fill('input[type=email]', email);
    await page.fill('input[type=password]', PW);
    if (await page.locator('input[type=text]').count()) await page.locator('input[type=text]').first().fill('rowmenu');
    await page.locator('button[type=submit]').first().click();
    await sleep(6500);

    // seed: deal with extras + monthly deal via the app's own API
    const seed = await page.evaluate(async ({ base, brandExtra, brandMonthly }) => {
      const post = (brand, payload) => fetch(base + '/api/deals', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ brand, payload }) }).then(r => r.json());
      const a = await post(brandExtra, { deliverable: 'x', deal_type: 'ugc', status: 'active', value: 4000,
        extras: [{ kind: 'bonus', amount: 1000, condition: 'if the Reel passes 100K views', rate: null, on_text: null, earned: false },
                 { kind: 'commission', amount: null, condition: null, rate: 10, on_text: 'with code CAMQ15', earned: false }] });
      const b = await post(brandMonthly, { deliverable: 'y', deal_type: 'ugc', status: 'active', value: 3000, payment_structure: 'monthly', structure_months: 3 });
      return { a: a.deal?.id, b: b.deal?.id };
    }, { base: BASE, brandExtra, brandMonthly });
    await sleep(1200);

    await page.goto(`${BASE}/app/deals`, { waitUntil: 'networkidle' });
    await sleep(2600);
    const dealsBody = await page.locator('body').innerText();
    console.log('\n=== DEALS TABLE (chromium-default viewport is 390 here) ===');
    ck('extras deal shows "+ 2 extras" chip', dealsBody.includes('+ 2 extras'), '');
    ck('monthly deal shows "$1,000 a month" second line', dealsBody.includes('$1,000 a month'), '');
    ck('no old "+ $1,000 bonus" line', !dealsBody.includes('bonus') && !dealsBody.includes('commission'), '');

    // ===== Task 1: payments row menu (portal + hide status) =====
    await page.goto(`${BASE}/app/payments`, { waitUntil: 'networkidle' });
    await sleep(2600);
    // The extras deal generated one $4,000 not-invoiced payment; open its ⋯
    const menuBtn = page.locator('button[aria-label="Payment actions"]').first();
    await menuBtn.click();
    await sleep(400);
    const menuInfo = await page.evaluate(() => {
      const m = document.querySelector('div[role="menu"]');
      if (!m) return null;
      const labels = [...m.querySelectorAll('button')].map(b => b.textContent);
      return { inBody: m.parentElement === document.body, fixed: getComputedStyle(m).position, labels: labels.map(l => l.trim()) };
    });
    console.log('\n=== PAYMENTS ROW MENU ===');
    ck('menu portal\'d to document.body', !!menuInfo && menuInfo.inBody, '');
    ck('menu position fixed', !!menuInfo && menuInfo.fixed === 'fixed', menuInfo && menuInfo.fixed);
    ck('"Mark not invoiced" hidden on not-invoiced payment', !!menuInfo && !menuInfo.labels.includes('Mark not invoiced'), JSON.stringify(menuInfo && menuInfo.labels));
    ck('"Mark invoiced" + "No invoice needed" present', !!menuInfo && menuInfo.labels.includes('Mark invoiced') && menuInfo.labels.includes('No invoice needed'), '');

    // ===== Task 2: total row amount =====
    const total = await page.evaluate(() => {
      const rows = [...document.querySelectorAll('div')].filter(d => /Total (expected|received)/i.test(d.textContent || '') && d.textContent.length < 40);
      return rows.map(r => r.textContent.trim()).slice(-3);
    });
    console.log('\n=== TOTAL ROW ===');
    ck('total row shows a dollar amount', total.some(t => /\$\d/.test(t)), JSON.stringify(total));

    // ===== Task 3: trial banner secondary button =====
    console.log('\n=== TRIAL BANNER ===');
    const btnInfo = await page.evaluate(() => {
      const btns = [...document.querySelectorAll('button')].filter(b => b.textContent.trim() === 'Subscribe');
      if (!btns.length) return null;
      const cs = getComputedStyle(btns[0]);
      return { bg: cs.backgroundColor, border: cs.borderTopWidth !== '0px' };
    });
    ck('Subscribe button is outlined/secondary (has border, not solid accent)', !!btnInfo && btnInfo.border, btnInfo && btnInfo.bg);

    // ===== Task 4b: extras hover card (desktop) =====
    console.log('\n=== EXTRAS CHIP HOVER (desktop 1280) ===');
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${BASE}/app/deals`, { waitUntil: 'networkidle' });
    await sleep(2200);
    const chip = page.locator('text=+ 2 extras').first();
    if (await chip.count()) {
      await chip.hover();
      await sleep(400);
      const card = await page.evaluate(() => {
        const cands = [...document.querySelectorAll('div')].filter(d => d.textContent.includes('Bonus') && d.textContent.includes('Commission') && d.textContent.includes('100K views'));
        return cands.length ? cands.map(c => c.textContent.replace(/\s+/g, ' ').trim()).slice(-1)[0] : null;
      });
      ck('hover card lists Bonus + Commission detail', !!card && card.includes('Bonus') && card.includes('$1,000') && card.includes('10% of sales') && card.includes('100K views'), card);
    } else {
      ck('hover card lists extras (chip present)', false, 'chip not found');
    }

    console.log(`\n=== RESULT: ${pass}/${pass + fail} passed ===`);
    if (fail) process.exitCode = 1;
  } catch (e) { console.error('FATAL', e.message); process.exitCode = 1; }
  finally {
    try {
      const uid = await page.evaluate(async ({ dbBase, key, email }) => {
        const h = { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' };
        const w = await fetch(dbBase + '/rest/v1/profiles?select=id&email=eq.' + encodeURIComponent(email), { headers: h }).then(r => r.json());
        return w && w[0] && w[0].id;
      }, { dbBase, key, email });
      if (uid) await page.evaluate(async ({ dbBase, key, uid }) => {
        const h = { apikey: key, Authorization: 'Bearer ' + key };
        const del = (p) => fetch(dbBase + '/rest/v1/' + p, { method: 'DELETE', headers: h });
        const deals = await fetch(dbBase + '/rest/v1/deals?select=id&user_id=eq.' + uid, { headers: h }).then(r => r.json());
        await Promise.all([...(deals || []).map(d => del('deals?id=eq.' + d.id)), del('payments?user_id=eq.' + uid), del('content?user_id=eq.' + uid), del('deal_extras?user_id=eq.' + uid), del('profiles?id=eq.' + uid)]);
      }, { dbBase, key, uid }).catch(() => {});
    } catch {}
    await browser.close();
  }
})().catch(e => { console.error('FATAL', e.message); process.exitCode = 1; });