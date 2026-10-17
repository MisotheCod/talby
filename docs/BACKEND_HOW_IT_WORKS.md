# Talby — Backend, How Everything Actually Works

Flat technical description. No opinion, no recommendations. This is how the platform is built and how each part behaves, written from the code.

---

## 1. Runtime & hosting

- **Framework:** Next.js (App Router). Server components + React Server Components for reads; dedicated server API routes (`src/app/api/**/route.ts`) for anything that writes, calls third parties, or needs the session server-side.
- **Hosting:** Vercel. Production alias `www.talby.io`. Previews are deployed per-branch and are protected by Vercel SSO (`all_except_custom_domains`) — i.e. only the custom production domain bypasses SSO; every preview URL requires auth.
- **Runtimes:** API routes default to Node. `force-dynamic` is set on essentially every route so nothing is statically cached in a way that serves stale user data.
- **Env:** Secrets live as Vercel environment variables and in `.env.local` locally. Two-vault split by design:
  - `src/lib/server-config.ts` — `import "server-only"`; holds `OPENROUTER_API_KEY`, `RESEND_INBOUND_WEBHOOK_SECRET`, `NOTION_CLIENT_ID`, `NOTION_CLIENT_SECRET`, `NOTION_REDIRECT_URI`. The `server-only` import throws at build time if any client component ever imports it, so these can't leak into the browser bundle.
  - `src/lib/constants.ts` — client-safe public identifiers only: `STRIPE_PRICE_ID`, `ASSISTANT_MODEL_ID`, `EMBED_MODEL_ID`, `EMBED_DIMENSIONS`, `NOTION_VERSION`.

---

## 2. Database & Supabase

