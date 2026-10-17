# Saves: the onAction prop

Every page board takes an `onAction(type, payload)` prop. The board updates the screen right away, then calls `onAction`. Return a promise:

- resolve (anything except `false`) and nothing else happens;
- reject, throw, or resolve to `false` and the board shows its error toast with **Try again**, which sends the same action again.

After a save succeeds, refresh the page data (`router.refresh()` or refetch) so the next render gets the stored rows in `data`. The boards reload their lists from `data` when it changes.

Write rules that still apply on your side: check the plan before saving (canceled and read only accounts cannot write; the boards also block this in the UI), make deal create and delete atomic, and make every action idempotent (the same action can arrive twice if the user taps Try again).

Ids: `id` in a payload is the id you passed in `data` (your database id). Overview rows have no ids in its data, so its actions carry the brand and dates instead.

## Every page

| type | payload | when |
|---|---|---|
| `look.update` | `{ theme, mode, sidebar }` | theme, mode or sidebar changed anywhere (also saved in localStorage `talby.look`). Save to profiles. |
| `deal.create` | `{ kind: 'deal', contract, form, plan, deals: [{ brand, amt, status, post }], title, chip, line }` | New deal dialog, manual form. `form` is the whole form (brand, amount, status, platforms, dates, payment terms, contacts). `plan` is the payment schedule shown to the user. `contract` is the uploaded file id when the deal came from a contract, otherwise null. |
| `deals.import` | `{ kind: 'import', count, deals, saved, source }` | Upload, CSV or Notion import finished. With `saved: true` the rows are already written: just reload. See "Imports" below. |
| `data.reload` | `{}` | Try again on a page that failed to load (`view="error"`). Refetch, then pass the new `data` and `view`. Resolve when done; reject to show the error again. |

## Overview (SOverview)

