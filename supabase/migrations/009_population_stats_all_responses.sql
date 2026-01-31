-- Quick Quality Assessment Survey - Revert Population Stats to All Responses
-- Version: 1.0
-- Date: January 2026
-- Purpose: Use all non-test completed responses for population statistics
--          (no dedup by lead_id). Each submission is a valid data point.
--
-- What stays:
--   - Snapshot columns on survey_responses (agency_size, role, primary_setting, state)
--   - latest_survey_responses view (useful for other features)
--   - Submit API snapshotting demographics
--
-- What changes:
--   - All 7 materialized views now query survey_responses directly
--     (no DISTINCT ON CTE)

-- ============================================================
-- Drop existing materialized views
-- ============================================================

DROP MATERIALIZED VIEW IF EXISTS score_distribution;
DROP MATERIALIZED VIEW IF EXISTS category_stats;
DROP MATERIALIZED VIEW IF EXISTS question_stats;
DROP MATERIALIZED VIEW IF EXISTS survey_stats;
DROP MATERIALIZED VIEW IF EXISTS stats_by_agency_size;
DROP MATERIALIZED VIEW IF EXISTS stats_by_setting;
DROP MATERIALIZED VIEW IF EXISTS stats_by_state;

-- ============================================================
-- 1. survey_stats — overall avg, median, percentiles
-- ============================================================

CREATE MATERIALIZED VIEW survey_stats AS
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
FROM survey_responses
WHERE is_test = false
  AND completed_at IS NOT NULL
  AND total_score IS NOT NULL
GROUP BY survey_version;

-- ============================================================
-- 2. question_stats — per-question yes%
-- ============================================================

CREATE MATERIALIZED VIEW question_stats AS
SELECT
  sa.question_id,
  sr.survey_version,
  COUNT(*) AS total_responses,
  AVG(CASE WHEN sa.answer THEN 1.0 ELSE 0.0 END) * 100 AS yes_percentage,
  SUM(CASE WHEN sa.answer THEN 1 ELSE 0 END) AS yes_count,
  SUM(CASE WHEN NOT sa.answer THEN 1 ELSE 0 END) AS no_count,
  NOW() AS last_updated
FROM survey_answers sa
JOIN survey_responses sr ON sa.response_id = sr.id
WHERE sr.is_test = false
  AND sr.completed_at IS NOT NULL
  AND sr.total_score IS NOT NULL
GROUP BY sa.question_id, sr.survey_version;

-- ============================================================
-- 3. category_stats — per-category avg%
-- ============================================================

CREATE MATERIALIZED VIEW category_stats AS
SELECT
  CASE
    WHEN sa.question_id LIKE 'ds_%' THEN 'daily_sessions'
    WHEN sa.question_id LIKE 'tf_%' THEN 'treatment_fidelity'
    WHEN sa.question_id LIKE 'da_%' THEN 'data_analysis'
    WHEN sa.question_id LIKE 'cg_%' THEN 'caregiver_guidance'
    WHEN sa.question_id LIKE 'sup_%' THEN 'supervision'
  END AS category,
  sr.survey_version,
  COUNT(DISTINCT sr.id) AS total_responses,
  AVG(CASE WHEN sa.answer THEN 1.0 ELSE 0.0 END) * 100 AS avg_percentage,
  NOW() AS last_updated
FROM survey_answers sa
JOIN survey_responses sr ON sa.response_id = sr.id
WHERE sr.is_test = false
  AND sr.completed_at IS NOT NULL
  AND sr.total_score IS NOT NULL
GROUP BY
  CASE
    WHEN sa.question_id LIKE 'ds_%' THEN 'daily_sessions'
    WHEN sa.question_id LIKE 'tf_%' THEN 'treatment_fidelity'
    WHEN sa.question_id LIKE 'da_%' THEN 'data_analysis'
    WHEN sa.question_id LIKE 'cg_%' THEN 'caregiver_guidance'
    WHEN sa.question_id LIKE 'sup_%' THEN 'supervision'
  END,
  sr.survey_version;

-- ============================================================
-- 4. score_distribution — score frequency histogram
-- ============================================================

CREATE MATERIALIZED VIEW score_distribution AS
SELECT
  survey_version,
  total_score,
  COUNT(*) AS frequency,
  SUM(COUNT(*)) OVER (PARTITION BY survey_version ORDER BY total_score) AS cumulative_count,
  SUM(COUNT(*)) OVER (PARTITION BY survey_version) AS total_count
