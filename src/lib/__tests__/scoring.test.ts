/**
 * Scoring Utility Tests
 *
 * Tests for survey score calculation functions.
 */

import { describe, it, expect } from 'vitest'
import {
  calculateScores,
  calculateCategoryScore,
  getGaps,
  getGapsByCategory,
  calculatePercentile,
  getScoreSummary,
  getPerformanceLevel,
  getPerformanceLabel,
  getPerformanceColor,
} from '../scoring'
import type { SurveyAnswers } from '@/data/questions/schema'
import { QUESTIONS, VERSION } from '@/data/questions'

/**
 * Helper to create all-Yes answers
 */
function createAllYesAnswers(): SurveyAnswers {
  const answers: SurveyAnswers = {}
  for (const q of QUESTIONS) {
    answers[q.id] = true
  }
  return answers
}

/**
 * Helper to create all-No answers
 */
function createAllNoAnswers(): SurveyAnswers {
  const answers: SurveyAnswers = {}
  for (const q of QUESTIONS) {
    answers[q.id] = false
  }
  return answers
}

/**
 * Helper to create mixed answers with specific count of Yes
 */
function createMixedAnswers(yesCount: number): SurveyAnswers {
  const answers: SurveyAnswers = {}
  QUESTIONS.forEach((q, index) => {
    answers[q.id] = index < yesCount
  })
  return answers
}

// =============================================================================
// calculateScores Tests
// =============================================================================

describe('calculateScores', () => {
  it('returns perfect score (28/28, 100%) when all answers are Yes', () => {
    const answers = createAllYesAnswers()
    const scores = calculateScores(answers)

    expect(scores.total).toBe(28)
    expect(scores.maxPossible).toBe(28)
    expect(scores.percentage).toBe(100)
    expect(scores.categories).toHaveLength(5)
  })

  it('returns zero score (0/28, 0%) when all answers are No', () => {
    const answers = createAllNoAnswers()
    const scores = calculateScores(answers)

    expect(scores.total).toBe(0)
    expect(scores.maxPossible).toBe(28)
    expect(scores.percentage).toBe(0)
  })

  it('calculates correct total for mixed answers', () => {
    const answers = createMixedAnswers(14) // Half Yes
    const scores = calculateScores(answers)

    expect(scores.total).toBe(14)
    expect(scores.percentage).toBe(50)
  })

  it('calculates correct per-category scores when all Yes', () => {
    const answers = createAllYesAnswers()
    const scores = calculateScores(answers)

    // Verify each category has correct maxScore
    const dailySessions = scores.categories.find(
      (c) => c.categoryId === 'daily_sessions'
    )
    expect(dailySessions?.score).toBe(7)
    expect(dailySessions?.maxScore).toBe(7)
    expect(dailySessions?.percentage).toBe(100)

    const treatmentFidelity = scores.categories.find(
      (c) => c.categoryId === 'treatment_fidelity'
    )
    expect(treatmentFidelity?.score).toBe(5)
    expect(treatmentFidelity?.maxScore).toBe(5)

    const dataAnalysis = scores.categories.find(
      (c) => c.categoryId === 'data_analysis'
    )
    expect(dataAnalysis?.score).toBe(6)
    expect(dataAnalysis?.maxScore).toBe(6)

    const caregiverGuidance = scores.categories.find(
      (c) => c.categoryId === 'caregiver_guidance'
    )
    expect(caregiverGuidance?.score).toBe(6)
    expect(caregiverGuidance?.maxScore).toBe(6)

    const supervision = scores.categories.find(
      (c) => c.categoryId === 'supervision'
    )
    expect(supervision?.score).toBe(4)
    expect(supervision?.maxScore).toBe(4)
  })

  it('returns correct category scores when all No', () => {
    const answers = createAllNoAnswers()
    const scores = calculateScores(answers)

    for (const category of scores.categories) {
      expect(category.score).toBe(0)
      expect(category.percentage).toBe(0)
    }
  })

  it('handles empty answers object (all undefined)', () => {
    const answers: SurveyAnswers = {}
    const scores = calculateScores(answers)

    expect(scores.total).toBe(0)
    expect(scores.percentage).toBe(0)
  })

  it('uses VERSION.maxScore for maxPossible', () => {
    const answers = createAllYesAnswers()
    const scores = calculateScores(answers)

    expect(scores.maxPossible).toBe(VERSION.maxScore)
  })
})

