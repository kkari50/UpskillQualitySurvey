/**
 * Survey Validation Schema Tests
 *
 * Tests for Zod schemas used in survey submission and validation.
 */

import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import {
  leadSchema,
  surveyAnswersSchema,
  surveySubmissionSchema,
  emailCaptureSchema,
  validateAnswer,
  formatZodErrors,
  userRoles,
  agencySizes,
  primarySettings,
  usStates,
} from '../survey'
import { QUESTIONS, CURRENT_VERSION } from '@/data/questions'

/**
 * Helper to create valid answers for all 28 questions
 */
function createValidAnswers(): Record<string, boolean> {
  const answers: Record<string, boolean> = {}
  for (const q of QUESTIONS) {
    answers[q.id] = true
  }
  return answers
}

// =============================================================================
// leadSchema Tests
// =============================================================================

describe('leadSchema', () => {
  it('validates valid lead data', () => {
    const validLead = {
      email: 'user@example.com',
      name: 'John Doe',
      role: 'bcba',
      agencySize: 'medium',
      primarySetting: 'clinic',
      state: 'CA',
      marketingConsent: true,
    }

    const result = leadSchema.safeParse(validLead)
    expect(result.success).toBe(true)
  })

  it('requires valid email', () => {
    const invalidLead = {
      email: 'not-an-email',
    }

    const result = leadSchema.safeParse(invalidLead)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('email')
    }
  })

  it('lowercases email', () => {
    const lead = {
      email: 'USER@EXAMPLE.COM',
    }

    const result = leadSchema.safeParse(lead)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.email).toBe('user@example.com')
    }
  })

  it('rejects email with leading/trailing whitespace (validation before trim)', () => {
    // Zod validates email format before applying trim transformation
    const lead = {
      email: '  user@example.com  ',
    }

    const result = leadSchema.safeParse(lead)
    // Spaces in email cause validation to fail
    expect(result.success).toBe(false)
  })

  it('rejects email longer than 255 characters', () => {
    const longEmail = 'a'.repeat(250) + '@example.com'
    const result = leadSchema.safeParse({ email: longEmail })

    expect(result.success).toBe(false)
  })

  it('allows optional name', () => {
    const result = leadSchema.safeParse({ email: 'user@example.com' })
    expect(result.success).toBe(true)
  })

  it('allows null name', () => {
    const result = leadSchema.safeParse({
      email: 'user@example.com',
      name: null,
    })
    expect(result.success).toBe(true)
  })

  it('rejects name longer than 100 characters', () => {
    const longName = 'a'.repeat(101)
    const result = leadSchema.safeParse({
      email: 'user@example.com',
      name: longName,
    })

    expect(result.success).toBe(false)
  })

  it('validates role enum', () => {
    const validRoles = userRoles

    for (const role of validRoles) {
      const result = leadSchema.safeParse({
        email: 'user@example.com',
        role,
      })
      expect(result.success).toBe(true)
    }
  })

  it('rejects invalid role', () => {
    const result = leadSchema.safeParse({
      email: 'user@example.com',
      role: 'invalid_role',
    })

    expect(result.success).toBe(false)
  })

  it('validates agencySize enum', () => {
    for (const size of agencySizes) {
      const result = leadSchema.safeParse({
        email: 'user@example.com',
        agencySize: size,
      })
      expect(result.success).toBe(true)
    }
  })

  it('validates primarySetting enum', () => {
    for (const setting of primarySettings) {
      const result = leadSchema.safeParse({
        email: 'user@example.com',
        primarySetting: setting,
      })
      expect(result.success).toBe(true)
    }
  })

  it('validates state enum', () => {
    const result = leadSchema.safeParse({
      email: 'user@example.com',
      state: 'CA',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid state', () => {
    const result = leadSchema.safeParse({
      email: 'user@example.com',
      state: 'XX',
    })
    expect(result.success).toBe(false)
  })

  it('defaults marketingConsent to false', () => {
    const result = leadSchema.safeParse({ email: 'user@example.com' })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.marketingConsent).toBe(false)
    }
  })
})

// =============================================================================
// surveyAnswersSchema Tests
// =============================================================================

