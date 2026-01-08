-- Quick Quality Assessment Survey - Test Data Cleanup
-- Version: 1.0
-- Date: January 2026
-- Purpose: Automatic cleanup of E2E test data

-- Enable pg_cron extension (must be enabled in Supabase dashboard)
-- This is typically pre-enabled in Supabase, but we include it for completeness
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Function to clean up test data older than 24 hours
CREATE OR REPLACE FUNCTION cleanup_test_data()
RETURNS void AS $$
DECLARE
  deleted_answers INTEGER;
  deleted_responses INTEGER;
  deleted_leads INTEGER;
BEGIN
  -- Delete survey answers for test responses
  DELETE FROM survey_answers
  WHERE response_id IN (
    SELECT id FROM survey_responses
    WHERE is_test = true
    AND completed_at < NOW() - INTERVAL '24 hours'
  );
  GET DIAGNOSTICS deleted_answers = ROW_COUNT;

  -- Delete test survey responses
  DELETE FROM survey_responses
  WHERE is_test = true
  AND completed_at < NOW() - INTERVAL '24 hours';
  GET DIAGNOSTICS deleted_responses = ROW_COUNT;

  -- Delete test leads (only if they have no remaining responses)
  DELETE FROM leads
  WHERE is_test = true
  AND created_at < NOW() - INTERVAL '24 hours'
  AND id NOT IN (SELECT DISTINCT lead_id FROM survey_responses);
  GET DIAGNOSTICS deleted_leads = ROW_COUNT;

  -- Log cleanup results (optional - comment out if not needed)
  RAISE NOTICE 'Test data cleanup: % answers, % responses, % leads deleted',
    deleted_answers, deleted_responses, deleted_leads;
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup job to run daily at 3 AM UTC
-- Note: Supabase may require this to be configured via dashboard
SELECT cron.schedule(
  'cleanup-test-data',           -- Job name
  '0 3 * * *',                   -- Cron expression: 3 AM daily
  'SELECT cleanup_test_data()'   -- SQL to execute
);

-- Also schedule materialized view refresh hourly
SELECT cron.schedule(
  'refresh-stats-views',
  '0 * * * *',  -- Every hour at minute 0
  $$
    REFRESH MATERIALIZED VIEW CONCURRENTLY survey_stats;
    REFRESH MATERIALIZED VIEW CONCURRENTLY question_stats;
    REFRESH MATERIALIZED VIEW CONCURRENTLY category_stats;
    REFRESH MATERIALIZED VIEW CONCURRENTLY score_distribution;
  $$
);

-- Manual cleanup function for immediate use (e.g., after test runs)
CREATE OR REPLACE FUNCTION cleanup_all_test_data()
RETURNS TABLE(answers_deleted INTEGER, responses_deleted INTEGER, leads_deleted INTEGER) AS $$
DECLARE
  a_count INTEGER;
  r_count INTEGER;
  l_count INTEGER;
BEGIN
  -- Delete all test answers
  DELETE FROM survey_answers
  WHERE response_id IN (SELECT id FROM survey_responses WHERE is_test = true);
  GET DIAGNOSTICS a_count = ROW_COUNT;

  -- Delete all test responses
  DELETE FROM survey_responses WHERE is_test = true;
  GET DIAGNOSTICS r_count = ROW_COUNT;

  -- Delete all test leads
  DELETE FROM leads WHERE is_test = true;
  GET DIAGNOSTICS l_count = ROW_COUNT;

  RETURN QUERY SELECT a_count, r_count, l_count;
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON FUNCTION cleanup_test_data() IS 'Removes test data older than 24 hours (runs daily via pg_cron)';
COMMENT ON FUNCTION cleanup_all_test_data() IS 'Immediately removes ALL test data (for manual cleanup)';
