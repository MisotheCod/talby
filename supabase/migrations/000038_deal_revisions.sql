-- 000038: Deal revision tracking.
-- Adds two deal-level columns: the revisions included in the contract
-- (null = "Not set", a whole number as text, or 'Unlimited') and the count
-- the creator has logged as used. Revisions are tracked per deal, not per post.
alter table public.deals
  add column if not exists revisions_included text,
  add column if not exists revisions_used int not null default 0;