-- ============================================================
-- 000044_plan_status.sql
-- Trial billing model: replace the free/paid tier with a lifecycle.
--
-- DECISION: do NOT overload the legacy `plan` column (a two-value tier)
-- with lifecycle states. Add `plan_status` as the single source of truth
-- for access, plus the trial/subscription bookkeeping columns. `plan` is
-- now LEGACY and will be dropped once every reader has migrated to
-- plan_status. This is additive: existing code that reads `plan` keeps
-- working unchanged, so the migration is non-breaking.
--
--   plan_status: 'none' | 'trialing' | 'active' | 'past_due' | 'canceled'
--   access       = trialing | active  (full). past_due keeps full access
--                  during a 7 day grace, then read only. none/canceled are
--                  read only. See the hasFullAccess helper in app code.
-- ============================================================

alter table public.profiles
  add column if not exists plan_status text not null default 'none';

alter table public.profiles
  add column if not exists trial_end timestamptz;

alter table public.profiles
  add column if not exists stripe_subscription_id text;

-- Backfill existing accounts WITHOUT any behavior change:
--   paid   -> active   (they are paying subscribers, keep full access)
--   free   -> none     (no card, no trial yet; app gates them read only)
-- Chanelica (chanelicarobinson) is already paid and stays active here;
-- a later dedicated pin guarantees she can never downgrade.
update public.profiles
   set plan_status = case
         when plan = 'paid' then 'active'
         else 'none'
       end
 where plan_status = 'none';

-- Index for cron/webhook lookups that will key on plan_status.
create index if not exists profiles_plan_status_idx on public.profiles (plan_status);