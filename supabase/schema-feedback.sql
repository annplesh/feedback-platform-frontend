-- =============================================
-- FEEDBACK TABLE — SCHEMA SETUP
-- =============================================
-- Run this only on a fresh database.
-- WARNING: do not run if feedback table already exists.
-- =============================================

-- Create feedback table
CREATE TABLE feedback (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  message text NOT NULL,
  rating smallint NOT NULL CHECK (rating >= 1 AND rating <= 5),
  date date NOT NULL DEFAULT current_date,
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;