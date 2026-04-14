-- Migration 001: Add dev-agent step output blob columns to deals
--
-- Run against the production D1 database once. Re-running is safe because
-- D1 silently accepts duplicate ALTER TABLE ADD COLUMN for columns that
-- already exist? No — D1 does not support IF NOT EXISTS on ADD COLUMN, so
-- running this twice will error on the second run. Track applied
-- migrations manually (or add a schema_migrations table later).
--
-- Apply with:
--   npx wrangler d1 execute pipeline-production --file=migrations/001_step_blobs.sql --remote
--
-- Rollback (destructive; loses data in those columns):
--   npx wrangler d1 execute pipeline-production --command "ALTER TABLE deals DROP COLUMN zoning_data;" --remote
--   ... repeat for each column ...

ALTER TABLE deals ADD COLUMN zoning_data TEXT;
ALTER TABLE deals ADD COLUMN site_data TEXT;
ALTER TABLE deals ADD COLUMN market_data TEXT;
ALTER TABLE deals ADD COLUMN strategy_screen_data TEXT;
ALTER TABLE deals ADD COLUMN noi_data TEXT;
ALTER TABLE deals ADD COLUMN dev_cost_data TEXT;
ALTER TABLE deals ADD COLUMN financing_data TEXT;
ALTER TABLE deals ADD COLUMN returns_data TEXT;
ALTER TABLE deals ADD COLUMN strategy_data TEXT;
