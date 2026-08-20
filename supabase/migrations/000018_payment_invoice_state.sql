-- 000018: Payment invoice state. An orthogonal dimension to payment status
-- (expected / received / past due): a payment can be expected AND not invoiced
-- at the same time. Values: invoiced | not_invoiced | no_invoice_needed.
alter table public.payments
  add column if not exists invoice_state text
  check (invoice_state in ('invoiced','not_invoiced','no_invoice_needed'));

-- Backfill: received payments are assumed to have been invoiced (money arrived).
update public.payments
  set invoice_state = 'invoiced'
  where invoice_state is null and status = 'received';

-- Everything else (expected / past due) needs a decision; leave null -> UI
-- treats null as 'not invoiced' so creators can spot unreached invoices.