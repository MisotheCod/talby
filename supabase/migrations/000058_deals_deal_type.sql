-- 000058_deals_deal_type.sql
-- The atomic create_deal RPC (000051) and the inbox scanner (000006) both write
-- deals.deal_type, but the column was added to production outside the migration
-- history, so Supabase branches (and other fresh environments) replayed from the
-- migrations are missing it -> 42703 "column deal_type of relation deals does not
-- exist" broke every deal.create through /api/deals on the branch.
-- Idempotent additive fix: no-op on production (column already present), adds it
-- everywhere mutations are replayed from scratch.
alter table public.deals add column if not exists deal_type text;
