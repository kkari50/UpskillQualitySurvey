/**
 * Survey Questions v1.0
 *
 * Original 27 questions across 5 categories for the
 * Quick Quality Assessment Survey.
 *
 * Source: requirements.md Section 3
 */

import type { Question, SurveyVersion, Category, CategoryId } from './schema'

/**
 * Version metadata for v1.0
 */
export const VERSION: SurveyVersion = {
  version: '1.0',
  releasedAt: '2026-01-15',
  questionIds: [
    // Daily Sessions (7)
    'ds_001', 'ds_002', 'ds_003', 'ds_004', 'ds_005', 'ds_006', 'ds_007',
    // Treatment Fidelity (5)
    'tf_001', 'tf_002', 'tf_003', 'tf_004', 'tf_005',
    // Data Analysis (5)
    'da_001', 'da_002', 'da_003', 'da_004', 'da_005',
    // Caregiver Guidance (6)
    'cg_001', 'cg_002', 'cg_003', 'cg_004', 'cg_005', 'cg_006',
    // Supervision (4)
    'sup_001', 'sup_002', 'sup_003', 'sup_004',
  ],
  maxScore: 27,
  changelog: 'Initial release with 27 questions across 5 categories',
}

/**
 * Category definitions
 */
export const CATEGORIES: Category[] = [
  {
    id: 'daily_sessions',
    name: 'Daily Sessions',
    shortName: 'Sessions',
    description: 'Evaluate session organization, trial counts, and goal implementation',
    questionCount: 7,
    maxScore: 7,
  },
  {
    id: 'treatment_fidelity',
    name: 'Treatment Fidelity',
    shortName: 'Fidelity',
    description: 'Assess adherence to treatment protocols and behavior skills training',
    questionCount: 5,
    maxScore: 5,
  },
  {
    id: 'data_analysis',
    name: 'Data Analysis',
    shortName: 'Data',
    description: 'Review data monitoring and intervention effectiveness practices',
    questionCount: 5,
    maxScore: 5,
  },
  {
    id: 'caregiver_guidance',
    name: 'Caregiver Guidance',
    shortName: 'Caregiver',
    description: 'Evaluate caregiver involvement and communication processes',
    questionCount: 6,
    maxScore: 6,
  },
  {
    id: 'supervision',
    name: 'Supervision',
    shortName: 'Supervision',
    description: 'Assess supervision quality, frequency, and clinical alignment',
    questionCount: 4,
    maxScore: 4,
  },
]

/**
 * All 27 questions for v1.0
 */
