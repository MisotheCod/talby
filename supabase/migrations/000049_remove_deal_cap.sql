-- ============================================================
-- 000049_remove_deal_cap.sql
-- Remove the free-plan active-deal cap entirely.
--
-- Under the trial model there is no 5-deal limit: trialing and active
-- accounts have full access, and read-only is enforced at the RLS layer
-- (has_full_access), not by a cap. The legacy plan column stays "free"
-- for trialing users, so enforce_active_deal_cap() would wrongly block
-- them at 5 deals. Drop it.
-- ============================================================

drop trigger if exists deals_active_cap on public.deals;
drop function if exists public.enforce_active_deal_cap();