FROM survey_responses
WHERE is_test = false
  AND completed_at IS NOT NULL
  AND total_score IS NOT NULL
GROUP BY survey_version, total_score
ORDER BY survey_version, total_score;

-- ============================================================
-- 5. stats_by_agency_size — uses snapshot column from survey_responses
-- ============================================================

CREATE MATERIALIZED VIEW stats_by_agency_size AS
SELECT
  survey_version,
  agency_size,
  COUNT(*) AS total_responses,
  AVG(total_score) AS avg_score,
  ROUND(AVG(total_score::numeric / max_possible_score * 100), 1) AS avg_percentage,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY total_score) AS median_score
FROM survey_responses
WHERE is_test = false
  AND completed_at IS NOT NULL
  AND total_score IS NOT NULL
  AND agency_size IS NOT NULL
GROUP BY survey_version, agency_size;

-- ============================================================
-- 6. stats_by_setting — uses snapshot column from survey_responses
-- ============================================================

CREATE MATERIALIZED VIEW stats_by_setting AS
SELECT
  survey_version,
  primary_setting,
  COUNT(*) AS total_responses,
  AVG(total_score) AS avg_score,
  ROUND(AVG(total_score::numeric / max_possible_score * 100), 1) AS avg_percentage,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY total_score) AS median_score
FROM survey_responses
WHERE is_test = false
  AND completed_at IS NOT NULL
  AND total_score IS NOT NULL
  AND primary_setting IS NOT NULL
GROUP BY survey_version, primary_setting;

-- ============================================================
-- 7. stats_by_state — uses snapshot column from survey_responses
-- ============================================================

CREATE MATERIALIZED VIEW stats_by_state AS
SELECT
  survey_version,
  state,
  COUNT(*) AS total_responses,
  AVG(total_score) AS avg_score,
  ROUND(AVG(total_score::numeric / max_possible_score * 100), 1) AS avg_percentage,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY total_score) AS median_score
FROM survey_responses
WHERE is_test = false
  AND completed_at IS NOT NULL
  AND total_score IS NOT NULL
  AND state IS NOT NULL
GROUP BY survey_version, state;

-- ============================================================
-- Recreate unique indexes for concurrent refresh
-- ============================================================

CREATE UNIQUE INDEX idx_survey_stats_version ON survey_stats(survey_version);
CREATE UNIQUE INDEX idx_question_stats_pk ON question_stats(question_id, survey_version);
CREATE UNIQUE INDEX idx_category_stats_pk ON category_stats(category, survey_version);
CREATE UNIQUE INDEX idx_score_dist_pk ON score_distribution(survey_version, total_score);
CREATE UNIQUE INDEX idx_stats_agency_size_unique ON stats_by_agency_size(survey_version, agency_size);
CREATE UNIQUE INDEX idx_stats_setting_unique ON stats_by_setting(survey_version, primary_setting);
CREATE UNIQUE INDEX idx_stats_state_unique ON stats_by_state(survey_version, state);

-- ============================================================
-- Refresh all materialized views immediately
-- ============================================================

REFRESH MATERIALIZED VIEW survey_stats;
REFRESH MATERIALIZED VIEW question_stats;
REFRESH MATERIALIZED VIEW category_stats;
REFRESH MATERIALIZED VIEW score_distribution;
REFRESH MATERIALIZED VIEW stats_by_agency_size;
REFRESH MATERIALIZED VIEW stats_by_setting;
REFRESH MATERIALIZED VIEW stats_by_state;

-- ============================================================
-- Update comments
-- ============================================================

COMMENT ON MATERIALIZED VIEW survey_stats IS 'Pre-computed overall survey statistics per version (all non-test completed responses)';
COMMENT ON MATERIALIZED VIEW question_stats IS 'Pre-computed per-question yes/no percentages (all non-test completed responses)';
COMMENT ON MATERIALIZED VIEW category_stats IS 'Pre-computed category-level statistics (all non-test completed responses)';
COMMENT ON MATERIALIZED VIEW score_distribution IS 'Score frequency distribution for percentile calculations (all non-test completed responses)';
COMMENT ON MATERIALIZED VIEW stats_by_agency_size IS 'Segmented stats by agency size using snapshot columns (all non-test completed responses)';
COMMENT ON MATERIALIZED VIEW stats_by_setting IS 'Segmented stats by primary setting using snapshot columns (all non-test completed responses)';
COMMENT ON MATERIALIZED VIEW stats_by_state IS 'Segmented stats by state using snapshot columns (all non-test completed responses)';
