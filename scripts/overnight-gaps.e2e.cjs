#!/usr/bin/env node
/**
 * OVERNIGHT GAPS E2E — covers Part 1B (reload persistence for the fields not
 * yet asserted after a FULL page reload) and Part 1C (calendar/overview show
 * the new data) on a camquint "Split Test Upfront" clone.
 *   B: change+save -> FULL reload -> reopen -> confirm:
 *        exclusivity, revisions, rep name, rep email, upfront percent,
 *        Paid structure.
 *   C: post date + payment due date appear on the calendar after save (reload);
 *      overview reflects amount.
 * Restores original values at the end. Run before any drawer deploy.
 */
const { chromium, webkit, firefox } = require(process.env.PLAYWRIGHT_PATH || '/opt/homebrew/lib/node_modules/playwright');
const ENGINE = { chromium, webkit, firefox }[process.env.PW_BROWSER || 'chromium'];
const fs = require('fs');
try {
  const envPath = require('path').join(require('path').dirname(require('path').resolve(__filename)), '..', '.env.local');
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].trim();
  }
} catch {}
const BASE_URL = (process.env.BASE_URL || 'https://www.talby.io').replace(/\/$/, '');
const PW = 'OvernightGaps123!x';
const TS = Date.now();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const check = (n, c, x) => { results.push({ name: n, pass: !!c }); console.log(`  ${c ? 'PASS' : 'FAIL'}  ${n}` + (x ? '   [' + x + ']' : '')); };
const dbBase = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
const dbKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const HD = { apikey: dbKey, Authorization: 'Bearer ' + dbKey, 'Content-Type': 'application/json', Prefer: 'return=representation' };
const ORIG = 4800;

