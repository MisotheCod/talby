-- 000040: payment structures + extras (release 1).
--
-- Captures how a deal is paid (once / split / parts / monthly) on the deal, and
-- keeps earned extras (bonus / commission) as a SEPARATE list — never mixed
-- into `payments` guaranteed-money rows. Payments stay generated from the
-- structure; extras are additive on top and are NOT counted in Booked/Expected/
-- Outstanding until a bonus is earned or a commission payout is logged (each
-- of those creates its own tracked payment labeled Bonus / Commission).

alter table public.deals
  add column if not exists payment_structure text
    check (payment_structure in ('once','split','parts','monthly'));

-- Structure detail fields (only the ones relevant to the chosen structure are
-- used; the rest stay null). Net timing values mirror the retired pay_terms set.
alter table public.deals
  add column if not exists structure_timing text,      -- once: 'when_posts'|'net_15'|'net_30'|'net_45'|'net_60'
  add column if not exists structure_timing_set_date date, -- once: when timing = a set date
  add column if not exists structure_upfront_pct int,  -- split: 25|30|40|50
  add column if not exists structure_balance_timing text, -- split: 'when_posts'|'net_15'|'net_30'|'net_60'
  add column if not exists structure_months int,       -- monthly: 3|6|12
  add column if not exists structure_start_date date;  -- monthly: first month

-- Extras: bonuses and commissions on a deal, separate from guaranteed payments.
create table if not exists public.deal_extras (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  deal_id uuid not null references public.deals(id) on delete cascade,
  kind text not null check (kind in ('bonus','commission')),
  amount numeric,                 -- bonus: amount; commission: unused
  condition text,                 -- bonus: "the Reel passes 100K views"; commission unused
  rate int,                       -- commission: percent
  on_text text,                   -- commission: "sales with code CAMBO10"
  earned boolean not null default false,  -- bonus only; commission earns via payouts
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists deal_extras_deal_idx on public.deal_extras (deal_id);
create index if not exists deal_extras_user_idx on public.deal_extras (user_id);

alter table public.deal_extras enable row level security;

create policy "deal_extras_select_own" on public.deal_extras
  for select using (auth.uid() = user_id);
create policy "deal_extras_insert_own" on public.deal_extras
  for insert with check (auth.uid() = user_id);
create policy "deal_extras_update_own" on public.deal_extras
  for update using (auth.uid() = user_id);
create policy "deal_extras_delete_own" on public.deal_extras
  for delete using (auth.uid() = user_id);