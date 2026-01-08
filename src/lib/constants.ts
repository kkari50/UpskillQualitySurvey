/**
 * Application Constants
 *
 * Central location for app-wide constants.
 */

// App metadata
export const APP_NAME = 'Quick Quality Assessment'
export const APP_DESCRIPTION =
  'A self-assessment tool for ABA agencies to evaluate clinical quality practices'
export const APP_BRAND = 'UpskillABA'

// URLs
export const APP_URL = process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'
export const BRAND_URL = 'https://upskillaba.com'

// Privacy & Stats thresholds
export const MIN_RESPONSES_FOR_STATS = 10 // Minimum responses before showing population comparison
export const STATS_STALE_HOURS = 1 // Materialized views refresh hourly

// Rate limits (requests per minute)
export const RATE_LIMIT_SURVEY_SUBMIT = 10
export const RATE_LIMIT_STATS = 60
export const RATE_LIMIT_PDF_GENERATE = 5

// Survey metadata
export const SURVEY_ESTIMATED_MINUTES = 5
export const SURVEY_QUESTION_COUNT = 27
export const SURVEY_CATEGORY_COUNT = 5
