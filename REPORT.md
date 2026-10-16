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
| `npm test` | **49 passing, 0 failing** |
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