export const QUESTIONS: Question[] = [
  // ============================================
  // Category 1: Daily Sessions (7 Questions)
  // ============================================
  {
    id: 'ds_001',
    category: 'daily_sessions',
    text: 'Area is organized and necessary materials are readily available consistently',
    versionAdded: '1.0',
  },
  {
    id: 'ds_002',
    category: 'daily_sessions',
    text: 'Trial count per hour is at least 50 trials on average',
    versionAdded: '1.0',
  },
  {
    id: 'ds_003',
    category: 'daily_sessions',
    text: 'Each goal opened is run to trial criterion (e.g., 10)',
    versionAdded: '1.0',
  },
  {
    id: 'ds_004',
    category: 'daily_sessions',
    text: 'Each goal is implemented at least once a session',
    versionAdded: '1.0',
  },
  {
    id: 'ds_005',
    category: 'daily_sessions',
    text: 'Preference assessments are completed at least once a week',
    versionAdded: '1.0',
  },
  {
    id: 'ds_006',
    category: 'daily_sessions',
    text: 'The SD, prompting strategy, reinforcement schedules, and target lists are available for all open goals',
    versionAdded: '1.0',
  },
  {
    id: 'ds_007',
    category: 'daily_sessions',
    text: 'All BT/RBTs are familiar with all the goals and with the client on a consistent basis',
    versionAdded: '1.0',
  },

  // ============================================
  // Category 2: Treatment Fidelity (5 Questions)
  // ============================================
  {
    id: 'tf_001',
    category: 'treatment_fidelity',
    text: 'Fidelity checks for skill acquisition goals are implemented at least every two weeks',
    versionAdded: '1.0',
  },
  {
    id: 'tf_002',
    category: 'treatment_fidelity',
    text: 'All new goals are introduced using Behavior Skills Training (BST) with BT/RBTs',
    versionAdded: '1.0',
  },
  {
    id: 'tf_003',
    category: 'treatment_fidelity',
    text: 'Challenging behavior targets have treatment fidelity checklists for each component of the behavior plan (e.g., NCR, DRO, FCT)',
    versionAdded: '1.0',
  },
  {
    id: 'tf_004',
    category: 'treatment_fidelity',
    text: 'The implementation of the behavior plan is presented utilizing BST',
    versionAdded: '1.0',
  },
  {
    id: 'tf_005',
    category: 'treatment_fidelity',
    text: 'The implementation of the behavior intervention plan is monitored with treatment fidelity checklists at least twice a month',
    versionAdded: '1.0',
  },

  // ============================================
  // Category 3: Data Analysis (5 Questions)
  // ============================================
  {
    id: 'da_001',
    category: 'data_analysis',
    text: 'There is a standardized approach to ensure that all clinicians review skill acquisition data every 10 sessions',
    versionAdded: '1.0',
  },
  {
    id: 'da_002',
    category: 'data_analysis',
    text: 'There is a standardized approach for BT/RBTs to alert their supervisors of a problematic goal',
    versionAdded: '1.0',
  },
  {
    id: 'da_003',
    category: 'data_analysis',
    text: 'The percentage of goals mastered for current treatment plan goals are monitored as an organization metric; goals that continue into the next authorization period have had any barriers identified, resolved, and have had protocols modified',
    versionAdded: '1.0',
  },
  {
    id: 'da_004',
    category: 'data_analysis',
    text: 'There is a standardized way to determine the effectiveness of challenging behavior interventions',
    versionAdded: '1.0',
  },
  {
    id: 'da_005',
    category: 'data_analysis',
    text: 'The interventions selected for challenging behavior have reduced challenging behavior to a desired level',
    versionAdded: '1.0',
  },

  // ============================================
  // Category 4: Caregiver Guidance (6 Questions)
  // ============================================
  {
    id: 'cg_001',
    category: 'caregiver_guidance',
    text: 'Caregiver guidance happens at least once a month',
    versionAdded: '1.0',
  },
  {
    id: 'cg_002',
    category: 'caregiver_guidance',
    text: 'There is good adherence to caregiver goals',
    versionAdded: '1.0',
  },
  {
    id: 'cg_003',
    category: 'caregiver_guidance',
    text: 'The agency conducts caregiver satisfaction surveys every six months',
    versionAdded: '1.0',
  },
  {
    id: 'cg_004',
    category: 'caregiver_guidance',
    text: 'The agency has a structured monthly update interview form to review items such as medication changes with caregivers',
    versionAdded: '1.0',
  },
  {
    id: 'cg_005',
    category: 'caregiver_guidance',
    text: 'The initial caregiver interview includes an area for caregivers to express their concerns',
    versionAdded: '1.0',
  },
  {
    id: 'cg_006',
    category: 'caregiver_guidance',
    text: 'The initial assessment and the 6-month reassessment include a quality of life measure',
    versionAdded: '1.0',
  },

  // ============================================
  // Category 5: Supervision (4 Questions)
  // ============================================
  {
    id: 'sup_001',
    category: 'supervision',
    text: 'BCBAs arrive to supervision sessions with a structured plan',
    versionAdded: '1.0',
  },
  {
    id: 'sup_002',
    category: 'supervision',
    text: 'Supervision sessions involve BST with BT/RBTs',
    versionAdded: '1.0',
  },
  {
    id: 'sup_003',
    category: 'supervision',
    text: 'Supervision happens at least twice a month',
    versionAdded: '1.0',
  },
  {
    id: 'sup_004',
    category: 'supervision',
    text: 'The percentage of supervision is in alignment with what is clinically necessary',
    versionAdded: '1.0',
  },
]

/**
 * Get questions by category
 */
export function getQuestionsByCategory(categoryId: CategoryId): Question[] {
  return QUESTIONS.filter((q) => q.category === categoryId)
}

/**
 * Get category by ID
 */
export function getCategoryById(categoryId: CategoryId): Category | undefined {
  return CATEGORIES.find((c) => c.id === categoryId)
}

/**
 * Get question by ID
 */
export function getQuestionById(questionId: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === questionId)
}

/**
 * Get category for a question
 */
export function getCategoryForQuestion(questionId: string): Category | undefined {
  const question = getQuestionById(questionId)
  if (!question) return undefined
  return getCategoryById(question.category)
}

/**
 * Validate that all required questions are answered
 */
export function validateAnswers(answers: Record<string, boolean>): {
  valid: boolean
  missing: string[]
  extra: string[]
} {
  const requiredIds = new Set(VERSION.questionIds)
  const providedIds = new Set(Object.keys(answers))

  const missing = [...requiredIds].filter((id) => !providedIds.has(id))
  const extra = [...providedIds].filter((id) => !requiredIds.has(id))

  return {
    valid: missing.length === 0 && extra.length === 0,
    missing,
    extra,
  }
}
