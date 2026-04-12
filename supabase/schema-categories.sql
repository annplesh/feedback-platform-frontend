-- =============================================
-- STATUS: ALREADY APPLIED — DO NOT RUN AGAIN
-- Last applied: April 2026
-- =============================================

-- Categories table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE
);

-- Link feedback to categories
ALTER TABLE feedback
ADD COLUMN category_id uuid REFERENCES categories(id);

-- Initial categories
INSERT INTO categories (name) VALUES
  ('Service'),
  ('Quality'),
  ('Delivery'),
  ('General');