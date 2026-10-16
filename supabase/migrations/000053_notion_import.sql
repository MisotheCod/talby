-- 000053_notion_import.sql
-- Item 14: Notion import — run ledger + repeat detection.
-- Additive only: two new objects, no existing column touched.

create table if not exists public.import_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  source text not null default 'notion',
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  total integer not null default 0,
  imported integer not null default 0,
  skipped integer not null default 0,
  failed integer not null default 0,
  error text
);

alter table public.import_runs enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'import_runs' and policyname = 'import_runs_owner_all') then
    create policy import_runs_owner_all on public.import_runs
      for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
end $$;

create index if not exists import_runs_user_started_idx on public.import_runs (user_id, started_at desc);

-- Repeat detection: remember which Notion page each deal came from.
alter table public.deals add column if not exists notion_page_id text;

create unique index if not exists deals_user_notion_page_uq
  on public.deals (user_id, notion_page_id)
  where notion_page_id is not null;
