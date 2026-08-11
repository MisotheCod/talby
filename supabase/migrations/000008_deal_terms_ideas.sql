-- 000008: Deal financial/exclusivity fields + ideas platform/status.
-- Splits deal lifecycle status from payment status; adds pay terms + exclusivity.
alter table public.deals
  add column if not exists payment_status text not null default 'expected'
    check (payment_status in ('expected','paid','none')),
  add column if not exists pay_terms text
    check (pay_terms in ('due_on_receipt','net_15','net_30','net_45','net_60','net_90','milestone')),
  add column if not exists exclusivity_days int;

-- Ideas get a platform + optional status (status reuses the existing stage, so we
-- add platform and a display-facing "status" that defaults to the stage).
alter table public.ideas
  add column if not exists platform text,
  add column if not exists status text not null default 'bucket'
    check (status in ('bucket','developing','ready','executed','archived'));