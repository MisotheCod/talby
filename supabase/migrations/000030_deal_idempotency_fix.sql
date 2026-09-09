-- Fix deal-creation idempotency upsert (broken by a partial unique index).
--
-- migration 000028 created the dedupe index with a WHERE predicate:
--     create unique index ... on deals (user_id, idempotency_key)
--       where idempotency_key is not null;
-- PostgreSQL's INSERT ... ON CONFLICT (cols) clause refuses to match a PARTIAL
-- unique index, so every upsert that sends an idempotency_key (e.g. deal create
-- with a contract attached) failed with:
--     "there is no unique or exclusion constraint matching the ON CONFLICT
--      specification"
-- A full unique index/constraint on a nullable column is fine: PostgreSQL treats
-- NULLs as distinct in a unique constraint, so rows with a NULL idempotency_key
-- (manual adds, no contract) coexist normally, while non-NULL keys stay unique
-- per user. ON CONFLICT matches a full unique index.

drop index if exists public.deals_user_idempotency_uq;

create unique index if not exists deals_user_idempotency_uq
  on public.deals (user_id, idempotency_key);