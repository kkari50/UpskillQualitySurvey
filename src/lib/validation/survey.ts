/**
 * Survey Validation Schemas
 *
 * Zod schemas for validating survey submissions and API requests.
 */

import { z } from 'zod'
import { TOTAL_QUESTIONS, CURRENT_VERSION } from '@/data/questions'

/**
 * Valid user roles (matches database enum)
 */
export const userRoles = [
  'clinical_director',
  'bcba',
  'bcaba',
  'rbt',
  'owner',
  'qa_manager',
  'consultant',
  'other',
] as const

export type UserRole = (typeof userRoles)[number]

/**
 * Question ID format: 2-3 lowercase letters followed by underscore and 3 digits
 * Examples: ds_001, tf_002, cg_006, sup_001
 */
const questionIdPattern = /^[a-z]{2,3}_\d{3}$/

/**
 * Survey version format: major.minor
 * Examples: 1.0, 1.1, 2.0
 */
const surveyVersionPattern = /^\d+\.\d+$/

/**
 * Lead/Email capture schema
 */
export const leadSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be 255 characters or less')
    .toLowerCase()
    .trim(),
  name: z
    .string()
    .max(100, 'Name must be 100 characters or less')
    .trim()
    .optional()
    .nullable(),
  role: z.enum(userRoles).optional().nullable(),
  marketingConsent: z.boolean().default(false),
})

export type LeadInput = z.infer<typeof leadSchema>

/**
 * Survey answers schema
 * Validates that all questions are answered with boolean values
 */
export const surveyAnswersSchema = z
  .record(
    z.string().regex(questionIdPattern, 'Invalid question ID format'),
    z.boolean()
  )
  .refine((obj) => Object.keys(obj).length === TOTAL_QUESTIONS, {
    message: `All ${TOTAL_QUESTIONS} questions must be answered`,
  })

export type SurveyAnswersInput = z.infer<typeof surveyAnswersSchema>

/**
 * Survey submission schema (for API route)
 */
export const surveySubmissionSchema = z.object({
  lead: leadSchema,
  survey: z.object({
    answers: surveyAnswersSchema,
    surveyVersion: z
      .string()
      .regex(surveyVersionPattern, 'Invalid version format')
      .default(CURRENT_VERSION),
  }),
})

export type SurveySubmissionInput = z.infer<typeof surveySubmissionSchema>

/**
 * Email capture form schema (simpler, for frontend form)
 */
export const emailCaptureSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email must be 255 characters or less')
    .toLowerCase()
    .trim(),
  name: z
    .string()
    .max(100, 'Name must be 100 characters or less')
    .trim()
    .optional()
    .or(z.literal('')),
  role: z.enum(userRoles).optional().or(z.literal('')),
  marketingConsent: z.boolean().default(false),
})

export type EmailCaptureInput = z.infer<typeof emailCaptureSchema>

/**
 * Stats query parameters schema
 */
export const statsQuerySchema = z.object({
  version: z
    .string()
    .regex(surveyVersionPattern, 'Invalid version format')
    .default(CURRENT_VERSION),
})

export type StatsQueryInput = z.infer<typeof statsQuerySchema>

/**
 * Percentile query parameters schema
 */
export const percentileQuerySchema = z.object({
  score: z.coerce
    .number()
    .int()
    .min(0, 'Score must be at least 0')
    .max(TOTAL_QUESTIONS, `Score cannot exceed ${TOTAL_QUESTIONS}`),
  version: z
    .string()
    .regex(surveyVersionPattern, 'Invalid version format')
    .default(CURRENT_VERSION),
})

export type PercentileQueryInput = z.infer<typeof percentileQuerySchema>

/**
 * Results token parameter schema
 */
export const resultsTokenSchema = z.object({
  token: z.string().uuid('Invalid results token'),
})

export type ResultsTokenInput = z.infer<typeof resultsTokenSchema>

/**
 * Validate a single question answer
 */
export function validateAnswer(questionId: string, answer: unknown): boolean {
  if (!questionIdPattern.test(questionId)) return false
  return typeof answer === 'boolean'
}

/**
 * Extract Zod validation errors into a simple field -> message map
 */
export function formatZodErrors(
  error: z.ZodError
): Record<string, string | string[]> {
  const fieldErrors: Record<string, string | string[]> = {}

  for (const issue of error.issues) {
    const path = issue.path.join('.')
    if (fieldErrors[path]) {
      const existing = fieldErrors[path]
      if (Array.isArray(existing)) {
        existing.push(issue.message)
      } else {
        fieldErrors[path] = [existing, issue.message]
      }
    } else {
      fieldErrors[path] = issue.message
    }
  }

  return fieldErrors
}
