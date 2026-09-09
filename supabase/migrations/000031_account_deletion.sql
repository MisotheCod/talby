-- ============================================================
-- TALBY — Account deletion (migration 000031)
-- ------------------------------------------------------------
-- Two irreversible account actions live behind Settings → Account
-- → Danger zone:
--   1. "Delete my data"   — wipe all of a user's content, keep the
--                           account/login/profile/plan.
--   2. "Delete my account" — everything upstream, plus the account.
--
-- This migration provides:
--   * public.deletion_log            — a server-side audit of every
--     deletion request + completion, retained separately for GRPR/audit.
--     Locked down (RLS on, zero policies) so only the service role
--     (which bypasses RLS) can read/write it — client code can't.
--   * public.delete_user_content()   — the RLS hard stop for the data
--     wipe. SECURITY DEFINER so it can delete across the user's content
--     tables regardless of RLS, but it FIRST asserts the caller is the
--     very user whose data is being deleted (auth.uid() = p_uid), so one
--     user can never invoke it against another's id. Every delete is
--     additionally scoped `where user_id = p_uid`.
--
-- Storage objects are NOT handled here — buckets don't cascade from
-- auth.users, so the server routes purge them explicitly (see
-- src/lib/account-deletion.ts). The auth-user delete cascades every
-- relational row (all child tables reference auth.users(id) on delete
-- cascade, and inbox_leads/notifications cascade via profiles).
-- ============================================================

-- ---- audit log (retained separately, service-role only) ----
create table if not exists public.deletion_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,                          -- the account being deleted (null-safe: kept after auth.user is gone)
  email text,                            -- best-effort identifier if the auth user is gone
  kind text not null check (kind in ('data','account')),
  status text not null default 'requested'
    check (status in ('requested','completed','failed')),
  detail text,                           -- free text (stripe sub ids, errors)
  requested_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.deletion_log enable row level security;
-- RLS on with ZERO policies = deny everything for anon/authenticated.
-- Service role bypasses RLS, so the server routes retain full access.

-- ---- RLS hard stop: wipe one user's content, only as that user ----
create or replace function public.delete_user_content(p_uid uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- The caller must BE the user being wiped. auth.uid() is the signed-in
  -- user's id; when invoked through a session client this is the real
  -- session user. This is the RLS boundary: no cross-user wipe.
  if p_uid is distinct from auth.uid() then
    raise exception 'You can only delete your own data.';
  end if;

  -- Child tables first (own user_id), deals last. All scoped by p_uid.
  delete from public.deal_checklist where user_id = p_uid;
  delete from public.deal_files     where user_id = p_uid;  -- tracked upload rows
  delete from public.deal_contracts where user_id = p_uid;
  delete from public.contract_chunks where user_id = p_uid;
  delete from public.payments       where user_id = p_uid;  -- deal_id is set-null, so explicit
  delete from public.nudges         where user_id = p_uid;
  delete from public.content        where user_id = p_uid;  -- calendar events + recurring cycles
  delete from public.notes          where user_id = p_uid;  -- day-pinned/marked calendar notes
  delete from public.ideas          where user_id = p_uid;
  delete from public.todos          where user_id = p_uid;
  delete from public.notifications  where user_id = p_uid;
  delete from public.inbox_leads    where user_id = p_uid;
  delete from public.inbound_emails where user_id = p_uid;  -- stored inbound email records
  delete from public.deals          where user_id = p_uid;  -- cascades remaining deal children
end;
$$;