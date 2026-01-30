-- Quick Quality Assessment Survey - Initial Schema
-- Version: 1.0
-- Date: January 2026

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Role enum for leads
CREATE TYPE user_role AS ENUM (
  'clinical_director',
  'bcba',
  'bcaba',
  'rbt',
  'owner',
  'qa_manager',
  'consultant',
  'other'
);

-- Leads table: captures email and optional info
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  role user_role,
  email_domain TEXT, -- Extracted from email (null for personal domains)
  marketing_consent BOOLEAN NOT NULL DEFAULT true,
  is_test BOOLEAN NOT NULL DEFAULT false, -- Flag for E2E test data
  user_id UUID, -- For V2: link to auth.users
  claimed_at TIMESTAMPTZ, -- When linked to authenticated user
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Survey responses table: metadata and scores for each submission
CREATE TABLE survey_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  survey_version TEXT NOT NULL DEFAULT '1.0',
  total_score INTEGER NOT NULL,
  max_possible_score INTEGER NOT NULL DEFAULT 27,
  results_token TEXT NOT NULL UNIQUE, -- UUID for shareable results URL
  is_test BOOLEAN NOT NULL DEFAULT false, -- Flag for E2E test data
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Survey answers table: individual question responses
CREATE TABLE survey_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  response_id UUID NOT NULL REFERENCES survey_responses(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL, -- e.g., "ds_001", "tf_002"
  answer BOOLEAN NOT NULL, -- Yes = true, No = false
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Ensure unique question per response
  UNIQUE(response_id, question_id)
);

-- Indexes for performance
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_email_domain ON leads(email_domain) WHERE email_domain IS NOT NULL;
CREATE INDEX idx_leads_is_test ON leads(is_test) WHERE is_test = true;
CREATE INDEX idx_leads_user_id ON leads(user_id) WHERE user_id IS NOT NULL;

CREATE INDEX idx_responses_token ON survey_responses(results_token);
CREATE INDEX idx_responses_lead_id ON survey_responses(lead_id);
CREATE INDEX idx_responses_version ON survey_responses(survey_version);
CREATE INDEX idx_responses_is_test ON survey_responses(is_test) WHERE is_test = true;
CREATE INDEX idx_responses_completed_at ON survey_responses(completed_at);

CREATE INDEX idx_answers_response_id ON survey_answers(response_id);
CREATE INDEX idx_answers_question_id ON survey_answers(question_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to leads
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comment on tables for documentation
COMMENT ON TABLE leads IS 'Email capture and lead information for survey takers';
COMMENT ON TABLE survey_responses IS 'Survey submission metadata including scores and results token';
COMMENT ON TABLE survey_answers IS 'Individual question responses (27 rows per survey submission)';
COMMENT ON COLUMN leads.is_test IS 'True for E2E test data, auto-cleaned after 24 hours';
COMMENT ON COLUMN leads.email_domain IS 'Extracted work email domain for agency grouping (null for personal emails)';
COMMENT ON COLUMN survey_responses.results_token IS 'UUID token for shareable results URL (/results/{token})';