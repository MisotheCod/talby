-- ============================================================
-- 000007_active_deal_cap.sql
-- HARD STOP: free users may hold at most 5 active deals.
-- Enforced at the DATABASE level (security-definer trigger) so
-- no client path (New Deal modal, Import, or direct API) can
-- bypass it. Paid ("pro / paid") users are unlimited.
--
-- An "active" deal = active = true AND status <> 'archived'.
-- ====  NOTE: keep FREE_ACTIVE_DEAL_CAP in src/lib/config.ts in sync  ====
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
    -- Count CURRENT active deals for this user (before this row lands).
    select count(*) into cnt
    from public.deals
    where user_id = NEW.user_id
      and active = true
      and status <> 'archived';

    -- For UPDATE the row's OLD version is still counted; subtract it.
    if TG_OP = 'UPDATE' and OLD.active and OLD.status <> 'archived' then
      cnt := cnt - 1;
    end if;

    -- Add this row if it will count as active.
    if NEW.active and NEW.status <> 'archived' then
      cnt := cnt + 1;
    end if;

    if cnt > 5 then
      raise exception 'Free plan is limited to 5 active deals. Go unlimited to add more.';
    end if;
  end if;

  return NEW;
end;
$$;

drop trigger if exists deals_active_cap on public.deals;
create trigger deals_active_cap
  before insert or update on public.deals
  for each row execute function public.enforce_active_deal_cap();