-- 000034: post_date is a real, editable date on the deal.
-- Until now post_date was derived at read-time from the earliest content row's
-- event_date (content.event_date where content.linked_deal_id = deal.id) and had
-- no column, so it could never be edited or persisted. Give it a real column so
-- the drawer's Post date field can write it. It is distinct from payments.expected_date
-- (pay by); a post date and a pay-by date are independent and often months apart.
alter table public.deals
  add column if not exists post_date date;