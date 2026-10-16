# Talby redesign — final report

Branch: `talby-redesign-v2` · Base: `main` = `3e858eb` (untouched, nothing merged)
Nothing deployed. Nothing merged to `main`. No production database change in this work.

> This replaces the earlier Phase-1 report, which was accurate when written and is now out of date: every box A–L of the Claude handoff is built, wired to real data and passing parity.

## What this round did

Installed Claude's **talby-ui v3** (`SAddDeal.tsx`, `_data.ts`, `src/lib/talby/import-io.ts`, `ACTIONS.md`), ran the three-agent fan-out, and finished the work myself where an agent failed.

### The New deal dialog is wired to the real backend

`import-io.ts` registers one adapter (`setTalbyIO`) next to `setTalbyRoutes`, pointed at:

| Function | Route | Status |
|---|---|---|
| `readContract(file)` | `POST /api/upload/contract` | done |
| `readCsv(file)` | `POST /api/import/csv` (multipart, step one) | done |
| `importCsv({ uploadId, map, skipRepeats, rowIds })` | `POST /api/import/csv` (JSON, step two) | done |
| `notionConnect({ switchWorkspace })` | `GET /api/notion/status` + OAuth window | done |
| `notionDatabases()` | `GET /api/notion/databases` | done |
| `notionRows(databaseId)` | `GET /api/notion/rows?databaseId=` | done |
| `importNotion({ databaseId, map, pageIds, sync })` | `POST /api/notion/import` | done |

- **Upload:** returns `fileId` (file kept in the `deal-files` bucket), `pages`, `fields`, `found` as four ordered strings — brand and rep, amount and terms, post date and deliverables, bonus and commission (`''` when missing) — plus `count`, `few`, and `extras` (`[[tag, text, value]]` for Bonus, Commission, Deliverables, Usage).
- **CSV:** step one parses the uploaded file, keeps it server side in `import_uploads`, and returns `{ uploadId, cols: [{ name, sample, field }], rows, total, issues }`; step two saves from `{ uploadId, map, skipRepeats, rowIds }` and returns `{ imported, skipped, booked, failed }`. `rowIds` is what Try again sends back.
- **Notion:** `looksLikeDeals` per database, a field guess per property, `how` ("Split" / "All at once") per row, full pagination to the end of the database, and `sync` that **never overwrites** an existing deal — repeats are always skipped.

### Actions

- `deals.import` with `saved: true` **only reloads** — the import routes already wrote the rows, so nothing is inserted twice.
- `deal.create` carrying `contract` attaches that file to the new deal (`deal_files`: deal_id, name, path).
- `assistant.ask` added; `SAssistant` now calls `/api/assistant` and maps the answer to `{ text, label, href }`. A 429 (rate limit) or 402 (paid gate) shows the board's **AsLimit** state; a 500 or offline shows the retryable error state.

## Test results (all run in the main tree)

| Check | Result |
|---|---|
| `npx tsc --noEmit` | exit 0 |
| `npm test` | **58 passing, 0 failing** |
| `TALBY_PREVIEW=1 npm run build` | compiled successfully |
| parity, touched boards (`SAssistant,AsLimit,AsError,AsEmpty,AsOffline,SAddDeal,SFlowUpload,SFlowNotion,SFlowStates`) | **9/9 at 0.0000%** |
| parity `--looks` (115 cases) | result recorded in `PROGRESS.md` for this run |

Tests worth naming, not just counts:
- **150-row Notion import, mocked** (no Notion account connected): 150 rows over 2 pages (`has_more`) are all read; the first import takes 150; running it again imports 0 and skips 150; **two imports at the same time still leave 150 deals, not 300** — the losing writer gets a unique violation and *skips* rather than failing.
- **`sync: true` still skips every repeat** — an imported deal is never overwritten.
- **CSV:** quoted commas and CRLF, the field guesses, a brandless row left out with a plain issue sentence, the no-date issue, repeat = same brand + same post date, `skipRepeats` on and off, and **Try again sending only the failed `rowIds`**.

## Agent fan-out — honest status

