# Real data: the data and account props

Claude already did the board side. Every page board takes:

- `account`: the same `AccountData` object on every page (name, handle, email, sidebar badges, trial and past due dates, bell notifications, Cmd K search index).
- `data`: that page's own data, typed below.
- `onAction`: the save hook (see ACTIONS.md).
- `view` and `plan`, as before.

All the types, plus the design sample for each one (`SAMPLE_*`), are in `src/components/talby/_data.ts`. The boards format everything themselves ($4,000, Oct 19, "In 5 days", "16 days late", singular and plural), so pass plain dates (`YYYY-MM-DD` in the user's time zone) and whole dollar numbers.

When `data` or `account` is missing, the board shows its design sample. That is why `/talby-preview` still matches the boards exactly, and why the parity tool keeps working while you wire things up.

## Your job per page

1. Write a query that loads the rows for the signed in user (`src/lib/talby/queries.ts`).
2. Write a mapper from those rows to the type (`src/lib/talby/to-board.ts`). Type it with the type from `_data.ts`, so tsc tells you when a field is missing.
3. Pass it: `<TalbyPage board="SDeals" props={{ data, account, plan, view, onAction }} />`.
4. Test the mapper: feed it rows shaped like the design sample and compare the result with `SAMPLE_*` from `_data.ts`.

| Page board | data type | sample |
|---|---|---|
| SOverview | `OverviewData` | `SAMPLE_OVERVIEW` |
| SDeals (also the deal panel) | `DealsData` | `SAMPLE_DEALS` |
| SPayments (Schedule and Income summary) | `PaymentsData` | `SAMPLE_PAYMENTS` |
| SCalendar | `CalendarData` | `SAMPLE_CALENDAR` |
| SIdeas | `IdeasData` | `SAMPLE_IDEAS` |
| STodos | `TodosData` | `SAMPLE_TODOS` |
| SSettings | `SettingsData` | `SAMPLE_SETTINGS` |
| SWelcome | `WelcomeData` | none (the Getting started steps) |
| every page | `AccountData` (as `account`) | `SAMPLE_ACCOUNT`, `SAMPLE_SEARCH` |

What the boards work out by themselves, so you do not have to: days late, "In N days", the week strip around today, the next payment hint, totals and counts on the Payments tiles, best month, due in the next 30 days, the income chart by month, quarter and year, the brands list on the Income summary, the deal panel's payment schedule lines.

What you do pass as numbers: the four Overview tiles (booked, received, owed, with counts), deals completed and deals still open on the Income summary, gifted value, the sidebar badge counts, and `dealsThisYear`.

## States

- `view="loading"` while the query runs, `view="error"` when it fails (the board's Try again calls `retryLoad`; hook that to a refetch if you like), `view="empty"` when the user has no rows for that page, and `view="sample"` (or leave it out) when you pass real data. "sample" just means "show the data".
- `plan` is `active`, `trial`, `pastdue`, `canceled` or `readonly`, from the profile's plan status. Trial and past due dates come from `account.trial` and `account.pastDueBy`.

## Known limits

- The calendar shows the year of `today`, January to December.
- The Notion and upload flows in the New deal dialog, and the assistant's answers, still use sample responses. ACTIONS.md says where to plug in the real ones.
- The Appearance preview card in Settings shows a fixed example deal on purpose. It previews the look and is not user data.
