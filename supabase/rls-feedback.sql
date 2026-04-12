-- =============================================
-- FEEDBACK TABLE — RLS POLICIES
-- =============================================
-- STATUS: ALREADY APPLIED — DO NOT RUN AGAIN
-- Last applied: April 2026
-- Verify: Authentication > Policies > feedback (6 policies)
-- To reapply: delete existing policies first.
-- =============================================

-- Public
CREATE POLICY "Public reads approved feedback"
ON feedback FOR SELECT
USING (approved = true);

-- Authenticated users
CREATE POLICY "Authenticated can insert"
ON feedback FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "User can delete own"
ON feedback FOR DELETE
USING (auth.uid() = user_id);

-- Admin only
CREATE POLICY "Admin reads all"
ON feedback FOR SELECT
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admin can delete any"
ON feedback FOR DELETE
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admin can update"
ON feedback FOR UPDATE
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');