describe('surveyAnswersSchema', () => {
  it('validates complete answers (28 questions)', () => {
    const answers = createValidAnswers()
    const result = surveyAnswersSchema.safeParse(answers)

    expect(result.success).toBe(true)
  })

  it('rejects answers with less than 28 questions', () => {
    const incompleteAnswers = {
      ds_001: true,
      ds_002: false,
    }

    const result = surveyAnswersSchema.safeParse(incompleteAnswers)
    expect(result.success).toBe(false)
  })

  it('rejects answers with more than 28 questions', () => {
    const answers = createValidAnswers()
    // Add extra question
    answers['extra_001'] = true

    const result = surveyAnswersSchema.safeParse(answers)
    expect(result.success).toBe(false)
  })

  it('rejects non-boolean answer values', () => {
    const answers = createValidAnswers()
    // @ts-expect-error - Testing invalid input
    answers['ds_001'] = 'yes'

    const result = surveyAnswersSchema.safeParse(answers)
    expect(result.success).toBe(false)
  })

  it('validates question ID format (prefix_digits)', () => {
    const invalidIdAnswers = {
      invalid: true,
    }

    const result = surveyAnswersSchema.safeParse(invalidIdAnswers)
    expect(result.success).toBe(false)
  })

  it('accepts valid question ID formats', () => {
    // All question IDs should match pattern: 2-3 lowercase letters + underscore + 3 digits
    const validIds = ['ds_001', 'tf_002', 'da_003', 'cg_004', 'sup_001']

    for (const id of validIds) {
      const singleAnswer = { [id]: true }
      // This tests the record key pattern, not the count refinement
      const result = z
        .record(
          z.string().regex(/^[a-z]{2,3}_\d{3}$/),
          z.boolean()
        )
        .safeParse(singleAnswer)
      expect(result.success).toBe(true)
    }
  })

  it('accepts all true answers', () => {
    const allTrue = createValidAnswers()
    const result = surveyAnswersSchema.safeParse(allTrue)
    expect(result.success).toBe(true)
  })

  it('accepts all false answers', () => {
    const allFalse: Record<string, boolean> = {}
    for (const q of QUESTIONS) {
      allFalse[q.id] = false
    }

    const result = surveyAnswersSchema.safeParse(allFalse)
    expect(result.success).toBe(true)
  })

  it('accepts mixed true/false answers', () => {
    const mixed: Record<string, boolean> = {}
    QUESTIONS.forEach((q, i) => {
      mixed[q.id] = i % 2 === 0
    })

    const result = surveyAnswersSchema.safeParse(mixed)
    expect(result.success).toBe(true)
  })
})

// =============================================================================
// surveySubmissionSchema Tests
// =============================================================================

describe('surveySubmissionSchema', () => {
  it('validates complete submission', () => {
    const submission = {
      lead: {
        email: 'user@example.com',
        name: 'Test User',
      },
      survey: {
        answers: createValidAnswers(),
        surveyVersion: '1.0',
      },
    }

    const result = surveySubmissionSchema.safeParse(submission)
    expect(result.success).toBe(true)
  })

  it('defaults surveyVersion to current version', () => {
    const submission = {
      lead: { email: 'user@example.com' },
      survey: {
        answers: createValidAnswers(),
      },
    }

    const result = surveySubmissionSchema.safeParse(submission)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.survey.surveyVersion).toBe(CURRENT_VERSION)
    }
  })

  it('validates surveyVersion format', () => {
    const submission = {
      lead: { email: 'user@example.com' },
      survey: {
        answers: createValidAnswers(),
        surveyVersion: 'invalid',
      },
    }

    const result = surveySubmissionSchema.safeParse(submission)
    expect(result.success).toBe(false)
  })

  it('accepts valid version formats', () => {
    const validVersions = ['1.0', '1.1', '2.0', '10.15']

    for (const version of validVersions) {
      const submission = {
        lead: { email: 'user@example.com' },
        survey: {
          answers: createValidAnswers(),
          surveyVersion: version,
        },
      }

      const result = surveySubmissionSchema.safeParse(submission)
      expect(result.success).toBe(true)
    }
  })

  it('rejects invalid version formats', () => {
    const invalidVersions = ['v1.0', '1', '1.0.0', 'latest']

    for (const version of invalidVersions) {
      const submission = {
        lead: { email: 'user@example.com' },
        survey: {
          answers: createValidAnswers(),
          surveyVersion: version,
        },
      }

      const result = surveySubmissionSchema.safeParse(submission)
      expect(result.success).toBe(false)
    }
  })

  it('requires lead.email', () => {
    const submission = {
      lead: {},
      survey: {
        answers: createValidAnswers(),
      },
    }

    const result = surveySubmissionSchema.safeParse(submission)
    expect(result.success).toBe(false)
  })

  it('requires survey.answers', () => {
    const submission = {
      lead: { email: 'user@example.com' },
      survey: {},
    }

    const result = surveySubmissionSchema.safeParse(submission)
    expect(result.success).toBe(false)
  })
})

// =============================================================================
// emailCaptureSchema Tests
// =============================================================================

