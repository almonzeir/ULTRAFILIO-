-- ==================================================
-- FIX: Add missing RLS policies for 'portfolios' bucket
-- Reason: Users were unable to upload project images/icons
-- ==================================================

-- 1. Allow authenticated users to upload to 'portfolios' bucket
CREATE POLICY "Authenticated users can upload portfolio assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolios');

-- 2. Allow users to update their own files (owner matches auth.uid)
CREATE POLICY "Users can update their own portfolio assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolios' AND owner = auth.uid());

-- 3. Allow users to delete their own files
CREATE POLICY "Users can delete their own portfolio assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolios' AND owner = auth.uid());
