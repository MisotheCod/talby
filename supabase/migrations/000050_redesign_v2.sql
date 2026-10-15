-- ============================================================
-- 000050_redesign_v2.sql
-- Redesign v2 additive schema (YOMI_PROMPT section 5). Nothing dropped,
-- renamed or rewritten. New columns / tables / defaults, all if not exists.
--   profiles: the saved look (theme/mode/sidebar), onboarding + first-run
--             flags, and the new onboarding fields.
--   import_runs / notion_syncs / stripe_events: new tables.
--   One backfill: copy the old look (accent/hue/dark/midnight) into theme+mode
--   with the migrateLook() rules. Old columns are kept.
-- ============================================================

-- ---- profiles: the look ----
alter table public.profiles
  add column if not exists theme text not null default 'studio';
alter table public.profiles
  add column if not exists mode  text not null default 'light';
alter table public.profiles
  add column if not exists sidebar text not null default 'expanded';

-- guards (additive; drop+add so re-running is safe)
do $$ begin
  alter table public.profiles drop constraint if exists profiles_theme_chk;
  alter table public.profiles add constraint profiles_theme_chk
    check (theme in ('studio','sand','mac','stationery','editorial'));
  alter table public.profiles drop constraint if exists profiles_mode_chk;
  alter table public.profiles add constraint profiles_mode_chk
    check (mode in ('light','dark','system'));
  alter table public.profiles drop constraint if exists profiles_sidebar_chk;
  alter table public.profiles add constraint profiles_sidebar_chk
    check (sidebar in ('expanded','icons'));
end $$;

-- ---- profiles: onboarding + first run ----
alter table public.profiles add column if not exists platforms text[] not null default '{}';
alter table public.profiles add column if not exists deal_volume text;
alter table public.profiles add column if not exists onboarding_completed_at timestamptz;
alter table public.profiles add column if not exists tour_seen_at timestamptz;
alter table public.profiles add column if not exists getting_started_dismissed_at timestamptz;
alter table public.profiles add column if not exists assistant_first_used_at timestamptz;
alter table public.profiles add column if not exists reminders_asked_at timestamptz;

-- ---- imports ----
create table if not exists public.import_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source text not null check (source in ('csv','notion','contract')),
  source_name text,
  idempotency_key text,
  status text not null default 'running' check (status in ('running','done','failed')),
  added int not null default 0,
  updated int not null default 0,
  posts int not null default 0,
  payments int not null default 0,
  failed int not null default 0,
  error text,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  unique (user_id, idempotency_key)
);

-- ---- Notion keep in sync ----
create table if not exists public.notion_syncs (
  user_id uuid primary key references auth.users(id) on delete cascade,
  database_id text not null,
  mapping jsonb not null,
  keep_in_sync boolean not null default false,
  last_synced_at timestamptz,
  last_error text
);

-- ---- Stripe idempotency ----
create table if not exists public.stripe_events (
  id text primary key,
  type text not null,
  received_at timestamptz not null default now()
);

-- ---- RLS: owners read/write their own rows; writes follow has_full_access() ----
alter table public.import_runs enable row level security;
alter table public.notion_syncs enable row level security;

do $$ begin
  drop policy if exists import_runs_select_own on public.import_runs;
  create policy import_runs_select_own on public.import_runs
    for select using (auth.uid() = user_id);
  drop policy if exists import_runs_insert_own on public.import_runs;
  create policy import_runs_insert_own on public.import_runs
    for insert with check (auth.uid() = user_id and public.has_full_access());
  drop policy if exists import_runs_update_own on public.import_runs;
  create policy import_runs_update_own on public.import_runs
    for update using (auth.uid() = user_id and public.has_full_access());

  drop policy if exists notion_syncs_select_own on public.notion_syncs;
  create policy notion_syncs_select_own on public.notion_syncs
    for select using (auth.uid() = user_id);
  drop policy if exists notion_syncs_upsert_own on public.notion_syncs;
  create policy notion_syncs_upsert_own on public.notion_syncs
    for insert with check (auth.uid() = user_id and public.has_full_access());
  drop policy if exists notion_syncs_update_own on public.notion_syncs;
  create policy notion_syncs_update_own on public.notion_syncs
    for update using (auth.uid() = user_id and public.has_full_access());

  drop policy if exists stripe_events_select on public.stripe_events;
  create policy stripe_events_select on public.stripe_events
    for select using (auth.uid() is not null);
end $$;

-- stripe_events is written by the service role (webhook); no user write policy.

-- ---- Backfill: old look -> theme + mode (migrateLook rules) ----
-- midnight -> studio + dark; old color accent -> studio + light (hue kept in
-- the legacy accent column); users who already finished onboarding keep it.
update public.profiles
   set theme = case when theme is null or theme = 'studio' then 'studio' else theme end
 where theme is null or theme = 'studio';

update public.profiles
   set mode = 'dark'
 where (mode is null or mode = 'light')
   and exists (
     select 1 from information_schema.columns c
     where c.table_schema='public' and c.table_name='profiles' and c.column_name='theme_mode'
   )
   and theme_mode = 'dark';

-- Users who finished the old onboarding never see the new setup/tour.
update public.profiles
   set onboarding_completed_at = coalesce(onboarding_completed_at, now()),
       tour_seen_at = coalesce(tour_seen_at, case when tour_seen then now() else null end)
 where onboarding_completed_at is null
   and exists (
     select 1 from information_schema.columns c
     where c.table_schema='public' and c.table_name='profiles' and c.column_name='onboarding_step'
   )
   and coalesce(onboarding_step, 0) >= 4;
