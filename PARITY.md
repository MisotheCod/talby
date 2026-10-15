# Parity results

Each board was rendered twice in Chromium at its canvas size: the original `.dc.html` board with the design runtime, and the converted React component. Fonts were the same local @fontsource files for both.

- **Structure:** every element in document order compared on tag, box (x, y, width, height to 0.01px), own text, and 27 computed styles (display, position, font family, size, weight, line height, letter spacing, color, background color and image, all four borders, radius, shadow, padding, margin, gap, opacity, transform, white space, text transform, overflow, z index, backdrop filter, filter).
- **Pixels:** full page screenshots diffed with pixelmatch at threshold 0.02. Two renders of the same original board differ by a few pixels (text antialiasing, timed animations), so anything at or under about 0.01 percent is render noise.
- **Next.js run:** the second table is from a production `next build` and `next start` (Next.js 15.5, React 19, strict TypeScript) with Tailwind 4 preflight, shadcn base styles and extra hostile global rules loaded, using `tools/talby-parity.cjs`. This is the strictest run.

## Next.js run: 115 of 115 pass, 115 of 115 structurally identical

| Board | Structure | Pixels differing |
|---|---|---|
| AsEmpty | same | 0.0000% |
| AsError | same | 0.0000% |
| AsLimit | same | 0.0000% |
| AsOffline | same | 0.0000% |
| BiActive | same | 0.0000% |
| BiCanceled | same | 0.0000% |
| BiPastdue | same | 0.0000% |
| BiReadonly | same | 0.0000% |
| BiTrial | same | 0.0000% |
| NoEmpty | same | 0.0000% |
| ObNameEmpty | same | 0.0000% |
| ObPhotoBig | same | 0.0000% |
| ObPhotoType | same | 0.0000% |
| ObSave | same | 0.0000% |
| PhCalendar | same | 0.0000% |
| PhDeal | same | 0.0000% |
| PhDeals | same | 0.0000% |
| PhHome | same | 0.0000% |
| PhIdeas | same | 0.0000% |
| PhIncome | same | 0.0000% |
| PhOnboard | same | 0.0000% |
| PhOverview | same | 0.0001% |
| PhPayments | same | 0.0000% |
| PhSettings | same | 0.0000% |
| PhTodos | same | 0.0000% |
| PhWelcome | same | 0.0000% |
| PlCanceled | same | 0.0002% |
| PlLocked | same | 0.0000% |
| PlPastdue | same | 0.0000% |
| PlReadonly | same | 0.0003% |
| PlTrial | same | 0.0000% |
| SAddDeal | same | 0.0000% |
| SAppearance | same | 0.0000% |
| SAssistant | same | 0.0000% |
| SBell | same | 0.0004% |
| SCalendar | same | 0.0001% |
| SCalendar__studio-dark | same | 0.0000% |
| SCommand | same | 0.0000% |
| SDatePicker | same | 0.0000% |
| SDeal | same | 0.0000% |
| SDeals | same | 0.0000% |
| SDeals__studio-dark | same | 0.0000% |
| SeErrors | same | 0.0000% |
| SeNotionLost | same | 0.0000% |
| SFlowNotion | same | 0.0000% |
| SFlowStates | same | 0.0000% |
| SFlowUpload | same | 0.0000% |
| SHome | same | 0.0000% |
| SIdeas | same | 0.0000% |
| SIncome | same | 0.0000% |
| SNewDeal | same | 0.0000% |
| SOnboard | same | 0.0000% |
| SOnboardFlow | same | 0.0000% |
| SOnboardPhone | same | 0.0000% |
| SOverview | same | 0.0000% |
| SOverview__editorial-dark | same | 0.0000% |
| SOverview__editorial-light | same | 0.0000% |
| SOverview__mac-dark | same | 0.0000% |
| SOverview__mac-light | same | 0.0000% |
| SOverview__sand-dark | same | 0.0000% |
| SOverview__sand-light | same | 0.0000% |
| SOverview__sidebar-icons | same | 0.0000% |
| SOverview__stationery-dark | same | 0.0000% |
| SOverview__stationery-light | same | 0.0000% |
| SOverview__studio-dark | same | 0.0000% |
| SOverview__studio-light | same | 0.0000% |
| SPayments | same | 0.0000% |
| SPayments__studio-dark | same | 0.0046% |
| SPraise | same | 0.0000% |
| SSettings | same | 0.0000% |
| SSettings__studio-dark | same | 0.0063% |
| SSidebar | same | 0.0000% |
| StCalendarEmpty | same | 0.0000% |
| StCalendarError | same | 0.0000% |
| StCalendarLoading | same | 0.0000% |
| StDealsEmpty | same | 0.0000% |
| StDealsError | same | 0.0000% |
| StDealsLoading | same | 0.0000% |
| SThemes | same | 0.0000% |
| StIdeasEmpty | same | 0.0000% |
| StIdeasError | same | 0.0000% |
| StIdeasLoading | same | 0.0000% |
| StIncomeEmpty | same | 0.0000% |
| StIncomeError | same | 0.0000% |
| StIncomeLoading | same | 0.0059% |
| STodos | same | 0.0000% |
| STopbar | same | 0.0000% |
| StOverviewEmpty | same | 0.0000% |
| StOverviewError | same | 0.0072% |
| StOverviewLoading | same | 0.0000% |
| StPaymentsEmpty | same | 0.0000% |
| StPaymentsError | same | 0.0000% |
| StPaymentsLoading | same | 0.0000% |
| StSettingsError | same | 0.0000% |
| StSettingsLoading | same | 0.0000% |
| StTodosEmpty | same | 0.0000% |
| StTodosError | same | 0.0000% |
| StTodosLoading | same | 0.0096% |
| SWelcome | same | 0.0000% |
| SWelcome__studio-dark | same | 0.0000% |
| TbCalendar | same | 0.0000% |
| TbDeal | same | 0.0000% |
| TbDeals | same | 0.0002% |
| TbHome | same | 0.0000% |
| TbIdeas | same | 0.0000% |
| TbIncome | same | 0.0001% |
| TbOnboard | same | 0.0000% |
| TbOverview | same | 0.0000% |
| TbPayments | same | 0.0002% |
| TbSettings | same | 0.0000% |
| TbTodos | same | 0.0000% |
| TbWelcome | same | 0.0000% |
| WeBlocked | same | 0.0000% |
| WeComplete | same | 0.0000% |
| WeOffline | same | 0.0000% |

