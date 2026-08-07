-- ============================================================
-- TALBY — Schema + Row Level Security (migration)
-- All tables are user-scoped. No user can ever see another's rows.
-- ============================================================

-- ---------- PROFILES ----------
-- One row per auth user, created via trigger on signup.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  handler text,                       -- creator handle shown in greeting
  accent text not null default 'coral',
  plan text not null default 'free' check (plan in ('free','paid')),
  stripe_customer_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- DEALS ----------
create table if not exists public.deals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  brand text not null,
  status text not null default 'active'
    check (status in ('active','pipeline','unpaid','paid','archived')),
  deliverable text,
  value numeric,                    -- dollar amount
  due_date date,
  notes text,
  links jsonb default '[]'::jsonb, -- [{url,label}]
  active boolean not null default true, -- active deals count toward free cap
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists deals_user_idx on public.deals (user_id);

alter table public.deals enable row level security;

create policy "deals_select_own" on public.deals
  for select using (auth.uid() = user_id);
create policy "deals_insert_own" on public.deals
  for insert with check (auth.uid() = user_id);
create policy "deals_update_own" on public.deals
  for update using (auth.uid() = user_id);
create policy "deals_delete_own" on public.deals
  for delete using (auth.uid() = user_id);

-- Updated-at trigger helper
create or replace function public.touch_updated_at()
returns trigger language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists deals_touch on public.deals;
create trigger deals_touch before update on public.deals
  for each row execute procedure public.touch_updated_at();

