#!/usr/bin/env node
/**
 * FREE-CAP EDIT E2E — proves the free active-deal cap blocks only CREATING,
 * never editing. Replicates camqdesigns' exact condition (free plan, deals
 * OVER the 5-active cap) on a throwaway account, then:
 *   1. edit a deal's amount + save  -> SUCCEEDS (no cap error)
 *   2. mark a payment paid + save   -> SUCCEEDS
 *   3. create a new deal            -> shows the free-limit/upgrade message
 *   4. restore the original values
 * Run before every deploy touching the drawer / cap. Chromium + webkit.
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
const PW = 'CapEditPass123!x';
const TS = Date.now();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const check = (n, c, x) => { results.push({ name: n, pass: !!c }); console.log(`  ${c ? 'PASS' : 'FAIL'}  ${n}` + (x ? '   [' + x + ']' : '')); };
const dbBase = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
const dbKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const HD = { apikey: dbKey, Authorization: 'Bearer ' + dbKey, 'Content-Type': 'application/json' };
const CAP = 5;
const EDITED_BRAND = 'BrandOne';

(async () => {
  const browser = await ENGINE.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log('  [pageerror]', e.message.slice(0, 160)));
  const email = `capedit.${TS}@talby.test`;
  let uid, dealId;
  try {
    console.log(`\n=== FREE-CAP EDIT E2E — ${BASE_URL} (${process.env.PW_BROWSER || 'chromium'}) ===`);
    await page.goto(`${BASE_URL}/signup`, { waitUntil: 'networkidle' });
    await page.fill('input[type=email]', email); await page.fill('input[type=password]', PW);
    if (await page.locator('input[type=text]').count()) await page.locator('input[type=text]').first().fill('capedit_user');
    await page.locator('button[type=submit]').first().click(); await sleep(6600);

    // Seed CAP+1 active deals (over the cap) on a now-free user. Insert while
    // the profile is 'paid' so the cap trigger doesn't stop seeding; downgrade
    // after, so the account is free-and-over-cap like camqdesigns.
    const seedRes = await page.evaluate(async ({ dbBase, key, userEmail, cap }) => {
      const H = { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json', Prefer: 'return=representation' };
      const who = await fetch(dbBase + '/rest/v1/profiles?select=id&email=eq.' + encodeURIComponent(userEmail), { headers: H }).then(r => r.json());
      const u = who && who[0] && who[0].id; if (!u) return null;
      await fetch(dbBase + '/rest/v1/profiles?id=eq.' + u, { method: 'PATCH', headers: H, body: JSON.stringify({ plan: 'paid' }) });
      const deals = [];
      for (let i = 0; i < cap + 1; i++) {
        const brand = i === 0 ? 'BrandOne' : 'OverCapBrand' + i;
        const row = await fetch(dbBase + '/rest/v1/deals', { method: 'POST', headers: H, body: JSON.stringify({ user_id: u, brand, deliverable: 'x', deal_type: 'ugc', status: 'active', active: true, value: 1000 + i * 500 }) }).then(r => r.json()).then(r => (Array.isArray(r) ? r[0] : null));
        if (row && row.id) {
          deals.push({ id: row.id, brand });
          await fetch(dbBase + '/rest/v1/payments', { method: 'POST', headers: H, body: JSON.stringify({ user_id: u, deal_id: row.id, amount: 1000 + i * 500, expected_date: null, status: 'expected', pay_status: 'not_invoiced', bonus_confirmed: true }) });
        }
      }
      await fetch(dbBase + '/rest/v1/profiles?id=eq.' + u, { method: 'PATCH', headers: H, body: JSON.stringify({ plan: 'free' }) });
      return { u, deals, count: deals.length };
    }, { dbBase, key: dbKey, userEmail: email, cap: CAP });
    if (!seedRes || !seedRes.u) { console.log('  SEED FAILED'); return; }
    uid = seedRes.u;
    // The free-plan overflow feature hides the OLDEST deals past the cap, so
    // edit the NEWEST (visible in the table) over-cap deal via the UI.
    const editDeal = (seedRes.deals || []).slice(-1)[0];
    dealId = editDeal && editDeal.id;
    const editBrand = (editDeal && editDeal.brand) || 'BrandOne';
    console.log('  seeded free+over-cap deals:', seedRes.count, '| editing visible deal:', editBrand);

    await page.goto(`${BASE_URL}/app`, { waitUntil: 'networkidle' }); await sleep(2500);
    await page.evaluate((id) => { const a = [...document.querySelectorAll('a')].find((x) => x.getAttribute('href') === '/app/deals'); if (a) a.click(); }, dealId);
    await sleep(2000);
    // open the edit deal drawer
    await page.evaluate((b) => { const el = [...document.querySelectorAll('[role=button].deal-row')].find((e) => e.textContent.includes(b)); if (el) el.click(); }, editBrand);
    await sleep(1800);

    // --- 1. edit amount -> save succeeds (no cap error) ---
    const amt = page.locator('input[aria-label="Deal amount"]').first();
    const origVal = await amt.inputValue().catch(() => '');
    const origNum = Number(String(origVal).replace(/[^0-9.]/g, '')) || 1000;
    await amt.click(); await sleep(400);
    await page.keyboard.press('Meta+A'); await page.keyboard.type(String(origNum + 777)); await page.keyboard.press('Tab'); await sleep(700);
    const saveDisabled = async () => (await page.locator('button:has-text("Save changes")').first().isDisabled().catch(() => null)) === true;
    check('1. Save enabled after amount edit (at over-cap)', !(await saveDisabled()));
    await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => /save changes/i.test(x.textContent)); if (b) b.click(); });
    await sleep(2800);
    const bodyAfterEdit = await page.locator('body').innerText();
    check('1. edit + save succeeded (no cap error)', !/max deals|active-deal limit|limited to \d+ active/.test(bodyAfterEdit) && /changes saved/i.test(bodyAfterEdit));

    // --- 2. mark a payment paid + save succeeds ---
    await page.evaluate(() => { const b = [...document.querySelectorAll('button[aria-expanded]')].find((x) => /^Payment/.test(x.textContent.trim()) && x.getAttribute('aria-expanded') === 'false'); if (b) b.click(); });
    await sleep(1200);
    await page.evaluate(() => { const cands = [...document.querySelectorAll('button')].filter((b) => /No due date|Not invoiced|Invoiced|Due /.test(b.textContent) && b.getBoundingClientRect().width > 150); if (cands[0]) cands[0].click(); });
    await sleep(900);
    const stI = await page.evaluate(() => { const c = [...document.querySelectorAll('[role=combobox]')].find((x) => (x.getAttribute('aria-label')||'') === 'Status' || /invoiced|paid|not invoiced/i.test(x.textContent)); return c ? [...document.querySelectorAll('[role=combobox]')].indexOf(c) : -1; });
    if (stI >= 0) { await page.evaluate((i) => { [...document.querySelectorAll('[role=combobox]')][i].click(); }, stI); await sleep(700); }
    const paid = await page.evaluate(() => { const o = [...document.querySelectorAll('[role=option]')].find((x) => x.textContent.trim() === 'Paid'); if (o) { o.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); o.click(); return true; } return false; });
    await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Done'); if (b) b.click(); }); await sleep(600);
    check('2. payment marked Paid', paid === true);
    if (!(await saveDisabled())) {
      await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => /save changes/i.test(x.textContent)); if (b) b.click(); });
      await sleep(2800);
      const b2 = await page.locator('body').innerText();
      check('2. mark-paid + save succeeded (no cap error)', !/max deals|active-deal limit|limited to \d+ active/.test(b2));
    } else { console.log('  (mark-paid made no change to save)'); }

    // close drawer, then
    await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => (x.getAttribute('aria-label')||'').toLowerCase().includes('close')); if (b) b.click(); }); await sleep(800);

    // --- 3. creating a new deal shows the free-limit/upgrade message ---
    await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => /add deal/i.test(x.textContent)); if (b) b.click(); });
    await sleep(1200);
    const addBody = await page.locator('body').innerText();
    check('3. new-deal modal shows free-limit message', /reached the free-plan limit|free plan.{0,30}limit|Go unlimited|archive a deal/i.test(addBody), 'banner present');

    // --- 4. restore the edited amount back to its original (the throwaway deal
    // and account are deleted in cleanup; restoring via service role is exact) ---
    const restored = await page.evaluate(async ({ dbBase, key, dealId, origNum }) => {
      const H = { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' };
      const r = await fetch(dbBase + '/rest/v1/deals?id=eq.' + dealId, { method: 'PATCH', headers: H, body: JSON.stringify({ value: origNum }) });
      const row = await fetch(dbBase + '/rest/v1/deals?select=value&id=eq.' + dealId, { headers: H }).then(res => res.json());
      return { ok: r.ok, value: row && row[0] && row[0].value };
    }, { dbBase, key: dbKey, dealId, origNum });
    check('4. original value restored', restored.ok && Number(restored.value) === origNum, 'value=' + restored.value);

    const failures = results.filter((r) => !r.pass);
    console.log(`\n=== RESULT: ${results.length - failures.length}/${results.length} passed ===`);
    if (failures.length) { failures.forEach((f) => console.log('  FAIL: ' + f.name)); process.exitCode = 1; }
  } catch (e) { console.error('FATAL', e.message); process.exitCode = 1; }
  finally {
    if (dbBase && dbKey && dealId && uid) {
      try { await page.evaluate(async ({ base, h, uid }) => {
        const del = (p) => fetch(base + '/rest/v1/' + p, { method: 'DELETE', headers: h }).then((r) => r);
        const deals = await fetch(base + '/rest/v1/deals?select=id&user_id=eq.' + uid, { headers: h }).then(r => r.json());
        await Promise.all([...(deals||[]).map(d => del('deals?id=eq.' + d.id)), del('payments?user_id=eq.' + uid), del('content?user_id=eq.' + uid), del('profiles?id=eq.' + uid)]);
      }, { base: dbBase, h: { apikey: dbKey, Authorization: 'Bearer ' + dbKey }, uid }).catch(() => {}); } catch {}
    }
    await browser.close();
  }
})().catch((e) => { console.error('FATAL', e.message); process.exitCode = 1; });