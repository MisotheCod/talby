-- 000011: daily digest opt-in.
alter table public.profiles
  add column if not exists digest_enabled boolean not null default false;