-- ---------- PAYMENTS ----------
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  deal_id uuid references public.deals(id) on delete set null,
  amount numeric not null,
  expected_date date,
  status text not null default 'expected'
    check (status in ('expected','received')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists payments_user_idx on public.payments (user_id);
create index if not exists payments_deal_idx on public.payments (deal_id);

alter table public.payments enable row level security;

create policy "payments_select_own" on public.payments
  for select using (auth.uid() = user_id);
create policy "payments_insert_own" on public.payments
  for insert with check (auth.uid() = user_id);
create policy "payments_update_own" on public.payments
  for update using (auth.uid() = user_id);
create policy "payments_delete_own" on public.payments
  for delete using (auth.uid() = user_id);

-- ---------- CONTENT (content calendar) ----------
-- Designed for future headroom: can later hold a full post's needs
-- (caption, media refs, platform, scheduled time) without a rebuild.
create table if not exists public.content (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  platform text,                  -- platform(s); comma-separated in v1
  post_type text,                 -- e.g. post, reel, story, short
  status text not null default 'planned'
    check (status in ('planned','published','idea')),
  event_date date not null,
  linked_deal_id uuid references public.deals(id) on delete set null,
  caption text,
  notes text,
  -- recurring (weekly / biweekly / monthly) — null = one-off
  repeat_type text check (repeat_type in ('weekly','biweekly','monthly')),
  repeat_until date,
  -- future-publishing headroom (v1 stores only; never publishes)
  scheduled_time time,
  media_refs jsonb default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists content_user_idx on public.content (user_id);
create index if not exists content_date_idx on public.content (user_id, event_date);

alter table public.content enable row level security;

create policy "content_select_own" on public.content
  for select using (auth.uid() = user_id);
create policy "content_insert_own" on public.content
  for insert with check (auth.uid() = user_id);
create policy "content_update_own" on public.content
  for update using (auth.uid() = user_id);
create policy "content_delete_own" on public.content
  for delete using (auth.uid() = user_id);

-- Expand recurring events to concrete dates when a recurring entry is created
create or replace function public.expand_recurring()
returns trigger language plpgsql security definer set search_path = public
as $$
declare
  d date := new.event_date;
  max_d date := coalesce(new.repeat_until, new.event_date + interval '1 year');
  step interval;
begin
  if new.repeat_type is null then
    return new;
  end if;
  step := case new.repeat_type
    when 'weekly'   then interval '7 days'
    when 'biweekly' then interval '14 days'
    when 'monthly'  then interval '1 month'
  end;
  d := d + step;
  while d <= max_d loop
    insert into public.content
      (user_id, title, platform, post_type, status, event_date,
       linked_deal_id, caption, notes, repeat_type, repeat_until, scheduled_time, media_refs)
    values
      (new.user_id, new.title, new.platform, new.post_type, new.status, d,
       new.linked_deal_id, new.caption, new.notes, null, null, new.scheduled_time, new.media_refs);
    d := d + step;
  end loop;
  return new;
end;
$$;

-- The base row carries repeat_type; generated instances get null repeat_type.
drop trigger if exists content_recurring on public.content;
create trigger content_recurring
  after insert on public.content
  for each row
  when (new.repeat_type is not null)
  execute procedure public.expand_recurring();

-- ---------- IDEAS ----------
create table if not exists public.ideas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  stage text not null default 'bucket'
    check (stage in ('bucket','developing','ready','executed')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists ideas_user_idx on public.ideas (user_id);

alter table public.ideas enable row level security;

create policy "ideas_select_own" on public.ideas
  for select using (auth.uid() = user_id);
create policy "ideas_insert_own" on public.ideas
  for insert with check (auth.uid() = user_id);
create policy "ideas_update_own" on public.ideas
  for update using (auth.uid() = user_id);
create policy "ideas_delete_own" on public.ideas
  for delete using (auth.uid() = user_id);

-- ---------- NOTES (autosaving scratchpad) ----------
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null default '',
  updated_at timestamptz not null default now()
);
create index if not exists notes_user_idx on public.notes (user_id);

alter table public.notes enable row level security;

create policy "notes_select_own" on public.notes
  for select using (auth.uid() = user_id);
create policy "notes_insert_own" on public.notes
  for insert with check (auth.uid() = user_id);
create policy "notes_update_own" on public.notes
  for update using (auth.uid() = user_id);
create policy "notes_delete_own" on public.notes
  for delete using (auth.uid() = user_id);

-- ---------- TODOS ----------
create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  done boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists todos_user_idx on public.todos (user_id);

alter table public.todos enable row level security;

create policy "todos_select_own" on public.todos
  for select using (auth.uid() = user_id);
create policy "todos_insert_own" on public.todos
  for insert with check (auth.uid() = user_id);
create policy "todos_update_own" on public.todos
  for update using (auth.uid() = user_id);
create policy "todos_delete_own" on public.todos
  for delete using (auth.uid() = user_id);

-- ---------- DEAL CHECKLIST ----------
create table if not exists public.deal_checklist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  deal_id uuid not null references public.deals(id) on delete cascade,
  title text not null,
  done boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists deal_checklist_user_idx on public.deal_checklist (user_id);
create index if not exists deal_checklist_deal_idx on public.deal_checklist (deal_id);

alter table public.deal_checklist enable row level security;

create policy "checklist_select_own" on public.deal_checklist
  for select using (auth.uid() = user_id);
create policy "checklist_insert_own" on public.deal_checklist
  for insert with check (auth.uid() = user_id);
create policy "checklist_update_own" on public.deal_checklist
  for update using (auth.uid() = user_id);
create policy "checklist_delete_own" on public.deal_checklist
  for delete using (auth.uid() = user_id);

-- ---------- DEAL FILES (paid plan only) ----------
create table if not exists public.deal_files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  deal_id uuid not null references public.deals(id) on delete cascade,
  name text not null,
  path text not null,              -- storage object path
  size_bytes bigint,
  mime text,
  created_at timestamptz not null default now()
);
create index if not exists deal_files_user_idx on public.deal_files (user_id);
create index if not exists deal_files_deal_idx on public.deal_files (deal_id);

alter table public.deal_files enable row level security;

create policy "files_select_own" on public.deal_files
  for select using (auth.uid() = user_id);
create policy "files_insert_own" on public.deal_files
  for insert with check (auth.uid() = user_id);
create policy "files_delete_own" on public.deal_files
  for delete using (auth.uid() = user_id);
