-- Quick Quality Assessment Survey - Deduplicate Population Stats
-- Version: 1.0
-- Date: January 2026
-- Purpose: (A) Snapshot demographics on survey_responses at submission time
--          (B) Deduplicate population stats to count only latest response per lead_id

-- ============================================================
-- Part A: Snapshot demographic columns on survey_responses
-- ============================================================
-- These get populated at submission time (see submit API).
-- Historical rows will have NULLs (acceptable — they predate this feature).

ALTER TABLE survey_responses
ADD COLUMN IF NOT EXISTS agency_size TEXT,
ADD COLUMN IF NOT EXISTS role TEXT,
ADD COLUMN IF NOT EXISTS primary_setting TEXT,
ADD COLUMN IF NOT EXISTS state TEXT;

-- ============================================================
-- Part B: Performance index for DISTINCT ON dedup query
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_responses_lead_completed_desc
  ON survey_responses(lead_id, completed_at DESC)
  WHERE is_test = false;

-- ============================================================
-- Part C: Regular view for latest (deduplicated) responses
-- ============================================================
-- Supabase JS client can query this like a table.
-- Only includes completed, scored, non-test responses.
-- One row per lead_id (the most recent completed response).

CREATE OR REPLACE VIEW latest_survey_responses AS
SELECT DISTINCT ON (sr.lead_id)
  sr.*
FROM survey_responses sr
WHERE sr.is_test = false
  AND sr.completed_at IS NOT NULL
  AND sr.total_score IS NOT NULL
ORDER BY sr.lead_id, sr.completed_at DESC;

-- ============================================================
-- Part D: Recreate all 7 materialized views with dedup CTE
-- ============================================================
-- Each view uses a CTE to get only the latest response per lead_id,
-- then aggregates from that deduplicated set.

-- Drop existing views (order matters for dependencies)
DROP MATERIALIZED VIEW IF EXISTS score_distribution;
DROP MATERIALIZED VIEW IF EXISTS category_stats;
DROP MATERIALIZED VIEW IF EXISTS question_stats;
DROP MATERIALIZED VIEW IF EXISTS survey_stats;
DROP MATERIALIZED VIEW IF EXISTS stats_by_agency_size;
DROP MATERIALIZED VIEW IF EXISTS stats_by_setting;
DROP MATERIALIZED VIEW IF EXISTS stats_by_state;

-- 1. survey_stats — overall avg, median, percentiles
CREATE MATERIALIZED VIEW survey_stats AS
WITH latest_responses AS (
  SELECT DISTINCT ON (lead_id) *
  FROM survey_responses
  WHERE is_test = false
    AND completed_at IS NOT NULL
    AND total_score IS NOT NULL
  ORDER BY lead_id, completed_at DESC
)
SELECT
  survey_version,
  COUNT(*) AS total_responses,
  AVG(total_score) AS avg_score,
  AVG(total_score::DECIMAL / max_possible_score * 100) AS avg_percentage,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY total_score) AS median_score,
  PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY total_score) AS p25_score,
  PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY total_score) AS p75_score,
  MIN(total_score) AS min_score,
  MAX(total_score) AS max_score,
  NOW() AS last_updated
FROM latest_responses
GROUP BY survey_version;

-- 2. question_stats — per-question yes%
CREATE MATERIALIZED VIEW question_stats AS
WITH latest_responses AS (
  SELECT DISTINCT ON (lead_id) id, survey_version
  FROM survey_responses
  WHERE is_test = false
    AND completed_at IS NOT NULL
    AND total_score IS NOT NULL
  ORDER BY lead_id, completed_at DESC
)
SELECT
  sa.question_id,
  lr.survey_version,
  COUNT(*) AS total_responses,
  AVG(CASE WHEN sa.answer THEN 1.0 ELSE 0.0 END) * 100 AS yes_percentage,
  SUM(CASE WHEN sa.answer THEN 1 ELSE 0 END) AS yes_count,
  SUM(CASE WHEN NOT sa.answer THEN 1 ELSE 0 END) AS no_count,
  NOW() AS last_updated
