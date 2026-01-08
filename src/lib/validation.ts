/**
 * Validation Schemas
 *
 * Re-export validation schemas from organized modules.
 * Import from this file for convenience.
 */

// Re-export survey validation schemas
export {
  userRoles,
  leadSchema,
  surveyAnswersSchema,
  surveySubmissionSchema,
  emailCaptureSchema,
  statsQuerySchema,
  percentileQuerySchema,
  resultsTokenSchema,
  validateAnswer,
  formatZodErrors,
  type UserRole,
  type LeadInput,
  type SurveyAnswersInput,
  type SurveySubmissionInput,
  type EmailCaptureInput,
  type StatsQueryInput,
  type PercentileQueryInput,
  type ResultsTokenInput,
} from './validation/survey'
