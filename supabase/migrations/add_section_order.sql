-- Add section_order column to portfolios table
-- Run this in your Supabase SQL Editor

-- Add the section_order column if it doesn't exist
ALTER TABLE portfolios 
ADD COLUMN IF NOT EXISTS section_order text[] DEFAULT ARRAY['about', 'skills', 'projects', 'experience', 'education', 'certifications', 'languages', 'contact'];

-- Add comment explaining the field
COMMENT ON COLUMN portfolios.section_order IS 'Array defining the order of sections in the portfolio layout';
