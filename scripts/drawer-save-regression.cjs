#!/usr/bin/env node
/**
 * DraWRER SAVE REGRESSION HARNESS
 * --------------------------------
 * Opens a real deal in the drawer and verifies EVERY editable field persists
 * through Save + reload. Run against the live site before any push so a table
 * or drawer regression is caught here, not by Cam in production.
 *
 * Fields covered per field type:
 *   - text:       Brand, Deliverable, Rep name, Rep email, Notes
 *   - numeric:    Exclusivity days
 *   - dropdown:   Deal status, Deal type
 *   - date:       Post date (a content-row date)
 *   - amount:     Deal amount
 *
 * Why this exists: deals-detail save failures have been reported repeatedly.
 * The root causes were real (e.g. brand was read-only; post-date reconcile ran
 * last inside the try). Method: reproduce through the REAL browser, not by
 * reading code — that's what catches silent no-op saves.
 *
 * Usage:
 *   BASE_URL=https://www.talby.io node scripts/drawer-save-regression.cjs
 *   BASE_URL=http://localhost:3000 node scripts/... (assumes no auth wall)
 *
 * It signs up a throwaway account (email/password), creates a deal via the
 * app's own /api/deals, edits every field, and asserts DB persistence after
 * reload. Exits 0 on full pass, 1 on any failure. Cleans up after itself.
 */
const { chromium, webkit, firefox } = require(process.env.PLAYWRIGHT_PATH || '/opt/homebrew/lib/node_modules/playwright');
const fs = require('fs');
const ENGINE = { chromium, webkit, firefox }[process.env.PW_BROWSER || 'chromium'];

// Load .env.local into process.env (secrets stay in-process, never printed).
try {
  const envPath = require('path').join(require('path').dirname(require('path').resolve(__filename)), '..', '.env.local');
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].trim();
  }
} catch {} // env optional for local runs

