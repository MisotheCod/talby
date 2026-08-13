-- 000013: light/dark theme mode.
alter table public.profiles
  add column if not exists theme_mode text not null default 'light'
    check (theme_mode in ('light','dark'));
