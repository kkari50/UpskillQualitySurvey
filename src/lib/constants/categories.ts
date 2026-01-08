/**
 * Category Constants
 *
 * Display order and UI-related category metadata.
 */

import type { CategoryId } from '@/data/questions/schema'

export type { CategoryId }

/**
 * Category display order (for rendering in UI)
 */
export const CATEGORY_ORDER: CategoryId[] = [
  'daily_sessions',
  'treatment_fidelity',
  'data_analysis',
  'caregiver_guidance',
  'supervision',
]

/**
 * Category display metadata
 */
export const CATEGORIES: Record<CategoryId, { displayName: string; shortName: string }> = {
  daily_sessions: { displayName: 'Daily Sessions', shortName: 'Sessions' },
  treatment_fidelity: { displayName: 'Treatment Fidelity', shortName: 'Fidelity' },
  data_analysis: { displayName: 'Data Analysis', shortName: 'Data' },
  caregiver_guidance: { displayName: 'Caregiver Guidance', shortName: 'Caregiver' },
  supervision: { displayName: 'Supervision', shortName: 'Supervision' },
}

/**
 * Category icons (Lucide icon names)
 */
export const CATEGORY_ICONS: Record<CategoryId, string> = {
  daily_sessions: 'Calendar',
  treatment_fidelity: 'ClipboardCheck',
  data_analysis: 'BarChart3',
  caregiver_guidance: 'Users',
  supervision: 'UserCheck',
}

/**
 * Category colors (Tailwind color names for accents)
 */
export const CATEGORY_COLORS: Record<CategoryId, string> = {
  daily_sessions: 'teal',
  treatment_fidelity: 'blue',
  data_analysis: 'purple',
  caregiver_guidance: 'orange',
  supervision: 'emerald',
}

/**
 * Category question ID prefixes
 */
export const CATEGORY_PREFIXES: Record<CategoryId, string> = {
  daily_sessions: 'ds',
  treatment_fidelity: 'tf',
  data_analysis: 'da',
  caregiver_guidance: 'cg',
  supervision: 'sup',
}

/**
 * Get category ID from question ID prefix
 */
export function getCategoryFromQuestionId(questionId: string): CategoryId | null {
  const prefix = questionId.split('_')[0]

  for (const [categoryId, categoryPrefix] of Object.entries(CATEGORY_PREFIXES)) {
    if (prefix === categoryPrefix) {
      return categoryId as CategoryId
    }
  }

  return null
}

/**
 * Get the display index for a category (1-based)
 */
export function getCategoryIndex(categoryId: CategoryId): number {
  return CATEGORY_ORDER.indexOf(categoryId) + 1
}

/**
 * Check if this is the first question of a category
 */
export function isFirstQuestionOfCategory(
  questionId: string,
  previousQuestionId: string | null
): boolean {
  if (!previousQuestionId) return true

  const currentCategory = getCategoryFromQuestionId(questionId)
  const previousCategory = getCategoryFromQuestionId(previousQuestionId)

  return currentCategory !== previousCategory
}
