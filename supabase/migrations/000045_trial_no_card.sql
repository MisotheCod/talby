-- ============================================================
-- 000045_trial_no_card.sql
-- Trial model pivot: no card at signup.
--
-- A new account starts a 14-day trial immediately and automatically.
-- No card, no Stripe, no reward. After 14 days the account becomes
-- read-only (computed from trial_end in app code — see hasFullAccess).
-- A user can later CHOOSE to subscribe ($9/mo) to keep full access.
--
-- The trigger change is the single choke point: it covers email,
-- Google and GitHub signups alike. plan_status defaults to 'none'
-- at the column level; this sets trialing + a trial_end for every
-- fresh row the trigger inserts.
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, plan_status, trial_end)
  values (new.id, 'trialing', now() + interval '14 days')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();