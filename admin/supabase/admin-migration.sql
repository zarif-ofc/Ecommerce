-- =============================================================
-- Cresol Admin Panel — Complete Database & Storage Migration
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/cgxexaongesloomabwji/sql/new
-- =============================================================

-- -------------------------------------------------------------
-- 1. CAROUSELS TABLE
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS carousels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT '',
  subtitle TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL,
  mobile_image_url TEXT DEFAULT '',
  link_url TEXT NOT NULL DEFAULT '#collection',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE carousels ENABLE ROW LEVEL SECURITY;

-- Drop existing table policies if re-running
DROP POLICY IF EXISTS "Anon can insert products" ON products;
DROP POLICY IF EXISTS "Anon can update products" ON products;
DROP POLICY IF EXISTS "Anon can delete products" ON products;
DROP POLICY IF EXISTS "Anon can update orders" ON orders;
DROP POLICY IF EXISTS "Anon can view carousels" ON carousels;
DROP POLICY IF EXISTS "Anon can insert carousels" ON carousels;
DROP POLICY IF EXISTS "Anon can update carousels" ON carousels;
DROP POLICY IF EXISTS "Anon can delete carousels" ON carousels;

-- -------------------------------------------------------------
-- 2. TABLE ROW LEVEL SECURITY (RLS) POLICIES
-- -------------------------------------------------------------
CREATE POLICY "Anon can insert products" ON products FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can update products" ON products FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon can delete products" ON products FOR DELETE TO anon USING (true);
CREATE POLICY "Anon can update orders" ON orders FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon can view carousels" ON carousels FOR SELECT TO anon USING (true);
CREATE POLICY "Anon can insert carousels" ON carousels FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can update carousels" ON carousels FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon can delete carousels" ON carousels FOR DELETE TO anon USING (true);

-- Seed initial hero banner (if table is empty)
INSERT INTO carousels (title, subtitle, image_url, link_url, sort_order, is_active)
SELECT 'Timeless Elegance', 'Discover our curated collection of handcrafted silver jewelry', '/images/hero-banner.jpg', '#collection', 0, true
WHERE NOT EXISTS (SELECT 1 FROM carousels LIMIT 1);

-- -------------------------------------------------------------
-- 3. STORAGE BUCKET: cresol-media (For Products & Carousels)
-- -------------------------------------------------------------
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

-- Drop existing storage policies if re-running
DROP POLICY IF EXISTS "Public can view cresol-media" ON storage.objects;
DROP POLICY IF EXISTS "Anon can upload to cresol-media" ON storage.objects;
DROP POLICY IF EXISTS "Anon can update in cresol-media" ON storage.objects;
DROP POLICY IF EXISTS "Anon can delete from cresol-media" ON storage.objects;

-- Storage policies for cresol-media bucket
CREATE POLICY "Public can view cresol-media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'cresol-media');

CREATE POLICY "Anon can upload to cresol-media"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'cresol-media');

CREATE POLICY "Anon can update in cresol-media"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'cresol-media');

CREATE POLICY "Anon can delete from cresol-media"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'cresol-media');
