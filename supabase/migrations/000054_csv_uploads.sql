-- 000054_csv_uploads.sql
-- Item 2: keep the parsed CSV server side so step two can save from an uploadId.
-- Additive only: one new table, no existing object touched.

create table if not exists public.import_uploads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  source text not null default 'csv',
  file_name text,
  /** the parsed file: { header: string[], rows: string[][], preview: [...] } */
  payload jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.import_uploads enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'import_uploads' and policyname = 'import_uploads_owner_all') then
    create policy import_uploads_owner_all on public.import_uploads
      for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
end $$;

create index if not exists import_uploads_user_created_idx on public.import_uploads (user_id, created_at desc);
