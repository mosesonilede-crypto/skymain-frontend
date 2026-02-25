-- Storage bucket policies for authenticated uploads
-- Bucket: documents (private) — org-isolated via path convention org_name/...

-- Drop old permissive policies
drop policy if exists "documents insert for authenticated" on storage.objects;
drop policy if exists "documents select for authenticated" on storage.objects;
drop policy if exists "documents update for authenticated" on storage.objects;
drop policy if exists "documents delete for authenticated" on storage.objects;
drop policy if exists "documents service role bypass" on storage.objects;

-- Org-isolated INSERT: path must start with user's org_name
create policy "documents insert for authenticated"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = public.current_user_org()
  );

-- Org-isolated SELECT: can only read own org's documents
create policy "documents select for authenticated"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = public.current_user_org()
  );

-- Org-isolated UPDATE
create policy "documents update for authenticated"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = public.current_user_org()
  );

-- Org-isolated DELETE
create policy "documents delete for authenticated"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = public.current_user_org()
  );

-- Service role bypass for server-side operations
create policy "documents service role bypass"
  on storage.objects for all
  to service_role
  using (bucket_id = 'documents')
  with check (bucket_id = 'documents');