**Tables** (from the code's usage): `profiles`, `deals`, `payments`, `content` (calendar posts / post dates), `todos`, `deal_files`, `deal_extras`, `deal_checklist`, `notes`, `inbox_leads`, `notifications`, `notion_connections`, `ideas`, `deal_contracts`, `contract_chunks`, `inbound_emails`, `deletion_log`, plus a Supabase Storage bucket `avatars` (profile photos) and `deal-files` (contract PDFs / attachments).

**Two clients** (`src/lib/supabase/server.ts`):
1. `createClient()` — user-scoped client built on `createServerClient` from `@supabase/ssr`, driven by cookies. **RLS applies.** Every "get your own data" server read goes through this.
2. `createServiceClient()` — `createSupabaseClient` with the **service-role key** (`SUPABASE_SERVICE_ROLE_KEY`). **Bypasses RLS.** Used only for background/server work with no user session: cron jobs, Stripe/Resend webhooks, Notion token storage, account deletion/export internals, and the few routes that must write as the system.

**Auth:** Supabase Auth (email/password + Google OAuth). The session is held in cookies and refreshed in Next.js middleware on every request.

---

## 3. Request flow & middleware

`src/lib/supabase/middleware.ts` runs on every request:
1. Refreshes the Supabase session cookie.
2. Route protection: unauthenticated users hitting `/app/*` or `/onboarding/*` are redirected to `/login?next=<path>`. Signed-in users hitting `/login` or `/signup` are redirected to `/app`.
3. Runs the landing-page A/B experiment (3 arms: control / question / signup) for anonymous visitors on `/`, `/blog`, `/privacy`, `/terms`, assigning a stable per-visitor variant cookie. (It no longer force-redirects the homepage to signup; it only assigns the variant.)

---

## 4. Access control & the trial model

The single source of truth for "what may an account do" is **`plan_status`** on `profiles` (migration 000044). Values:

| plan_status | Access |
|---|---|
| `none` | read only (no trial, or trial ended without subscribing) |
| `trialing` | full until `trial_end`, then read only |
| `active` | full |
| `past_due` | full during a 7-day grace after trial_end, then read only |
| `canceled` | read only |

- **Server logic:** `hasFullAccess(status, trialEnd, now)` in `src/lib/access.ts`. Pinned owner emails (`chanelicarobinson@gmail.com`, `approvedbybre@gmail.com`, `camqdesigns@gmail.com`, `camquint@gmail.com`) are always full access and can never be downgraded (`isPinnedUnlimited`).
- **DB logic:** `public.has_full_access()` (security definer, migration 000046) mirrors the same rule at the database layer.

**"Read only"** means view/search/export everything, but no create/edit/delete of deals, payments, files, or other user content. Nothing is deleted; it's a lock, not a wipe.

### The two write paths and how each is gated

1. **Client direct writes** (components write straight to Supabase with the user's session client). Gated **by RLS**: every INSERT/UPDATE/DELETE policy on user-content tables now also requires `public.has_full_access()` (migration 000046). Account-state tables (profiles, notifications, notion_connections, inbox_*) are deliberately NOT gated — a read-only user still manages their own settings.
2. **Server routes that write via the service role** (which bypasses RLS by definition). Gated **in the route handler** by `userIsReadOnly(userId)` from `src/lib/write-access.ts`, which reads the caller's own profile through their RLS-scoped client and returns true when they can't write. The routes return 403 with a clear "trial ended" message. `extract-contract` and `deals/[id] DELETE` both use this.

So the layering is: RLS is the gate for client-writes; the route-level `userIsReadOnly` check is the belt for the handful of service-role writes.

---

## 5. Deals — create / read / update / delete

### Create: `POST /api/deals` (`src/app/api/deals/route.ts`)
Body: `{ brand, payload, idempotencyKey?, text? }`.

1. Auth via session client.
2. Read-only gate via `userIsReadOnly` → 403 if read-only.
3. **Idempotency** (two layers): an in-process `Map` keyed `${userId}:${idempotencyKey}` short-circuits re-entrant calls on the same server instance; a DB unique index `(user_id, idempotency_key)` (migration 000028) is the durable guard via an `upsert(..., ignoreDuplicates)`. A duplicate returns the existing deal flagged `duplicate:true`.
4. Strips `structure_parts`, `extras`, `post_dates` from the deal row payload (they aren't deal columns) and persists them separately:
   - **post_dates** → `content` rows (each date + optional label/kind; `status: planned`), sorted ascending. `deals.post_date` is treated as a legacy/read-only column.
   - **payments** → generated server-side by `generatePaymentsFromStructure(...)` in `src/lib/payment-structure.ts` (every deal gets at least one payment row). Payment rows get `expected_date` only where the structure yields a concrete date (parts carry explicit dates; once/split derive dates from a post date + net days when the generator receives a post date; monthly rows have `expected_date: null`).
   - **extras** → `deal_extras` rows (bonus: amount + condition; commission: rate + on_text; `earned` flag).
5. If `text` is present (extracted contract), it fires a server-side fetch to `/api/assistant/ingest` to chunk + embed it. Non-fatal on failure.
6. Returns `{ ok, deal, duplicate }`.

### Read: deals page queries
Client fetches from `deals`, `payments`, `content`, `deal_extras` via the session client. Derived values computed in `src/app/app/deals/page.tsx`:
- `pay_by` = earliest payment `expected_date`.
- `post_dates` = full sorted list of linked `content` rows.
- `pay_cell` / `post_cell` = the next-unpaid/next-unposted + progress line ("0 of 2 paid", "Month 1 of 6", "0 of 2 posted").
- `pay_rollup` = deal-level status rollup (Paid only when all paid, else earliest unpaid).
- `extras` = the deal's `deal_extras`.

### Delete: `DELETE /api/deals/[id]`
Ownership enforced by resolving the deal through the caller's RLS-scoped client with `.eq('user_id', user.id)` (404s for non-owners). If owned and not read-only, it deletes via the service client in order: storage objects in `deal-files` then `deal_files` rows → `payments` → `deal_checklist` → `content` → `deal_contracts` + `contract_chunks` (so the assistant can never cite a deleted deal) → unlink any `inbox_leads.linked_deal_id` (set to null, lead kept) → finally the `deals` row.

*(Update of deal fields happens client-side through the session client, RLS-gated. There is no general `PATCH /api/deals` — the drawer writes directly to Supabase.)*

---

## 6. Contract upload → auto-filled deal

`POST /api/deals/extract-contract` (multipart, field `file`):
1. Auth; read-only gate (403 "Unlimited" message); checks `OPENROUTER_API_KEY` configured.
2. Max file 6 MB. Accepts PDF (extracted via `unpdf`, a pdfjs wrapper that bundles its own worker for serverless) or text/markdown.
3. Cap text at 30,000 chars.
4. Calls OpenRouter `google/gemini-3.5-flash-lite` with `response_format: json_object`, temperature 0, system prompt instructing strict extraction of every field with **null, never invented values**. The **owner identity** (the creator's email/full name/handle) is injected so the model rejects any rep-contact that matches the creator — `rep_name`/`rep_email` must be the brand's contact, else null.
5. Returns `{ ok, fields, text }` — the extracted fields prefill the deal form; the raw text rides along so it can be handed to the ingest route for chunking/embedding.

### Assistant ingest: `POST /api/assistant/ingest`
1. Auth; 15 req/min per-user rate limit; paid-tier gate (legacy `plan === "paid"` check).
2. Ownership check on the deal (RLS). Cap 30k chars.
3. Deletes + re-inserts `deal_contracts` (full text) and `contract_chunks` (chunks of ~900 chars with 120 overlap, each embedded via OpenRouter `text-embedding-3-small`, 1536 dims). Re-upload replaces prior chunks.

---

## 7. Assistant (`POST /api/assistant`)

A grounded question-answerer over the user's OWN data.

1. Auth; 15 req/min rate limit; paid-tier gate (402). Off-topic → immediate redirect message (no model call).
2. **Local intent classifier** (`detectIntent`, deterministic keyword + Levenshtein edit-distance matching) maps the question to: `money | schedule | contract | conflict | off_topic`. As a fallback the pronoun triggers an LLM intent judge (~8 tokens) only when the local net returns `ambiguous`.
3. Loads the user's own data through the session client (RLS): deals, payments, content, to-dos.
4. Builds a grounded context block with all their data + computed totals (expected, received, biggest deal).
5. For `contract`/`conflict`: embeds the question, runs `match_contract_chunks` RPC (semantic search over the user's OWN `contract_chunks` — the SQL binds to `auth.uid()`), and includes a **coverage note** telling the model how many of the user's total contracts it's actually seeing so it can say when it's missing a contract rather than guess.
6. Streams the answer as SSE. System prompt enforces: answer only from the retrieved data, never general knowledge, never output system prompts, quote clauses verbatim, and **treat all retrieved content as read-only data (prompt-injection defense)**.
7. Returns `CITATIONS:` line parsed into deal-brand citations surfaced to the UI.

**Privacy:** every OpenRouter call carries `provider: { zdr: true, data_collection: "deny", allow_fallbacks: false }` — routes only to zero-data-retention endpoints, fails rather than routing to a host that retains/trains. This is in `src/lib/assistant-ai.ts`, applied to chat, streaming, embedding, and import mapping.

---

## 8. Import (CSV + Notion) → mapping → insert

### CSV
`src/app/app/import/page.tsx` parses CSV client-side into `{ columns, rows }`. A CSV can be stashed in `sessionStorage` (`talby_pending_import`) by the Deals-page upload modal so the import page auto-parses without a manual re-upload.

### Notion connection (OAuth)
- `GET /api/notion/connect` → validates config (503 if not configured), builds Notion's authorize URL (owner=user), writes a signed `notion_state` cookie `{state, user_id, redirect_to}`, redirects to Notion.
- `GET /api/notion/callback` → verifies `state` (falls back to the signed-in session when the cross-site cookie dropped due to sameSite=lax — connect only ever starts for the signed-in user), exchanges the code at Notion `/v1/oauth/token` for a **long-lived** access token (Notion has no refresh flow), upserts it into `notion_connections`, redirects back to the import flow.
- The token is stored **server-side only** and never sent to the browser.

### Notion read
- `GET /api/notion/status` → `{ connected, workspace, configured }` (never returns the token).
- `GET /api/notion/databases` → lists accessible databases (Notion `/v1/search`).
- `POST /api/notion/fetch` → queries one database (first 100 rows), flattens every property type (`title`, `rich_text`, `number`, `select`, `status`, `multi_select`, `date`, `checkbox`, `url`, `email`, `formula`, `people`, etc.) into plain text via `propToText`, and returns `{ columns, rows, sourceName }` — **the exact same shape as parsed CSV**, so Notion feeds the identical mapping pipeline.

### Shared AI mapping + insert
- `POST /api/import/map` → OpenRouter (DeepSeek, ZDR params) reads columns + samples of rows and returns a `mapping` (column → Talby field) and per-row extracted items (brand, value, status, deliverable, due_date, notes, rep_email, content{title, event_date, platform}, payment{amount, expected_date, status}). Items with confidence < 0.6 are flagged `__review`.
- `importRows()` runs client-side against Supabase through the session client:
  - Loads existing deals by brand.
  - **New brands → insert.** **Existing brands → update, non-destructively**: only fills fields that are currently **empty**; manual data is never overwritten; duplicates never created.
  - Upserts calendar posts (`content`) keyed by `deal_id|date`. Upserts payments keyed by `deal_id|date|amount`, preserving received status.
  - **Never fabricates a received payment.** A source row that says "paid" but yields no received payment maps to `not_invoiced`, never a synthetic paid status (a previously-fixed bug ("Verde/Lumen/Kindred class") where imported deals were marked paid with no earned money behind them).

---

## 9. Stripe (subscriptions)

- `stripe/checkout` → creates a Stripe Checkout Session (payment at upgrade, no `trial_period_days` — the trial is managed app-side by plan_status/trial_end).
- `stripe/webhook` → verifies each event with `STRIPE_WEBHOOK_SECRET`, then resolves the user (preferring session/subscription metadata `userId`, falling back to `stripe_customer_id` on profiles) and writes `plan_status` (and `stripe_subscription_id`, `trial_end`) on the profile. Handled events:
  - `checkout.session.completed` → `active`
  - `customer.subscription.created/updated` → `trialing` / `active` / `past_due` / `canceled` from Stripe's status
  - `customer.subscription.deleted` → `canceled`
  - `invoice.payment_succeeded` → `active`
  - `invoice.payment_failed` → `past_due`
  - `customer.subscription.trial_will_end` → records `trial_end`, does NOT flip status yet.
- **Pinned accounts short-circuit `setPlanStatus`** and are always forced back to `active` — no webhook/cron can downgrade them.
- `plan` (legacy tier column) is mirrored alongside `plan_status` during the transition (active/trialing/past_due → paid; none/canceled → free) so old readers keep working; it's slated to be dropped.

---

## 10. Email — Resend (send + inbound)

**Send:** transactional email goes through **Resend**, rendered from React Email templates (`src/emails/daily-digest.tsx` etc.). Used by the digests, trial emails, welcome, unsubscribe replies. Subject to the standing rule: emails are drafted, never auto-sent except by explicit scheduled crons.

**Inbound** (`POST /api/inbound/webhook`): a Resend forward webhook, **Svix-signed** (`RESEND_INBOUND_WEBHOOK_SECRET`, `verifySvix`). Currently **log-and-store only**: it verifies the signature (rejects unsigned), normalizes email_id/to/from/subject, and inserts the **entire raw payload** into `inbound_emails` (jsonb `raw`). It does not yet parse forward-to-Talby contract emails into deals — the parsing engine exists (the same one used by contract upload) but the inbound → deal pipeline is not switched on. The point of the storage is to observe real Gmail confirmation + auto-forward header values before building on it.

---

## 11. Crons / scheduled jobs

Defined in `vercel.json` + route files under `src/app/api/cron/`:

| Cron | Schedule (UTC) | Body |
|---|---|---|
| `/api/cron/notifications` | 0 15 * * * | Idempotent day-rollup; fires browser push notifications for due items (skips events already notified today) |
| `/api/cron/digest` | 0 13 * * * | Daily email to opted-in users who have items that day (payments due, deliverables, posts, to-dos); never emails opt-outs or empty days |
| `/api/cron/expire-gifts` | 0 16 * * * | Revokes expired gift Unlimate grants |

**All guarded by `CRON_SECRET`** (fail-closed: reject unless the bearer token matches; Vercel sends it on real cron invocations). They use `createServiceClient()` (no user session).

**Present but not scheduled:** `/api/cron/trial-emails` is fully implemented (idempotent via `trial_email_reminder_sent`/`trial_email_ended_sent` flags on profiles, CRON_SECRET-guarded) but is **absent from `vercel.json`**, so Vercel never fires it.

---

## 12. Data writes, transactions & the "silently broke / didn't save" surface

This is the part that historically caused "things not saving / silently breaking." Facts from the code:

- **The app's primary write path is client-direct to Supabase.** Most saves (deal drawer, calendar, todos, etc.) are `supabase.from(...).upsert/insert/update(...)` fired from a client component, governed by RLS. There is **no central transaction layer** and **no single save service** — each screen writes its own rows.
- **Multi-table persistence is split into separate statements, not a transaction.** Example: creating a deal (via modal) writes the `deals` row, then `content` rows, then `payments` rows in separate Supabase calls. If any later call fails, the earlier rows are already committed — you can get a deal that exists but is missing its payments, or vice-versa. The `/api/deals` route writes them sequentially and wraps each child block in `try/catch` labeled **`/* non-fatal */`** (post_dates below, payment generation, extras, assistant ingest). A failure there is logged server-side but **still returns 200 with the deal created** — silent partial writes are possible by design for those secondary blocks.
- **Idempotency** only covers the create-deal path (keyed by user+idempotencyKey), not general client upserts.
- **Payment generation rules:** `once`/`split`/`monthly` structures only get an `expected_date` when the generator receives a post date it can compute net-days from. When a deal is created through the API without a post date in the payload, `once`/`monthly` rows land with `expected_date: null`, so the Pay-by column renders "—" until the date is set in the drawer. `parts` carries explicit per-part dates.
- **RLS is the correctness backstop** for client writes: a write that violates RLS/policies returns an error the client must handle. If the client ignores the returned `error` object (many `.then()` chains rely on `{ data, error }`), the UI can show success while the row silently didn't persist. Whether each screen checks the returned `error` varies by component.
- **Error-handling convention:** server routes generally `return NextResponse.json({ error, status })` and the client checks `!res.ok`. Client-direct Supabase writes return `{ data, error }` and manually map errors to messages. The assistant/ingest/extract routes explicitly catch and return structured errors so they don't produce an HTML 500 that the client misreads.
- **No global transaction/rollback, no outbox/event-log for writes.** Account deletion / export are the notable exception, done as deliberate multi-step server operations with a `deletion_log`.

---

## 13. PostHog (analytics)

Client and server instrumentation pushes funnel events: `account_created`, `trial_started`, `checkout_opened`, `checkout_completed`, `checkout_abandoned`. Ingests go through a **reverse-proxy rewrite** in `next.config.ts` (`/ingest/*` → PostHog) so ad blockers can't block client analytics.

---

## 14. Deploy & hygiene

- **One branch at a time to production** is the current operating rule; every deploy runs the full test suite (tsc + build + unit tests + Playwright regression harnesses) against the preview URL before merging to main.
- **Regression harness** (`scripts/drawer-save-regression.cjs`) signs up a throwaway account, seeds a deal, edits it in the drawer, and asserts the values actually persisted in the DB (27 checks) — it reads the DB via the service role to verify writes landed.
- **Backups** exist under `backups/` (Supabase JSON snapshot).

---

## 15. Notable behaviors worth knowing (facts)

- **Pinned accounts** are the only ones that can never be downgraded; they're keyed by email set in two places (TypeScript `isPinnedUnlimited` and the SQL `has_full_access` array) — the two must stay in sync.
- **The trial is app-managed**, not Stripe-trial-managed: signup requires no card, `trial_end` is set/observed app-side, and Stripe only marks `active` when someone pays.
- **The assistant is strictly RLS-bounded** — it reads via the session client, and semantic retrieval only ever touches `auth.uid()`'s chunks.
- **Notion + CSV converge on one mapping engine** because the fetch normalizes to the same `{columns, rows}` shape.
- **Inbound email is captured but not yet acted on** (log-only).
- **Trial-email cron is coded but not scheduled.**
```

