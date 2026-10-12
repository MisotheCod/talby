#!/usr/bin/env node
/**
 * CROSS-ROUTE REFRESH E2E — proves a save in the deal drawer (or a payment
 * status change) refreshes the deals table, Payments page and Overview WITHOUT
 * a full page reload. This was broken because Next.js App Router's client
 * cache keeps visited routes mounted, so they kept stale data until a hard
 * reload.
 *
 * Reproduces the exact stale scenario: pre-visit Payments + Overview (so the
 * router cache holds their mounted, old-data components), mutate on Deals, then
 * return to each via CLIENT-side navigation (no reload) and assert fresh data.
 *
 * Uses a throwaway account cloned from camquint's real "Split Test Upfront"
 * deal (2x $2400 payments, split). Restores original values at the end.
 *
 * Usage: BASE_URL=https://www.talby.io node scripts/cross-route-refresh.e2e.cjs
 *        PW_BROWSER=webkit ... (also run webkit for the iPad engine)
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
const PW = 'XRoutePass123!x';
const TS = Date.now();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const check = (n, c, x) => { results.push({ name: n, pass: !!c }); console.log(`  ${c ? 'PASS' : 'FAIL'}  ${n}` + (x ? '   [' + x + ']' : '')); };
const dbBase = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
const dbKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const HD = { apikey: dbKey, Authorization: 'Bearer ' + dbKey, 'Content-Type': 'application/json' };
const ORIG_VALUE = 4800;
const NEW_VALUE = 5600;

(async () => {
  const browser = await ENGINE.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log('  [pageerror]', e.message.slice(0, 160)));
  const email = `xroute.${TS}@talby.test`;
  const brand = `XRoute${TS.toString().slice(-7)}`;
  let dealId, uid;
  const navTo = async (href) => {
    await page.evaluate((h) => { const a = [...document.querySelectorAll('a')].find((x) => x.getAttribute('href') === h); if (a) a.click(); }, href);
    await sleep(2400);
  };
  const openRow = () => page.evaluate((b) => { const el = [...document.querySelectorAll('[role=button].deal-row')].find((e) => e.textContent.includes(b)); if (el) el.click(); }, brand);
  const saveDisabled = async () => (await page.locator('button:has-text("Save changes")').first().isDisabled().catch(() => null)) === true;
  const clickSave = async () => {
    await page.locator('button:has-text("Save changes")').first().click({ force: true }).catch(async () => {
      await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => /save changes/i.test(x.textContent)); if (b) b.click(); });
    });
    await sleep(2500);
  };
  const closeDrawer = async () => {
    await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => (x.getAttribute('aria-label') || '').toLowerCase().includes('close') || /^Close$/i.test((x.getAttribute('aria-label') || ''))); if (b) b.click(); });
    await sleep(900);
  };
  const openDrawerAndPaymentAcc = async () => {
    // CLIENT-side nav to Deals + row-click, never a full goto — so the cached
    // Payments/Overview stay mounted (the stale scenario the fix must solve).
    await navTo('/app/deals');
    await openRow(); await sleep(1800);
    await page.evaluate(() => { const b = [...document.querySelectorAll('button[aria-expanded]')].find((x) => /^Payment/.test(x.textContent.trim()) && x.getAttribute('aria-expanded') === 'false'); if (b) b.click(); });
    await sleep(1200);
  };
  try {
    console.log(`\n=== CROSS-ROUTE REFRESH E2E — ${BASE_URL} (${process.env.PW_BROWSER || 'chromium'}) ===`);

    // ---- setup: clone camquint's split deal (2x $2400) under a throwaway ----
    await page.goto(`${BASE_URL}/signup`, { waitUntil: 'networkidle' });
    await page.fill('input[type=email]', email); await page.fill('input[type=password]', PW);
    if (await page.locator('input[type=text]').count()) await page.locator('input[type=text]').first().fill('xroute_user');
    await page.locator('button[type=submit]').first().click(); await sleep(6600);
    const c = await page.evaluate(async ({ brand, base, value }) => {
      const res = await fetch(base + '/api/deals', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand, payload: { deliverable: 'split refresh', deal_type: 'paid_partnership', status: 'active', value } }) });
      return await res.json();
    }, { brand, base: BASE_URL, value: ORIG_VALUE });
    if (!c.deal) { console.log('  CREATE FAILED'); return; }
    dealId = c.deal.id;
    const seed = await page.evaluate(async ({ base, h, id, userEmail, amount }) => {
      const who = await fetch(base + '/rest/v1/profiles?select=id&email=eq.' + encodeURIComponent(userEmail), { headers: h }).then((r) => r.json());
      const u = who && who[0] && who[0].id; if (!u) return null;
      await fetch(base + '/rest/v1/deals?id=eq.' + id, { method: 'PATCH', headers: h, body: JSON.stringify({ payment_structure: 'split', structure_upfront_pct: 50, structure_balance_timing: 'net_30' }) });
      for (let i = 0; i < 2; i++) await fetch(base + '/rest/v1/payments', { method: 'POST', headers: h, body: JSON.stringify({ user_id: u, deal_id: id, amount, expected_date: null, status: 'expected', pay_status: 'not_invoiced', bonus_confirmed: true }) });
      return u;
    }, { base: dbBase, h: HD, id: dealId, userEmail: email, amount: ORIG_VALUE / 2 });
    if (!seed) { console.log('  SEED FAILED'); return; }
    uid = seed;
    console.log('  cloned split deal. original value:', ORIG_VALUE);

    // ---- pre-visit Payments + Overview so the router cache holds them (stale scenario) ----
    await page.goto(`${BASE_URL}/app`, { waitUntil: 'networkidle' }); await sleep(2400);
    await navTo('/app/payments'); await sleep(400);
    const prePay = await page.locator('body').innerText();
    await navTo('/app'); await sleep(400);
    console.log('  (pre-visited Overview + Payments; baseline payments body has 4,800:', /4,800/.test(prePay) + ')');

    // ---- go to Deals, open clone, change amount to 5600, save (broadcast) ----
    await openDrawerAndPaymentAcc();
    const amt = page.locator('input[aria-label="Deal amount"]').first();
    await amt.click(); await sleep(400);
    await page.keyboard.press('Meta+A'); await page.keyboard.type(String(NEW_VALUE)); await page.keyboard.press('Tab'); await sleep(700);
    check('4b. Save enabled after amount change', !(await saveDisabled()));
    await clickSave();
    check('4b. "Changes saved" toast', /changes saved/i.test(await page.locator('body').innerText()));

    // ---- 3. row BEHIND the open drawer updates (no reload) ----
    const rowTxt = await page.locator(`[role=button].deal-row:has-text("${brand}")`).first().innerText().catch(() => '');
    check('3. deals table row behind shows new amount', /5,600/.test(rowTxt), 'row="' + rowTxt.replace(/\n/g, '|').slice(0, 60) + '"');

    // close the drawer (still on /app/deals, client-side) then navigate
    await closeDrawer();
    // ---- 4c. Payments page updates WITHOUT reload (client nav) ----
    await navTo('/app/payments');
    const payBody = await page.locator('body').innerText();
    check('4c. Payments page shows new amount without reload', /5,600/.test(payBody));

    // ---- 4c. Overview updates WITHOUT reload ----
    await navTo('/app');
    const ovBody = await page.locator('body').innerText();
    check('4c. Overview shows new amount without reload', /5,600/.test(ovBody));

    // ---- 4d. Mark ONE payment Paid in the drawer -> table, payments, overview ----
    await openDrawerAndPaymentAcc();
    const beforeRow = await page.locator(`[role=button].deal-row:has-text("${brand}")`).first().innerText().catch(() => '');
    // click the first schedule row -> Status editor opens
    await page.evaluate(() => {
      const cands = [...document.querySelectorAll('button')].filter((b) => /No due date|Not invoiced/.test(b.textContent) && b.getBoundingClientRect().width > 120);
      if (cands[0]) cands[0].click();
    });
    await sleep(1000);
    // click the Status combobox, pick "Paid"
    const statusIdx = await page.evaluate(() => {
      const c = [...document.querySelectorAll('[role=combobox]')].find((x) => (x.getAttribute('aria-label') || '') === 'Status' || /not invoiced|invoiced|paid/i.test(x.textContent));
      return c ? [...document.querySelectorAll('[role=combobox]')].indexOf(c) : -1;
    });
    if (statusIdx >= 0) { await page.evaluate((i) => { [...document.querySelectorAll('[role=combobox]')][i].click(); }, statusIdx); await sleep(800); }
    const marked = await page.evaluate(() => { const o = [...document.querySelectorAll('[role=option]')].find((x) => x.textContent.trim() === 'Paid'); if (o) { o.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); o.click(); return true; } return false; });
    check('4d. payment marked Paid in editor', marked === true);
    await sleep(800);
    check('4d. Save enabled after marking paid', !(await saveDisabled()));
    await clickSave();
    const afterRow = await page.locator(`[role=button].deal-row:has-text("${brand}")`).first().innerText().catch(() => '');
    check('4d. deals table Payment pill updated (1 of 2 paid)', /1 of 2 paid/i.test(afterRow) && !/1 of 2 paid/i.test(beforeRow), 'row="' + afterRow.replace(/\n/g, '|').slice(0, 70) + '"');

    await closeDrawer();
    await navTo('/app/payments');
    const payPaid = await page.locator('body').innerText();
    // The paid payment moved out of "Expected" (2 -> 1 expected payment) and the
    // deal value chip reflects $5,600 — both only possible if the page refetched.
    check('4d. Payments page reflects the paid payment', /1 payment/i.test(payPaid) && /5,600/.test(payPaid) && payPaid !== payBody, 'Expected=1 payment, value=$5,600');

    await navTo('/app');
    const ovPaid = await page.locator('body').innerText();
    check('4d. Overview totals updated after marking paid', ovPaid !== ovBody, 'overview refreshed');

    // ---- 4e. restore original values ----
    await openDrawerAndPaymentAcc();
    const amtR = page.locator('input[aria-label="Deal amount"]').first();
    await amtR.click(); await sleep(400); await page.keyboard.press('Meta+A'); await page.keyboard.type(String(ORIG_VALUE)); await page.keyboard.press('Tab'); await sleep(600);
    // restore the paid payment back to Not invoiced
    await page.evaluate(() => {
      const cands = [...document.querySelectorAll('button')].filter((b) => (/Paid/.test(b.textContent) || /No due date/.test(b.textContent)) && b.getBoundingClientRect().width > 120);
      if (cands[0]) cands[0].click();
    });
    await sleep(1000);
    const stR = await page.evaluate(() => {
      const c = [...document.querySelectorAll('[role=combobox]')].find((x) => (x.getAttribute('aria-label') || '') === 'Status' || /paid|not invoiced/i.test(x.textContent));
      return c ? [...document.querySelectorAll('[role=combobox]')].indexOf(c) : -1;
    });
    if (stR >= 0) { await page.evaluate((i) => { [...document.querySelectorAll('[role=combobox]')][i].click(); }, stR); await sleep(800); }
    await page.evaluate(() => { const o = [...document.querySelectorAll('[role=option]')].find((x) => /^Not invoiced/.test(x.textContent)); if (o) { o.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); o.click(); } }); await sleep(800);
    await clickSave();
    console.log('  (restored original value + payment status)');

    const failures = results.filter((r) => !r.pass);
    console.log(`\n=== RESULT: ${results.length - failures.length}/${results.length} passed ===`);
    if (failures.length) { failures.forEach((f) => console.log('  FAIL: ' + f.name)); process.exitCode = 1; }
  } catch (e) { console.error('FATAL', e.message); process.exitCode = 1; }
  finally {
    if (dbBase && dbKey && dealId) {
      try { await page.evaluate(async ({ base, h, dealId, uid }) => {
        const del = (p) => fetch(base + '/rest/v1/' + p, { method: 'DELETE', headers: h }).then((r) => r.ok);
        await Promise.all([del('deals?id=eq.' + encodeURIComponent(dealId)), uid ? del('profiles?id=eq.' + encodeURIComponent(uid)) : Promise.resolve(true)]);
      }, { base: dbBase, h: { apikey: dbKey, Authorization: 'Bearer ' + dbKey }, dealId, uid }).catch(() => {}); } catch {}
    }
    await browser.close();
  }
})().catch((e) => { console.error('FATAL', e.message); process.exitCode = 1; });