## First run, no app CSS: 98 of 99 structurally identical

Not identical: PhWelcome. PhWelcome starts the first run tour, which scrolls the page with a smooth scroll timed off measured sizes. Two renders of the original board also land at different scroll offsets (72 to 79px in our runs), so this is timing, not a difference in the component. Rendered alone it is pixel identical.

## Click test

Every visible button, link, tab, menu item, checkbox and label was clicked one at a time in a fresh page of the original and of the port (same clock and random seed), then the two screenshots were diffed. Then each board had its text fields typed into, Escape pressed, and Cmd K pressed.

First pass waited 0.7s after each click. Boards with differences were run again waiting 2.5s after each click, waiting for any new page to load, and resizing to full height before the screenshot; the table shows the final run. Differences under 150 pixels were treated as noise (the Ask Talby button text antialiasing differs by about 125 pixels between two renders of the same original).

SOverview "Remind" (2 clicks): after the click the mouse rests over the income chart and its hover tooltip shows in both versions, one pixel apart. Same content, so not a difference in the component.

| Board | Clicks compared | Result |
|---|---|---|
| PhCalendar | 15 | same |
| PhDeal | 15 | same |
| PhDeals | 15 | same |
| PhHome | 15 | same |
| PhIdeas | 15 | same |
| PhOnboard | 3 | same |
| PhOverview | 15 | same |
| PhPayments | 15 | same |
| PhSettings | 15 | same |
| PhTodos | 13 | same |
| PhWelcome | 15 | same |
| SAddDeal | 19 | same |
| SAppearance | 14 | same |
| SAssistant | 7 | same |
| SBell | 17 | same |
| SCalendar | 40 | same |
| SCommand | 26 | same |
| SDatePicker | 40 | same |
| SDeal | 40 | same |
| SDeals | 40 | same |
| SFlowNotion | 36 | same |
| SFlowUpload | 40 | same |
| SHome | 40 | same |
| SIdeas | 25 | same |
| SIncome | 32 | same |
| SNewDeal | 40 | same |
| SOnboard | 2 | same |
| SOverview | 40 | click 20 "Remind" 336px; click 22 "Remind" 190px |
| SPayments | 38 | same |
| SPraise | 4 | same |
| SSettings | 28 | same |
| SSidebar | 8 | same |
| STodos | 21 | same |
| STopbar | 8 | same |
| SWelcome | 27 | same |
