#!/usr/bin/env node
/**
 * PER-TAB SAVE REPRO — signs up a throwaway, seeds a realistic deal (payments
 * + checklist + notes), opens the drawer, and after editing EACH surface
 * reports whether the Save button enables (dirty flag). Isolates exactly which
 * edit path leaves hasChanges false (= Save greyed out).
 */
const { chromium, webkit } = require(process.env.PLAYWRIGHT_PATH || '/opt/homebrew/lib/node_modules/playwright');
const ENGINE = { chromium, webkit }[process.env.PW_BROWSER || 'chromium'];
const fs = require('fs');
try {
  const envPath = require('path').join(require('path').dirname(require('path').resolve(__filename)), '..', '.env.local');
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].trim();
  }
} catch {}
const BASE_URL = (process.env.BASE_URL || 'https://www.talby.io').replace(/\/$/, '');
const PW = 'PerTabPass123!x';
const TS = Date.now();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const check = (name, cond) => { results.push({ name, pass: !!cond }); console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${name}`); };

(async () => {
  const browser = await ENGINE.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log('  [pageerror]', e.message.slice(0, 160)));
  const email = `pertab.${TS}@talby.test`;
  const brand = `PerTab${TS.toString().slice(-7)}`;
  let dealId;

  try {
    console.log(`\n=== PER-TAB SAVE REPRO — ${BASE_URL} (${process.env.PW_BROWSER || 'chromium'}) ===`);
    await page.goto(`${BASE_URL}/signup`, { waitUntil: 'networkidle' });
    await page.fill('input[type=email]', email);
    await page.fill('input[type=password]', PW);
    if (await page.locator('input[type=text]').count()) await page.locator('input[type=text]').first().fill('pertab_user');
    await page.locator('button[type=submit]').first().click();
    await sleep(6500);

    const created = await page.evaluate(async ({ brand, base }) => {
      const res = await fetch(base + '/api/deals', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand, payload: { deliverable: 'PerTabTest', deal_type: 'ugc', status: 'active', value: 1250 } }) });
      return await res.json();
    }, { brand, base: BASE_URL });
    if (!created.deal) { console.log('CREATE FAILED', JSON.stringify(created).slice(0, 200)); return; }
    dealId = created.deal.id;

    // Seed realistic children via service role: payment + checklist + note.
    const dbBase = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
    const dbKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    const seeded = await page.evaluate(async ({ base, key, id, userEmail }) => {
      const h = { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' };
      const who = await fetch(base + '/rest/v1/profiles?select=id&email=eq.' + encodeURIComponent(userEmail), { headers: h }).then((r) => r.json()).then((r) => (r && r[0]) || null);
      if (!who) return { ok: false, why: 'profile-not-found' };
      const uid = who.id;
      const pm = await fetch(base + '/rest/v1/payments', { method: 'POST', headers: h, body: JSON.stringify({ user_id: uid, deal_id: id, amount: 1250, expected_date: null, status: 'expected', pay_status: 'not_invoiced', bonus_confirmed: true }) });
      const pmTxt = await pm.text();
      const cl = await fetch(base + '/rest/v1/deal_checklist', { method: 'POST', headers: h, body: JSON.stringify({ user_id: uid, deal_id: id, title: 'Send brief', done: false }) });
      const clTxt = await cl.text();
      const nt = await fetch(base + '/rest/v1/deals?id=eq.' + encodeURIComponent(id), { method: 'PATCH', headers: h, body: JSON.stringify({ notes: 'original note' }) });
      const ntTxt = await nt.text();
      return { ok: pm.ok && cl.ok && nt.ok, pm: [pm.status, pmTxt.slice(0, 120)], cl: [cl.status, clTxt.slice(0, 120)], nt: [nt.status, ntTxt.slice(0, 120)] };
    }, { base: dbBase, key: dbKey, id: dealId, userEmail: email });
    console.log('  seeded children:', JSON.stringify(seeded));

    await page.goto(`${BASE_URL}/app/deals`, { waitUntil: 'networkidle' });
    await sleep(2500);
    await page.evaluate((b) => { const el = [...document.querySelectorAll('[role=button].deal-row')].find((e) => e.textContent.includes(b)); if (el) el.click(); }, brand);
    await sleep(2000);

    const saveBtn = page.locator('button:has-text("Save changes")').first();
    const saveDisabled = async () => (await saveBtn.isDisabled().catch(() => null)) === true;

    // --- A. Amount (known-fixed) ---
    let amt = page.locator('input[aria-label="Deal amount"]').first();
    await amt.click(); await sleep(400);
    await page.keyboard.press('Meta+A'); await page.keyboard.type('2000'); await page.keyboard.press('Tab'); await sleep(700);
    check('A. amount edit enables Save', !(await saveDisabled()));

    // --- B. Brand text ---
    await page.evaluate(() => { const b = [...document.querySelectorAll('button[aria-expanded]')].find((x) => /^Deal/.test(x.textContent.trim()) && x.getAttribute('aria-expanded') === 'false'); if (b) b.click(); });
    await sleep(900);
    let brandIn = page.locator('input[placeholder="e.g. Glossier"]').first();
    await brandIn.click(); await sleep(300);
    await page.keyboard.press('Meta+A'); await page.keyboard.type('RenamedBrand' + TS.toString().slice(-4)); await page.keyboard.press('Tab'); await sleep(700);
    check('B. brand edit enables Save', !(await saveDisabled()));

    // --- C. Rep name (Contact accordion) ---
    await page.evaluate(() => { const b = [...document.querySelectorAll('button[aria-expanded]')].find((x) => /contact|representative|rep/i.test(x.textContent.trim()) && x.getAttribute('aria-expanded') === 'false'); if (b) b.click(); });
    await sleep(900);
    let rep = page.locator('input[placeholder="Contact name"]').first();
    if (await rep.count()) {
      await rep.click(); await sleep(300);
      await page.keyboard.type('JaneRep'); await page.keyboard.press('Tab'); await sleep(700);
      check('C. rep name edit enables Save', !(await saveDisabled()));
    } else { console.log('  (no rep accordion/field found)'); }

    // --- D. Notes tab ---
    await page.evaluate(() => { const t = [...document.querySelectorAll('button')].find((x) => /^Notes/.test(x.textContent.trim())); if (t) t.click(); });
    await sleep(900);
    let notes = page.locator('textarea[placeholder*="remember"]').first();
    if (await notes.count()) {
      await notes.click(); await sleep(300);
      await page.keyboard.press('Meta+A'); await page.keyboard.type('edited note ' + TS.toString().slice(-4)); await page.keyboard.press('Tab'); await sleep(700);
      check('D. notes edit enables Save', !(await saveDisabled()));
    } else { console.log('  (no notes textarea found)'); }

    // --- E. Checklist tab ---
    await page.evaluate(() => { const t = [...document.querySelectorAll('button')].find((x) => /^Checklist/.test(x.textContent.trim())); if (t) t.click(); });
    await sleep(900);
    let toggle = page.locator('button[aria-label="Toggle"]').first();
    if (await toggle.count()) {
      await toggle.click(); await sleep(700);
      check('E. checklist toggle enables Save', !(await saveDisabled()));
    } else { console.log('  (no checklist toggle found)'); }

    // --- F. Checklist: add a new item ---
    let addIn = page.locator('input[placeholder="Add a checklist item…"]').first();
    if (await addIn.count()) {
      await addIn.click(); await sleep(300);
      await page.keyboard.type('New step ' + TS.toString().slice(-4));
      await page.keyboard.press('Enter'); await sleep(700);
      check('F. checklist add enables Save', !(await saveDisabled()));
    } else { console.log('  (no checklist add input found)'); }

    // Summary
    const failures = results.filter((r) => !r.pass);
    console.log(`\n=== RESULT: ${results.length - failures.length}/${results.length} passed ===`);
    if (failures.length) { failures.forEach((f) => console.log('  - ' + f.name)); process.exitCode = 1; }

    // cleanup
    if (dbBase && dbKey && dealId) {
      await page.evaluate(async ({ base, key, dealId }) => {
        const h = { apikey: key, Authorization: 'Bearer ' + key };
        await fetch(base + '/rest/v1/deals?id=eq.' + encodeURIComponent(dealId), { method: 'DELETE', headers: h });
      }, { base: dbBase, key: dbKey, dealId });
    }
  } finally { await browser.close(); }
})().catch((e) => { console.error('FATAL', e.message); process.exitCode = 1; });
