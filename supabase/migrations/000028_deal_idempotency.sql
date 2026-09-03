-- Idempotency for deal creation.
-- A client-generated key, sent on submit, lets a retried/double-submitted
-- request return the already-created deal instead of creating a second one.
-- Storing it on the deal row with a unique partial index makes the dedupe
-- durable and exact even if two requests race across server instances.

alter table public.deals
  add column if not exists idempotency_key text;

-- Unique per user: one deal per (user, idempotency_key). Guardrails for RLS:
-- only the owner can read/write their own deals, so an upsert by key can't
-- cross users. We scoped the index to user_id first so a leaked key from one
-- user can't collide with another user's row.
create unique index if not exists deals_user_idempotency_uq
  on public.deals (user_id, idempotency_key)
  where idempotency_key is not null;