// =============================================================================
// calculateCategoryScore Tests
// =============================================================================

describe('calculateCategoryScore', () => {
  it('returns correct score for daily_sessions category', () => {
    const answers = createAllYesAnswers()
    const result = calculateCategoryScore(answers, 'daily_sessions')

    expect(result).not.toBeNull()
    expect(result?.categoryId).toBe('daily_sessions')
    expect(result?.categoryName).toBe('Daily Sessions')
    expect(result?.score).toBe(7)
    expect(result?.maxScore).toBe(7)
    expect(result?.percentage).toBe(100)
  })

  it('returns null for invalid category ID', () => {
    const answers = createAllYesAnswers()
    // @ts-expect-error - Testing invalid input
    const result = calculateCategoryScore(answers, 'invalid_category')

    expect(result).toBeNull()
  })

  it('calculates 0% for category with all No answers', () => {
    const answers = createAllNoAnswers()
    const result = calculateCategoryScore(answers, 'supervision')

    expect(result?.score).toBe(0)
    expect(result?.percentage).toBe(0)
  })

  it('calculates partial score correctly', () => {
    // Create answers with only first 2 daily_sessions questions as Yes
    const answers = createAllNoAnswers()
    answers['ds_001'] = true
    answers['ds_002'] = true

    const result = calculateCategoryScore(answers, 'daily_sessions')

    expect(result?.score).toBe(2)
    expect(result?.percentage).toBe(29) // 2/7 = 28.57% rounds to 29%
  })
})

// =============================================================================
// getGaps Tests
// =============================================================================

describe('getGaps', () => {
  it('returns empty array when all answers are Yes', () => {
    const answers = createAllYesAnswers()
    const gaps = getGaps(answers)

    expect(gaps).toHaveLength(0)
  })

  it('returns all 28 questions as gaps when all answers are No', () => {
    const answers = createAllNoAnswers()
    const gaps = getGaps(answers)

    expect(gaps).toHaveLength(28)
  })

  it('returns correct gap structure with category info', () => {
    const answers = createAllYesAnswers()
    answers['ds_001'] = false // Make one gap

    const gaps = getGaps(answers)

    expect(gaps).toHaveLength(1)
    expect(gaps[0].questionId).toBe('ds_001')
    expect(gaps[0].categoryId).toBe('daily_sessions')
    expect(gaps[0].categoryName).toBe('Daily Sessions')
    expect(gaps[0].questionText).toBeDefined()
  })

  it('includes question text from QUESTIONS array', () => {
    const answers = createAllYesAnswers()
    answers['tf_001'] = false

    const gaps = getGaps(answers)
    const tfQuestion = QUESTIONS.find((q) => q.id === 'tf_001')

    expect(gaps[0].questionText).toBe(tfQuestion?.text)
  })

  it('does not include undefined answers as gaps', () => {
    // Only some answers provided
    const answers: SurveyAnswers = {
      ds_001: true,
      ds_002: false,
    }

    const gaps = getGaps(answers)

    // Only ds_002 is explicitly false
    expect(gaps).toHaveLength(1)
    expect(gaps[0].questionId).toBe('ds_002')
  })
})

// =============================================================================
// getGapsByCategory Tests
// =============================================================================

