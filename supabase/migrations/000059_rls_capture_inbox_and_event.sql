-- 000059_rls_capture_inbox_and_event.sql
-- Captures production schema that lives OUTSIDE the migration history, so fresh
-- environments (Supabase branches replayed from migrations) end up identical:
--   (1) rls_auto_enable() event-trigger function — present in production, missing
--       on branches. Not wired to any trigger (production's RLS auto-enable runs
--       via the Supabase-managed `ensure_rls` event trigger), so it is inert, but
--       it is part of the public schema and must not silently disappear.
--   (2) inbox_leads table + RLS policies — production has the `inbox_leads` table
--       (incoming-leads / email scanner) but it is NOT in the migration history,
--       so branches are missing the whole table, its grants and its owner-rows
--       policies. Recreated here from production's live DDL.
-- Additive and idempotent (create if not exists / drop-if-exists policy).
create or replace function public.rls_auto_enable()
 returns event_trigger
 language plpgsql security definer set search_path to 'pg_catalog'
as $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT * FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
    IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
    ELSE
      RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
    END IF;
  END LOOP;
END;
$function$;

create table if not exists public.inbox_leads (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  gmail_message_id text NOT NULL,
  thread_id text,
  sender_name text,
  sender_email text,
  subject text,
  snippet text,
  body_text text,
  brand_name text,
  agency_name text,
  contact_name text,
  contact_email text,
  deal_type text,
  compensation text,
  currency text,
  deliverables text,
  platforms text,
  draft_deadline text,
  post_date text,
  summary text,
  next_action text,
  confidence numeric,
  extracted jsonb,
  status text NOT NULL DEFAULT 'new'::text,
  linked_deal_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  primary key (id)
);

alter table public.inbox_leads enable row level security;
drop policy if exists inbox_leads_select_own on public.inbox_leads;
drop policy if exists inbox_leads_insert_own on public.inbox_leads;
drop policy if exists inbox_leads_update_own on public.inbox_leads;
drop policy if exists inbox_leads_delete_own on public.inbox_leads;
create policy inbox_leads_select_own on public.inbox_leads for select using (auth.uid() = user_id);
create policy inbox_leads_insert_own on public.inbox_leads for insert with check (auth.uid() = user_id);
create policy inbox_leads_update_own on public.inbox_leads for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy inbox_leads_delete_own on public.inbox_leads for delete using (auth.uid() = user_id);

grant select, insert, update, delete on public.inbox_leads to authenticated, anon;