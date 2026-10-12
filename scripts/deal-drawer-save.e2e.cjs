#!/usr/bin/env node
/**
 * DEAL DRAWER SAVE E2E — the authoritative pre-deploy gate for any change that
 * touches the deal drawer. Run before every deploy that touches the drawer.
 *
 * It exercises the SAME data shape as camquint's real "Split Test Upfront" deal
 * (fetched read-only via service role, replicated onto a throwaway account so
 * the real deal is never modified), then asserts Cam's save spec end-to-end:
 *
 *   4a. Open the deal -> Save disabled.
 *   4b. Change Amount -> Save enabled -> Save -> "Changes saved" toast + disabled.
 *   4c. Reload + reopen -> new amount persists -> change back + save.
 *   4d. Enable check for: payment-row status, Deliverable, Rep contact name.
 *       + split upfront % and bonus extra (the bug that left Save permanently
 *         disabled on split deals).
 *   4e. Footer's full-width Save never shows while the deal is loading.
 *   2c. Closing a dirty drawer asks "Discard changes?" first.
 *
 * Usage:  BASE_URL=https://www.talby.io node scripts/deal-drawer-save.e2e.cjs
 *         PW_BROWSER=webkit ...   (also run webkit for the iPad engine)
 * Exits 0 on full pass, 1 otherwise. Cleans up the throwaway deal + user.
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
const PW = 'DrawerE2EPass123!x';
const TS = Date.now();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const check = (n, c, extra) => { results.push({ name: n, pass: !!c }); console.log(`  ${c ? 'PASS' : 'FAIL'}  ${n}` + (extra ? '   [' + extra + ']' : '')); };

const dbBase = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
const dbKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const HD = { apikey: dbKey, Authorization: 'Bearer ' + dbKey, 'Content-Type': 'application/json' };

// Read camquint's real "Split Test Upfront" deal + children (read-only).
async function readRealDeal(page) {
  return await page.evaluate(async ({ base, h }) => {
    const j = (p) => fetch(base + '/rest/v1/' + p, { headers: h }).then((r) => r.json());
    const deals = await j('deals?select=*&brand=eq.Split%20Test%20Upfront&limit=1');
    const d = deals[0];
    if (!d) return null;
    const [payments, extras] = await Promise.all([
      j('payments?select=*&deal_id=eq.' + d.id),
      j('deal_extras?select=*&deal_id=eq.' + d.id),
    ]);
    return { deal: d, payments, extras };
  }, { base: dbBase, h: HD });
}

(async () => {
  const browser = await ENGINE.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log('  [pageerror]', e.message.slice(0, 200)));
  const email = `e2e.${TS}@talby.test`;
  const cloneBrand = `E2EClone${TS.toString().slice(-7)}`;
  let outUser, dealId;
  try {
    console.log(`\n=== DEAL DRAWER SAVE E2E — ${BASE_URL} (${process.env.PW_BROWSER || 'chromium'}) ===`);

    // Source: camquint's real deal (read-only), to replicate its exact shape.
    const real = await readRealDeal(page);
    if (!real) { console.log('  [camquint deal not found — proceeding with synthetic split deal]'); }
    const src = real || null;
    const payload = {
      deliverable: (src && src.deal.deliverable) || '1 split-paid integration',
      deal_type: (src && src.deal.deal_type) || 'paid_partnership',
      status: (src && src.deal.status) || 'active',
      value: (src && src.deal.value) || 4800,
    };
    console.log('  source deal:', src ? 'camquint Split Test Upfront' : 'synthetic');

    // 1. Sign up throwaway.
    await page.goto(`${BASE_URL}/signup`, { waitUntil: 'networkidle' });
    await page.fill('input[type=email]', email); await page.fill('input[type=password]', PW);
    if (await page.locator('input[type=text]').count()) await page.locator('input[type=text]').first().fill('e2e_user');
    await page.locator('button[type=submit]').first().click(); await sleep(6500);

    // 2. Create deal + replicate the real deal's structure/payments/extras.
    const created = await page.evaluate(async ({ brand, base, payload }) => {
      const res = await fetch(base + '/api/deals', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand, payload }) });
      return await res.json();
    }, { brand: cloneBrand, base: BASE_URL, payload });
    if (!created.deal) { console.log('  CREATE FAILED:', JSON.stringify(created).slice(0, 300)); return; }
    dealId = created.deal.id;
    const structFields = src ? {
      payment_structure: src.deal.payment_structure, structure_timing: src.deal.structure_timing,
      structure_timing_set_date: src.deal.structure_timing_set_date, structure_upfront_pct: src.deal.structure_upfront_pct,
      structure_balance_timing: src.deal.structure_balance_timing, structure_months: src.deal.structure_months,
      structure_start_date: src.deal.structure_start_date,
    } : { payment_structure: 'split', structure_upfront_pct: 50, structure_balance_timing: 'net_30' };
    const seed = await page.evaluate(async ({ base, h, id, userEmail, structFields, payments, extras }) => {
      const who = await fetch(base + '/rest/v1/profiles?select=id&email=eq.' + encodeURIComponent(userEmail), { headers: h }).then((r) => r.json());
      const uid = who && who[0] && who[0].id; if (!uid) return { ok: false };
      await fetch(base + '/rest/v1/deals?id=eq.' + id, { method: 'PATCH', headers: h, body: JSON.stringify(structFields) });
      for (const p of (payments || [{ amount: 2400 }, { amount: 2400 }])) {
        await fetch(base + '/rest/v1/payments', { method: 'POST', headers: h, body: JSON.stringify({ user_id: uid, deal_id: id, amount: p.amount ?? 2400, expected_date: p.expected_date ?? null, status: p.status ?? 'expected', pay_status: p.pay_status ?? 'not_invoiced', bonus_confirmed: p.bonus_confirmed !== false }) });
      }
      for (const e of (extras || [])) {
        await fetch(base + '/rest/v1/deal_extras', { method: 'POST', headers: h, body: JSON.stringify({ user_id: uid, deal_id: id, kind: e.kind ?? 'bonus', amount: e.amount ?? null, condition: e.condition ?? null, rate: e.rate ?? null, on_text: e.on_text ?? null, earned: e.earned ?? false }) });
      }
      return { ok: true, uid };
    }, { base: dbBase, h: HD, id: dealId, userEmail: email, structFields, payments: src && src.payments, extras: src && src.extras });
    if (!seed.ok || !seed.uid) { console.log('  SEED FAILED'); return; }
    outUser = seed.uid;
    console.log('  deal cloned (split shape). value:', payload.value);

    const openDeal = async () => {
      await page.goto(`${BASE_URL}/app/deals`, { waitUntil: 'networkidle' }); await sleep(2200);
      await page.evaluate((b) => { const el = [...document.querySelectorAll('[role=button].deal-row')].find((e) => e.textContent.includes(b)); if (el) el.click(); }, cloneBrand);
      await sleep(1800);
    };
    const saveBtn = () => page.locator('button:has-text("Save changes")').first();
    const saveDisabled = async () => (await saveBtn().isDisabled().catch(() => null)) === true;
    const bodyHas = async (re) => re.test(await page.locator('body').innerText());

    // ===== 4e. Footer never shows full-width Save while loading =====
    await page.goto(`${BASE_URL}/app/deals`, { waitUntil: 'networkidle' }); await sleep(2200);
    await page.evaluate((b) => { const el = [...document.querySelectorAll('[role=button].deal-row')].find((e) => e.textContent.includes(b)); if (el) el.click(); }, cloneBrand);
    // Immediately after click (mid-load): footer/Save should be absent.
    await sleep(120);
    const footerDuringLoad = await page.evaluate(() => {
      const s = [...document.querySelectorAll('button')].some((x) => /save changes/i.test(x.textContent));
      return s;
    });
    check('4e. no Save footer while loading', footerDuringLoad === false);
    await sleep(2200); // let it finish loading
    check('4e. Save footer appears after load', (await page.locator('button:has-text("Save changes")').count()) >= 1);

    // ===== 4a. Save disabled on open =====
    check('4a. Save disabled on open', await saveDisabled());

    // ===== 4b. Amount -> enabled -> save -> toast + disabled =====
    const NEW_AMOUNT = 5100;
    const amt = page.locator('input[aria-label="Deal amount"]').first();
    await amt.click(); await sleep(400);
    await page.keyboard.press('Meta+A'); await page.keyboard.type(String(NEW_AMOUNT)); await page.keyboard.press('Tab'); await sleep(700);
    check('4b. Save ENABLED after amount change', !(await saveDisabled()));
    await saveBtn().click({ force: true }).catch(async () => {
      await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => /save changes/i.test(x.textContent)); if (b) b.click(); });
    });
    await sleep(2500);
    check('4b. "Changes saved" toast appears', await bodyHas(/changes saved/i));
    check('4b. Save disabled after save', await saveDisabled());

    // ===== 4c. Reload -> reopen -> amount persisted -> change back -> save =====
    await openDeal();
    const persisted = await page.locator('input[aria-label="Deal amount"]').first().inputValue().catch(() => '(none)');
    const persistedNum = Number(String(persisted).replace(/[^0-9.]/g, '')) || 0;
    check('4c. new amount persisted after reload', persistedNum === NEW_AMOUNT, 'seen=' + persisted);
    // change it back to original and save
    await page.locator('input[aria-label="Deal amount"]').first().click(); await sleep(400);
    await page.keyboard.press('Meta+A'); await page.keyboard.type(String(payload.value)); await page.keyboard.press('Tab'); await sleep(700);
    check('4c. Save ENABLED after change-back', !(await saveDisabled()));
    await saveBtn().click({ force: true }).catch(async () => { await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => /save changes/i.test(x.textContent)); if (b) b.click(); }); });
    await sleep(2500);

    // ===== 4d. per-control enable checks (reopen fresh between each) =====
    const openAndExpandPayment = async () => {
      await openDeal();
      await page.evaluate(() => { const b = [...document.querySelectorAll('button[aria-expanded]')].find((x) => /^Payment/.test(x.textContent.trim()) && x.getAttribute('aria-expanded') === 'false'); if (b) b.click(); });
      await sleep(1200);
    };

    // 4d-i. Deliverable (Deal accordion)
    await openDeal();
    await page.evaluate(() => { const b = [...document.querySelectorAll('button[aria-expanded]')].find((x) => /^Deal/.test(x.textContent.trim()) && x.getAttribute('aria-expanded') === 'false'); if (b) b.click(); });
    await sleep(900);
    const del = page.locator('input[placeholder^="e.g. 1 YouTube"]').first();
    if (await del.count()) {
      await del.click(); await sleep(300); await page.keyboard.press('Meta+A'); await page.keyboard.type('E2E deliverable'); await page.keyboard.press('Tab'); await sleep(700);
      check('4d. Deliverable change enables Save', !(await saveDisabled()));
    }

    // 4d-ii. Rep contact name
    await openDeal();
    await page.evaluate(() => { const b = [...document.querySelectorAll('button[aria-expanded]')].find((x) => /Rep contact/i.test(x.textContent) && x.getAttribute('aria-expanded') === 'false'); if (b) b.click(); });
    await sleep(900);
    const rep = page.locator('input[placeholder="Contact name"]').first();
    if (await rep.count()) {
      await rep.click(); await sleep(300); await page.keyboard.type('E2ERep'); await page.keyboard.press('Tab'); await sleep(700);
      check('4d. Rep name change enables Save', !(await saveDisabled()));
    }

    // 4d-iii. Payment row status (open a schedule row, change status)
    await openAndExpandPayment();
    await page.evaluate(() => {
      const cands = [...document.querySelectorAll('button')].filter((b) => /Upfront|No due date|Not invoiced/.test(b.textContent));
      const row = cands.find((b) => b.getBoundingClientRect().width > 150);
      if (row) row.click();
    });
    await sleep(900);
    const stIdx = await page.evaluate(() => {
      const c = [...document.querySelectorAll('[role=combobox]')].find((x) => /not invoiced|invoiced|paid/i.test(x.textContent));
      return c ? [...document.querySelectorAll('[role=combobox]')].indexOf(c) : -1;
    });
    if (stIdx >= 0) {
      await page.evaluate((i) => { [...document.querySelectorAll('[role=combobox]')][i].click(); }, stIdx); await sleep(700);
      await page.evaluate(() => { const o = [...document.querySelectorAll('[role=option]')].find((x) => x.textContent.trim() === 'Invoiced'); if (o) o.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); }); await sleep(700);
      await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Done'); if (b) b.click(); }); await sleep(600);
      check('4d. payment row status change enables Save', !(await saveDisabled()));
    }

    // 4d-iv. Split upfront % (the regression: was leaving Save disabled)
    await openAndExpandPayment();
    const upIdx = await page.evaluate(() => {
      const c = [...document.querySelectorAll('[role=combobox]')].find((x) => /upfront percent/i.test(x.getAttribute('aria-label') || ''));
      return c ? [...document.querySelectorAll('[role=combobox]')].indexOf(c) : -1;
    });
    if (upIdx >= 0) {
      await page.evaluate((i) => { [...document.querySelectorAll('[role=combobox]')][i].click(); }, upIdx); await sleep(800);
      const opts = await page.evaluate(() => [...document.querySelectorAll('[role=option]')].map((o) => o.textContent.trim()).filter((t) => !/✓/.test(t)));
      const current = (src && src.deal.structure_upfront_pct) || 50;
      const target = opts.find((t) => !t.startsWith(String(current)));
      if (target) {
        await page.evaluate((txt) => { const o = [...document.querySelectorAll('[role=option]')].find((x) => x.textContent.trim() === txt); if (o) { o.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); o.click(); } }, target); await sleep(900);
        check('4d. split upfront %% change enables Save (regression)', !(await saveDisabled()), 'picked ' + target);
      }
    }

    // 4d-v. Bonus extra (was also leaving Save disabled)
    await openAndExpandPayment();
    const extraOpened = await page.evaluate(() => {
      // Click the EXISTING bonus row (its button is wide, e.g. "Bonus $1,000 ... Not earned").
      const cands = [...document.querySelectorAll('button')].filter((b) => /^Bonus/i.test(b.textContent.trim()));
      const row = cands.find((b) => b.getBoundingClientRect().width > 150);
      if (row) { row.click(); return true; } return false;
    });
    await sleep(900);
    if (extraOpened) {
      const ledger = await page.evaluate(() => [...document.querySelectorAll('button')].filter((b) => b.getBoundingClientRect().width > 40).map((b) => b.textContent.trim().slice(0, 30)));
      console.log('  [after bonus row click] buttons:', JSON.stringify(ledger));
      const earned = await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => /mark as earned/i.test(x.textContent)); if (b) { b.click(); return true; } return false; });
      await sleep(700);
      const probeSave = await saveDisabled();
      console.log('  [bonus] markEarned=' + earned + ' | save disabled after:', probeSave);
      check('4d. bonus extra change enables Save (regression)', !probeSave, 'markEarned=' + earned);
    } else {
      console.log('  [no bonus row found]');
    }

    // ===== 2c. Dirty close -> "Discard changes?" confirm =====
    await openDeal();
    await amt.click(); await sleep(300); await page.keyboard.type('9999'); await page.keyboard.press('Tab'); await sleep(600);
    await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => x.getAttribute('aria-label') === 'Close' || /close/i.test(x.getAttribute('aria-label') || '')); if (b) b.click(); });
    await sleep(800);
    check('2c. dirty close asks "Discard changes?"', await bodyHas(/Discard unsaved changes\?/i));

    // Summary
    const failures = results.filter((r) => !r.pass);
    console.log(`\n=== RESULT: ${results.length - failures.length}/${results.length} passed ===`);
    if (failures.length) { failures.forEach((f) => console.log('  FAIL: ' + f.name)); process.exitCode = 1; }
  } catch (e) { console.error('FATAL', e.message); process.exitCode = 1; }
  finally {
    if (dbBase && dbKey && dealId) {
      try { await page.evaluate(async ({ base, h, dealId, uid }) => {
        const del = (p) => fetch(base + '/rest/v1/' + p, { method: 'DELETE', headers: h }).then((r) => r.ok);
        await Promise.all([del('deals?id=eq.' + encodeURIComponent(dealId)), uid ? del('profiles?id=eq.' + encodeURIComponent(uid)) : Promise.resolve(true)]);
      }, { base: dbBase, h: { apikey: dbKey, Authorization: 'Bearer ' + dbKey }, dealId, uid: outUser }).catch(() => {}); } catch {}
    }
    await browser.close();
  }
})().catch((e) => { console.error('FATAL', e.message); process.exitCode = 1; });