-- Migration 007: Add gis_url column
--
-- gis_url: county parcel / GIS portal URL for this deal's site.
-- Editable inline from the deal header. Persists through re-syncs.
--
-- Apply with:
--   npx wrangler d1 execute pipeline-production --file=migrations/007_gis_url.sql --remote

ALTER TABLE deals ADD COLUMN gis_url TEXT;
