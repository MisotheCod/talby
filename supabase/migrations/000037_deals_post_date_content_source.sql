-- 000037: post dates now live in content rows, not deals.post_date (phase 1).
--
-- Phase 1 of the two-phase move (same approach as the pay-status rollup):
--   * Backfill the one deal whose post_date had no linked content row
--     (Dulcolax 2026-09-10) so every stored post date is represented.
--   * Add a BEFORE UPDATE/INSERT trigger that RAISES on any change to
--     deals.post_date. The column stays readable for one cycle; the guard makes
--     any missed writer surface as a loud error instead of silent drift.
-- Phase 2 (separate migration) drops deals.post_date entirely.

-- 1) Backfill: create a content row for stored post_date values that have no
--    linked content row. Idempotent — only inserts where there's a deal
--    post_date and no content row for that deal/date. (Both columns are date.)
insert into public.content (user_id, title, event_date, linked_deal_id, status)
select d.user_id, d.brand, d.post_date, d.id, 'planned'
from public.deals d
where d.post_date is not null
  and not exists (
    select 1 from public.content c
    where c.linked_deal_id = d.id and c.event_date = d.post_date
  );

-- 2) Write guard on deals.post_date (reads still work).
create or replace function public.guard_deals_post_date() returns trigger as $$
begin
  if new.post_date is distinct from old.post_date then
    raise 'deals.post_date is read-only: post dates live in content rows linked to the deal. Write content.event_date instead.';
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists deals_post_date_write_guard on public.deals;
create trigger deals_post_date_write_guard
  before insert or update on public.deals
  for each row execute function public.guard_deals_post_date();