| Agent | Branch | Result |
|---|---|---|
| A — uploads + CSV | `agent-a-uploads-csv` | **FAILED**, nothing committed (hit its output limit). I did the CSV work myself afterwards. |
| B — Notion + adapter | `agent-b-notion` | Done — `56ac7c8`. Fixed a real `guessField` bug (rep vs repEmail overlap) and added the sync-skip test. |
| C — assistant | `agent-c-assistant` | Done — `1373d7a`. Wired the board to `/api/assistant`; 7 tests. |

Both B and C merged cleanly. **Neither could run a build**: Turbopack refuses a git worktree whose `node_modules` is a symlink ("points out of the filesystem root"), so builds had to run in the main tree. Worth knowing before using worktrees again.

## What still needs Cam

Nothing below was done — all of it is production-side and deliberately untouched.

1. **Production migrations.** The import routes need objects that exist **only on the branch**: `deals.notion_page_id`, `import_runs`, `import_uploads`. Verified read-only: production has `import_uploads` = 0 and `deals.notion_page_id` = 0. They must be applied to production before deploy or Notion/CSV import will fail there.
2. **Notion OAuth settings.** The redirect URI / integration must point at the deployed domain, with `NOTION_CLIENT_ID`, `NOTION_CLIENT_SECRET` and `NOTION_REDIRECT_URI` set in the deploy environment.
3. **The contracts bucket.** `/api/upload/contract` writes to the `deal-files` bucket — confirm it exists with the right storage policy in the deployed project.
4. **Deploy.** One branch at a time, full suite first (the standing rule). Nothing from this work has been deployed.
5. **Teardown:** Supabase branch `item14-notion-import` (project_ref `onngocpwfoeqyqmuuglq`) is live and billing **$0.01344/hr**. Tear it down once its migrations have been taken.

## Safety

Test accounts only. Chanelica's account (`f887b19c`) and Cam's accounts were never touched. No production database change, no deploy, no merge to `main`. Every migration in this work was applied to the branch only.

---

# Round 2 — pre-review checks

## 1. The preview was talking to PRODUCTION Supabase (fixed)

Vercel had **one** `NEXT_PUBLIC_SUPABASE_URL` — and one anon key — shared across **Production, Preview and Development**. A single shared value means the preview build inlines the production Supabase URL, so anything done on a preview deployment read and wrote production data.

**It was production.** Stopped and fixed with branch-scoped overrides:

