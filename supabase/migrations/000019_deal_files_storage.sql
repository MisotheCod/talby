-- 000019: Secure deal-files storage. Ensure the private bucket exists and that
-- storage object access is enforced: users can only create/read/delete files
-- under their own user_id/ path. Path layout is <user_id>/<deal_id>/<name>.
insert into storage.buckets (id, name, public)
values ('deal-files', 'deal-files', false)
on conflict (id) do nothing;

-- Storage RLS. The path is <user_id>/<deal_id>/<file>. A user may only touch
-- objects whose first path segment equals their own auth.uid().
create policy "deal_files_storage_insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'deal-files'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "deal_files_storage_read" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'deal-files'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "deal_files_storage_delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'deal-files'
    and (storage.foldername(name))[1] = auth.uid()::text
  );