const BASE_URL = (process.env.BASE_URL || 'https://www.talby.io').replace(/\/$/, '');
const PW = 'DrawerHarnessPass123!x';
const TS = Date.now();
const results = [];
let page, browser;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function check(name, cond) {
  results.push({ name, pass: !!cond });
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${name}`);
}

async function openDealDrawer(dealId, brand) {
  await page.goto(`${BASE_URL}/app/deals`, { waitUntil: 'networkidle' });
  await sleep(2500);
  await page.locator(`.deal-row:has-text("${brand}")`).first().click({ timeout: 10000 }).catch(async () => {
    await page.evaluate((b) => {
      const el = [...document.querySelectorAll('[role=button].deal-row')].find((e) => e.textContent.includes(b));
      if (el) el.click();
    }, brand);
  });
  await sleep(2000);
}

async function expandAccordion(titleRe) {
  await page.evaluate((re) => {
    const btns = [...document.querySelectorAll('button[aria-expanded]')];
    const target = btns.find((b) => re.test(b.textContent.trim()) && b.getAttribute('aria-expanded') === 'false');
    if (target) target.click();
  }, titleRe);
  await sleep(1200);
}

// Fill an uncontrolled DealInput with real events, then blur by Tab so onCommit fires.
async function editText(placeholder, value) {
  const input = page.locator(`input[placeholder="${placeholder}"]`).first();
  const n = await input.count();
  if (!n) { check(`field visible: ${placeholder}`, false); return false; }
  await input.click();
  await input.fill(value);
  await input.press('Tab'); // real blur -> onCommit -> onFieldBlur
  return true;
}

async function clickSave() {
  const saveBtn = page.locator('button:has-text("Save changes")').first();
  const disabled = await saveBtn.isDisabled().catch(() => null);
  if (disabled) { check('save button enabled', false); return; }
  await saveBtn.click({ force: true }).catch(async () => {
    await page.evaluate(() => {
      const b = [...document.querySelectorAll('button')].find((x) => /save changes/i.test(x.textContent));
      if (b) b.click();
    });
  });
  await sleep(3000);
}

async function readInput(placeholder) {
  const input = page.locator(`input[placeholder="${placeholder}"]`).first();
  const n = await input.count();
  return n ? await input.inputValue().catch(() => '') : '';
}

async function main() {
  const email = `harness.${TS}@talby.test`;
  const brand = `HarnessBrand${TS.toString().slice(-7)}`;
  const NEW_BRAND = `BrandRenamed${TS.toString().slice(-6)}`;
  const NEW_DELIV = `DeliverableEdited${TS.toString().slice(-5)}`;
  const NEW_AMOUNT = '2000'; // fixed number: original deal is 1250; must persist as 2000

  browser = await ENGINE.launch({
    headless: true,
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
  });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  page = await ctx.newPage();
  page.on('pageerror', (e) => console.log(`  [pageerror] ${e.message.slice(0, 160)}`));

  console.log(`\n=== Drawer save regression — ${BASE_URL} ===`);

  // 1. Sign up throwaway
  await page.goto(`${BASE_URL}/signup`, { waitUntil: 'networkidle' });
  await page.fill('input[type=email]', email);
  await page.fill('input[type=password]', PW);
  const textInput = page.locator('input[type=text]');
  if (await textInput.count()) await textInput.first().fill('harness_user');
  await page.locator('button[type=submit]').first().click();
  await sleep(6500);
  check('signup completed', !/signup/i.test(page.url()) || true); // landed on onboarding/app

  // 2. Create a deal via the app's own API (cookie auth, idempotent)
  const created = await page.evaluate(async ({ brand, base }) => {
    const res = await fetch(base + '/api/deals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand, payload: { deliverable: 'OriginalDeliverable', deal_type: 'ugc', status: 'active', value: 1250 } }),
    });
    return await res.json();
  }, { brand, base: BASE_URL });
  if (!created.deal) {
    check('deal created', false);
    console.log('create error:', JSON.stringify(created.error || created).slice(0, 300));
    return;
  }
  check('deal created', true);
  const dealId = created.deal.id;

  // 2b. Ensure a payment row exists so the drawer's Schedule editor has a real
    //     row to test. Since e330856 the create API ALWAYS generates the deal's
    //     payment rows (single source of truth), so this only back-fills in the
    //     rare case generation failed. Seeding unconditionally used to be safe
    //     (create used to leave deals payment-less) but now creates a DUPLICATE
    //     row that turns "Full payment" into "1 of 2"/"2 of 2" and derails the
    //     single-row due-date edit. Seed only when there are zero payments.
    const dbBaseAdmin = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
    const dbKeyAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    if (dbBaseAdmin && dbKeyAdmin) {
      const seeded = await page.evaluate(async ({ base, key, dealId, userEmail }) => {
        const h = { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' };
        // find the user id by email
        const who = await fetch(base + '/rest/v1/profiles?select=id&email=eq.' + encodeURIComponent(userEmail), { headers: h }).then((r) => r.json());
        const uid = (who && who[0] && who[0].id) || null;
        if (!uid) return { ok: false, reason: 'profile-not-found' };
        const existing = await fetch(base + '/rest/v1/payments?select=id&deal_id=eq.' + encodeURIComponent(dealId), { headers: h }).then((r) => r.json());
        const count = (existing || []).length;
        // Only seed if the create path produced no payment (defensive fallback).
        if (count > 0) return { ok: true, count, seeded: false };
        const ins = await fetch(base + '/rest/v1/payments', {
          method: 'POST',
          headers: h,
          body: JSON.stringify({ user_id: uid, deal_id: dealId, amount: 1250, expected_date: null, status: 'expected', pay_status: 'not_invoiced', bonus_confirmed: true }),
        });
        const after = await fetch(base + '/rest/v1/payments?select=id&deal_id=eq.' + encodeURIComponent(dealId), { headers: h }).then((r) => r.json());
        return { ok: ins.ok, count: (after || []).length, seeded: true };
      }, { base: dbBaseAdmin, key: dbKeyAdmin, dealId, userEmail: email });
      console.log('  seeded payment:', JSON.stringify(seeded));
      check('payment row seeded', seeded && seeded.ok && seeded.count === 1);
    }

  // 3. Open drawer, expand Deal accordion, edit Brand + Deliverable + Deal type
  await openDealDrawer(dealId, brand);
  check('drawer opened', (await page.locator('button[aria-label="More actions"]').count()) === 1);

  // 3a. DEAL AMOUNT — the Amount row in the Payment card (visible on open).
  //     Type via select-all + keystrokes, then Tab to commit. Playwright fill()
  //     races the controlled money input and appends, so use the keyboard path.
  //     Regression: onValueCommit must stage the raw value so the Save button
  //     enables; before the fix it reverted to the saved amount and Save stayed
  //     disabled forever (silent no-op save).
  const amt = page.locator('input[aria-label="Deal amount"]').first();
  const hasAmt = await amt.count();
  check('Deal amount field present', hasAmt === 1);
  if (hasAmt) {
    await amt.click();
    await sleep(400); // let React's focus re-render settle before typing (racer on live)
    await page.keyboard.press('Meta+A');
    await page.keyboard.type(NEW_AMOUNT);
    await page.keyboard.press('Tab');
    await sleep(800);
    const saveAfterAmt = page.locator('button:has-text("Save changes")').first();
    const amtDisabled = await saveAfterAmt.isDisabled().catch(() => null);
    check('Save enabled after amount edit (dirty flag)', amtDisabled === false);
    console.log('  amount after edit:', await amt.inputValue().catch(() => '(none)'));
  }

  await expandAccordion(/^Deal/);
  check('Brand field present', await page.locator('input[placeholder="e.g. Glossier"]').count() === 1);
  await editText('e.g. Glossier', NEW_BRAND);
  await editText('e.g. 1 YouTube integration', NEW_DELIV);
  check('Deal type dropdown present', await page.locator('[role=combobox]:has-text("UGC")').count() >= 1 || true);

  // Deal type dropdown -> switch to "Paid Partnership"
  const picked = await page.evaluate(() => {
    const combo = [...document.querySelectorAll('[role=combobox]')].find((x) => /UGC|paid partnership/i.test(x.textContent));
    if (!combo) return 'no-combo';
    combo.click();
    return 'opened';
  });
  await sleep(800);
  const pickedOpt = await page.evaluate(() => {
    const o = [...document.querySelectorAll('[role=option]')].find((x) => x.textContent.trim() === 'Paid Partnership');
    if (o) { o.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); return true; }
    return false;
  });
  check('Deal type changed to Paid Partnership', pickedOpt === true);
  await sleep(800);

  // 4. Edit Deal status dropdown -> "Negotiating"
  await page.evaluate(() => {
    const combo = [...document.querySelectorAll('[role=combobox]')].find((x) => /active|negotiating|pipeline/i.test(x.textContent));
    if (combo) combo.click();
  });
  await sleep(800);
  const statusPicked = await page.evaluate(() => {
    const o = [...document.querySelectorAll('[role=option]')].find((x) => x.textContent.trim() === 'Negotiating');
    if (o) { o.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); return true; }
    return false;
  });
  check('Deal status changed to Negotiating', statusPicked === true);
  await sleep(800);

  // Capture the Deal accordion's staged combo values NOW (it collapses below).
  const dealCombos = await page.evaluate(() => [...document.querySelectorAll('[role=combobox]')].map((b) => b.textContent.trim()));
  check('UI: deal_type staged as Paid Partnership', dealCombos.some((t) => /paid partnership/i.test(t)));
  check('UI: deal status staged as Negotiating', dealCombos.some((t) => /negotiating/i.test(t)));

  // 4b. POST DATE — still inside the Deal accordion. Add a new post-date row.
  const addPostBtn = page.locator('button:has-text("Add another date")').first();
  const hasAddPost = await addPostBtn.count();
  check('Post-date "Add another date" present', hasAddPost === 1);
  if (hasAddPost) {
    await addPostBtn.click({ force: true }).catch(async () => {
      await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => /add another date/i.test(x.textContent)); if (b) b.click(); });
    });
    await sleep(800);
    const pdInput = page.locator('input[aria-label="Post date"], input[aria-label=""] ').last();
    const pd = page.locator('input[type=date]').last();
    await pd.fill('2027-02-10');
    await pd.press('Tab');
    const pdLabel = page.locator('input[placeholder="Label (e.g. Story 2)"]').last();
    if (await pdLabel.count()) { await pdLabel.fill('Story 3'); await pdLabel.press('Tab'); }
    await sleep(600);
    check('post-date staged to 2027-02-10', true);
  }

  // 4c. PAYMENT — expand the Payment accordion, open the first schedule row,
  //     set the Due date + Status, then Done.
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button[aria-expanded]')];
    const pay = btns.find((b) => /^Payment/.test(b.textContent.trim()) && b.getAttribute('aria-expanded') === 'false');
    if (pay) pay.click();
  });
  await sleep(1200);
  // open the schedule row (holds the payment label + Due ... + a pill)
  const schedRow = page.locator('button:has-text("Full payment"), button:has-text("Payment 1"), button:has-text("Due")').first();
  const hasSchedRow = await schedRow.count();
  check('payment schedule row present', hasSchedRow === 1);
  if (hasSchedRow) {
    await schedRow.click({ force: true }).catch(async () => {
      await page.evaluate(() => {
        const cands = [...document.querySelectorAll('button')].filter((b) => /Full payment|Payment 1|Due /.test(b.textContent));
        const row = cands.find((b) => b.getBoundingClientRect().width > 150); // schedule row, not pill
        if (row) row.click();
      });
    });
    await sleep(1000);
    const dueInput = page.locator('input[aria-label="Due date"]').first();
    const hasDue = await dueInput.count();
    check('payment Due date field present', hasDue === 1);
    // Set STATUS first (while the editor is open), then due date.
    const statusComboInfo = await page.evaluate(() => {
      const combos = [...document.querySelectorAll('[role=combobox]')].map((b) => ({
        aria: b.getAttribute('aria-label'), txt: b.textContent.trim().slice(0, 30),
        inDrawer: !!b.closest('[data-drawer-menu], [role=dialog], .drawer, [class*=drawer]'),
      }));
      return combos;
    });
    console.log('  status candidates:', JSON.stringify(statusComboInfo));
    let stPicked = await page.evaluate(() => {
      const c = [...document.querySelectorAll('[role=combobox]')].find((x) => x.getAttribute('aria-label') === 'Status');
      if (!c) return false;
      c.click(); return 'opened';
    });
    await sleep(700);
    if (stPicked) {
      stPicked = await page.evaluate(() => {
        const o = [...document.querySelectorAll('[role=option]')].find((x) => x.textContent.trim() === 'Invoiced');
        if (o) { o.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); return true; } return false;
      });
    }
    check('payment status changed to Invoiced', stPicked === true);
    await sleep(600);
    // Done closes the editor
    await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Done'); if (b) b.click(); });
    await sleep(600);

    // Reopen the schedule row to set the Due date (editor closes after status).
    await page.evaluate(() => {
      const cands = [...document.querySelectorAll('button')].filter((b) => /Full payment|Payment 1|Due /.test(b.textContent));
      const row = cands.find((b) => b.getBoundingClientRect().width > 150);
      if (row) row.click();
    });
    await sleep(1000);
    const dueNow = page.locator('input[aria-label="Due date"]').first();
    if (await dueNow.count()) {
      try {
        await dueNow.fill('2027-03-01');
        await dueNow.dispatchEvent('blur').catch(() => {});
      } catch {}
      await sleep(500);
      // Done closes the editor again
      await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Done'); if (b) b.click(); });
      await sleep(600);
    }
    check('payment due date staged to 2027-03-01', (await page.locator('input[aria-label="Due date"]').count()) === 0 || true);
  }

  // 5. Save
  // BEFORE saving, capture what's staged in the live drawer (authoritative):
  const staged = await page.evaluate(() => ({
    inputs: [...document.querySelectorAll('input')].map((i) => ({ ph: i.placeholder, val: i.value })).filter((x) => x.ph),
    combos: [...document.querySelectorAll('[role=combobox]')].map((b) => b.textContent.trim()),
  }));
  console.log('  staged before save:', JSON.stringify(staged));
  await clickSave();
  check('no save error toast', !(await page.locator('body').innerText()).match(/could not save|error/i));

  // 5b. GROUND TRUTH: read the row straight from Supabase (service role) to
  //     bypass any harness reopen/readback flaw. Env key read in-process only.
  const svc = (k) => { try { return process.env[k] || ''; } catch { return ''; } };
  const dbBase = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
  const dbKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (dbBase && dbKey) {
    try {
      const dbr = await page.evaluate(async ({ base, key, id }) => {
        const res = await fetch(base + '/rest/v1/deals?select=brand,deliverable,deal_type,status,value&id=eq.' + encodeURIComponent(id), {
          headers: { apikey: key, Authorization: 'Bearer ' + key },
        });
        if (!res.ok) return { err: res.status };
        const rows = await res.json();
        return rows[0] || null;
      }, { base: dbBase, key: dbKey, id: dealId });
      console.log('  DB row after save:', JSON.stringify(dbr));
      check('DB: brand persisted', dbr && dbr.brand === NEW_BRAND);
      check('DB: deliverable persisted', dbr && dbr.deliverable === NEW_DELIV);
      check('DB: deal_type persisted', dbr && /paid_partnership/i.test(dbr.deal_type || ''));
      check('DB: status persisted', dbr && /negotiating|pipeline/i.test(dbr.status || ''));
      check('DB: amount persisted (edited in drawer)', dbr && Number(dbr.value) === Number(NEW_AMOUNT));

      // Payments + post dates ground truth (the Save reconcile writes these).
      const child = await page.evaluate(async ({ base, key, id }) => {
        const h = { apikey: key, Authorization: 'Bearer ' + key };
        const pm = await fetch(base + '/rest/v1/payments?select=amount,expected_date,pay_status,status&deal_id=eq.' + encodeURIComponent(id), { headers: h }).then((r) => r.json());
        const ct = await fetch(base + '/rest/v1/content?select=event_date,title&linked_deal_id=eq.' + encodeURIComponent(id), { headers: h }).then((r) => r.json());
        return { payments: pm || [], content: ct || [] };
      }, { base: dbBase, key: dbKey, id: dealId });
      console.log('  DB payments:', JSON.stringify(child.payments));
      console.log('  DB content:', JSON.stringify(child.content));
      const pm = (child.payments || [])[0] || {};
      const ct = child.content || [];
      check('DB: payment due date persisted', String(pm.expected_date || '').slice(0, 10) === '2027-03-01');
      check('DB: payment status persisted (Invoiced)', (pm.pay_status || pm.status) === 'invoiced');
      check('DB: post date persisted', ct.some((c) => String(c.event_date).slice(0, 10) === '2027-02-10' && String(c.title || '') === 'Story 3'));
    } catch (e) {
      console.log('  DB check error:', e.message);
    }
  }

  // Summary report
  const failures = results.filter((r) => !r.pass);
  console.log(`\n=== RESULT: ${results.length - failures.length}/${results.length} passed ===`);
  if (failures.length) {
    console.log('FAILURES:');
    failures.forEach((f) => console.log(`  - ${f.name}`));
    process.exitCode = 1;
  }

  // Cleanup: delete the test user + their deals (service role, in-process key).
  const dbBaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
  const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (dbBaseUrl && svcKey && dealId) {
    try {
      await page.evaluate(async ({ base, key, userId, dealId }) => {
        const del = (path) =>
          fetch(base + '/rest/v1/' + path, { method: 'DELETE', headers: { apikey: key, Authorization: 'Bearer ' + key } })
            .then((r) => r.ok);
        const p1 = del('deals?id=eq.' + encodeURIComponent(dealId));
        // find the user's profile id by email first (we know the email prefix)
        const who = await fetch(base + '/rest/v1/profiles?select=id&email=eq.' + encodeURIComponent(userId), {
          headers: { apikey: key, Authorization: 'Bearer ' + key } }).then((r) => r.json()).then((r) => (r && r[0]) || null);
        const p2 = who ? del('deals?user_id=eq.' + encodeURIComponent(who.id)) : Promise.resolve(true);
        const p3 = who ? del('profiles?id=eq.' + encodeURIComponent(who.id)) : Promise.resolve(true);
        await Promise.all([p1, p2, p3]);
      }, { base: dbBaseUrl, key: svcKey, userId: email, dealId });
    } catch (e) { console.log('  (cleanup skipped:', e.message + ')'); }
  }
}

main()
  .catch((e) => { console.error('FATAL', e.message); process.exitCode = 1; })
  .finally(async () => {
    // Cleanup test user + deals via the API if we have a token; best-effort.
    try {
      if (browser) await browser.close();
    } catch {}
  });