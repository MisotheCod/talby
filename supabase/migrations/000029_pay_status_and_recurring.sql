-- 000029: pay_status on payments + recurring deal framework
--
-- Folded into ONE migration so `payments` is altered once, avoiding the
-- "same column twice" risk. Contains two additive changes:
--   A) Replace per-deal payment_status/invoice_state with per-payment pay_status
--   B) Recurring deals: deal-level pattern + deal_cycles + cycle links
--
-- A notes/place changes nothing destructive: payments.invoice_state and
-- deals.payment_status are LEFT IN PLACE (code stops writing them). A separate
-- later migration drops them once verified.

--------------------------------------------------------------------------------
-- A) pay_status on payments
--------------------------------------------------------------------------------

alter table public.payments
  add column if not exists pay_status text;

-- Backfill per-payment with the approved priority:
--   received              -> paid
--   else invoice_state=invoiced        -> invoiced
--   else invoice_state=no_invoice_needed -> no_invoice_needed
--   else (null OR not_invoiced)        -> not_invoiced (explicitly written, never left null)
update public.payments
set pay_status =
  case
    when status = 'received' then 'paid'
    when invoice_state = 'invoiced' then 'invoiced'
    when invoice_state = 'no_invoice_needed' then 'no_invoice_needed'
    else 'not_invoiced'  -- collapses null and not_invoiced into the concrete value
  end;

-- Enforce the four-value domain (column is non-null after backfill).
alter table public.payments
  add constraint payments_pay_status_ck
  check (pay_status in ('not_invoiced','invoiced','paid','no_invoice_needed'));

--------------------------------------------------------------------------------
-- B) Recurring deal framework
--------------------------------------------------------------------------------

-- Deal-level recurrence pattern. NULL on all = a one-off deal (untouched).
alter table public.deals
  add column if not exists repeat_freq text;          -- 'monthly' now; weekly/biweekly/quarterly later
alter table public.deals
  add column if not exists per_cycle_deliverables int;
alter table public.deals
  add column if not exists delivery_due_timing text;  -- 'end' | 'start' | 'day_n'
alter table public.deals
  add column if not exists delivery_due_day int;      -- day-of-cycle when timing='day_n'
alter table public.deals
  add column if not exists payment_timing text;       -- 'terms' | 'days_after_delivery'
alter table public.deals
  add column if not exists payment_delay_days int;    -- when payment_timing='days_after_delivery'
alter table public.deals
  add column if not exists repeat_start date;
alter table public.deals
  add column if not exists repeat_end date;           -- NULL = open-ended
alter table public.deals
  add column if not exists repeat_amount numeric;     -- per-cycle amount (rate)

-- One row per generated period. This is the anchor for situations 1-6:
-- skip, rate-change (amount overridable per row), early-end (stop generating),
-- delivery slip (due date overridable per row), partial pay (multiple payments).
create extension if not exists pgcrypto;
create table if not exists public.deal_cycles (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references public.deals(id) on delete cascade,
  period_start date not null,
  period_end date not null,
  amount numeric not null,            -- per-cycle amount (locked at generation)
  delivery_due date not null,         -- overridable per cycle (situation 4/6)
  payment_due date,                   -- computed; may be null
  skipped boolean not null default false,   -- situation 1: skip a cycle
  created_at timestamptz not null default now(),
  unique (deal_id, period_start)
);

-- Cycle linkage on payments + content (NULL = existing one-off rows untouched).
alter table public.payments
  add column if not exists cycle_id uuid references public.deal_cycles(id);
alter table public.content
  add column if not exists cycle_id uuid references public.deal_cycles(id);

-- RLS: deal_cycles is owned via the parent deal.
alter table public.deal_cycles enable row level security;
drop policy if exists "deal_cycles select own" on public.deal_cycles;
create policy "deal_cycles select own" on public.deal_cycles
  for select using (auth.uid() = (select user_id from public.deals where id = deal_id));
drop policy if exists "deal_cycles insert own" on public.deal_cycles;
create policy "deal_cycles insert own" on public.deal_cycles
  for insert with check (auth.uid() = (select user_id from public.deals where id = deal_id));
drop policy if exists "deal_cycles update own" on public.deal_cycles;
create policy "deal_cycles update own" on public.deal_cycles
  for update using (auth.uid() = (select user_id from public.deals where id = deal_id));
drop policy if exists "deal_cycles delete own" on public.deal_cycles;
create policy "deal_cycles delete own" on public.deal_cycles
  for delete using (auth.uid() = (select user_id from public.deals where id = deal_id));

-- Deals table: normalize the stray status values we're abandoning in favor of
-- the rollup. Keep all columns; the app no longer reads payment_status.