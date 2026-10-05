-- 000039: Gifted Unlimited accounts (creator recruitment).
-- Adds a gift_until timestamp to profiles. A creator who is being recruited to make
-- UGC videos is given Unlimited for 12 months: set plan='paid' AND gift_until = now()+months.
-- The daily expiry cron flips plan back to 'free' when gift_until passes, but only for
-- users with NO stripe_customer_id (a real paying subscriber is never downgraded by a gift).
alter table public.profiles
  add column if not exists gift_until timestamptz;

-- Idempotent expiry used by the daily /api/cron/expire-gifts route. Downgrades a
-- gifted account to free only when (a) the gift window has passed AND (b) the user
-- has no Stripe customer (so a paying subscriber is never downgraded by a gift).
create or replace function public.expire_gifted_plans()
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  n int;
begin
  update public.profiles
     set plan = 'free'
   where plan = 'paid'
     and gift_until is not null
     and gift_until < now()
     and (stripe_customer_id is null or stripe_customer_id = '');
  get diagnostics n = row_count;
  return n;
end;
$$;