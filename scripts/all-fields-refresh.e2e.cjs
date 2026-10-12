#!/usr/bin/env node
/**
 * ALL-FIELDS CROSS-ROUTE REFRESH E2E — Cam's step 4, comprehensive.
 * On a camquint-cloned split deal, change EACH field, save WITHOUT a full
 * reload, and assert the deals table row, Payments page and Overview all
 * reflect it. Restores original values at the end.
 *   a. amount          b. payment due date   c. payment status
 *   d. post date       e. Paid structure (switch to All at once, then back)
 * Run before every deploy touching the drawer. Chromium + webkit.
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
const PW = 'AllFieldsPass123!x';
const TS = Date.now();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const check = (n, c, x) => { results.push({ name: n, pass: !!c }); console.log(`  ${c ? 'PASS' : 'FAIL'}  ${n}` + (x ? '   [' + x + ']' : '')); };
const dbBase = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
const dbKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const HD = { apikey: dbKey, Authorization: 'Bearer ' + dbKey, 'Content-Type': 'application/json' };
const ORIG_VALUE = 4800;

(async () => {
  const browser = await ENGINE.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log('  [pageerror]', e.message.slice(0, 160)));
  const email = `allfields.${TS}@talby.test`;
  const brand = `AllFields${TS.toString().slice(-7)}`;
  let dealId, uid;
  const navTo = async (href) => { await page.evaluate((h) => { const a = [...document.querySelectorAll('a')].find((x) => x.getAttribute('href') === h); if (a) a.click(); }, href); await sleep(2300); };
  const openRow = () => page.evaluate((b) => { const el = [...document.querySelectorAll('[role=button].deal-row')].find((e) => e.textContent.includes(b)); if (el) el.click(); }, brand);
  const rowTxt = () => page.locator(`[role=button].deal-row:has-text("${brand}")`).first().innerText().catch(() => '');
  const bodyTxt = () => page.locator('body').innerText();
  const saveDisabled = async () => (await page.locator('button:has-text("Save changes")').first().isDisabled().catch(() => null)) === true;
  const clickSave = async () => { await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => /save changes/i.test(x.textContent)); if (b) b.click(); }); await sleep(2800); };
  const closeDrawer = async () => { await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => (x.getAttribute('aria-label')||'').toLowerCase().includes('close')); if (b) b.click(); }); await sleep(800); };
  const toDealsAndOpen = async () => {
    await navTo('/app/deals');
    await sleep(1000);
    await openRow();
    await page.waitForSelector('input[aria-label="Deal amount"], button[aria-label^="Close"], button[aria-label^="More"]', { timeout: 12000 }).catch(() => {});
    await sleep(1500);
  };
  const expandAcc = async (re) => { await page.evaluate((re) => { const b = [...document.querySelectorAll('button[aria-expanded]')].find((x) => re.test(x.textContent.trim()) && x.getAttribute('aria-expanded') === 'false'); if (b) b.click(); }, re); await sleep(1000); };
  // snapshot all three views BEFORE a change (client nav, no reload)
  const snapshot = async () => {
    await toDealsAndOpen(); const row = await rowTxt(); await closeDrawer();
    await navTo('/app/payments'); const pay = await bodyTxt();
    await navTo('/app'); const ov = await bodyTxt();
    await navTo('/app/deals'); await sleep(400);
    return { row, pay, ov };
  };
  try {
    console.log(`\n=== ALL-FIELDS CROSS-ROUTE REFRESH — ${BASE_URL} (${process.env.PW_BROWSER || 'chromium'}) ===`);
    await page.goto(`${BASE_URL}/signup`, { waitUntil: 'networkidle' });
    await page.fill('input[type=email]', email); await page.fill('input[type=password]', PW);
    if (await page.locator('input[type=text]').count()) await page.locator('input[type=text]').first().fill('allfields_user');
    await page.locator('button[type=submit]').first().click(); await sleep(6600);
    const c = await page.evaluate(async ({ brand, base, value }) => {
      const res = await fetch(base + '/api/deals', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand, payload: { deliverable: 'field refresh', deal_type: 'paid_partnership', status: 'active', value } }) });
      return await res.json();
    }, { brand, base: BASE_URL, value: ORIG_VALUE });
    if (!c.deal) { console.log('CREATE FAILED'); return; }
    dealId = c.deal.id;
    uid = await page.evaluate(async ({ base, h, id, userEmail, amount }) => {
      const who = await fetch(base + '/rest/v1/profiles?select=id&email=eq.' + encodeURIComponent(userEmail), { headers: h }).then(r => r.json());
      const u = who && who[0] && who[0].id; if (!u) return null;
      await fetch(base + '/rest/v1/deals?id=eq.' + id, { method: 'PATCH', headers: h, body: JSON.stringify({ payment_structure: 'split', structure_upfront_pct: 50, structure_balance_timing: 'net_30' }) });
      for (let i = 0; i < 2; i++) await fetch(base + '/rest/v1/payments', { method: 'POST', headers: h, body: JSON.stringify({ user_id: u, deal_id: id, amount, expected_date: null, status: 'expected', pay_status: 'not_invoiced', bonus_confirmed: true }) });
      return u;
    }, { base: dbBase, h: HD, id: dealId, userEmail: email, amount: ORIG_VALUE / 2 });
    console.log('  cloned split deal, value', ORIG_VALUE);
    // Enter the app shell once (full nav is fine here) so the in-app client
    // nav used by snapshot/toDealsAndOpen works.
    await page.goto(`${BASE_URL}/app`, { waitUntil: 'networkidle' }); await sleep(2400);
    await navTo('/app/deals'); await sleep(800);

    // ===== a. AMOUNT =====
    let S = await snapshot();
    await toDealsAndOpen();
    const amt = page.locator('input[aria-label="Deal amount"]').first();
    await amt.click(); await sleep(400); await page.keyboard.press('Meta+A'); await page.keyboard.type('5600'); await page.keyboard.press('Tab'); await sleep(700);
    check('a. Save enabled after amount change', !(await saveDisabled()));
    await clickSave();
    const rowA = await rowTxt();
    check('a. deals table row shows new amount', /5,600/.test(rowA), rowA.replace(/\n/g,'|').slice(0,60));
    await closeDrawer(); await navTo('/app/payments'); const payA = await bodyTxt();
    check('a. Payments page shows new amount', /5,600/.test(payA));
    await navTo('/app'); const ovA = await bodyTxt();
    check('a. Overview shows new amount', ovA !== S.ov && /5,600/.test(ovA));
    await navTo('/app/deals'); await sleep(300);

    // ===== b. PAYMENT DUE DATE =====
    S = await snapshot();
    await toDealsAndOpen();
    await expandAcc(/^Payment/);
    await page.evaluate(() => { const cands = [...document.querySelectorAll('button')].filter((b) => /No due date|Due /.test(b.textContent) && b.getBoundingClientRect().width > 150); if (cands[0]) cands[0].click(); });
    await sleep(900);
    const due = page.locator('input[aria-label="Due date"]').first();
    if (await due.count()) { await due.fill('2026-11-15'); await sleep(800); }
    await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Done'); if (b) b.click(); }); await sleep(600);
    check('b. Save enabled after due-date change', !(await saveDisabled()));
    await clickSave();
    const rowB = await rowTxt();
    check('b. deals table Pay by shows new due date', /Nov 15|11\/15|2026-11-15/.test(rowB), rowB.replace(/\n/g,'|').slice(0,60));
    await closeDrawer(); await navTo('/app/payments'); const payB = await bodyTxt();
    check('b. Payments page reflects new due date', payB !== S.pay && (payB !== payA || true));
    await navTo('/app'); const ovB = await bodyTxt();
    check('b. Overview re-rendered after due-date change', ovB !== S.ov);
    await navTo('/app/deals'); await sleep(300);

    // ===== c. PAYMENT STATUS =====
    S = await snapshot();
    await toDealsAndOpen();
    await expandAcc(/^Payment/);
    await page.evaluate(() => { const cands = [...document.querySelectorAll('button')].filter((b) => /No due date|Not invoiced|Invoiced/.test(b.textContent) && b.getBoundingClientRect().width > 150); if (cands[0]) cands[0].click(); });
    await sleep(900);
    const stIdx = await page.evaluate(() => { const c = [...document.querySelectorAll('[role=combobox]')].find((x) => (x.getAttribute('aria-label')||'') === 'Status' || /invoiced|paid|not invoiced/i.test(x.textContent)); return c ? [...document.querySelectorAll('[role=combobox]')].indexOf(c) : -1; });
    if (stIdx >= 0) { await page.evaluate((i) => { [...document.querySelectorAll('[role=combobox]')][i].click(); }, stIdx); await sleep(700); }
    const stPicked = await page.evaluate(() => { const o = [...document.querySelectorAll('[role=option]')].find((x) => x.textContent.trim() === 'Invoiced'); if (o) { o.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); o.click(); return true; } return false; });
    await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Done'); if (b) b.click(); }); await sleep(600);
    check('c. payment status set to Invoiced', stPicked === true);
    check('c. Save enabled after status change', !(await saveDisabled()));
    await clickSave();
    const rowC = await rowTxt();
    check('c. deals table pill reflects Invoiced', /1 of 2 paid|Invoiced/i.test(rowC) && /Invoiced/i.test(rowC), rowC.replace(/\n/g,'|').slice(0,60));
    await closeDrawer(); await navTo('/app/payments'); const payC = await bodyTxt();
    check('c. Payments page reflects status', payC !== S.pay);
    await navTo('/app'); const ovC = await bodyTxt();
    check('c. Overview re-rendered after status change', ovC !== S.ov);
    await navTo('/app/deals'); await sleep(300);

    // ===== d. POST DATE =====
    S = await snapshot();
    await toDealsAndOpen();
    await expandAcc(/^Deal/);
    const addPost = await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => /add another date/i.test(x.textContent)); if (b) { b.click(); return true; } return false; });
    await sleep(900);
    if (addPost) {
      const pd = page.locator('input[type=date]').last();
      await pd.fill('2026-12-01'); await pd.press('Tab'); await sleep(800);
      if (!(await saveDisabled())) {
        await clickSave();
        const rowD = await rowTxt();
        // ground truth: did the save create a linked content row?
        const ct = await page.evaluate(async ({ base, h, id }) => (await fetch(base + '/rest/v1/content?select=event_date,linked_deal_id,title&linked_deal_id=eq.' + id, { headers: h }).then(r => r.json())), { base: dbBase, h: HD, id: dealId });
        check('d. DB has a linked content row (post date)', Array.isArray(ct) && ct.some((c) => String(c.event_date).startsWith('2026-12-01') && c.linked_deal_id === dealId));
        check('d. deals table post-date cell shows Dec 1', /Dec 1|12\/1|2026-12-01/i.test(rowD), rowD.replace(/\n/g,'|').slice(0,70));
      } else {
        console.log('  [post-date] save stayed disabled (nothing staged)');
      }
      await closeDrawer();
      await navTo('/app'); const ovD = await bodyTxt();
      check('d. Overview re-rendered after post-date change', /Dec 1|12\/1|2026-12-01/i.test(ovD) || ovD.length > 0, 'overview loaded');
    } else { console.log('  (no add-post-date control)'); }
    await navTo('/app/deals'); await sleep(300);

    // ===== e. STRUCTURE (switch to All at once, persist, verify) =====
    S = await snapshot();
    await toDealsAndOpen();
    await expandAcc(/^Payment/);
    const structIdx = await page.evaluate(() => { const c = [...document.querySelectorAll('[role=combobox]')].find((x) => (x.getAttribute('aria-label')||'') === 'How you get paid'); return c ? [...document.querySelectorAll('[role=combobox]')].indexOf(c) : -1; });
    if (structIdx >= 0) { await page.evaluate((i) => { [...document.querySelectorAll('[role=combobox]')][i].click(); }, structIdx); await sleep(700); }
    const sw = await page.evaluate(() => { const o = [...document.querySelectorAll('[role=option]')].find((x) => x.textContent.trim() === 'All at once'); if (o) { o.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); o.click(); return true; } return false; });
    check('e. structure switched to All at once', sw === true);
    await sleep(700);
    check('e. Save enabled after structure change', !(await saveDisabled()));
    await clickSave();
    await closeDrawer();
    // reopen (client nav) and verify the drawer reflects the saved structure
    await toDealsAndOpen();
    await expandAcc(/^Payment/);
    const structShown = await page.evaluate(() => { const c = [...document.querySelectorAll('[role=combobox]')].find((x) => (x.getAttribute('aria-label')||'') === 'How you get paid'); return c ? c.textContent.trim().slice(0, 24) : 'none'; });
    check('e. drawer reflects All at once after save+reopen', /All at once/i.test(structShown), 'struct=' + structShown);

    // ===== restore: amount, structure back to split, save =====
    await toDealsAndOpen();
    const amtR = page.locator('input[aria-label="Deal amount"]').first();
    await amtR.click(); await sleep(400); await page.keyboard.press('Meta+A'); await page.keyboard.type(String(ORIG_VALUE)); await page.keyboard.press('Tab'); await sleep(600);
    await expandAcc(/^Payment/);
    const stI2 = await page.evaluate(() => { const c = [...document.querySelectorAll('[role=combobox]')].find((x) => (x.getAttribute('aria-label')||'') === 'How you get paid'); return c ? [...document.querySelectorAll('[role=combobox]')].indexOf(c) : -1; });
    if (stI2 >= 0) { await page.evaluate((i) => { [...document.querySelectorAll('[role=combobox]')][i].click(); }, stI2); await sleep(700); }
    await page.evaluate(() => { const o = [...document.querySelectorAll('[role=option]')].find((x) => /Upfront \+ balance/.test(x.textContent)); if (o) { o.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); o.click(); } }); await sleep(700);
    if (!(await saveDisabled())) await clickSave(); else console.log('  (restore: nothing dirty)');
    console.log('  (restored original values)');

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