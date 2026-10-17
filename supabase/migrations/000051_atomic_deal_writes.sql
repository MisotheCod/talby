-- ============================================================
-- 000051_atomic_deal_writes.sql
-- Redesign v2, backend upgrade 1: atomic deal create + delete.
-- Deal create (deals, content, payments, deal_extras) and deal delete become
-- Postgres functions called via supabase.rpc so one failure rolls back
-- everything. The JS callers compute the payment rows through the shared
-- generator and pass them in; the RPC is the single transactional write.
--
-- Security: both run as the invoking user (default security invoker) so RLS
-- policies (user_id = auth.uid() AND has_full_access()) still apply on every
-- statement. NOT security definer.
-- ============================================================

-- ------------------------------------------------------------------
-- create_deal(p_user uuid, p_brand text, p_deal jsonb,
--             p_payments jsonb, p_post_dates jsonb, p_extras jsonb)
-- Inserts the deal + its children in one transaction. Returns the deal id.
-- Any child failure raises -> the entire transaction rolls back.
-- Idempotent on (user_id, idempotency_key): returns the existing deal.
-- ------------------------------------------------------------------
create or replace function public.create_deal(
  p_user uuid,
  p_brand text,
  p_deal jsonb,
  p_payments jsonb,
  p_post_dates jsonb,
  p_extras jsonb
) returns jsonb
language plpgsql
as $$
declare
  v_id uuid;
  v_key text := p_deal->>'idempotency_key';
  v_existing uuid;
begin
  -- Idempotency: durable unique (user_id, idempotency_key) index.
  if v_key is not null and v_key <> '' then
    select id into v_existing from public.deals
      where user_id = p_user and idempotency_key = v_key;
    if v_existing is not null then
      return jsonb_build_object('ok', true, 'deal_id', v_existing, 'duplicate', true);
    end if;
  end if;

  insert into public.deals (
    user_id, brand, deliverable, value, status, due_date, notes,
    rep_name, rep_email, deal_type, payment_status, pay_terms,
    exclusivity_days, idempotency_key, post_date, revisions_included,
    payment_structure, structure_timing, structure_timing_set_date,
    structure_upfront_pct, structure_balance_timing, structure_months,
    structure_start_date, active
  ) values (
    p_user, p_brand,
    p_deal->>'deliverable',
    nullif(p_deal->>'value', '')::numeric,
    coalesce(p_deal->>'status', 'active'),
    nullif(p_deal->>'due_date', '')::date,
    nullif(p_deal->>'notes', '')::text,
    nullif(p_deal->>'rep_name', '')::text,
    nullif(p_deal->>'rep_email', '')::text,
    nullif(p_deal->>'deal_type', '')::text,
    coalesce(nullif(p_deal->>'payment_status', ''), 'none'),
    nullif(p_deal->>'pay_terms', '')::text,
    nullif(p_deal->>'exclusivity_days', '')::int,
    nullif(v_key, '')::text,
    nullif(p_deal->>'post_date', '')::date,
    nullif(p_deal->>'revisions_included', '')::text,
    nullif(p_deal->>'payment_structure', '')::text,
    nullif(p_deal->>'structure_timing', '')::text,
    nullif(p_deal->>'structure_timing_set_date', '')::date,
    nullif(p_deal->>'structure_upfront_pct', '')::int,
    nullif(p_deal->>'structure_balance_timing', '')::text,
    nullif(p_deal->>'structure_months', '')::int,
    nullif(p_deal->>'structure_start_date', '')::date,
    coalesce((p_deal->>'active')::boolean, true)
  ) returning id into v_id;

  -- Post dates -> content rows.
  if jsonb_typeof(p_post_dates) = 'array' then
    insert into public.content (user_id, linked_deal_id, event_date, title, post_type, status)
    select p_user, v_id,
           (row->>'date')::date,
           coalesce(nullif(row->>'label', ''), 'Post'),
           nullif(row->>'post_type', ''),
           'planned'
    from jsonb_array_elements(p_post_dates) as row
    where row->>'date' is not null and row->>'date' <> '';
  end if;

  -- Payments.
  if jsonb_typeof(p_payments) = 'array' then
    insert into public.payments (user_id, deal_id, amount, expected_date, notes, status, pay_status, bonus_confirmed)
    select p_user, v_id,
           coalesce((row->>'amount')::numeric, 0),
           nullif(row->>'expected_date', '')::date,
           nullif(row->>'notes', ''),
           coalesce(nullif(row->>'status', ''), 'expected'),
           coalesce(nullif(row->>'pay_status', ''), 'not_invoiced'),
           coalesce((row->>'bonus_confirmed')::boolean, true)
    from jsonb_array_elements(p_payments) as row;
  end if;

  -- Extras.
  if jsonb_typeof(p_extras) = 'array' then
    insert into public.deal_extras (user_id, deal_id, kind, amount, condition, rate, on_text, earned)
    select p_user, v_id,
           row->>'kind',
           nullif(row->>'amount', '')::numeric,
           nullif(row->>'condition', ''),
           nullif(row->>'rate', '')::int,
           nullif(row->>'on_text', ''),
           coalesce((row->>'earned')::boolean, false)
    from jsonb_array_elements(p_extras) as row
    where row->>'kind' in ('bonus', 'commission');
  end if;

  return jsonb_build_object('ok', true, 'deal_id', v_id, 'duplicate', false);
end;
$$;

-- ------------------------------------------------------------------
-- delete_deal(p_deal_id uuid)
-- Deletes a deal + everything attached to it in one transaction. Ownership
-- and full-access are enforced by RLS (deals_delete_own on each table).
-- Returns true. The caller removes storage objects first (storage can't run
-- inside SQL); the rows themselves are atomic.
-- ------------------------------------------------------------------
create or replace function public.delete_deal(p_deal_id uuid)
returns boolean
language plpgsql
as $$
begin
  delete from public.payments      where deal_id = p_deal_id;
  delete from public.deal_checklist where deal_id = p_deal_id;
  delete from public.content        where linked_deal_id = p_deal_id;
  delete from public.deal_contracts where deal_id = p_deal_id;
  delete from public.contract_chunks where deal_id = p_deal_id;
  delete from public.deal_extras    where deal_id = p_deal_id;
  delete from public.deal_files     where deal_id = p_deal_id;
  update public.inbox_leads set linked_deal_id = null where linked_deal_id = p_deal_id;
  delete from public.deals          where id = p_deal_id;
  return true;
end;
$$;
