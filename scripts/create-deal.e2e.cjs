#!/usr/bin/env node
/**
 * CREATE-DEAL E2E — verifies deal creation (the POST /api/deals path the
 * New-deal modal AND contract upload both use) works, including the bug that
 * made contract upload fail: the modal's payload includes `post_dates`, which
 * is not a deals column and previously leaked into the deals insert.
 *
 *   a. "By hand" create: standard payload (no post dates) -> deal created.
 *   b. "Contract upload" create: payload WITH post_dates + structure + extras
 *      (what extract-contract + the modal produce) -> deal created AND post
 *      dates land in the content table.
 *   c. Both appear in the deals table and the payments page.
 * Restores/deletes the throwaway account in cleanup.
 * Chromium + webkit. Run before any deploy touching deal creation.
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
const PW = 'CreateDeal123!x';
const TS = Date.now();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const check = (n, c, x) => { results.push({ name: n, pass: !!c }); console.log(`  ${c ? 'PASS' : 'FAIL'}  ${n}` + (x ? '   [' + x + ']' : '')); };
const dbBase = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
const dbKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const HD = { apikey: dbKey, Authorization: 'Bearer ' + dbKey, 'Content-Type': 'application/json' };

(async () => {
  const browser = await ENGINE.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log('  [pageerror]', e.message.slice(0, 160)));
  const email = `createdeal.${TS}@talby.test`;
  const handBrand = `HandDeal${TS.toString().slice(-7)}`;
  const contractBrand = `ContractDeal${TS.toString().slice(-7)}`;
  let uid;
  try {
    console.log(`\n=== CREATE-DEAL E2E — ${BASE_URL} (${process.env.PW_BROWSER || 'chromium'}) ===`);
    await page.goto(`${BASE_URL}/signup`, { waitUntil: 'networkidle' });
    await page.fill('input[type=email]', email); await page.fill('input[type=password]', PW);
    if (await page.locator('input[type=text]').count()) await page.locator('input[type=text]').first().fill('createdeal_user');
    await page.locator('button[type=submit]').first().click(); await sleep(6600);

    // Mirror a full-access user: camquint/camqdesigns/chanelica are allowlisted in
    // has_full_access(), so their payment writes pass RLS. A bare free signup is
    // neither, so set plan_status='active' (the DB gate) to replicate that access.
    uid = await page.evaluate(async ({ dbBase, key, userEmail }) => {
      const h = { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' };
      const w = await fetch(dbBase + '/rest/v1/profiles?select=id&email=eq.' + encodeURIComponent(userEmail), { headers: h }).then(r => r.json());
      if (w && w[0]) { await fetch(dbBase + '/rest/v1/profiles?id=eq.' + w[0].id, { method: 'PATCH', headers: h, body: JSON.stringify({ plan_status: 'active', trial_end: null }) }); return w[0].id; }
      return null;
    }, { dbBase, key: dbKey, userEmail: email });

    // a. create "by hand" via the app's own API (standard payload)
    const hand = await page.evaluate(async ({ base, brand }) => {
      const res = await fetch(base + '/api/deals', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand, payload: { deliverable: 'Hand deliverable', deal_type: 'ugc', status: 'active', value: 1200 } }) });
      return await res.json();
    }, { base: BASE_URL, brand: handBrand });
    check('a. hand create succeeded', !!(hand && hand.deal && hand.deal.id), JSON.stringify(hand.error || '').slice(0, 60));

    // b. create "from contract upload" — payload WITH post_dates + structure + extras
    const contract = await page.evaluate(async ({ base, brand }) => {
      const res = await fetch(base + '/api/deals', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand, payload: {
          deliverable: 'Contract deliverable', deal_type: 'paid_partnership', status: 'active', value: 5000,
          pay_terms: 'net_30', exclusivity_days: 30, revisions_included: '2',
          rep_name: 'Jane Rep', rep_email: 'jane@brand.co',
          post_dates: [ { date: '2026-10-28', label: 'Reel' }, { date: '2026-11-02', label: 'Story 2' } ],
          payment_structure: 'once', structure_timing: 'net_30',
          extras: [ { kind: 'bonus', amount: 500, condition: 'Reel > 100K views' } ],
        } }) });
      return await res.json();
    }, { base: BASE_URL, brand: contractBrand });
    check('b. contract create succeeded (no post_dates column error)', !!(contract && contract.deal && contract.deal.id), JSON.stringify(contract.error || '').slice(0, 80));

    // post dates must have landed in content (not in deals)
    const contentRows = contract && contract.deal ? await page.evaluate(async ({ dbBase, key, dealId }) => {
      const h = { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' };
      return fetch(dbBase + '/rest/v1/content?select=event_date,title&linked_deal_id=eq.' + dealId, { headers: h }).then(r => r.json());
    }, { dbBase, key: dbKey, dealId: contract.deal.id }) : [];
    check('b. post dates persisted to content (2 rows)', Array.isArray(contentRows) && contentRows.length === 2, 'rows=' + (contentRows || []).length);

    // c. both appear in the deals table and payments page
    await page.goto(`${BASE_URL}/app`, { waitUntil: 'networkidle' }); await sleep(2400);
    await page.evaluate(() => { const a = [...document.querySelectorAll('a')].find((x) => x.getAttribute('href') === '/app/deals'); if (a) a.click(); });
    await sleep(2200);
    const dealsBody = await page.locator('body').innerText();
    check('c. hand deal appears in deals table', dealsBody.includes(handBrand));
    check('c. contract deal appears in deals table', dealsBody.includes(contractBrand));
    await page.evaluate(() => { const a = [...document.querySelectorAll('a')].find((x) => x.getAttribute('href') === '/app/payments'); if (a) a.click(); });
    await sleep(2200);
    const payBody = await page.locator('body').innerText();
    check('c. payments page shows both deals (hand $1,200 + contract $5,000)', /\$1,200/.test(payBody) && /\$5,000/.test(payBody), 'payments present');

    const failures = results.filter((r) => !r.pass);
    console.log(`\n=== RESULT: ${results.length - failures.length}/${results.length} passed ===`);
    if (failures.length) { failures.forEach((f) => console.log('  FAIL: ' + f.name)); process.exitCode = 1; }
  } catch (e) { console.error('FATAL', e.message); process.exitCode = 1; }
  finally {
    if (dbBase && dbKey) {
      try {
        const u = await page.evaluate(async ({ dbBase, key, userEmail }) => {
          const h = { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' };
          const w = await fetch(dbBase + '/rest/v1/profiles?select=id&email=eq.' + encodeURIComponent(userEmail), { headers: h }).then(r => r.json());
          return w && w[0] && w[0].id;
        }, { dbBase, key: dbKey, userEmail: email });
        if (u) await page.evaluate(async ({ dbBase, key, u }) => {
          const h = { apikey: key, Authorization: 'Bearer ' + key };
          const del = (p) => fetch(dbBase + '/rest/v1/' + p, { method: 'DELETE', headers: h });
          const deals = await fetch(dbBase + '/rest/v1/deals?select=id&user_id=eq.' + u, { headers: h }).then(r => r.json());
          await Promise.all([...(deals||[]).map(d => del('deals?id=eq.' + d.id)), del('payments?user_id=eq.' + u), del('content?user_id=eq.' + u), del('deal_extras?user_id=eq.' + u), del('profiles?id=eq.' + u)]);
        }, { dbBase, key: dbKey, u }).catch(() => {});
      } catch {}
    }
    await browser.close();
  }
})().catch((e) => { console.error('FATAL', e.message); process.exitCode = 1; });