describe('emailCaptureSchema', () => {
  it('validates minimal email input', () => {
    const result = emailCaptureSchema.safeParse({
      email: 'user@example.com',
    })

    expect(result.success).toBe(true)
  })

  it('requires email field', () => {
    const result = emailCaptureSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('rejects empty email', () => {
    const result = emailCaptureSchema.safeParse({ email: '' })
    expect(result.success).toBe(false)
  })

  it('allows empty string for optional fields', () => {
    const result = emailCaptureSchema.safeParse({
      email: 'user@example.com',
      name: '',
      role: '',
      agencySize: '',
      primarySetting: '',
      state: '',
    })

    expect(result.success).toBe(true)
  })
})

// =============================================================================
// validateAnswer Tests
// =============================================================================

describe('validateAnswer', () => {
  it('returns true for valid question ID and boolean answer', () => {
    expect(validateAnswer('ds_001', true)).toBe(true)
    expect(validateAnswer('tf_005', false)).toBe(true)
    expect(validateAnswer('sup_001', true)).toBe(true)
  })

  it('returns false for invalid question ID format', () => {
    expect(validateAnswer('invalid', true)).toBe(false)
    expect(validateAnswer('DS_001', true)).toBe(false)
    expect(validateAnswer('ds_1', true)).toBe(false)
    expect(validateAnswer('ds_0001', true)).toBe(false)
  })

  it('returns false for non-boolean answer', () => {
    expect(validateAnswer('ds_001', 'yes')).toBe(false)
    expect(validateAnswer('ds_001', 1)).toBe(false)
    expect(validateAnswer('ds_001', null)).toBe(false)
    expect(validateAnswer('ds_001', undefined)).toBe(false)
  })

  it('accepts 2-letter prefixes', () => {
    expect(validateAnswer('ds_001', true)).toBe(true)
    expect(validateAnswer('tf_001', true)).toBe(true)
    expect(validateAnswer('da_001', true)).toBe(true)
    expect(validateAnswer('cg_001', true)).toBe(true)
  })

  it('accepts 3-letter prefixes', () => {
    expect(validateAnswer('sup_001', true)).toBe(true)
  })
})

// =============================================================================
// formatZodErrors Tests
// =============================================================================

describe('formatZodErrors', () => {
  it('formats single error correctly', () => {
    const schema = z.object({
      email: z.string().email(),
    })

    const result = schema.safeParse({ email: 'invalid' })
    expect(result.success).toBe(false)

    if (!result.success) {
      const formatted = formatZodErrors(result.error)
      expect(formatted.email).toBeDefined()
      expect(typeof formatted.email).toBe('string')
    }
  })

  it('formats nested path errors correctly', () => {
    const schema = z.object({
      lead: z.object({
        email: z.string().email(),
      }),
    })

    const result = schema.safeParse({ lead: { email: 'invalid' } })
    expect(result.success).toBe(false)

    if (!result.success) {
      const formatted = formatZodErrors(result.error)
      expect(formatted['lead.email']).toBeDefined()
    }
  })

  it('groups multiple errors for same field into array', () => {
    const schema = z.object({
      password: z
        .string()
        .min(8, 'Too short')
        .regex(/[A-Z]/, 'Need uppercase'),
    })

    const result = schema.safeParse({ password: 'ab' })
    expect(result.success).toBe(false)

    if (!result.success) {
      const formatted = formatZodErrors(result.error)
      expect(Array.isArray(formatted.password)).toBe(true)
      expect(formatted.password).toHaveLength(2)
    }
  })

  it('handles multiple fields with errors', () => {
    const schema = z.object({
      email: z.string().email(),
      name: z.string().min(1),
    })

    const result = schema.safeParse({ email: 'invalid', name: '' })
    expect(result.success).toBe(false)

    if (!result.success) {
      const formatted = formatZodErrors(result.error)
      expect(formatted.email).toBeDefined()
      expect(formatted.name).toBeDefined()
    }
  })
})

// =============================================================================
// Enum Constants Tests
// =============================================================================

describe('userRoles constant', () => {
  it('contains expected roles', () => {
    expect(userRoles).toContain('bcba')
    expect(userRoles).toContain('rbt')
    expect(userRoles).toContain('clinical_director')
    expect(userRoles).toContain('owner')
    expect(userRoles).toContain('other')
  })
})

describe('agencySizes constant', () => {
  it('contains expected sizes', () => {
    expect(agencySizes).toContain('solo_small')
    expect(agencySizes).toContain('medium')
    expect(agencySizes).toContain('large')
    expect(agencySizes).toContain('enterprise')
  })
})

describe('primarySettings constant', () => {
  it('contains expected settings', () => {
    expect(primarySettings).toContain('in_home')
    expect(primarySettings).toContain('clinic')
    expect(primarySettings).toContain('school')
    expect(primarySettings).toContain('hybrid')
  })
})

describe('usStates constant', () => {
  it('contains 50 states plus DC', () => {
    expect(usStates).toHaveLength(51)
  })

  it('contains major states', () => {
    expect(usStates).toContain('CA')
    expect(usStates).toContain('TX')
    expect(usStates).toContain('NY')
    expect(usStates).toContain('FL')
    expect(usStates).toContain('DC')
  })
})
