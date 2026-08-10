-- ============================================================
-- TALBY — Gmail inbox deal scanner (migration 000006)
-- Adds deal_type to deals, plus an inbox_leads table powering the
-- three-state detector (new / added / not_interested). All user-scoped.
-- ============================================================

-- Classified opportunity type on a deal (e.g. Paid Partnership, UGC, TBD).
alter table public.deals add column if not exists deal_type text;

-- Detected email lead. status: new = awaiting decision, added = turned into
-- a deal, not_interested = suppressed from re-surfacing.
create table if not exists public.inbox_leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  gmail_message_id text not null,
  thread_id text,
  sender_name text,
  sender_email text,
  subject text,
  snippet text,
  body_text text,
  brand_name text,
  agency_name text,
  contact_name text,
  contact_email text,
  deal_type text,
  compensation text,
  currency text,
  deliverables text,
  platforms text,
  draft_deadline text,
  post_date text,
  summary text,
  next_action text,
  confidence numeric,
  extracted jsonb,
  status text not null default 'new',
  linked_deal_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, gmail_message_id)
);

alter table public.inbox_leads enable row level security;

create policy "inbox_leads_select_own" on public.inbox_leads
  for select using (auth.uid() = user_id);
create policy "inbox_leads_insert_own" on public.inbox_leads
  for insert with check (auth.uid() = user_id);
create policy "inbox_leads_update_own" on public.inbox_leads
  for update using (auth.uid() = user_id);
create policy "inbox_leads_delete_own" on public.inbox_leads
  for delete using (auth.uid() = user_id);