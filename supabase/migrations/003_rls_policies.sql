-- Quick Quality Assessment Survey - Row Level Security Policies
-- Version: 1.0
-- Date: January 2026
-- Purpose: Secure database access - service role only for V1

-- Enable RLS on all tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_answers ENABLE ROW LEVEL SECURITY;

-- For V1: Only service_role can access tables
-- This prevents any direct client access via anon key

-- Leads policies
CREATE POLICY "Service role full access to leads"
  ON leads
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Survey responses policies
CREATE POLICY "Service role full access to survey_responses"
  ON survey_responses
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Survey answers policies
CREATE POLICY "Service role full access to survey_answers"
  ON survey_answers
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Materialized views don't need RLS (they're read-only and accessed via service role)
-- But we can create policies for future SELECT access if needed

-- V2 Addition: When auth is added, we'll add policies like:
-- CREATE POLICY "Users can view their own leads"
--   ON leads
--   FOR SELECT
--   USING (auth.uid() = user_id);
--
-- CREATE POLICY "Users can view their own responses"
--   ON survey_responses
--   FOR SELECT
--   USING (lead_id IN (SELECT id FROM leads WHERE user_id = auth.uid()));

-- Comments
COMMENT ON POLICY "Service role full access to leads" ON leads
  IS 'V1: All database access goes through API routes using service role';
COMMENT ON POLICY "Service role full access to survey_responses" ON survey_responses
  IS 'V1: All database access goes through API routes using service role';
COMMENT ON POLICY "Service role full access to survey_answers" ON survey_answers
  IS 'V1: All database access goes through API routes using service role';
