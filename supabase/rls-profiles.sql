-- =============================================
-- PROFILES TABLE — RLS POLICIES
-- =============================================
-- STATUS: ALREADY APPLIED — DO NOT RUN AGAIN
-- Last applied: April 2026
-- Verify: Authentication > Policies > profiles (3 policies)
-- Note: ran twice by accident — "policy already exists" is expected.
-- To reapply: delete existing policies first.
-- =============================================

-- Anyone can read profiles (needed to show avatars on the Wall)
CREATE POLICY "Public reads profiles"
ON profiles FOR SELECT
USING (true);

-- User can only create their own profile
CREATE POLICY "User inserts own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- User can only update their own profile
CREATE POLICY "User updates own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);