-- 000033: desktop calendar view preference (month | agenda).
alter table public.profiles
  add column if not exists calendar_view text not null default 'month'
    check (calendar_view in ('month','agenda'));