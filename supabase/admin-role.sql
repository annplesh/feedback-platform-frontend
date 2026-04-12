-- =============================================
-- ADMIN ROLE SETUP
-- =============================================
-- Run this to assign the admin role to a user.
-- Replace the email with the admin's email.
-- After running: user must log out and log back
-- in for the new role to appear in the JWT.
-- =============================================

UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'ann.pleshakova@gmail.com';