-- 000009: avatars + notifications.
alter table public.profiles
  add column if not exists avatar_url text;

-- In-app notifications.
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null default 'calendar',
  title text not null,
  body text,
  link text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_idx on public.notifications(user_id, read, created_at desc);

-- Notification preferences live on profiles.
alter table public.profiles
  add column if not exists notify_calendar_inapp boolean not null default true,
  add column if not exists notify_calendar_email boolean not null default false;

alter table public.profiles
  enable row level security;
alter table public.notifications
  enable row level security;

-- RLS: users manage their own notifications + profile.
drop policy if exists "profiles select own" on public.profiles;
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles select own" on public.profiles for select using (auth.uid() = id);
create policy "profiles update own" on public.profiles for update using (auth.uid() = id);

drop policy if exists "notifications select own" on public.notifications;
drop policy if exists "notifications insert own" on public.notifications;
drop policy if exists "notifications update own" on public.notifications;
drop policy if exists "notifications delete own" on public.notifications;
create policy "notifications select own" on public.notifications for select using (auth.uid() = user_id);
create policy "notifications insert own" on public.notifications for insert with check (auth.uid() = user_id);
create policy "notifications update own" on public.notifications for update using (auth.uid() = user_id);
create policy "notifications delete own" on public.notifications for delete using (auth.uid() = user_id);
