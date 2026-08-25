-- 000022: SECURITY FIX - secure the idea-files bucket.
-- The idea-files bucket was public=true with a read policy allowing ANY
-- authenticated user to read ANY object, which let one account read another
-- account's idea files (verified live with a cross-user download test).
--
-- This makes the bucket private and scopes EVERY policy (read/insert/update/
-- delete) to the owner, matching deal-files (000019). The ideas page was
-- switched to short-lived signed URLs, so a foreign path no longer resolves to
-- a public URL and cross-user reads are denied by storage RLS.

insert into storage.buckets (id, name, public)
values ('idea-files', 'idea-files', false)
on conflict (id) do update set public = false;

drop policy if exists "idea-files read" on storage.objects;
drop policy if exists "idea-files read own" on storage.objects;

create policy "idea-files read own" on storage.objects for select
  using (bucket_id = 'idea-files' and (storage.foldername(name))[1] = auth.uid()::text);
