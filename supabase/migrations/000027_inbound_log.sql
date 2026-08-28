-- 000027: inbound email log store (Part 1 of the forwarding ingest).
-- Every Resend inbound webhook payload is stored raw here so nothing is lost
-- before parsing exists. Status tracks the lifecycle so debug is possible
-- without DB access to the queue. User-scoped via RLS; `user_id` is resolved
-- from the recipient address once forwarding addresses exist (nullable for now
-- while the log-only endpoint is the only consumer).
create table if not exists public.inbound_emails (
  id uuid primary key default gen_random_uuid(),
  email_id text,                       -- Resend email_id (webhook idempotency key)
  user_id uuid references auth.users(id) on delete cascade,
  to_address text,
  from_address text,
  subject text,
  raw jsonb,                           -- full webhook payload
  status text not null default 'received'
    check (status in ('received','confirming','quarantined','processed','failed')),
  received_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists inbound_emails_email_id_idx on public.inbound_emails (email_id);
create index if not exists inbound_emails_user_idx on public.inbound_emails (user_id);
create index if not exists inbound_emails_received_idx on public.inbound_emails (received_at);

alter table public.inbound_emails enable row level security;
create policy "inbound_select_own" on public.inbound_emails
  for select using (auth.uid() = user_id);
create policy "inbound_insert_own" on public.inbound_emails
  for insert with check (auth.uid() = user_id);
create policy "inbound_update_own" on public.inbound_emails
  for update using (auth.uid() = user_id);