-- 000039: bonus_confirmed flag on payments.
--
-- Part 2 of the payments=posts alignment. Every payment gets a confirmed flag
-- that:
--   * defaults to TRUE — so all existing payments (and any payment not created
--     through the Bonus shortcut) are confirmed and stay in Booked/Outstanding;
--   * only Bonus-shortcut payments are created UNCONFIRMED (bonus_confirmed
--     = false), and they are EXCLUDED from Booked/Outstanding until confirmed.
--     The drawer Pay-by popover and the deal page show a "Confirm" action on
--     unconfirmed bonus payments.
--
-- Backfill: every existing row defaults to true on ADD COLUMN, so no current
-- deal's Booked/Outstanding changes. No data migration needed beyond the
-- column default.

alter table public.payments
  add column if not exists bonus_confirmed boolean not null default true;