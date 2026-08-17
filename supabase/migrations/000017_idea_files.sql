-- 000017: Idea reference uploads — private storage bucket, per-user folders.
insert into storage.buckets (id, name, public)
values ('idea-files', 'idea-files', true)
on conflict (id) do nothing;

drop policy if exists "idea-files read" on storage.objects;
drop policy if exists "idea-files insert own" on storage.objects;
drop policy if exists "idea-files update own" on storage.objects;
drop policy if exists "idea-files delete own" on storage.objects;

create policy "idea-files read" on storage.objects for select
  using (bucket_id = 'idea-files');
create policy "idea-files insert own" on storage.objects for insert
  with check (bucket_id = 'idea-files' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "idea-files update own" on storage.objects for update
  using (bucket_id = 'idea-files' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "idea-files delete own" on storage.objects for delete
  using (bucket_id = 'idea-files' and (storage.foldername(name))[1] = auth.uid()::text);