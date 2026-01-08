-- Quick Quality Assessment Survey - Agency Demographics
-- Version: 1.0
-- Date: January 2026
-- Purpose: Add optional agency demographics for segmented population comparison

-- Add agency demographics columns to leads table
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS agency_size TEXT CHECK (agency_size IN ('solo_small', 'medium', 'large', 'enterprise')),
ADD COLUMN IF NOT EXISTS primary_setting TEXT CHECK (primary_setting IN ('in_home', 'clinic', 'school', 'hybrid')),
ADD COLUMN IF NOT EXISTS state TEXT;

-- Add indexes for segmented queries
CREATE INDEX IF NOT EXISTS idx_leads_agency_size ON leads(agency_size) WHERE agency_size IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_primary_setting ON leads(primary_setting) WHERE primary_setting IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_state ON leads(state) WHERE state IS NOT NULL;

-- Create materialized view for segmented stats by agency size
CREATE MATERIALIZED VIEW IF NOT EXISTS stats_by_agency_size AS
SELECT
  sr.survey_version,
  l.agency_size,
  COUNT(*) as total_responses,
  AVG(sr.total_score) as avg_score,
  ROUND(AVG(sr.total_score::numeric / sr.max_possible_score * 100), 1) as avg_percentage,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY sr.total_score) as median_score
FROM survey_responses sr
JOIN leads l ON sr.lead_id = l.id
WHERE l.agency_size IS NOT NULL
  AND sr.is_test = false
GROUP BY sr.survey_version, l.agency_size;

-- Create materialized view for segmented stats by setting
CREATE MATERIALIZED VIEW IF NOT EXISTS stats_by_setting AS
SELECT
  sr.survey_version,
  l.primary_setting,
  COUNT(*) as total_responses,
  AVG(sr.total_score) as avg_score,
  ROUND(AVG(sr.total_score::numeric / sr.max_possible_score * 100), 1) as avg_percentage,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY sr.total_score) as median_score
FROM survey_responses sr
JOIN leads l ON sr.lead_id = l.id
WHERE l.primary_setting IS NOT NULL
  AND sr.is_test = false
GROUP BY sr.survey_version, l.primary_setting;

-- Create materialized view for segmented stats by state
CREATE MATERIALIZED VIEW IF NOT EXISTS stats_by_state AS
SELECT
  sr.survey_version,
  l.state,
  COUNT(*) as total_responses,
  AVG(sr.total_score) as avg_score,
  ROUND(AVG(sr.total_score::numeric / sr.max_possible_score * 100), 1) as avg_percentage,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY sr.total_score) as median_score
FROM survey_responses sr
JOIN leads l ON sr.lead_id = l.id
WHERE l.state IS NOT NULL
  AND sr.is_test = false
GROUP BY sr.survey_version, l.state;

-- Create unique indexes for concurrent refresh
CREATE UNIQUE INDEX IF NOT EXISTS idx_stats_agency_size_unique
ON stats_by_agency_size(survey_version, agency_size);

CREATE UNIQUE INDEX IF NOT EXISTS idx_stats_setting_unique
ON stats_by_setting(survey_version, primary_setting);

CREATE UNIQUE INDEX IF NOT EXISTS idx_stats_state_unique
ON stats_by_state(survey_version, state);

-- Update the hourly refresh job to include new views
SELECT cron.schedule(
  'refresh-segmented-stats',
  '5 * * * *',  -- Every hour at minute 5
  $$
    REFRESH MATERIALIZED VIEW CONCURRENTLY stats_by_agency_size;
    REFRESH MATERIALIZED VIEW CONCURRENTLY stats_by_setting;
    REFRESH MATERIALIZED VIEW CONCURRENTLY stats_by_state;
  $$
);

-- Comments
COMMENT ON COLUMN leads.agency_size IS 'Agency size: solo_small (1-10), medium (11-50), large (51-200), enterprise (200+)';
COMMENT ON COLUMN leads.primary_setting IS 'Primary service setting: in_home, clinic, school, hybrid';
COMMENT ON COLUMN leads.state IS 'US state abbreviation (e.g., TX, CA, NY)';
