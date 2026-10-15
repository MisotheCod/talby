-- ============================================================
-- 000052_stripe_event_idempotency.sql
-- Redesign v2, backend upgrade 10: dedupe Stripe webhook events.
-- Stripe may deliver an event more than once (retries, replays). record_stripe_event
-- inserts the event id once; if the id already exists it reports a duplicate and the
-- caller skips reprocessing. SECURITY DEFINER so the webhook (service role) can write
-- stripe_events, which has no user RLS write policy (events are not user-owned).
-- ============================================================
create or replace function public.record_stripe_event(p_id text, p_type text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_inserted boolean;
begin
  insert into public.stripe_events (id, type)
  values (p_id, p_type)
  on conflict (id) do nothing
  returning true into v_inserted;
  -- If the row was already there, INSERT ... ON CONFLICT DO NOTHING returns no row.
  return coalesce(v_inserted, false);
end;
$$;

grant execute on function public.record_stripe_event(text, text) to anon, authenticated, service_role;
