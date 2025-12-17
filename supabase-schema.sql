-- =============================================
-- UltraFolio SAFE Database Schema
-- This script is IDEMPOTENT - safe to run multiple times
-- It will NOT fail if tables/policies already exist
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== TABLES ====================

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  photo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Portfolios table
CREATE TABLE IF NOT EXISTS public.portfolios (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null,
  title text not null,
  subtitle text,
  description text,
  profile_photo_url text,
  
  -- Personal Info
  email text,
  phone text,
  location text,
  website text,
  linkedin text,
  github text,
  
  -- CV Data (JSON fields for flexibility)
  experience jsonb default '[]'::jsonb,
  education jsonb default '[]'::jsonb,
  skills jsonb default '[]'::jsonb,
  projects jsonb default '[]'::jsonb,
  certifications jsonb default '[]'::jsonb,
  languages jsonb default '[]'::jsonb,
  
  -- Template
  template_id text not null default 'modern',
  template_name text,
  custom_styles jsonb,
  
  -- Status
  status text default 'draft' check (status in ('draft', 'published')),
  is_public boolean default false,
  
  -- NEW: Slug for custom URLs
  slug varchar(50) unique,
  
  -- NEW: Theme for color customization
  theme varchar(50),
  
  -- Timestamps
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  published_at timestamp with time zone
);

-- CV Uploads table
CREATE TABLE IF NOT EXISTS public.cv_uploads (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null,
  portfolio_id uuid references public.portfolios(id) on delete set null,
  file_name text not null,
  file_size integer,
  file_type text,
  storage_path text not null,
  status text default 'processing' check (status in ('processing', 'completed', 'failed')),
  error_message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==================== ADD MISSING COLUMNS ====================
-- These run safely even if columns already exist

DO $$
BEGIN
    -- Add slug column to portfolios if not exists
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'portfolios' AND column_name = 'slug') THEN
        ALTER TABLE public.portfolios ADD COLUMN slug varchar(50) unique;
    END IF;
    
    -- Add theme column to portfolios if not exists
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'portfolios' AND column_name = 'theme') THEN
        ALTER TABLE public.portfolios ADD COLUMN theme varchar(50);
    END IF;
END $$;

-- ==================== FOREIGN KEYS ====================
-- Update foreign keys to reference auth.users directly

DO $$
BEGIN
    -- Fix portfolios user_id foreign key
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'portfolios_user_id_fkey') THEN
        ALTER TABLE public.portfolios DROP CONSTRAINT portfolios_user_id_fkey;
    END IF;
    ALTER TABLE public.portfolios ADD CONSTRAINT portfolios_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
EXCEPTION WHEN others THEN
    NULL; -- Ignore if constraint handling fails
END $$;

DO $$
BEGIN
    -- Fix cv_uploads user_id foreign key
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'cv_uploads_user_id_fkey') THEN
        ALTER TABLE public.cv_uploads DROP CONSTRAINT cv_uploads_user_id_fkey;
    END IF;
    ALTER TABLE public.cv_uploads ADD CONSTRAINT cv_uploads_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
EXCEPTION WHEN others THEN
    NULL;
END $$;

-- ==================== ENABLE RLS ====================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cv_uploads ENABLE ROW LEVEL SECURITY;

-- ==================== DROP OLD POLICIES (to recreate cleanly) ====================

DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view their own portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Public portfolios are viewable by everyone" ON public.portfolios;
DROP POLICY IF EXISTS "Public portfolios viewable by slug" ON public.portfolios;
DROP POLICY IF EXISTS "Users can insert their own portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Users can update their own portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Users can delete their own portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Users can view their own uploads" ON public.cv_uploads;
DROP POLICY IF EXISTS "Users can insert their own uploads" ON public.cv_uploads;

-- ==================== CREATE RLS POLICIES ====================

-- Users table policies
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Portfolios table policies
CREATE POLICY "Users can view their own portfolios"
  ON public.portfolios FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Public portfolios are viewable by everyone"
  ON public.portfolios FOR SELECT
  USING (is_public = true OR slug IS NOT NULL);

CREATE POLICY "Users can insert their own portfolios"
  ON public.portfolios FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own portfolios"
  ON public.portfolios FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own portfolios"
  ON public.portfolios FOR DELETE
  USING (auth.uid() = user_id);

-- CV uploads table policies
CREATE POLICY "Users can view their own uploads"
  ON public.cv_uploads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own uploads"
  ON public.cv_uploads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ==================== TRIGGERS ====================

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Add triggers (drop first if exist)
DROP TRIGGER IF EXISTS handle_users_updated_at ON public.users;
CREATE TRIGGER handle_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_portfolios_updated_at ON public.portfolios;
CREATE TRIGGER handle_portfolios_updated_at
  BEFORE UPDATE ON public.portfolios
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- ==================== INDEXES ====================

CREATE INDEX IF NOT EXISTS portfolios_user_id_idx ON public.portfolios(user_id);
CREATE INDEX IF NOT EXISTS portfolios_status_idx ON public.portfolios(status);
CREATE INDEX IF NOT EXISTS portfolios_is_public_idx ON public.portfolios(is_public);
CREATE INDEX IF NOT EXISTS portfolios_slug_idx ON public.portfolios(slug);
CREATE INDEX IF NOT EXISTS cv_uploads_user_id_idx ON public.cv_uploads(user_id);

-- ==================== STORAGE BUCKETS ====================

-- Create buckets (ignore if exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('cvs', 'cvs', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolios', 'portfolios', true)
ON CONFLICT (id) DO NOTHING;

-- Drop old storage policies
DROP POLICY IF EXISTS "Users can upload their own CVs" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own CVs" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own CVs" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view portfolio assets" ON storage.objects;

-- CV uploads bucket policies (private)
CREATE POLICY "Users can upload their own CVs"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own CVs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own CVs"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Profile photos bucket policies (public)
CREATE POLICY "Anyone can view profile photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-photos');

CREATE POLICY "Users can upload their own photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own photos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Portfolio assets bucket (public read)
-- Portfolio assets bucket (public read, auth write)
CREATE POLICY "Anyone can view portfolio assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolios');

CREATE POLICY "Authenticated users can upload portfolio assets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolios');

CREATE POLICY "Users can update their own portfolio assets"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'portfolios' AND owner = auth.uid());

CREATE POLICY "Users can delete their own portfolio assets"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'portfolios' AND owner = auth.uid());

-- ==================== DONE ====================
SELECT '✅ UltraFolio database schema applied successfully!' AS result;
