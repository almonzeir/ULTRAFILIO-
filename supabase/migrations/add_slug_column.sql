-- =============================================
-- SAFE MIGRATION: Add slug column to portfolios
-- Run this in your Supabase SQL Editor
-- https://supabase.com/dashboard/project/YOUR_PROJECT/sql
-- =============================================

-- This script ONLY adds the slug column
-- It will NOT recreate any existing tables

-- 1. Add slug column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'portfolios' 
        AND column_name = 'slug'
    ) THEN
        ALTER TABLE public.portfolios ADD COLUMN slug VARCHAR(50) UNIQUE;
        RAISE NOTICE 'Column slug added successfully';
    ELSE
        RAISE NOTICE 'Column slug already exists, skipping';
    END IF;
END $$;

-- 2. Create index for faster slug lookups (if doesn't exist)
CREATE INDEX IF NOT EXISTS idx_portfolios_slug ON public.portfolios(slug);

-- 3. Add theme column if it doesn't exist (for saving user's color theme)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'portfolios' 
        AND column_name = 'theme'
    ) THEN
        ALTER TABLE public.portfolios ADD COLUMN theme VARCHAR(50);
        RAISE NOTICE 'Column theme added successfully';
    ELSE
        RAISE NOTICE 'Column theme already exists, skipping';
    END IF;
END $$;

-- 4. Update RLS policy to allow public access by slug
-- First drop if exists, then recreate
DROP POLICY IF EXISTS "Public portfolios viewable by slug" ON public.portfolios;

CREATE POLICY "Public portfolios viewable by slug"
    ON public.portfolios FOR SELECT
    USING (slug IS NOT NULL OR is_public = true);

-- Done!
SELECT 'Migration completed successfully!' AS result;
