-- =============================================================
-- Cresol: Add mobile_image_url to carousels table
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/cgxexaongesloomabwji/sql/new
-- =============================================================

ALTER TABLE carousels ADD COLUMN IF NOT EXISTS mobile_image_url TEXT DEFAULT '';