FROM survey_answers sa
JOIN latest_responses lr ON sa.response_id = lr.id
GROUP BY sa.question_id, lr.survey_version;

-- 3. category_stats — per-category avg%
CREATE MATERIALIZED VIEW category_stats AS
WITH latest_responses AS (
  SELECT DISTINCT ON (lead_id) id, survey_version
  FROM survey_responses
  WHERE is_test = false
    AND completed_at IS NOT NULL
    AND total_score IS NOT NULL
  ORDER BY lead_id, completed_at DESC
)
SELECT
  CASE
    WHEN sa.question_id LIKE 'ds_%' THEN 'daily_sessions'
    WHEN sa.question_id LIKE 'tf_%' THEN 'treatment_fidelity'
    WHEN sa.question_id LIKE 'da_%' THEN 'data_analysis'
    WHEN sa.question_id LIKE 'cg_%' THEN 'caregiver_guidance'
    WHEN sa.question_id LIKE 'sup_%' THEN 'supervision'
  END AS category,
  lr.survey_version,
  COUNT(DISTINCT lr.id) AS total_responses,
  AVG(CASE WHEN sa.answer THEN 1.0 ELSE 0.0 END) * 100 AS avg_percentage,
  NOW() AS last_updated
FROM survey_answers sa
JOIN latest_responses lr ON sa.response_id = lr.id
GROUP BY
  CASE
    WHEN sa.question_id LIKE 'ds_%' THEN 'daily_sessions'
    WHEN sa.question_id LIKE 'tf_%' THEN 'treatment_fidelity'
    WHEN sa.question_id LIKE 'da_%' THEN 'data_analysis'
    WHEN sa.question_id LIKE 'cg_%' THEN 'caregiver_guidance'
    WHEN sa.question_id LIKE 'sup_%' THEN 'supervision'
  END,
  lr.survey_version;

-- 4. score_distribution — score frequency histogram
CREATE MATERIALIZED VIEW score_distribution AS
WITH latest_responses AS (
  SELECT DISTINCT ON (lead_id) *
  FROM survey_responses
  WHERE is_test = false
    AND completed_at IS NOT NULL
    AND total_score IS NOT NULL
  ORDER BY lead_id, completed_at DESC
)
SELECT
  survey_version,
  total_score,
  COUNT(*) AS frequency,
  SUM(COUNT(*)) OVER (PARTITION BY survey_version ORDER BY total_score) AS cumulative_count,
  SUM(COUNT(*)) OVER (PARTITION BY survey_version) AS total_count
FROM latest_responses
GROUP BY survey_version, total_score
ORDER BY survey_version, total_score;

-- 5. stats_by_agency_size — uses snapshot column from survey_responses
CREATE MATERIALIZED VIEW stats_by_agency_size AS
WITH latest_responses AS (
  SELECT DISTINCT ON (lead_id) *
  FROM survey_responses
  WHERE is_test = false
    AND completed_at IS NOT NULL
    AND total_score IS NOT NULL
  ORDER BY lead_id, completed_at DESC
)
SELECT
  survey_version,
  agency_size,
  COUNT(*) AS total_responses,
  AVG(total_score) AS avg_score,
  ROUND(AVG(total_score::numeric / max_possible_score * 100), 1) AS avg_percentage,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY total_score) AS median_score
FROM latest_responses
WHERE agency_size IS NOT NULL
GROUP BY survey_version, agency_size;

-- 6. stats_by_setting — uses snapshot column from survey_responses
CREATE MATERIALIZED VIEW stats_by_setting AS
WITH latest_responses AS (
  SELECT DISTINCT ON (lead_id) *
  FROM survey_responses
  WHERE is_test = false
    AND completed_at IS NOT NULL
    AND total_score IS NOT NULL
  ORDER BY lead_id, completed_at DESC
)
SELECT
  survey_version,
  primary_setting,
  COUNT(*) AS total_responses,
  AVG(total_score) AS avg_score,
  ROUND(AVG(total_score::numeric / max_possible_score * 100), 1) AS avg_percentage,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY total_score) AS median_score
