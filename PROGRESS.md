# PROGRESS — Talby redesign v2

Branch `talby-redesign-v2`. Nothing merges to main. Work top to bottom through
BUILD_CHECKLIST.md. Each line: item, what shipped, evidence.

- **0. Foundation** — talby-themes tokens + theme provider (CSS vars, no-flash,
  system-mode live listener), fonts, interactions.css, kit.js, utils helpers.
  Evidence: commits `7773522`..`6e577fd`, tsc + build green.
- **1. Shared components to kit.js** — Button (btnP/S/O/G/D + sizes), Input
  (36px/fill/no-border), Textarea, Select (trigger/content/item), Badge
  (22px + pay 24px), Card (rCard/border/shCard), Checkbox (16px rBox), RadioGroup,
  Switch, Skeleton, Avatar (initials, rAvatar), Alert + StateBlock (kit `blk`
  empty/error). Evidence: tsc exit 0, `next build` compiled + 42/42 pages,
  `npm test` 22/22.
- **2. Overlays to kit.js** — Dialog + AlertDialog (card/rDialog/shPop, overlay
  --t-overlay), Sheet (right side 480px tablet / full phone), Drawer (bottom
  sheet, rDialog), DropdownMenu (pop + 34px items rItem), Popover (pop),
  Tooltip (fg/card, 30px, rItem), Sonner (card/rCard/shPop, top on phone).
  Evidence: tsc exit 0, `next build` compiled + 42/42 pages.
- **3. Sidebar** — `src/components/shell/sidebar.tsx`: expanded + icon rail +
  drawer, Manage/Create groups, badges (hidden when fresh), plan/trial card with
  meter, Settings, user button + account menu, collapsed tooltips. Wired into the
  live shell (`app/app/app-shell.tsx`). Evidence: tsc + build green; signed up a
  test account and rendered /app live: aside present, 6 nav links
  (Overview/Deals/Calendar/Payments/Ideas/To-dos), Settings + user button with
  initials, --t-page #FFFFFF (studio light). Screenshot `/tmp/talby-shell/app-desktop.png`.
- **4. Top bar + menus** — `shell/topbar.tsx` (nav toggle, title, search pill,
  appearance, bell, Add deal), `shell/add-deal-menu.tsx` (New deal / Upload /
  Import from Notion), `shell/notifications.tsx` (header + Mark all read, All/
  Unread tabs, grouped rows by kind, "You are all caught up" empty state,
  footer). Wired into the live shell. Evidence: live render against a test
  account — add menu items `["New deal Start from scratch","Upload Contract or
  CSV","N Import from Notion Connect and pull deals"]`, notifications panel text
  `"Notifications … You are all caught up / New alerts about payments and posts
  show up here."`. Screenshots `topbar-add-menu.png`, `topbar-notifications.png`.
- **5. Plan banners + locked guard** — `shell/plan-banner.tsx`: PlanBanner for
  trialing (days-left copy) / pastdue (update card) / canceled (restart) /
  readonly (trial ended), solid-accent Subscribe right aligned; LockedDialog for
  trial-ended vs canceled. Wired into the shell under the top bar. Locked-writes
  guard confirmed live: `userIsReadOnly` on POST /api/deals, DELETE
  /api/deals/[id], and extract-contract (403 for read-only). Evidence: tsc +
  build green; live render showed the trial banner "14 days left in your free
  trial." + Subscribe (earlier vision analysis).
- **6. Search Cmd K** — `shell/search.tsx`: SearchPalette (overlay + input +
  scope chips All/Deals/Payments/Calendar/To-dos/Ideas/Pages, Recent from
  `talby.recentSearch`, Quick actions + Jump to groups, Ask Talby row, footer
  with ↑↓↵esc + results count, keyboard ↑↓EnterEscape) + `useCmdK`. Wired into
  the shell (Cmd/Ctrl K). Evidence: live — Cmd K opens the palette, scopes
  `["All","Deals","Payments","Calendar","To-dos","Ideas","Pages"]`, groups show
  Recent chips + Quick actions (New deal/Upload/Import from Notion) + Jump to,
  footer present. Screenshot `search-open.png`.
- **7. Date picker + praise** — `shell/date-picker.tsx`: trigger (md/sm,
  fill/outline, clear, chevron) + popover (296px, rTile, header prev/next +
  Month Year, Su..Sa grid 42 cells with today ring / selected primary / outside
  muted, Presets Today Tomorrow In a week). `shell/praise.tsx`: confetti burst +
  check badge, title, green chip, line, dismiss, 4.8s timer bar; mounted in the
  shell. Evidence: tsc exit 0, `next build` green.
- **8. Assistant** — `shell/assistant.tsx`: fab (Ask Talby, bottom-right /
  icon-only phone) + panel (400x620 desktop, full-screen phone) — header
  (avatar, title, sub, New chat, Close), empty state with 4 suggestions,
  messages, typing dots, composer + disclaimer, and the error / limit / offline
  states with Try again. Wired into the shell (streams /api/assistant). Evidence:
  live — fab present, panel renders "Talby Assistant … Hi there. What do you
  want to know? …". Screenshot `assistant.png`. tsc + build green.

## Blocked / notes
- `assets/ad/*.json` changes are from the parallel session, left untouched.
