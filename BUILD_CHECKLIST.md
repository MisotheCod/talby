# Talby redesign build checklist (v2 — Claude's React board ports)

Yomi: the UI is DONE — every design board is a React component in
`src/components/talby/`, matched to its board (structure + pixels + clicks),
verified by Claude in `PARITY.md`. Do NOT rebuild or restyle any screen. Work
this list in order: put each page board on its route and wire it to real data
and real saves (README sections 4 and 5). Never edit a board's `render()`.
After every change run `node tools/talby-parity.cjs` for that board — it must
still pass. Same safety rules: branch `talby-redesign-v2`, nothing to main, no
production deploys, additive DB only, never real accounts / Cam's login.

Install (README §3) done: folders copied, fonts self-hosted, preview routes
live at /talby-preview/<Board>, parity tool runs. Baseline = `e2e/talby-parity/`.

- [x] A. Install, fonts, preview routes, parity baseline green
- [x] B. TalbyPage, setTalbyRoutes, look sync with profiles (theme, mode, sidebar)
- [x] C. Overview on /app with real data, view and plan states
- [x] D. Deals on /app/deals: table, deal panel, phone sheet, real create, edit and delete
- [x] E. New deal dialog: manual, upload (20 MB direct), CSV and Excel, Notion import
- [x] F. Payments and Income summary: mark paid, record payment, reminders
- [x] G. Calendar
- [x] H. To-dos (Open the deal only when linked)
- [x] I. Ideas (burst animation)
- [x] J. Settings: account, appearance, billing in all five plans, Notion connection, inline errors
- [x] K. Onboarding (6 steps), first run tour, reminders, Getting started
- [x] L. Homepage on /
- [ ] M. Backend upgrades still open from the old checklist
- [ ] N. Triple check: parity tool green on all boards, every forced error, every plan, all themes; REPORT.md; pull request

## Backend already done (do not redo; wire the board handlers to them)
- Atomic deal create/delete: `create_deal`/`delete_deal` RPCs (000051), forced-fail/create/delete verified.
- Save helper: `src/lib/save.ts` runSave (error toast + Try again), npm test 27/27.
- Idempotency: deals unique (user_id, idempotency_key) + inflight map; Stripe dedup via `record_stripe_event` (000052).
- Pinned list: single source `PINNED_EMAILS` in `src/lib/access.ts`.
- Section-5 migrations: 000050 (profiles look/onboarding cols, import_runs/notion_syncs/stripe_events tables).
- Legacy plan check: `src/lib/plan-gate.ts` (currentPlanState via plan_status+hasFullAccess) replaced 3 legacy reads.
- Shared rate limits: `src/lib/rate-limit.ts` (assistant + ingest).
- Trial emails cron: scheduled in vercel.json (09:00), route idempotent.
- Notion token encryption: `src/lib/token-encrypt.ts` (AES-256-GCM on callback write / read decrypt).
- Sentry: @sentry/nextjs 11 + instrumentation.ts (no-op without SENTRY_DSN).
- Contract upload: extract-contract 20 MB cap + .docx via mammoth.
- Seeded test accounts: fixture.*@talby.test (sample = 26 deals / 3 late / 1 idea / 1 todo).
- Backend work this build lives on `talby-redesign-v2` (already pushed).