| type | payload |
|---|---|
| `payment.markPaid` | `{ brand, amount }` (a late payment's Paid button) |
| `deal.setPayBy` | `{ brand, date }` |
| `todo.setDone` | `{ id, done: true }` |
| `todo.create` | `{ text, deal: '' }` |

## Deals and the deal panel (SDeals)

| type | payload |
|---|---|
| `deal.update` | `{ id, changes, extras, checklist }`. `changes` holds only the fields the user edited in the panel: status (`Active`, `Negotiating`, or `Archived` which means archive the deal), how, when (`Net 30` and so on), due, post, amt (text like "6,000"), plats, types, rev, repName, repEmail, repPhone, notes. `extras` is the full list `[{ type, value }]` and `checklist` the full list `[{ text, done }]`: replace what is stored. |
| `payment.setStatus` | `{ dealId, paymentId, index, state }`: sent on Save for each payment whose status changed in the deal panel schedule. state is `not`, `inv` or `paid`. `paymentId` is the `payments[].id` you passed in (null when you sent none, then use `index`). When every payment is paid, mark the deal paid too. |
| `payment.setDate` | `{ dealId, paymentId, index, date }`: one payment's due date (or received date when paid) was picked in the schedule. `date` is ISO or "" when cleared. With a single payment the panel edits the deal's due date instead (sent in `deal.update` as `due`). |
| `deal.markPaid` | `{ id, amount }` |
| `deal.duplicate` | `{ id }` |
| `deal.archive` / `deal.unarchive` | `{ id }` (unarchive is the toast's Undo) |
| `deal.delete` / `deal.restore` | `{ id }`. Delete shows Undo for 4 seconds, so make delete a soft delete and restore clear it. |
| `deals.bulk` | `{ change: 'paid' \| 'invoiced' \| 'archived', ids }` |

## Payments (SPayments)

| type | payload |
|---|---|
| `payment.markPaid` | `{ id, brand, amount }` |
| `payment.record` | `{ id, brand, amount, date }` (Record payment dialog) |

The reminder dialog copies text to the clipboard only, nothing to save.

## Calendar (SCalendar)

| type | payload |
|---|---|
| `event.create` | `{ date, kind: 'post' \| 'del' \| 'pay', title, amount }` |
| `event.setDone` | `{ id, done }` (deliverables) |

## Ideas (SIdeas)

| type | payload |
|---|---|
| `idea.create` | `{ text }` |
| `idea.star` | `{ id, starred }` |
| `idea.delete` / `idea.restore` | `{ id }` |

## To-dos (STodos)

| type | payload |
|---|---|
| `todo.create` | `{ text, deal, due }` |
| `todo.setDone` | `{ id, done }` |
| `todo.delete` / `todo.restore` | `{ id }` |

## Settings (SSettings)

| type | payload |
|---|---|
| `profile.update` | `{ displayName, handle }` |
| `photo.update` | `{ dataUrl }` (the board has already checked type and size) / `photo.remove` `{}` |
| `notifications.update` | `{ inapp, digest, overdue, posts }` |
| `password.update` | `{ current, next }` |
| `notion.disconnect` | `{}` |
| `billing.open` | `{ plan }`: open the Stripe customer portal or checkout. |
| `data.deleteAll` / `account.delete` | `{}` after the user typed DELETE. Sign them out after `account.delete`. |

## Imports (the New deal dialog)

The upload, CSV and Notion flows inside `SAddDeal` call a small backend object, `TalbyImportIO`. Its full contract, with every field and error code, is at the bottom of `src/components/talby/_data.ts`. Register it once with `setTalbyIO(io)`. `src/lib/talby/import-io.ts` already does that against these routes:

| Function | Route |
|---|---|
| `readContract(file)` | `POST /api/upload/contract` |
| `readCsv(file)` | `POST /api/import/csv` (multipart, step one) |
| `importCsv({ uploadId, map, skipRepeats, rowIds })` | `POST /api/import/csv` (JSON, step two) |
| `notionConnect({ switchWorkspace })` | `GET /api/notion/status`, and the Notion window if not connected |
| `notionDatabases()` | `GET /api/notion/databases` |
| `notionRows(databaseId)` | `GET /api/notion/rows?databaseId=` |
| `importNotion({ databaseId, map, pageIds, sync })` | `POST /api/notion/import` |

How it works:
- Until `setTalbyIO` is called, and always on state boards (they pass `frame`), the dialog runs the design sample, so parity is unchanged.
- To show an error step, reject with `{ code }`. Contract: `too_big`, `bad_type`, `offline`, `unreadable`. CSV: `empty`, `offline`. Notion: `notion_denied`, `notion_lost`, `not_ready`, `fetch_failed`.
- Imports are saved by `importCsv` and `importNotion` themselves. When they finish, the page board still sends `deals.import`, now with `saved: true` and `source: 'csv' | 'notion'`. For those, only reload the data: do not insert again.
- A result with `failed` rows shows the partial step. Try again calls the same function with only those ids (`rowIds` or `pageIds`), and the totals add up across tries.
- `deal.create` from a read contract now carries `contract`: the `fileId` that `readContract` returned. Attach that file to the new deal.

## The assistant (SAssistant)

The assistant answers from a small set of sample answers in its logic class. Replace that function with a call to your assistant endpoint (backend item 12) and keep the reply shape `{ text, label, href }`.

## Deal files (Files tab and the Invoice row)

Pass the deal's files in `DealRow.files` (see `_data.ts`); the contract saved from the New deal dialog belongs there with kind `contract`. Uploads from the panel call `uploadDealFile(file, { dealId, kind })` on the same `setTalbyIO` object: store the file, add a `deal_files` row, and return `{ id, name, kind, url, date }`. `kind` is `auto` when the user left File type on Auto: decide contract or invoice yourself. Without `uploadDealFile` the buttons only show a hint.

## Upgrade link

The trial card in the sidebar links to the board name `SUpgrade`. Map it in `setTalbyRoutes` to a route (for example `/upgrade`) that starts Stripe Checkout for Unlimited and redirects there.