(async () => {
  const browser = await ENGINE.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log('  [pageerror]', e.message.slice(0, 160)));
  const email = `gaps.${TS}@talby.test`;
  const brand = `OvernightGaps${TS.toString().slice(-7)}`;
  let dealId, uid, pmId;
  const openDeal = async () => {
    await page.goto(`${BASE_URL}/app/deals`, { waitUntil: 'networkidle' }); await sleep(2300);
    await page.evaluate((b) => { const el = [...document.querySelectorAll('[role=button].deal-row')].find((e) => e.textContent.includes(b)); if (el) el.click(); }, brand); await sleep(1900);
  };
  const openAndExpand = async (re) => { await openDeal(); await page.evaluate((re) => { const b = [...document.querySelectorAll('button[aria-expanded]')].find((x) => re.test(x.textContent.trim()) && x.getAttribute('aria-expanded') === 'false'); if (b) b.click(); }, re); await sleep(1000); };
  const saveDisabled = async () => (await page.locator('button:has-text("Save changes")').first().isDisabled().catch(() => null)) === true;
  const clickSave = async () => { if (!(await saveDisabled())) { await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => /save changes/i.test(x.textContent)); if (b) b.click(); }); await sleep(2800); return true; } return false; };
  try {
    console.log(`\n=== OVERNIGHT GAPS — ${BASE_URL} (${process.env.PW_BROWSER || 'chromium'}) ===`);
    await page.goto(`${BASE_URL}/signup`, { waitUntil: 'networkidle' });
    await page.fill('input[type=email]', email); await page.fill('input[type=password]', PW);
    if (await page.locator('input[type=text]').count()) await page.locator('input[type=text]').first().fill('gaps_user');
    await page.locator('button[type=submit]').first().click(); await sleep(6600);
    // clone camquint split deal: this user is free but creating 1 deal is under cap.
    const seed = await page.evaluate(async ({ dbBase, key, userEmail, brand, orig }) => {
      const H = { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json', Prefer: 'return=representation' };
      const who = await fetch(dbBase + '/rest/v1/profiles?select=id&email=eq.' + encodeURIComponent(userEmail), { headers: H }).then(r => r.json());
      const u = who && who[0] && who[0].id; if (!u) return null;
      const d = await fetch(dbBase + '/rest/v1/deals', { method: 'POST', headers: H, body: JSON.stringify({ user_id: u, brand, deliverable: 'Split deal', deal_type: 'paid_partnership', status: 'active', active: true, value: orig, payment_structure: 'split', structure_upfront_pct: 50, structure_balance_timing: 'net_30' }) }).then(r => r.json()).then(r => (Array.isArray(r) ? r[0] : null));
      const p1 = await fetch(dbBase + '/rest/v1/payments', { method: 'POST', headers: H, body: JSON.stringify({ user_id: u, deal_id: d.id, amount: orig / 2, expected_date: null, status: 'expected', pay_status: 'not_invoiced', bonus_confirmed: true }) }).then(r => r.json()).then(r => (Array.isArray(r) ? r[0] : null));
      const p2 = await fetch(dbBase + '/rest/v1/payments', { method: 'POST', headers: H, body: JSON.stringify({ user_id: u, deal_id: d.id, amount: orig / 2, expected_date: null, status: 'expected', pay_status: 'not_invoiced', bonus_confirmed: true }) });
      return { u, deal: d, pm1: p1 };
    }, { dbBase, key: dbKey, userEmail: email, brand, orig: ORIG });
    if (!seed || !seed.deal) { console.log('  SEED FAILED'); return; }
    uid = seed.u; dealId = seed.deal.id; pmId = seed.pm1 && seed.pm1.id;
    console.log('  cloned split deal, value', ORIG);

    // ==== B. reload persistence for remaining fields ====
    // B1. Rep name + Rep email (Rep contact accordion)
    await openAndExpand(/Rep contact/);
    const rep = page.locator('input[placeholder="Contact name"]').first();
    if (await rep.count()) { await rep.click(); await sleep(300); await page.keyboard.type('Jane'); await page.keyboard.press('Tab'); await sleep(500); }
    const repE = page.locator('input[placeholder="rep@brand.com"]').first();
    if (await repE.count()) { await repE.click(); await sleep(300); await page.keyboard.type('jane@brand.co'); await page.keyboard.press('Tab'); await sleep(500); }
    await clickSave();
    await openAndExpand(/Rep contact/);
    const repV = await page.locator('input[placeholder="Contact name"]').first().inputValue().catch(() => '');
    const repEV = await page.locator('input[placeholder="rep@brand.com"]').first().inputValue().catch(() => '');
    check('B1. rep name + email persisted across reload', repV === 'Jane' && repEV === 'jane@brand.co', 'name=' + repV + ' email=' + repEV);

    // B2. Exclusivity + Revisions (Deal accordion)
    await openAndExpand(/^Deal/);
    const exc = page.locator('input[placeholder="Days"]').first();
    if (await exc.count()) { await exc.click(); await sleep(300); await page.keyboard.type('45'); await page.keyboard.press('Tab'); await sleep(500); }
    const rev = page.locator('input[placeholder="Not set"]').first();
    if (await rev.count()) { await rev.click(); await sleep(300); await page.keyboard.type('3'); await page.keyboard.press('Tab'); await sleep(500); }
    await clickSave();
    await openAndExpand(/^Deal/);
    const excV = await page.locator('input[placeholder="Days"]').first().inputValue().catch(() => '');
    const revV = await page.locator('input[placeholder="Not set"]').first().inputValue().catch(() => '');
    check('B2. exclusivity + revisions persisted across reload', excV === '45' && revV === '3', 'exc=' + excV + ' rev=' + revV);

    // B3. Upfront percent + Paid structure (Payment accordion) — reload
    await openAndExpand(/^Payment/);
    const upI = await page.evaluate(() => { const c = [...document.querySelectorAll('[role=combobox]')].find((x) => /upfront percent/i.test(x.getAttribute('aria-label')||'')); return c ? [...document.querySelectorAll('[role=combobox]')].indexOf(c) : -1; });
    if (upI >= 0) { await page.evaluate((i) => { [...document.querySelectorAll('[role=combobox]')][i].click(); }, upI); await sleep(700); }
    const upPicked = await page.evaluate(() => { const o = [...document.querySelectorAll('[role=option]')].find((x) => /^40%/.test(x.textContent.trim())); if (o) { o.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); o.click(); return true; } return false; });
    await sleep(600);
    await clickSave();
    await openAndExpand(/^Payment/);
    const upV = await page.evaluate(() => { const c = [...document.querySelectorAll('[role=combobox]')].find((x) => /upfront percent/i.test(x.getAttribute('aria-label')||'')); return c ? c.textContent.trim().slice(0, 12) : 'none'; });
    check('B3. upfront percent persisted across reload', /40%/.test(upV), 'upfront=' + upV);

    // B4. Paid structure -> All at once, reload, confirm, then back
    await openAndExpand(/^Payment/);
    const stI = await page.evaluate(() => { const c = [...document.querySelectorAll('[role=combobox]')].find((x) => (x.getAttribute('aria-label')||'') === 'How you get paid'); return c ? [...document.querySelectorAll('[role=combobox]')].indexOf(c) : -1; });
    if (stI >= 0) { await page.evaluate((i) => { [...document.querySelectorAll('[role=combobox]')][i].click(); }, stI); await sleep(700); }
    await page.evaluate(() => { const o = [...document.querySelectorAll('[role=option]')].find((x) => x.textContent.trim() === 'All at once'); if (o) { o.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); o.click(); } }); await sleep(600);
    await clickSave();
    await openAndExpand(/^Payment/);
    const structV = await page.evaluate(() => { const c = [...document.querySelectorAll('[role=combobox]')].find((x) => (x.getAttribute('aria-label')||'') === 'How you get paid'); return c ? c.textContent.trim().slice(0, 16) : 'none'; });
    check('B4. Paid structure (All at once) persisted across reload', /All at once/.test(structV), 'struct=' + structV);

    // ==== C. shows-everywhere: calendar + overview after a payment due date + post date ====
    // give the deal a post date in the CURRENT month (calendar opens on current
    // month) with a distinctive label so it's assertable in the day-cell view.
    await openAndExpand(/^Deal/);
    const addPost = await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => /add another date/i.test(x.textContent)); if (b) { b.click(); return true; } return false; });
    if (addPost) { await sleep(800); const pd = page.locator('input[type=date]').last(); await pd.fill('2026-10-20'); await pd.press('Tab'); await sleep(400); const pl = page.locator('input[aria-label="Post date label"]').first(); if (await pl.count()) { await pl.click(); await pl.type('CalPostCheck'); await page.keyboard.press('Tab'); } await sleep(500); }
    await clickSave();
    await page.goto(`${BASE_URL}/app/calendar`, { waitUntil: 'networkidle' }); await sleep(2500);
    const calBody = await page.locator('body').innerText();
    check('C1. post date appears on the calendar', /CalPostCheck/.test(calBody), 'post label on calendar');

    // C2. set a payment due date -> calendar shows the payment amount that day
    await openAndExpand(/^Payment/);
    await page.evaluate(() => { const cands = [...document.querySelectorAll('button')].filter((b) => /No due date|Due /.test(b.textContent) && b.getBoundingClientRect().width > 150); if (cands[0]) cands[0].click(); });
    await sleep(900);
    const due = page.locator('input[aria-label="Due date"]').first();
    const dueCount = await due.count();
    if (dueCount) { await due.fill('2026-10-25'); await sleep(700); }
    const saved = await clickSave();
    const pmDB = await page.evaluate(async ({ dbBase, key, dealId }) => {
          const h = { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' };
          return fetch(dbBase + '/rest/v1/payments?select=amount,expected_date&deal_id=eq.' + dealId, { headers: h }).then(r => r.json());
        }, { dbBase, key: dbKey, dealId });
        await page.goto(`${BASE_URL}/app/calendar`, { waitUntil: 'networkidle' }); await sleep(2500);
    const calBody2 = await page.locator('body').innerText();
    const hasAmt = Array.isArray(pmDB) && pmDB.some(p => String(p.expected_date || '').startsWith('2026-10-25'));
    check('C2. payment due date persisted to payment row', hasAmt, 'DB expected_date');
    check('C2. payment due date appears on the calendar', hasAmt && /2,400|4,800/.test(calBody2), 'payment amount on calendar');

    // C3. overview reflects the deal amount
    await page.goto(`${BASE_URL}/app`, { waitUntil: 'networkidle' }); await sleep(2500);
    const ovBody = await page.locator('body').innerText();
    check('C3. overview reflects deal amount', /4,800/.test(ovBody), 'overview shows 4800');

    const failures = results.filter((r) => !r.pass);
    console.log(`\n=== RESULT: ${results.length - failures.length}/${results.length} passed ===`);
    if (failures.length) { failures.forEach((f) => console.log('  FAIL: ' + f.name)); process.exitCode = 1; }
  } catch (e) { console.error('FATAL', e.message); process.exitCode = 1; }
  finally {
    if (dbBase && dbKey && dealId && uid) {
      try { await page.evaluate(async ({ dbBase, key, uid }) => {
        const H = { apikey: key, Authorization: 'Bearer ' + key };
        const del = (p) => fetch(dbBase + '/rest/v1/' + p, { method: 'DELETE', headers: H });
        const deals = await fetch(dbBase + '/rest/v1/deals?select=id&user_id=eq.' + uid, { headers: H }).then(r => r.json());
        await Promise.all([...(deals||[]).map(d => del('deals?id=eq.' + d.id)), del('payments?user_id=eq.' + uid), del('content?user_id=eq.' + uid), del('deal_extras?user_id=eq.' + uid), del('profiles?id=eq.' + uid)]);
      }, { dbBase, key: dbKey, uid }).catch(() => {}); } catch {}
    }
    await browser.close();
  }
})().catch((e) => { console.error('FATAL', e.message); process.exitCode = 1; });