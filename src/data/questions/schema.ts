/**
 * Question Schema Types
 *
 * Defines the structure for survey questions and categories.
 * Used across the application for type safety.
 */

/**
 * Category identifiers for the 5 survey domains
 */
export type CategoryId =
  | 'daily_sessions'
  | 'treatment_fidelity'
  | 'data_analysis'
  | 'caregiver_guidance'
  | 'supervision'

/**
 * Category metadata
 */
export interface Category {
  id: CategoryId
  name: string
  shortName: string
  description: string
  questionCount: number
  maxScore: number
}

/**
 * Individual survey question
 */
export interface Question {
  /** Stable identifier, never changes (e.g., "ds_001") */
  id: string
  /** Category this question belongs to */
  category: CategoryId
  /** Full question text */
  text: string
  /** Version when this question was added */
  versionAdded: string
  /** Version when deprecated (if applicable) */
  versionDeprecated?: string
  /** If question was significantly reworded, reference to replacement */
  replacedBy?: string
}

/**
 * Survey version metadata
 */
export interface SurveyVersion {
  /** Version string (e.g., "1.0", "1.1") */
  version: string
  /** ISO date when released */
  releasedAt: string
  /** Array of active question IDs in this version */
  questionIds: string[]
  /** Total possible score */
  maxScore: number
  /** Optional changelog description */
  changelog?: string
}

/**
 * Survey answers as a record of question ID to boolean
 */
export type SurveyAnswers = Record<string, boolean>

/**
 * Calculated scores for a survey response
 */
export interface SurveyScores {
  /** Total score (sum of Yes answers) */
  total: number
  /** Maximum possible score */
  maxPossible: number
  /** Percentage (0-100) */
  percentage: number
  /** Per-category breakdown */
  categories: CategoryScore[]
}

/**
 * Score for a single category
 */
export interface CategoryScore {
  categoryId: CategoryId
  categoryName: string
  score: number
  maxScore: number
  percentage: number
}

/**
 * Performance level based on score percentage
 */
export type PerformanceLevel = 'strong' | 'moderate' | 'needs_improvement'

/**
 * Performance thresholds
 */
export const PERFORMANCE_THRESHOLDS = {
  strong: { min: 90, label: 'Strong Alignment', color: 'emerald' },
  moderate: { min: 70, label: 'Moderate Alignment', color: 'amber' },
  needs_improvement: { min: 0, label: 'Needs Improvement', color: 'rose' },
} as const

/**
 * Get performance level from percentage
 */
export function getPerformanceLevel(percentage: number): PerformanceLevel {
  if (percentage >= PERFORMANCE_THRESHOLDS.strong.min) return 'strong'
  if (percentage >= PERFORMANCE_THRESHOLDS.moderate.min) return 'moderate'
  return 'needs_improvement'
}

/**
 * Get performance label from percentage
 */
export function getPerformanceLabel(percentage: number): string {
  const level = getPerformanceLevel(percentage)
  return PERFORMANCE_THRESHOLDS[level].label
}

/**
 * Get performance color from percentage
 */
export function getPerformanceColor(percentage: number): string {
  const level = getPerformanceLevel(percentage)
  return PERFORMANCE_THRESHOLDS[level].color
}
