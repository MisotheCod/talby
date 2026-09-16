-- 000036: backfill deals.post_date from linked content so the flip to a stored
-- column doesn't blank 50 deals that currently derive a post date from their
-- earliest content row. post_date becomes an editable, independent field after
-- this — it is no longer derived, so this is a one-time seed, not a live sync.
update public.deals
set post_date = c.min_ev
from (
  select c2.linked_deal_id as deal_id, min(c2.event_date::date) as min_ev
  from public.content c2
  where c2.linked_deal_id is not null and c2.event_date is not null
  group by c2.linked_deal_id
) c
where public.deals.id = c.deal_id
  and public.deals.post_date is null;