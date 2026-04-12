-- =============================================
-- CATEGORIES TABLE — RLS POLICIES
-- =============================================
-- STATUS: ALREADY APPLIED — DO NOT RUN AGAIN
-- Last applied: April 2026
-- Verify: Authentication > Policies > categories (1 policy)
-- To reapply: delete existing policies first.
-- =============================================

-- Anyone can read categories (needed for feedback form dropdown)
CREATE POLICY "Public reads categories"
ON categories FOR SELECT
USING (true);