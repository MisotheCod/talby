-- 000017: Idea reference uploads — PRIVATE storage bucket, per-user folders.
-- ---------------------------------------------------------------------
-- SECURITY FIX: this bucket was originally `public=true` with a read policy that
-- allowed ANY authenticated user to read ANY object. That let one account read
-- another account's idea files. Now: bucket is private, and read is scoped to the
-- owner (first path segment == auth.uid()). Served via short-lived signed URLs.
insert into storage.buckets (id, name, public)
values ('idea-files', 'idea-files', false)
on conflict (id) do update set public = false;

drop policy if exists "idea-files read" on storage.objects;
drop policy if exists "idea-files insert own" on storage.objects;
drop policy if exists "idea-files update own" on storage.objects;
drop policy if exists "idea-files delete own" on storage.objects;

create policy "idea-files read own" on storage.objects for select
  using (bucket_id = 'idea-files' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "idea-files insert own" on storage.objects for insert
  with check (bucket_id = 'idea-files' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "idea-files update own" on storage.objects for update
  using (bucket_id = 'idea-files' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "idea-files delete own" on storage.objects for delete
  using (bucket_id = 'idea-files' and (storage.foldername(name))[1] = auth.uid()::text);