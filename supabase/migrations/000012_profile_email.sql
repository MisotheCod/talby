-- 000012: profiles.email (for the daily digest), backfilled from auth.users.
alter table public.profiles
  add column if not exists email text;

-- Backfill existing rows from auth.users.
update public.profiles p
  set email = u.email
  from auth.users u
  where u.id = p.id and p.email is null;

-- Keep it in sync going forward.
create or replace function public.sync_profile_email()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update public.profiles set email = new.email where id = new.id and email is distinct from new.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_email on auth.users;
create trigger on_auth_user_email
  after insert or update of email on auth.users
  for each row execute function public.sync_profile_email();
