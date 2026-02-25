-- Storage bucket and policies for user profile avatars
-- Run in Supabase SQL Editor

-- Create the avatars bucket (private by default)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own avatar
-- Path pattern: avatars/{user_email}/avatar.{ext}
DROP POLICY IF EXISTS "avatars insert for authenticated" ON storage.objects;
CREATE POLICY "avatars insert for authenticated"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'avatars');

-- Allow authenticated users to update (overwrite) their own avatar
DROP POLICY IF EXISTS "avatars update for authenticated" ON storage.objects;
CREATE POLICY "avatars update for authenticated"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'avatars');

-- Allow anyone to read avatars (public bucket)
DROP POLICY IF EXISTS "avatars select for all" ON storage.objects;
CREATE POLICY "avatars select for all"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'avatars');

-- Allow authenticated users to delete their own avatar
DROP POLICY IF EXISTS "avatars delete for authenticated" ON storage.objects;
CREATE POLICY "avatars delete for authenticated"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'avatars');

-- Service role bypass for server-side operations
DROP POLICY IF EXISTS "avatars service role bypass" ON storage.objects;
CREATE POLICY "avatars service role bypass"
  ON storage.objects FOR ALL
  TO service_role
  USING (bucket_id = 'avatars')
  WITH CHECK (bucket_id = 'avatars');
