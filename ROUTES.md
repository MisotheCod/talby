# Which board goes where

Each route renders one page board. The page boards handle desktop, tablet (768 to 1023) and phone (under 768) themselves, and they include the shell (sidebar, top bar, Add deal menu, Cmd K, notifications, assistant, Appearance window, toasts).

| Route | Board | Props |
|---|---|---|
| `/` | `SHome` | `tab`, `theme` (demo controls, leave unset) |
| `/onboarding` | `SOnboard` | `step` (1 to 6), `err` (forced error for checks), `vw`, `pv`, `frame` (preview only) |
| `/app` (first visit) | `SWelcome` | `view`, `plan`, `start`, `err` |
| `/app` | `SOverview` | `view`, `plan`, `writes` |
| `/app/deals` | `SDeals` | `view`, `plan`, `start` (`deal` opens the deal panel, `new` opens New deal, `cmd` opens search), `writes` |
| `/app/calendar` | `SCalendar` | `view`, `plan`, `failSave` |
| `/app/payments` | `SPayments` | `view`, `plan`, `start` (`income` opens the summary), `failSave` |
| `/app/ideas` | `SIdeas` | `view`, `plan` |
| `/app/todos` | `STodos` | `view`, `plan` |
| `/app/settings` | `SSettings` | `view`, `plan`, `tab` (opens on `account` by default), `notion`, `showErrors` |

Shared props on every page board:

- `view`: `sample` (default, the board's sample data), `empty`, `loading`, `error`. Pass `loading` while data loads, `error` when the load fails, `empty` when the account has no rows.
- `plan`: `active`, `trial`, `pastdue`, `canceled`, `readonly`. `canceled` and `readonly` lock every write and show the upgrade message.
- `color` and `dark`: only the starting look when nothing is saved in `localStorage talby.look`. Leave unset in the app.

Pieces you will not mount on their own (the page boards already include them): `SSidebar`, `STopbar`, `SBell`, `SCommand`, `SAssistant`, `SAppearance`, `SAddDeal`, `SDatePicker`, `SPraise`. They are kept as separate components because the page boards import them.

Reference only boards (state and flow sheets, phone and tablet frames, plan and error frames): every `Ph*`, `Tb*`, `St*`, `Pl*`, `Bi*`, `Se*`, `Ob*`, `We*`, `As*`, `NoEmpty`, `SFlowUpload`, `SFlowNotion`, `SFlowStates`, `SOnboardFlow`, `SOnboardPhone`, `SThemes`, `SDeal`, `SNewDeal`, `SIncome`. Each one is a page board with fixed props. They live under `/talby-preview` for the parity tool. You do not mount them on app routes.
