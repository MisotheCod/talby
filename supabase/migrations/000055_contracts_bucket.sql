-- 000055_contracts_bucket.sql
-- The contract upload stores the original file and hands its path back as fileId
-- (attached to the deal on create). Additive: one bucket + owner-scoped policies.

insert into storage.buckets (id, name, public, file_size_limit)
values ('contracts', 'contracts', false, 20971520)
on conflict (id) do nothing;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'contracts_owner_read') then
    create policy contracts_owner_read on storage.objects
      for select using (bucket_id = 'contracts' and (storage.foldername(name))[1] = auth.uid()::text);
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'contracts_owner_write') then
    create policy contracts_owner_write on storage.objects
      for insert with check (bucket_id = 'contracts' and (storage.foldername(name))[1] = auth.uid()::text);
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'contracts_owner_delete') then
    create policy contracts_owner_delete on storage.objects
      for delete using (bucket_id = 'contracts' and (storage.foldername(name))[1] = auth.uid()::text);
  end if;
end $$;
