-- Quick Quality Assessment Survey - Backfill Snapshot Demographics
-- Version: 1.0
-- Date: January 2026
-- Purpose: Populate snapshot columns on historical survey_responses from leads table.
--          Migration 007 added agency_size, role, primary_setting, state to
--          survey_responses but left existing rows as NULL. The materialized views
--          (stats_by_agency_size, stats_by_setting, stats_by_state) filter on
--          these columns being NOT NULL, so historical data was excluded.
--          This one-time backfill copies the current leads demographics to
--          historical responses where snapshots are missing.

-- Backfill snapshot columns from leads for all responses that have NULLs
UPDATE survey_responses sr
SET
  agency_size    = l.agency_size,
  role           = l.role::text,
  primary_setting = l.primary_setting,
  state          = l.state
FROM leads l
WHERE sr.lead_id = l.id
  AND sr.agency_size IS NULL
  AND (l.agency_size IS NOT NULL
    OR l.role IS NOT NULL
    OR l.primary_setting IS NOT NULL
    OR l.state IS NOT NULL);

-- Refresh all materialized views to pick up the backfilled data
REFRESH MATERIALIZED VIEW CONCURRENTLY survey_stats;
REFRESH MATERIALIZED VIEW CONCURRENTLY question_stats;
REFRESH MATERIALIZED VIEW CONCURRENTLY category_stats;
REFRESH MATERIALIZED VIEW CONCURRENTLY score_distribution;
REFRESH MATERIALIZED VIEW CONCURRENTLY stats_by_agency_size;
REFRESH MATERIALIZED VIEW CONCURRENTLY stats_by_setting;
REFRESH MATERIALIZED VIEW CONCURRENTLY stats_by_state;
