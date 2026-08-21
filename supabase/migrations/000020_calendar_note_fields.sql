-- 000020: Calendar note fields. Notes can carry a completion state and optional
-- details, alongside their pinned event_date (000014).
alter table public.notes
  add column if not exists done boolean not null default false,
  add column if not exists details text;