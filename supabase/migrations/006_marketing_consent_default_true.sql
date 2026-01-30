-- Change marketing_consent default from false to true
-- Marketing consent is now granted by default upon survey submission.
-- The opt-in checkbox has been removed from the email capture form.
ALTER TABLE leads ALTER COLUMN marketing_consent SET DEFAULT true;
