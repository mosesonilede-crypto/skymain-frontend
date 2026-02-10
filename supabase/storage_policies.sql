-- Storage bucket policies for authenticated uploads
-- Bucket: documents (private)

create policy "documents insert for authenticated"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'documents');

create policy "documents select for authenticated"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'documents');
