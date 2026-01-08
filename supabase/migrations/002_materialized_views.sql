-- Quick Quality Assessment Survey - Materialized Views
-- Version: 1.0
-- Date: January 2026
-- Purpose: Pre-computed statistics for fast population comparison queries

-- Overall survey statistics (excluding test data)
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
GROUP BY survey_version;

-- Per-question statistics (excluding test data)
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
GROUP BY sa.question_id, sr.survey_version;

-- Category statistics (computed from question stats)
-- Note: Category grouping done via question_id prefix
CREATE MATERIALIZED VIEW category_stats AS
SELECT
  CASE
    WHEN question_id LIKE 'ds_%' THEN 'daily_sessions'
    WHEN question_id LIKE 'tf_%' THEN 'treatment_fidelity'
    WHEN question_id LIKE 'da_%' THEN 'data_analysis'
    WHEN question_id LIKE 'cg_%' THEN 'caregiver_guidance'
    WHEN question_id LIKE 'sup_%' THEN 'supervision'
  END AS category,
  sr.survey_version,
  COUNT(DISTINCT sr.id) AS total_responses,
  AVG(CASE WHEN sa.answer THEN 1.0 ELSE 0.0 END) * 100 AS avg_percentage,
  NOW() AS last_updated
FROM survey_answers sa
JOIN survey_responses sr ON sa.response_id = sr.id
WHERE sr.is_test = false
GROUP BY
  CASE
    WHEN question_id LIKE 'ds_%' THEN 'daily_sessions'
    WHEN question_id LIKE 'tf_%' THEN 'treatment_fidelity'
    WHEN question_id LIKE 'da_%' THEN 'data_analysis'
    WHEN question_id LIKE 'cg_%' THEN 'caregiver_guidance'
    WHEN question_id LIKE 'sup_%' THEN 'supervision'
  END,
  sr.survey_version;

-- Score distribution for percentile calculations (excluding test data)
CREATE MATERIALIZED VIEW score_distribution AS
SELECT
  survey_version,
  total_score,
  COUNT(*) AS frequency,
  SUM(COUNT(*)) OVER (PARTITION BY survey_version ORDER BY total_score) AS cumulative_count,
  SUM(COUNT(*)) OVER (PARTITION BY survey_version) AS total_count
FROM survey_responses
WHERE is_test = false
GROUP BY survey_version, total_score
ORDER BY survey_version, total_score;

-- Unique indexes for concurrent refresh
CREATE UNIQUE INDEX idx_survey_stats_version ON survey_stats(survey_version);
CREATE UNIQUE INDEX idx_question_stats_pk ON question_stats(question_id, survey_version);
CREATE UNIQUE INDEX idx_category_stats_pk ON category_stats(category, survey_version);
CREATE UNIQUE INDEX idx_score_dist_pk ON score_distribution(survey_version, total_score);

-- Comments
COMMENT ON MATERIALIZED VIEW survey_stats IS 'Pre-computed overall survey statistics per version';
COMMENT ON MATERIALIZED VIEW question_stats IS 'Pre-computed per-question yes/no percentages';
COMMENT ON MATERIALIZED VIEW category_stats IS 'Pre-computed category-level statistics';
COMMENT ON MATERIALIZED VIEW score_distribution IS 'Score frequency distribution for percentile calculations';
