-- 000029: pay_status on payments (pay-status consolidation only)
--
-- Moves the invoice/pay status to the per-payment level as a single field.
-- The recurring-deal schema is a SEPARATE migration (000030) shipped with the
-- recurring feature. pay_status is written by the app; the old fields
-- (payments.invoice_state, deals.payment_status) are left in place for now —
-- code stops describing them and a later migration drops them once verified.

alter table public.payments
  add column if not exists pay_status text;

-- Backfill per-payment with the approved priority:
--   received                  -> paid
--   else invoice_state=invoiced        -> invoiced
--   else invoice_state=no_invoice_needed -> no_invoice_needed
--   else (null OR not_invoiced)        -> not_invoiced (explicitly written, never left null)
update public.payments
set pay_status =
  case
    when status = 'received' then 'paid'
    when invoice_state = 'invoiced' then 'invoiced'
    when invoice_state = 'no_invoice_needed' then 'no_invoice_needed'
    else 'not_invoiced'  -- collapses null and not_invoiced into the concrete value
  end;

-- Enforce the four-value domain (non-null after backfill).
alter table public.payments
  add constraint payments_pay_status_ck
  check (pay_status in ('not_invoiced','invoiced','paid','no_invoice_needed'));

-- The old invoice_status column and deals.payment_status are intentionally left
-- in place; a separate later migration drops them once the UI is verified.