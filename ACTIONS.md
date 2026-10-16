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
| `deal.create` | `{ kind: 'deal', form, plan, deals: [{ brand, amt, status, post }], title, chip, line }` | New deal dialog, manual form. `form` is the whole form (brand, amount, status, platforms, dates, payment terms, contacts). `plan` is the payment schedule shown to the user. |
| `deals.import` | `{ kind: 'import', count, deals: [{ brand, amt, status }] }` | Upload, CSV or Notion import finished. See "Imports" below. |
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
| `deal.update` | `{ id, changes, extras, checklist }`. `changes` holds only the fields the user edited in the panel (status, how, when, due, post, plats, repName and so on). |
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

The upload, CSV and Notion flows inside `SAddDeal` run on the design's sample responses (`data()` near the top of its logic class: extracted contract fields, CSV rows, Notion databases and rows). To make them real, replace what `data()` returns with your API results, in the same shapes, before each step renders, and keep the step names (`pick`, `reading`, `review`, `csvMap`, and so on). That is backend items 13 and 14. Keep the board's error steps: they already match the error frames in SFlowStates.

## The assistant (SAssistant)

The assistant answers from a small set of sample answers in its logic class. Replace that function with a call to your assistant endpoint (backend item 12) and keep the reply shape `{ text, label, href }`.
