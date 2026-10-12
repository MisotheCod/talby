-- ============================================================
-- 000043_active_deal_cap_insert_only.sql
-- The free active-deal cap must limit ONLY creating active deals —
-- never routine edits. The previous function fired on every UPDATE and
-- raised whenever the user's total active count exceeded 5, so a free
-- user at/over the cap (e.g. downgraded, or camqdesigns with 19 active)
-- could not edit, mark paid, archive, or touch ANY deal. Editing failed
-- with "you reached your max deals".
--
-- New rule: the cap is checked only when a NEW counting deal enters the
-- active set:
--   - INSERT of an active, non-archived deal (create, duplicate).
--   - UPDATE that RESTORES an archived/inactive deal to active.
-- All other updates (editing a field, marking paid, changing status among
-- the active states, archiving, deleting, touching payments/extras) never
-- count and are always allowed, even at/over the cap.
--
-- An "active" deal (what counts) = active = true AND status <> 'archived'.
-- Archived deals do not count. Keep FREE_ACTIVE_DEAL_CAP in sync (5).
-- ============================================================
create or replace function public.enforce_active_deal_cap()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  p_plan text;
  cnt int := 0;
begin
  -- Only enforce for free users; paid users are unlimited.
  select plan into p_plan from public.profiles where id = NEW.user_id;

  if p_plan is distinct from 'paid' then
    -- The cap applies only when a NEW active, non-archived deal is being
    -- created (INSERT) or an archived/inactive deal is restored to active
    -- (UPDATE entering the active set). Routine updates are never counted
    -- and never block, regardless of how far over the cap a downgraded user is.
    if TG_OP = 'INSERT' and NEW.active and NEW.status is distinct from 'archived' then
      select count(*) into cnt
      from public.deals
      where user_id = NEW.user_id and active = true and status <> 'archived';
      if cnt >= 5 then
        raise exception 'Free plan is limited to 5 active deals. Go unlimited to add more.';
      end if;
    elsif TG_OP = 'UPDATE'
      and NEW.active and NEW.status is distinct from 'archived'
      and (OLD.status = 'archived' or OLD.active is distinct from true) then
      -- Restore/reactivate: this row did not count before (the UPDATE has not
      -- landed, so NEW is not in the table yet; OLD was archived/inactive and
      -- is excluded by the count query). Block only if the set is already full.
      select count(*) into cnt
      from public.deals
      where user_id = NEW.user_id and active = true and status <> 'archived';
      if cnt >= 5 then
        raise exception 'Free plan is limited to 5 active deals. Go unlimited to add more.';
      end if;
    end if;
  end if;

  return NEW;
end;
$$;

-- Trigger stays on INSERT OR UPDATE; the function now skips routine updates.
drop trigger if exists deals_active_cap on public.deals;
create trigger deals_active_cap
  before insert or update on public.deals
  for each row execute function public.enforce_active_deal_cap();