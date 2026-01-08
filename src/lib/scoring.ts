/**
 * Scoring Utility
 *
 * Calculates survey scores from answers.
 * Used by API routes and results pages.
 */

import type {
  SurveyAnswers,
  SurveyScores,
  CategoryScore,
  CategoryId,
  PerformanceLevel,
} from '@/data/questions/schema'
import {
  CATEGORIES,
  QUESTIONS,
  VERSION,
  getQuestionsByCategory,
} from '@/data/questions'
import {
  getPerformanceLevel,
  getPerformanceLabel,
  getPerformanceColor,
} from '@/data/questions/schema'

/**
 * Calculate complete survey scores from answers
 *
 * @param answers - Record of question ID to boolean answer
 * @returns Complete scores breakdown including total and per-category
 */
export function calculateScores(answers: SurveyAnswers): SurveyScores {
  // Calculate total score (count of Yes/true answers)
  const total = Object.values(answers).filter(Boolean).length
  const maxPossible = VERSION.maxScore
  const percentage = Math.round((total / maxPossible) * 100)

  // Calculate per-category scores
  const categories: CategoryScore[] = CATEGORIES.map((category) => {
    const categoryQuestions = getQuestionsByCategory(category.id)
    const categoryAnswers = categoryQuestions.map((q) => answers[q.id])
    const score = categoryAnswers.filter(Boolean).length

    return {
      categoryId: category.id,
      categoryName: category.name,
      score,
      maxScore: category.maxScore,
      percentage: Math.round((score / category.maxScore) * 100),
    }
  })

  return {
    total,
    maxPossible,
    percentage,
    categories,
  }
}

/**
 * Calculate score for a single category
 *
 * @param answers - Record of question ID to boolean answer
 * @param categoryId - Category to calculate score for
 * @returns Category score breakdown
 */
export function calculateCategoryScore(
  answers: SurveyAnswers,
  categoryId: CategoryId
): CategoryScore | null {
  const category = CATEGORIES.find((c) => c.id === categoryId)
  if (!category) return null

  const categoryQuestions = getQuestionsByCategory(categoryId)
  const categoryAnswers = categoryQuestions.map((q) => answers[q.id])
  const score = categoryAnswers.filter(Boolean).length

  return {
    categoryId: category.id,
    categoryName: category.name,
    score,
    maxScore: category.maxScore,
    percentage: Math.round((score / category.maxScore) * 100),
  }
}

/**
 * Get gaps (questions answered "No") with category info
 *
 * @param answers - Record of question ID to boolean answer
 * @returns Array of gap questions with their category
 */
export function getGaps(answers: SurveyAnswers): Array<{
  questionId: string
  questionText: string
  categoryId: CategoryId
  categoryName: string
}> {
  const gaps: Array<{
    questionId: string
    questionText: string
    categoryId: CategoryId
    categoryName: string
  }> = []

  for (const question of QUESTIONS) {
    if (answers[question.id] === false) {
      const category = CATEGORIES.find((c) => c.id === question.category)
      gaps.push({
        questionId: question.id,
        questionText: question.text,
        categoryId: question.category,
        categoryName: category?.name ?? question.category,
      })
    }
  }

  return gaps
}

/**
 * Get gaps grouped by category
 *
 * @param answers - Record of question ID to boolean answer
 * @returns Map of category ID to array of gap question texts
 */
export function getGapsByCategory(
  answers: SurveyAnswers
): Map<CategoryId, string[]> {
  const gapsByCategory = new Map<CategoryId, string[]>()

  for (const category of CATEGORIES) {
    gapsByCategory.set(category.id, [])
  }

  const gaps = getGaps(answers)
  for (const gap of gaps) {
    const categoryGaps = gapsByCategory.get(gap.categoryId) ?? []
    categoryGaps.push(gap.questionText)
    gapsByCategory.set(gap.categoryId, categoryGaps)
  }

  return gapsByCategory
}

/**
 * Calculate percentile rank given a score and score distribution
 *
 * @param score - The score to rank
 * @param distribution - Array of [score, count] pairs
 * @returns Percentile (0-100)
 */
export function calculatePercentile(
  score: number,
  distribution: Array<{ score: number; count: number }>
): number {
  const totalResponses = distribution.reduce((sum, d) => sum + d.count, 0)

  if (totalResponses === 0) return 50 // Default to median if no data

  // Count responses below this score
  const belowCount = distribution
    .filter((d) => d.score < score)
    .reduce((sum, d) => sum + d.count, 0)

  // Count responses at this score
  const atCount = distribution.find((d) => d.score === score)?.count ?? 0

  // Percentile using mid-rank method: (below + 0.5 * at) / total * 100
  const percentile = ((belowCount + 0.5 * atCount) / totalResponses) * 100

  return Math.round(percentile)
}

/**
 * Get score summary with performance level info
 *
 * @param scores - Calculated survey scores
 * @returns Summary object with labels and colors
 */
export function getScoreSummary(scores: SurveyScores): {
  total: number
  maxPossible: number
  percentage: number
  level: PerformanceLevel
  label: string
  color: string
  categories: Array<{
    id: CategoryId
    name: string
    score: number
    maxScore: number
    percentage: number
    level: PerformanceLevel
    label: string
    color: string
  }>
} {
  return {
    total: scores.total,
    maxPossible: scores.maxPossible,
    percentage: scores.percentage,
    level: getPerformanceLevel(scores.percentage),
    label: getPerformanceLabel(scores.percentage),
    color: getPerformanceColor(scores.percentage),
    categories: scores.categories.map((cat) => ({
      id: cat.categoryId,
      name: cat.categoryName,
      score: cat.score,
      maxScore: cat.maxScore,
      percentage: cat.percentage,
      level: getPerformanceLevel(cat.percentage),
      label: getPerformanceLabel(cat.percentage),
      color: getPerformanceColor(cat.percentage),
    })),
  }
}

// Re-export performance level utilities for convenience
export { getPerformanceLevel, getPerformanceLabel, getPerformanceColor }
