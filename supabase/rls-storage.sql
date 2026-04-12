-- =============================================
-- STORAGE — AVATARS BUCKET RLS POLICIES
-- =============================================
-- STATUS: ALREADY APPLIED — DO NOT RUN AGAIN
-- Last applied: April 2026
-- Verify: Storage > Policies > avatars (4 policies)
-- To reapply: delete existing policies first
-- in Supabase > Storage > Policies.
-- Note: bucket 'avatars' must already exist.
-- =============================================

-- Anyone can view avatars (needed to display on Wall page)
CREATE POLICY "Public read avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- User can upload their own avatar only
CREATE POLICY "User uploads own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- User can replace their own avatar only
CREATE POLICY "User updates own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- User can delete their own avatar only
CREATE POLICY "User deletes own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);