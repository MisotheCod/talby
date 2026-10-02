-- 000041: backfill once-structure timing as "set date" from existing due dates.
--
-- Release 1 set structure_timing = null for once deals (they were migrated with
-- a payment row already carrying an expected_date). The drawer fell back to
-- Net 30, which is wrong when the due date is a fixed date the brand committed
-- to (often BEFORE posting, e.g. Haleon due Jul 6, posting Aug 4).
--
-- Rule: any 'once' deal that already has a payment row with an expected_date,
-- and whose timing was never set, is 'set_date' with that expected_date.
-- We use the EARLIEST expected_date (single-payment deals are the common case).
begin;

update public.deals d
set structure_timing = 'set_date',
    structure_timing_set_date = sub.earliest
from (
  select p.deal_id, min(p.expected_date) as earliest
  from public.payments p
  where p.expected_date is not null
  group by p.deal_id
) sub
where d.id = sub.deal_id
  and d.payment_structure = 'once'
  and d.structure_timing is null;

commit;