FROM latest_responses
WHERE primary_setting IS NOT NULL
GROUP BY survey_version, primary_setting;

-- 7. stats_by_state — uses snapshot column from survey_responses
CREATE MATERIALIZED VIEW stats_by_state AS
WITH latest_responses AS (
  SELECT DISTINCT ON (lead_id) *
  FROM survey_responses
  WHERE is_test = false
    AND completed_at IS NOT NULL
    AND total_score IS NOT NULL
  ORDER BY lead_id, completed_at DESC
)
SELECT
  survey_version,
  state,
  COUNT(*) AS total_responses,
  AVG(total_score) AS avg_score,
  ROUND(AVG(total_score::numeric / max_possible_score * 100), 1) AS avg_percentage,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY total_score) AS median_score
FROM latest_responses
WHERE state IS NOT NULL
GROUP BY survey_version, state;

-- ============================================================
-- Part E: Recreate indexes for concurrent refresh
-- ============================================================

CREATE UNIQUE INDEX idx_survey_stats_version ON survey_stats(survey_version);
CREATE UNIQUE INDEX idx_question_stats_pk ON question_stats(question_id, survey_version);
CREATE UNIQUE INDEX idx_category_stats_pk ON category_stats(category, survey_version);
CREATE UNIQUE INDEX idx_score_dist_pk ON score_distribution(survey_version, total_score);
CREATE UNIQUE INDEX idx_stats_agency_size_unique ON stats_by_agency_size(survey_version, agency_size);
CREATE UNIQUE INDEX idx_stats_setting_unique ON stats_by_setting(survey_version, primary_setting);
CREATE UNIQUE INDEX idx_stats_state_unique ON stats_by_state(survey_version, state);

-- ============================================================
-- Part F: Refresh all materialized views immediately
-- ============================================================

REFRESH MATERIALIZED VIEW survey_stats;
REFRESH MATERIALIZED VIEW question_stats;
REFRESH MATERIALIZED VIEW category_stats;
REFRESH MATERIALIZED VIEW score_distribution;
REFRESH MATERIALIZED VIEW stats_by_agency_size;
REFRESH MATERIALIZED VIEW stats_by_setting;
REFRESH MATERIALIZED VIEW stats_by_state;

-- ============================================================
-- Comments
-- ============================================================

COMMENT ON COLUMN survey_responses.agency_size IS 'Snapshot of agency_size at submission time (from leads table)';
COMMENT ON COLUMN survey_responses.role IS 'Snapshot of role at submission time (from leads table)';
COMMENT ON COLUMN survey_responses.primary_setting IS 'Snapshot of primary_setting at submission time (from leads table)';
COMMENT ON COLUMN survey_responses.state IS 'Snapshot of state at submission time (from leads table)';

COMMENT ON VIEW latest_survey_responses IS 'Deduplicated view: only the latest completed response per lead_id (non-test)';
COMMENT ON MATERIALIZED VIEW survey_stats IS 'Pre-computed overall survey statistics per version (deduplicated by lead_id)';
COMMENT ON MATERIALIZED VIEW question_stats IS 'Pre-computed per-question yes/no percentages (deduplicated by lead_id)';
COMMENT ON MATERIALIZED VIEW category_stats IS 'Pre-computed category-level statistics (deduplicated by lead_id)';
COMMENT ON MATERIALIZED VIEW score_distribution IS 'Score frequency distribution for percentile calculations (deduplicated by lead_id)';
COMMENT ON MATERIALIZED VIEW stats_by_agency_size IS 'Segmented stats by agency size using snapshot columns (deduplicated by lead_id)';
COMMENT ON MATERIALIZED VIEW stats_by_setting IS 'Segmented stats by primary setting using snapshot columns (deduplicated by lead_id)';
COMMENT ON MATERIALIZED VIEW stats_by_state IS 'Segmented stats by state using snapshot columns (deduplicated by lead_id)';