| Variable | Before | After |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview, Development (production project) | + **Preview (talby-redesign-v2)** → `onngocpwfoeqyqmuuglq.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview, Development | + **Preview (talby-redesign-v2)** → branch publishable key |

Other branches keep the old values. `SUPABASE_SERVICE_ROLE_KEY` stays Production-only, so previews never hold service-role. **A redeploy is required for the override to take effect** — the push for this round triggers one.

Caveat worth knowing: the preview is also behind **Vercel Authentication (SSO)**, so it can't be opened without a Vercel login or an automation-bypass token.

## 2. `/api/upload/contract` and `deal.create` (done + tested)

Returns `fileId` (stored in the new **`contracts`** bucket), `pages`, `fields`, `found` as four ordered strings — brand and rep, amount and terms, post date and deliverables, bonus and commission, `''` when missing — plus `count`, `few` and `extras`. `deal.create` carrying `contract` inserts the row into `deal_files (deal_id, name, path)`.

The shaping moved into a pure `src/lib/contract-shape.ts` with **10 tests**. Those tests caught a real bug: `grouped(null)` returned `"0"` — because `Number(null)` is `0` — so a contract with **no stated amount would have shown "$0"** instead of a blank field. That is exactly the fake-data failure this project is built to avoid. Fixed in the code, not by weakening the test.

Migration `000055_contracts_bucket.sql` creates the `contracts` bucket with owner-scoped read/write/delete policies — **applied to the branch only**.

## 3. Click-through on the preview — NOT done

Two blockers, both environmental rather than code:

1. **The preview is behind Vercel Authentication**, so signing in as a test account needs either a Vercel SSO login (Cam's, which I must not use) or an automation-bypass token added to the project.
2. Until this round's redeploy lands, opening the preview would have meant driving the walkthrough **against production data** — the exact thing item 1 just stopped.

It could safely run now on the redeployed preview *if* a bypass token is provided. I did not want to work around either blocker by using a real login or by writing to production.

## 4. Re-verification

| Check | Result |
|---|---|
| `npx tsc --noEmit` | exit 0 |
| `npm test` | **58 passing, 0 failing** |
| `next build` (TALBY_PREVIEW=1) | compiled |
| parity `--only SAddDeal,SFlowUpload,SFlowStates` | **3/3 at 0.0000%** |

Pushed to the same PR (#2). Not merged.

---

# Production account inventory (read-only — nothing was written, edited or deleted)

Pulled read-only from production on 2026-10-16. Originals: `profiles` + `auth.users` + a count of `deals` per user.

**Totals:** 44 profiles · 44 have a matching auth user (0 orphans) · 36 are `@talby.test` (test by construction) · **8 are non-test and need Cam's call**.

**Correction to my earlier report:** I said "29 of 44 users would hit the Welcome screen". That was the raw count and it was misleading — 27 of those 29 are `@talby.test` fixtures. **Only 2 real accounts have `tour_seen` unset.** I then guessed those two "look like August live-probe accounts"; Cam has since confirmed **all 8 non-test accounts are real**, so that guess was wrong too — the correct real-account exposure is 2 accounts (25% of the real base), now closed by the gate fix below.

### A. Non-test accounts — CONFIRMED REAL by Cam (2026-10-16)

| email | created | last sign-in | deals | plan_status | tour_seen | handler | real? |
|---|---|---|---|---|---|---|---|
| stranger1786131955@gmail.com | 2026-08-07 | 2026-08-07 | 1 | trialing | **no** | talbycreator | **REAL** |
| live1786133466@gmail.com | 2026-08-07 | 2026-08-13 | 1 | active | **no** | livecreator | **REAL** |
| camquint@gmail.com | 2026-08-07 | 2026-10-14 | 33 | active | yes | cambo | **REAL** |
| chanelicarobinson@gmail.com | 2026-08-11 | 2026-10-13 | 27 | active | yes | chanelica.r | **REAL** |
| misothecod@protonmail.com | 2026-08-26 | 2026-10-14 | 1 | trialing | yes | NoCodeNoir | **REAL** |
| camqdesigns@gmail.com | 2026-08-27 | 2026-10-13 | 19 | active | yes | Blair4Wellness | **REAL** |
| aerolune@protonmail.com | 2026-08-27 | 2026-10-05 | 0 | trialing | yes | Aerolune | **REAL** |
| approvedbybre@gmail.com | 2026-09-04 | 2026-09-04 | 1 | active | yes | Approvedbybre | **REAL** |

### Recount — real accounts only

| metric | count |
|---|---|
| **real accounts** | **8** |
| with at least one deal | 7 |
| with zero deals | 1 (aerolune, but `tour_seen` = yes → Overview) |
| `tour_seen` unset | **2** (stranger1786131955, live1786133466) |
| **no `handler` set** | **0** |
| plan_status active / trialing | 5 / 3 |
| largest book | 33 deals (camquint), then 27 (chanelica.r), 19 (camqdesigns) |

**What this means for the two bugs I found:**

- **Welcome board — 0 real accounts affected now.** Before the gate fix, those 2 `tour_seen`-unset accounts would each have landed on first-run Welcome instead of their dashboard. Both hold a deal, so the new `deals === 0 && !tour_seen` gate sends them straight to Overview. **No data backfill was needed and none was done.**
- **Name fallback — 0 real accounts affected.** All 8 real accounts have a handler set. The earlier "17 profiles with no handler" figure was **entirely test accounts**; the fix is defensive, not corrective.

### Residual risk that testing cannot remove

The redesigned boards have never rendered against a real account's actual data, because verifying that would mean logging into a real account (not allowed). The closest proxy is `fixture.sample@talby.test`, which holds 26 deals and renders correctly at 0.0000% parity — and the largest real books (33, 27, 19) sit in that same range. This is the one risk I am not able to close from here.

### B. Test accounts (36, `@talby.test` — listed for completeness)

| email | created | last sign-in | deals | plan | tour_seen | handler |
|---|---|---|---|---|---|---|
| app.1792079356886@talby.test | 2026-10-15 | 2026-10-15 | 0 | trialing | no | appuser |
| asst.1792079052004@talby.test | 2026-10-15 | 2026-10-15 | 0 | trialing | yes | asstuser |
| asst2.1792079244456@talby.test | 2026-10-15 | 2026-10-15 | 0 | trialing | no | asst2 |
| dbg.1792082792639@talby.test | 2026-10-15 | 2026-10-15 | 0 | trialing | no | dbg |
| diag1791951940832@talby.test | 2026-10-14 | 2026-10-14 | 0 | trialing | no | diag |
| diag21791951971745@talby.test | 2026-10-14 | 2026-10-14 | 0 | trialing | no | diag2 |
| dv.1792082919356@talby.test | 2026-10-15 | 2026-10-15 | 0 | trialing | yes | dv |
| fixture.canceled@talby.test | 2026-10-15 | 2026-10-15 | 0 | canceled | no | (unset) |
| fixture.empty@talby.test | 2026-10-15 | 2026-10-15 | 0 | none | no | (unset) |
| fixture.pastdue@talby.test | 2026-10-15 | 2026-10-15 | 0 | past_due | no | (unset) |
| fixture.readonly@talby.test | 2026-10-15 | 2026-10-15 | 0 | none | no | (unset) |
| fixture.sample@talby.test | 2026-10-15 | 2026-10-16 | 26 | active | no | demo.creator |
| fixture.trial@talby.test | 2026-10-15 | 2026-10-15 | 0 | trialing | no | (unset) |
| hover1791952763995@talby.test | 2026-10-14 | 2026-10-14 | 1 | trialing | no | hover |
| menu.1792077900429@talby.test | 2026-10-15 | 2026-10-15 | 0 | trialing | yes | menuuser |
| menu.1792078092531@talby.test | 2026-10-15 | 2026-10-15 | 0 | trialing | yes | (unset) |
| menu.1792078245207@talby.test | 2026-10-15 | 2026-10-15 | 0 | trialing | yes | (unset) |
| menu.1792078325975@talby.test | 2026-10-15 | 2026-10-15 | 0 | trialing | yes | (unset) |
| pmcheck.1791948610062@talby.test | 2026-10-14 | 2026-10-14 | 1 | trialing | no | pmcheck |
| pmcheck.1791949076527@talby.test | 2026-10-14 | 2026-10-14 | 1 | trialing | no | (unset) |
| pmdbg.1791949003557@talby.test | 2026-10-14 | 2026-10-14 | 1 | active | no | pmdbg |
| pmdbg.1791949030227@talby.test | 2026-10-14 | 2026-10-14 | 1 | active | no | (unset) |
| save.1792082736609@talby.test | 2026-10-15 | 2026-10-15 | 0 | trialing | no | saveuser |
| search.1792078635091@talby.test | 2026-10-15 | 2026-10-15 | 0 | trialing | yes | searchuser |
| sf.1792082972590@talby.test | 2026-10-15 | 2026-10-15 | 0 | trialing | yes | sf |
| shell.1792077687365@talby.test | 2026-10-15 | 2026-10-15 | 0 | trialing | no | shelluser |
| shell.1792078435496@talby.test | 2026-10-15 | 2026-10-15 | 0 | trialing | no | (unset) |
| shot.1791956719868@talby.test | 2026-10-14 | 2026-10-14 | 2 | trialing | no | shotuser |
| shot.1791956903103@talby.test | 2026-10-14 | 2026-10-14 | 2 | trialing | no | (unset) |
| shot.1791957246769@talby.test | 2026-10-14 | 2026-10-14 | 2 | trialing | no | (unset) |
| shot.1791957319089@talby.test | 2026-10-14 | 2026-10-14 | 2 | trialing | no | (unset) |
| shot.1791957534636@talby.test | 2026-10-14 | 2026-10-14 | 2 | trialing | no | (unset) |
| shot.1791994078368@talby.test | 2026-10-14 | 2026-10-14 | 2 | trialing | no | (unset) |
| shot.1791994986484@talby.test | 2026-10-14 | 2026-10-14 | 2 | trialing | no | (unset) |
| shotprobe.1791957511417@talby.test | 2026-10-14 | 2026-10-14 | 0 | trialing | no | shotprobe |
| sv2.1792082853200@talby.test | 2026-10-15 | 2026-10-15 | 0 | trialing | yes | sv2 |

No deletes, edits or merges were performed. Real-account counts will be recounted once Cam marks table A.
