-- ============================================================
-- TALBY — Payment nudge automation (schema, migration 000002)
-- All new data is user-scoped via RLS. Draft-for-approval is the
-- default; auto-send must be explicitly opted in per deal.
-- ============================================================

-- ---------- DEALS: rep contact + nudge mode ----------
alter table public.deals
  add column if not exists rep_name text,
  add column if not exists rep_email text,
  add column if not exists nudge_mode text not null default 'draft'
    check (nudge_mode in ('off','notify','draft','auto'));

-- ---------- PROFILES: per-user nudge rules (settings defaults) ----------
alter table public.profiles
  add column if not exists nudge_days_overdue int not null default 3,
  add column if not exists nudge_cadence_days int not null default 6,
  add column if not exists nudge_max_count int not null default 3;

-- ---------- GMAIL CONNECTIONS (server-side token, user-scoped) ----------
create table if not exists public.gmail_connections (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,                       -- the connected Gmail address
  access_token text,                -- server-side only
  refresh_token text,               -- server-side only
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.gmail_connections enable row level security;
create policy "gmail_select_own" on public.gmail_connections
  for select using (auth.uid() = user_id);
create policy "gmail_insert_own" on public.gmail_connections
  for insert with check (auth.uid() = user_id);
create policy "gmail_update_own" on public.gmail_connections
  for update using (auth.uid() = user_id);
create policy "gmail_delete_own" on public.gmail_connections
  for delete using (auth.uid() = user_id);

-- ---------- NUDGES (history + dedupe; one row per attempt) ----------
create table if not exists public.nudges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  deal_id uuid references public.deals(id) on delete cascade,
  payment_id uuid references public.payments(id) on delete cascade,
  status text not null default 'draft'
    check (status in ('draft','sent','skipped')),
  subject text,
  body text,
  sequence_step int not null default 1,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists nudges_user_idx on public.nudges (user_id);
create index if not exists nudges_payment_idx on public.nudges (payment_id);

alter table public.nudges enable row level security;
create policy "nudges_select_own" on public.nudges
  for select using (auth.uid() = user_id);
create policy "nudges_insert_own" on public.nudges
  for insert with check (auth.uid() = user_id);
create policy "nudges_update_own" on public.nudges
  for update using (auth.uid() = user_id);
create policy "nudges_delete_own" on public.nudges
  for delete using (auth.uid() = user_id);

-- ---------- APP SETTINGS (RPC helpers) ----------
-- The surveillance/manual send and scheduler run server-side with the
-- service role, so they rely on these two helper functions rather than
-- direct client access to gmail_connections (which is RLS-protected).
-- Service role bypasses RLS directly; these exist for clarity only.