describe('getGapsByCategory', () => {
  it('returns Map with all category keys', () => {
    const answers = createAllYesAnswers()
    const gapsByCategory = getGapsByCategory(answers)

    expect(gapsByCategory.size).toBe(5)
    expect(gapsByCategory.has('daily_sessions')).toBe(true)
    expect(gapsByCategory.has('treatment_fidelity')).toBe(true)
    expect(gapsByCategory.has('data_analysis')).toBe(true)
    expect(gapsByCategory.has('caregiver_guidance')).toBe(true)
    expect(gapsByCategory.has('supervision')).toBe(true)
  })

  it('returns empty arrays for all categories when all Yes', () => {
    const answers = createAllYesAnswers()
    const gapsByCategory = getGapsByCategory(answers)

    for (const [, gaps] of gapsByCategory) {
      expect(gaps).toHaveLength(0)
    }
  })

  it('returns all questions as gaps per category when all No', () => {
    const answers = createAllNoAnswers()
    const gapsByCategory = getGapsByCategory(answers)

    expect(gapsByCategory.get('daily_sessions')).toHaveLength(7)
    expect(gapsByCategory.get('treatment_fidelity')).toHaveLength(5)
    expect(gapsByCategory.get('data_analysis')).toHaveLength(6)
    expect(gapsByCategory.get('caregiver_guidance')).toHaveLength(6)
    expect(gapsByCategory.get('supervision')).toHaveLength(4)
  })

  it('correctly groups gaps by category', () => {
    const answers = createAllYesAnswers()
    answers['ds_001'] = false
    answers['tf_002'] = false
    answers['sup_001'] = false

    const gapsByCategory = getGapsByCategory(answers)

    expect(gapsByCategory.get('daily_sessions')).toHaveLength(1)
    expect(gapsByCategory.get('treatment_fidelity')).toHaveLength(1)
    expect(gapsByCategory.get('supervision')).toHaveLength(1)
    expect(gapsByCategory.get('data_analysis')).toHaveLength(0)
    expect(gapsByCategory.get('caregiver_guidance')).toHaveLength(0)
  })

  it('stores question texts, not IDs', () => {
    const answers = createAllYesAnswers()
    answers['ds_001'] = false

    const gapsByCategory = getGapsByCategory(answers)
    const dsGaps = gapsByCategory.get('daily_sessions')
    const dsQuestion = QUESTIONS.find((q) => q.id === 'ds_001')

    expect(dsGaps?.[0]).toBe(dsQuestion?.text)
  })
})

// =============================================================================
// calculatePercentile Tests
// =============================================================================

describe('calculatePercentile', () => {
  it('returns 50 (median) when distribution is empty', () => {
    const percentile = calculatePercentile(15, [])

    expect(percentile).toBe(50)
  })

  it('calculates percentile correctly for simple distribution', () => {
    // 10 responses: 5 scored 10, 5 scored 20
    const distribution = [
      { score: 10, count: 5 },
      { score: 20, count: 5 },
    ]

    // Score of 10: 0 below, 5 at = (0 + 2.5) / 10 * 100 = 25%
    expect(calculatePercentile(10, distribution)).toBe(25)

    // Score of 20: 5 below, 5 at = (5 + 2.5) / 10 * 100 = 75%
    expect(calculatePercentile(20, distribution)).toBe(75)
  })

  it('returns 100 for highest score in distribution', () => {
    const distribution = [
      { score: 10, count: 1 },
      { score: 20, count: 1 },
      { score: 28, count: 1 },
    ]

    // Score of 28: 2 below, 1 at = (2 + 0.5) / 3 * 100 = 83%
    // Note: Using mid-rank, not 100%
    expect(calculatePercentile(28, distribution)).toBe(83)
  })

  it('handles score not in distribution', () => {
    const distribution = [
      { score: 10, count: 5 },
      { score: 20, count: 5 },
    ]

    // Score of 15: 5 below, 0 at = 5/10 * 100 = 50%
    expect(calculatePercentile(15, distribution)).toBe(50)
  })

  it('handles single-score distribution', () => {
    const distribution = [{ score: 20, count: 10 }]

    // Everyone has the same score
    // Score of 20: 0 below, 10 at = (0 + 5) / 10 * 100 = 50%
    expect(calculatePercentile(20, distribution)).toBe(50)
  })

  it('calculates correctly with diverse distribution', () => {
    const distribution = [
      { score: 5, count: 10 },
      { score: 10, count: 20 },
      { score: 15, count: 40 },
      { score: 20, count: 20 },
      { score: 25, count: 10 },
    ]
    // Total: 100 responses

    // Score of 15: 30 below, 40 at = (30 + 20) / 100 * 100 = 50%
    expect(calculatePercentile(15, distribution)).toBe(50)

    // Score of 25: 90 below, 10 at = (90 + 5) / 100 * 100 = 95%
    expect(calculatePercentile(25, distribution)).toBe(95)
  })
})

