-- Remove unique constraint from slug column in products table
-- This allows the same product to appear in multiple categories

ALTER TABLE products DROP INDEX IF EXISTS UKostq1ec3toafnjok09y9l7dox;
-- Or if the constraint name is different, use:
-- ALTER TABLE products DROP INDEX IF EXISTS products_slug_unique;
-- Or find the constraint name first:
-- SHOW INDEX FROM products WHERE Column_name = 'slug';

-- Alternative: If you want to keep slug unique but allow same product in multiple categories,
-- you could create a composite unique constraint on (slug, category_id) instead:
-- ALTER TABLE products ADD UNIQUE KEY unique_slug_per_category (slug, category_id);
