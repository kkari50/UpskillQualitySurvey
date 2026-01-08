/**
 * Questions Index
 *
 * Exports the current active version of survey questions.
 * Import from this file for application use.
 *
 * To access a specific version directly, import from that version file:
 * import { QUESTIONS } from './v1.0'
 */

// Re-export types
export type {
  CategoryId,
  Category,
  Question,
  SurveyVersion,
  SurveyAnswers,
  SurveyScores,
  CategoryScore,
  PerformanceLevel,
} from './schema'

// Re-export utility functions from schema
export {
  PERFORMANCE_THRESHOLDS,
  getPerformanceLevel,
  getPerformanceLabel,
  getPerformanceColor,
} from './schema'

// Export current version (v1.0)
export {
  VERSION,
  CATEGORIES,
  QUESTIONS,
  getQuestionsByCategory,
  getCategoryById,
  getQuestionById,
  getCategoryForQuestion,
  validateAnswers,
} from './v1.0'

// For reference to previous versions (when we have them)
export { VERSION as VERSION_1_0, QUESTIONS as QUESTIONS_1_0 } from './v1.0'

/**
 * Current survey version string
 */
export const CURRENT_VERSION = '1.0'

/**
 * Total number of questions in current version
 */
export const TOTAL_QUESTIONS = 27

/**
 * Total number of categories
 */
export const TOTAL_CATEGORIES = 5
