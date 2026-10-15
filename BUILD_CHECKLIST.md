# Talby redesign build checklist

Yomi: copy this file to the repo root as BUILD_CHECKLIST.md. Work top to bottom. For each item: build it, verify it (parity under 0.5 percent against the listed screenshots, phone and tablet boards, its states, no horizontal scroll), commit, tick the box, and move to the next. Never stop because "the rest is a lot". The work only stops when every box is ticked, or the session ends; the next session starts at the first unticked box.

Item 0 is already done (foundation, commits 7773522 to 6e577fd).

## Shell
- [x] 1. Shared components restyled to kit.js: Button, Input, Textarea, Select, Badge, Card, Checkbox, RadioGroup, Switch, Skeleton, Avatar, Alert, the empty and error block
- [x] 2. Overlays: Dialog, AlertDialog, Sheet, Drawer, DropdownMenu, Popover, Tooltip, Sonner toasts (top on phone)
- [x] 3. Sidebar: expanded, icon rail, drawer, trial card, no counts for empty accounts (SSidebar, PlTrial)
- [x] 4. Top bar, Add deal menu, notifications with empty state (STopbar, SBell, NoEmpty)
- [x] 5. Plan banners and locked writes guard (PlPastdue, PlReadonly, PlCanceled)
- [x] 6. Search Cmd K (SCommand)
- [ ] 7. Date picker (SDatePicker), praise cards (SPraise)
- [ ] 8. Assistant panel and states (SAssistant, AsEmpty, AsError, AsLimit, AsOffline)
- [ ] 9. Appearance window and theme switching (SAppearance, SThemes)
- [ ] 10. Seeded test accounts: sample, empty, trial, past due, canceled, read only

## Backend first (writes)
- [ ] 11. Section 5 migrations and backfill on a Supabase branch
- [ ] 12. Atomic deal create and delete (upgrade 1)
- [ ] 13. Save helper with error toast and retry (upgrade 2)
- [ ] 14. Idempotency (3), pinned list (5), Stripe events (10)

## Overview and Deals
- [ ] 15. Overview desktop, all 10 looks (SOverview, SOverview__*)
- [ ] 16. Overview phone, tablet, empty, loading, error (PhOverview, TbOverview, StOverview*)
- [ ] 17. Deals table desktop (SDeals)
- [ ] 18. Deals tablet compact table and phone cards with the Show deals sheet (TbDeals, PhDeals)
- [ ] 19. Deals empty, loading, error, no results (StDeals*)
- [ ] 20. Deal panel desktop, tablet, phone (SDeal, TbDeal, PhDeal)
- [ ] 21. New deal dialog with platform icons and Facebook (SAddDeal, SNewDeal)
- [ ] 22. New deal form errors and locked dialog (SFlowStates form frames, PlLocked)

## Upload and Notion
- [ ] 23. 20 MB direct to storage upload, PDF and Word (upgrade 13)
- [ ] 24. Contract upload flow and its errors (SFlowUpload, SFlowStates upload frames)
- [ ] 25. CSV and Excel flow and its errors (SFlowUpload, SFlowStates CSV frames)
- [ ] 26. Notion connect, pick, match, choose, import (SFlowNotion)
- [ ] 27. Notion errors, pagination, Looks like deals, repeats, import_runs (SFlowStates Notion frames)
- [ ] 28. Notion token encryption and OAuth domain fix (7), shared rate limits (4)

## Money and calendar
- [ ] 29. Calendar desktop, tablet, phone, states (SCalendar, TbCalendar, PhCalendar, StCalendar*)
- [ ] 30. Payments desktop, tablet, phone, states, dialogs (SPayments, TbPayments, PhPayments, StPayments*)
- [ ] 31. Income summary all sizes and states (SIncome, TbIncome, PhIncome, StIncome*)

## Ideas, To-dos, Settings
- [ ] 32. Ideas with burst animation, all sizes and states (SIdeas, PhIdeas, TbIdeas, StIdeas*)
- [ ] 33. To-dos, Open the deal only when linked, all sizes and states (STodos, PhTodos, TbTodos, StTodos*)
- [ ] 34. Settings opening on Account, all tabs, all sizes, loading and error (SSettings, PhSettings, TbSettings, StSettings*)
- [ ] 35. Billing in all five plan states (BiActive, BiTrial, BiPastdue, BiCanceled, BiReadonly)
- [ ] 36. Settings inline errors and Notion connection lost (SeErrors, SeNotionLost)
- [ ] 37. Legacy plan check (6), trial emails cron (9)

## Onboarding and first run
- [ ] 38. Setup 6 steps desktop (SOnboard, SOnboardFlow)
- [ ] 39. Setup phone and tablet, preview sheet (SOnboardPhone, PhOnboard, TbOnboard)
- [ ] 40. Setup errors (ObNameEmpty, ObPhotoType, ObPhotoBig, ObSave)
- [ ] 41. First run tour, reminders, Getting started (SWelcome, PhWelcome, TbWelcome, WeBlocked, WeOffline, WeComplete)

## Homepage and cleanup
- [ ] 42. Homepage desktop (SHome)
- [ ] 43. Homepage tablet and phone, every demo by touch (TbHome, PhHome)
- [ ] 44. Email forwarding removed from code and copy (8)
- [ ] 45. Sentry (11), assistant limits and citations (12)

## Triple check and hand off
- [ ] 46. Pass 1: full parity suite green on all 115 screenshots, no horizontal scroll at 7 widths
- [ ] 47. Pass 2: every interaction and every forced error, every plan, all themes
- [ ] 48. Pass 3: clean clone audit (shadcn, copy, rules, decisions, data safety)
- [ ] 49. report/index.html side by side, REPORT.md complete with morning steps
- [ ] 50. Pull request with preview URL