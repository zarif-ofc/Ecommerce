-- =============================================================
-- Cresol Supabase Storage Setup
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/cgxexaongesloomabwji/sql/new
-- =============================================================

-- 1. Create the 'cresol-media' public storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cresol-media',
  'cresol-media',
  true,
  10485760, -- 10MB per file
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

-- 2. Storage RLS Policies
-- Allow anyone (storefront visitors, customers, admin) to view/download images
DROP POLICY IF EXISTS "Public can view cresol-media" ON storage.objects;
CREATE POLICY "Public can view cresol-media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'cresol-media');

-- Allow anon and authenticated to upload images (products, carousels)
DROP POLICY IF EXISTS "Anon can upload to cresol-media" ON storage.objects;
CREATE POLICY "Anon can upload to cresol-media"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'cresol-media');

-- Allow anon and authenticated to update images
DROP POLICY IF EXISTS "Anon can update in cresol-media" ON storage.objects;
CREATE POLICY "Anon can update in cresol-media"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'cresol-media');

-- Allow anon and authenticated to delete images
DROP POLICY IF EXISTS "Anon can delete from cresol-media" ON storage.objects;
CREATE POLICY "Anon can delete from cresol-media"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'cresol-media');
