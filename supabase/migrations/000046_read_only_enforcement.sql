-- ============================================================
-- 000046_read_only_enforcement.sql
-- Central read-only enforcement at the database layer.
--
-- The app has two write paths:
--   1. Client components write DIRECTLY to Supabase (RLS-governed).
--   2. A few server routes use the service-role client (bypasses RLS).
--
-- This migration makes RLS the authoritative gate for path 1: every
-- write policy now ALSO requires public.has_full_access(). The access
-- mirrors src/lib/access.ts hasFullAccess(): active/trialing(within
-- trial_end)/past_due(within 7d grace) may write; none/canceled and
-- expired-trialing may not. Pinned owner emails always may.
--
-- Path 2 (service-role routes) is enforced separately in the route
-- handlers via a server-side isReadOnly check (see access.ts), because
-- the service role bypasses RLS by design.
--
-- Account-state tables (profiles, notifications, notion_connections,
-- inbox_*) are deliberately NOT gated: a read-only user still manages
-- their own settings and reads their mail. Only user *content* is gated.
-- ============================================================

-- ------------------------------------------------------------------
-- Access predicate — security definer so it can read the caller's
-- profile without tripping profiles' own RLS.
-- ------------------------------------------------------------------
create or replace function public.has_full_access()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1
    from profiles p
    where p.id = auth.uid()
      and (
        -- pinned owner accounts never lose access
        lower(coalesce(p.email, '')) = any (array[
          'chanelicarobinson@gmail.com',
          'approvedbybre@gmail.com',
          'camqdesigns@gmail.com',
          'camquint@gmail.com'
        ])
        or p.plan_status = 'active'
        or (p.plan_status = 'trialing' and (p.trial_end is null or p.trial_end > now()))
        or (p.plan_status = 'past_due' and (p.trial_end is null or p.trial_end + interval '7 days' > now()))
      )
  );
$$;

-- ------------------------------------------------------------------
-- Rebuild write policies to require has_full_access().
-- INSERT -> with check; UPDATE/DELETE -> using.
-- ------------------------------------------------------------------

-- deals
drop policy if exists deals_insert_own on deals;
create policy deals_insert_own on deals
  for insert with check (auth.uid() = user_id and public.has_full_access());
drop policy if exists deals_update_own on deals;
create policy deals_update_own on deals
  for update using (auth.uid() = user_id and public.has_full_access());
drop policy if exists deals_delete_own on deals;
create policy deals_delete_own on deals
  for delete using (auth.uid() = user_id and public.has_full_access());

-- payments
drop policy if exists payments_insert_own on payments;
create policy payments_insert_own on payments
  for insert with check (auth.uid() = user_id and public.has_full_access());
drop policy if exists payments_update_own on payments;
create policy payments_update_own on payments
  for update using (auth.uid() = user_id and public.has_full_access());
drop policy if exists payments_delete_own on payments;
create policy payments_delete_own on payments
  for delete using (auth.uid() = user_id and public.has_full_access());

-- content (post dates / deliverables)
drop policy if exists content_insert_own on content;
create policy content_insert_own on content
  for insert with check (auth.uid() = user_id and public.has_full_access());
drop policy if exists content_update_own on content;
create policy content_update_own on content
  for update using (auth.uid() = user_id and public.has_full_access());
drop policy if exists content_delete_own on content;
create policy content_delete_own on content
  for delete using (auth.uid() = user_id and public.has_full_access());

-- deal_files
drop policy if exists files_insert_own on deal_files;
create policy files_insert_own on deal_files
  for insert with check (auth.uid() = user_id and public.has_full_access());
drop policy if exists files_delete_own on deal_files;
create policy files_delete_own on deal_files
  for delete using (auth.uid() = user_id and public.has_full_access());

-- deal_checklist
drop policy if exists checklist_insert_own on deal_checklist;
create policy checklist_insert_own on deal_checklist
  for insert with check (auth.uid() = user_id and public.has_full_access());
drop policy if exists checklist_update_own on deal_checklist;
create policy checklist_update_own on deal_checklist
  for update using (auth.uid() = user_id and public.has_full_access());
drop policy if exists checklist_delete_own on deal_checklist;
create policy checklist_delete_own on deal_checklist
  for delete using (auth.uid() = user_id and public.has_full_access());

-- deal_extras
drop policy if exists deal_extras_insert_own on deal_extras;
create policy deal_extras_insert_own on deal_extras
  for insert with check (auth.uid() = user_id and public.has_full_access());
drop policy if exists deal_extras_update_own on deal_extras;
create policy deal_extras_update_own on deal_extras
  for update using (auth.uid() = user_id and public.has_full_access());
drop policy if exists deal_extras_delete_own on deal_extras;
create policy deal_extras_delete_own on deal_extras
  for delete using (auth.uid() = user_id and public.has_full_access());

-- deal_contracts
drop policy if exists deal_contracts_insert_own on deal_contracts;
create policy deal_contracts_insert_own on deal_contracts
  for insert with check (auth.uid() = user_id and public.has_full_access());
drop policy if exists deal_contracts_delete_own on deal_contracts;
create policy deal_contracts_delete_own on deal_contracts
  for delete using (auth.uid() = user_id and public.has_full_access());

-- contract_chunks
drop policy if exists contract_chunks_insert_own on contract_chunks;
create policy contract_chunks_insert_own on contract_chunks
  for insert with check (auth.uid() = user_id and public.has_full_access());
drop policy if exists contract_chunks_delete_own on contract_chunks;
create policy contract_chunks_delete_own on contract_chunks
  for delete using (auth.uid() = user_id and public.has_full_access());

-- ideas
drop policy if exists ideas_insert_own on ideas;
create policy ideas_insert_own on ideas
  for insert with check (auth.uid() = user_id and public.has_full_access());
drop policy if exists ideas_update_own on ideas;
create policy ideas_update_own on ideas
  for update using (auth.uid() = user_id and public.has_full_access());
drop policy if exists ideas_delete_own on ideas;
create policy ideas_delete_own on ideas
  for delete using (auth.uid() = user_id and public.has_full_access());

-- notes
drop policy if exists notes_insert_own on notes;
create policy notes_insert_own on notes
  for insert with check (auth.uid() = user_id and public.has_full_access());
drop policy if exists notes_update_own on notes;
create policy notes_update_own on notes
  for update using (auth.uid() = user_id and public.has_full_access());
drop policy if exists notes_delete_own on notes;
create policy notes_delete_own on notes
  for delete using (auth.uid() = user_id and public.has_full_access());

-- todos
drop policy if exists todos_insert_own on todos;
create policy todos_insert_own on todos
  for insert with check (auth.uid() = user_id and public.has_full_access());
drop policy if exists todos_update_own on todos;
create policy todos_update_own on todos
  for update using (auth.uid() = user_id and public.has_full_access());
drop policy if exists todos_delete_own on todos;
create policy todos_delete_own on todos
  for delete using (auth.uid() = user_id and public.has_full_access());

-- nudges
drop policy if exists nudges_insert_own on nudges;
create policy nudges_insert_own on nudges
  for insert with check (auth.uid() = user_id and public.has_full_access());
drop policy if exists nudges_update_own on nudges;
create policy nudges_update_own on nudges
  for update using (auth.uid() = user_id and public.has_full_access());
drop policy if exists nudges_delete_own on nudges;
create policy nudges_delete_own on nudges
  for delete using (auth.uid() = user_id and public.has_full_access());