// =============================================================================
// getScoreSummary Tests
// =============================================================================

describe('getScoreSummary', () => {
  it('returns complete summary structure', () => {
    const answers = createAllYesAnswers()
    const scores = calculateScores(answers)
    const summary = getScoreSummary(scores)

    expect(summary.total).toBe(28)
    expect(summary.maxPossible).toBe(28)
    expect(summary.percentage).toBe(100)
    expect(summary.level).toBeDefined()
    expect(summary.label).toBeDefined()
    expect(summary.color).toBeDefined()
    expect(summary.categories).toHaveLength(5)
  })

  it('returns "strong" level for 100% score', () => {
    const answers = createAllYesAnswers()
    const scores = calculateScores(answers)
    const summary = getScoreSummary(scores)

    expect(summary.level).toBe('strong')
    expect(summary.label).toBe('Strong Alignment')
    expect(summary.color).toBe('emerald')
  })

  it('returns "needs_improvement" level for 0% score', () => {
    const answers = createAllNoAnswers()
    const scores = calculateScores(answers)
    const summary = getScoreSummary(scores)

    expect(summary.level).toBe('needs_improvement')
    expect(summary.label).toBe('Needs Improvement')
    expect(summary.color).toBe('rose')
  })

  it('includes category-level performance info', () => {
    const answers = createAllYesAnswers()
    const scores = calculateScores(answers)
    const summary = getScoreSummary(scores)

    for (const cat of summary.categories) {
      expect(cat.id).toBeDefined()
      expect(cat.name).toBeDefined()
      expect(cat.score).toBeDefined()
      expect(cat.maxScore).toBeDefined()
      expect(cat.percentage).toBeDefined()
      expect(cat.level).toBeDefined()
      expect(cat.label).toBeDefined()
      expect(cat.color).toBeDefined()
    }
  })
})

// =============================================================================
// Performance Level Functions Tests
// =============================================================================

describe('getPerformanceLevel', () => {
  it('returns "strong" for percentage >= 85', () => {
    expect(getPerformanceLevel(85)).toBe('strong')
    expect(getPerformanceLevel(90)).toBe('strong')
    expect(getPerformanceLevel(100)).toBe('strong')
  })

  it('returns "moderate" for percentage 60-84', () => {
    expect(getPerformanceLevel(60)).toBe('moderate')
    expect(getPerformanceLevel(70)).toBe('moderate')
    expect(getPerformanceLevel(84)).toBe('moderate')
  })

  it('returns "needs_improvement" for percentage < 60', () => {
    expect(getPerformanceLevel(0)).toBe('needs_improvement')
    expect(getPerformanceLevel(30)).toBe('needs_improvement')
    expect(getPerformanceLevel(59)).toBe('needs_improvement')
  })

  it('handles boundary values correctly', () => {
    expect(getPerformanceLevel(59)).toBe('needs_improvement')
    expect(getPerformanceLevel(60)).toBe('moderate')
    expect(getPerformanceLevel(84)).toBe('moderate')
    expect(getPerformanceLevel(85)).toBe('strong')
  })
})

describe('getPerformanceLabel', () => {
  it('returns correct labels for each level', () => {
    expect(getPerformanceLabel(100)).toBe('Strong Alignment')
    expect(getPerformanceLabel(70)).toBe('Moderate Alignment')
    expect(getPerformanceLabel(30)).toBe('Needs Improvement')
  })
})

describe('getPerformanceColor', () => {
  it('returns correct colors for each level', () => {
    expect(getPerformanceColor(100)).toBe('emerald')
    expect(getPerformanceColor(70)).toBe('amber')
    expect(getPerformanceColor(30)).toBe('rose')
  })
})
