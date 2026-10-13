-- ============================================================
-- 000048_fresh_trials_existing_free.sql
-- LAUNCH-DAY migration: existing free accounts get a fresh 14-day
-- trial instead of the old "start trial" wall.
--
-- Grants plan_status='trialing' + trial_end = now()+14d to every
-- account that is currently plan_status='none' (the old free tier),
-- EXCEPT the pinned owner accounts (which are already active and are
-- excluded by the 'none' filter anyway).
--
-- Idempotent: only touches rows that are still 'none' when it runs.
-- Apply this at launch (do NOT apply during preview testing, or the
-- trial clock starts early).
--
-- NOTE: chanelica.r is already plan_status='active' and pinned; this
-- migration does not change her (she needs no fresh trial).
-- ============================================================

update public.profiles
   set plan_status = 'trialing',
       trial_end = now() + interval '14 days'
 where plan_status = 'none';
