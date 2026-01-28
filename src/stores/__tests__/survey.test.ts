/**
 * Survey Store Tests
 *
 * Tests for Zustand store managing survey state.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { useSurveyStore } from '../survey'
import {
  getCategoryProgress,
  isCategoryComplete,
  isSurveyComplete,
} from '../survey'
import type { SurveyAnswers } from '@/data/questions/schema'
import { QUESTIONS, TOTAL_QUESTIONS } from '@/data/questions'

/**
 * Helper to create all answers
 */
function createAllAnswers(value: boolean): SurveyAnswers {
  const answers: SurveyAnswers = {}
  for (const q of QUESTIONS) {
    answers[q.id] = value
  }
  return answers
}

/**
 * Helper to create answers for a specific category
 */
function createCategoryAnswers(
  categoryId: string,
  value: boolean
): SurveyAnswers {
  const answers: SurveyAnswers = {}
  for (const q of QUESTIONS.filter((q) => q.category === categoryId)) {
    answers[q.id] = value
  }
  return answers
}

// Reset store before each test
beforeEach(() => {
  useSurveyStore.getState().resetSurvey()
})

// =============================================================================
// Initial State Tests
// =============================================================================

describe('initial state', () => {
  it('has empty answers', () => {
    const state = useSurveyStore.getState()
    expect(Object.keys(state.answers)).toHaveLength(0)
  })

  it('starts at question index 0', () => {
    const state = useSurveyStore.getState()
    expect(state.currentQuestionIndex).toBe(0)
  })

  it('starts at category index 0', () => {
    const state = useSurveyStore.getState()
    expect(state.currentCategoryIndex).toBe(0)
  })

  it('is not started initially', () => {
    const state = useSurveyStore.getState()
    expect(state.isStarted).toBe(false)
  })

  it('is not completed initially', () => {
    const state = useSurveyStore.getState()
    expect(state.isCompleted).toBe(false)
  })

  it('has no completedAt date', () => {
    const state = useSurveyStore.getState()
    expect(state.completedAt).toBeNull()
  })

  it('does not show category transition initially', () => {
    const state = useSurveyStore.getState()
    expect(state.showCategoryTransition).toBe(false)
  })
})

// =============================================================================
// startSurvey Tests
// =============================================================================

describe('startSurvey', () => {
  it('sets isStarted to true', () => {
    useSurveyStore.getState().startSurvey()
    expect(useSurveyStore.getState().isStarted).toBe(true)
  })

  it('shows category transition for first category', () => {
    useSurveyStore.getState().startSurvey()
    expect(useSurveyStore.getState().showCategoryTransition).toBe(true)
  })
})

// =============================================================================
// setAnswer Tests
// =============================================================================

describe('setAnswer', () => {
  it('sets answer for a question', () => {
    useSurveyStore.getState().setAnswer('ds_001', true)
    expect(useSurveyStore.getState().answers['ds_001']).toBe(true)
  })

  it('can set answer to false', () => {
    useSurveyStore.getState().setAnswer('ds_001', false)
    expect(useSurveyStore.getState().answers['ds_001']).toBe(false)
  })

  it('overwrites existing answer', () => {
    useSurveyStore.getState().setAnswer('ds_001', true)
    useSurveyStore.getState().setAnswer('ds_001', false)
    expect(useSurveyStore.getState().answers['ds_001']).toBe(false)
  })

  it('preserves other answers when setting new one', () => {
    useSurveyStore.getState().setAnswer('ds_001', true)
    useSurveyStore.getState().setAnswer('ds_002', false)

    const answers = useSurveyStore.getState().answers
    expect(answers['ds_001']).toBe(true)
    expect(answers['ds_002']).toBe(false)
  })
})

// =============================================================================
// Navigation Tests
// =============================================================================

describe('goToNextQuestion', () => {
  it('advances currentQuestionIndex by 1', () => {
    useSurveyStore.getState().goToNextQuestion()
    expect(useSurveyStore.getState().currentQuestionIndex).toBe(1)
  })

  it('does not advance past last question', () => {
    // Set to last question
    useSurveyStore.setState({ currentQuestionIndex: TOTAL_QUESTIONS - 1 })
    useSurveyStore.getState().goToNextQuestion()

    expect(useSurveyStore.getState().currentQuestionIndex).toBe(
      TOTAL_QUESTIONS - 1
    )
  })

  it('shows category transition when moving to new category', () => {
    // Move to question 7 (last of daily_sessions)
    useSurveyStore.setState({ currentQuestionIndex: 6 })
    // Go to next (first of treatment_fidelity)
    useSurveyStore.getState().goToNextQuestion()

    expect(useSurveyStore.getState().showCategoryTransition).toBe(true)
  })

  it('does not show transition within same category', () => {
    useSurveyStore.setState({
      currentQuestionIndex: 0,
      showCategoryTransition: false,
    })
    useSurveyStore.getState().goToNextQuestion()

    expect(useSurveyStore.getState().showCategoryTransition).toBe(false)
  })

  it('updates currentCategoryIndex when moving to new category', () => {
    // Last question of first category (ds_007 is index 6)
    useSurveyStore.setState({ currentQuestionIndex: 6, currentCategoryIndex: 0 })
    useSurveyStore.getState().goToNextQuestion()

    expect(useSurveyStore.getState().currentCategoryIndex).toBe(1)
  })
})

describe('goToPreviousQuestion', () => {
  it('decreases currentQuestionIndex by 1', () => {
    useSurveyStore.setState({ currentQuestionIndex: 5 })
    useSurveyStore.getState().goToPreviousQuestion()

    expect(useSurveyStore.getState().currentQuestionIndex).toBe(4)
  })

  it('does not go below 0', () => {
    useSurveyStore.setState({ currentQuestionIndex: 0 })
    useSurveyStore.getState().goToPreviousQuestion()

    expect(useSurveyStore.getState().currentQuestionIndex).toBe(0)
  })

  it('does not show category transition when going back', () => {
    useSurveyStore.setState({
      currentQuestionIndex: 7,
      showCategoryTransition: true,
    })
    useSurveyStore.getState().goToPreviousQuestion()

    expect(useSurveyStore.getState().showCategoryTransition).toBe(false)
  })

  it('updates currentCategoryIndex when going to previous category', () => {
    // First question of second category
    useSurveyStore.setState({ currentQuestionIndex: 7, currentCategoryIndex: 1 })
    useSurveyStore.getState().goToPreviousQuestion()

    expect(useSurveyStore.getState().currentCategoryIndex).toBe(0)
  })
})

describe('goToQuestion', () => {
  it('jumps to specific question index', () => {
    useSurveyStore.getState().goToQuestion(15)
    expect(useSurveyStore.getState().currentQuestionIndex).toBe(15)
  })

  it('does not go to negative index', () => {
    useSurveyStore.getState().goToQuestion(-1)
    expect(useSurveyStore.getState().currentQuestionIndex).toBe(0)
  })

  it('does not go beyond total questions', () => {
    useSurveyStore.getState().goToQuestion(100)
    expect(useSurveyStore.getState().currentQuestionIndex).toBe(0)
  })

  it('updates currentCategoryIndex appropriately', () => {
    // Jump to supervision category (starts at index 24)
    useSurveyStore.getState().goToQuestion(24)
    expect(useSurveyStore.getState().currentCategoryIndex).toBe(4)
  })

  it('does not show category transition', () => {
    useSurveyStore.setState({ showCategoryTransition: true })
    useSurveyStore.getState().goToQuestion(15)

    expect(useSurveyStore.getState().showCategoryTransition).toBe(false)
  })
})

// =============================================================================
// dismissCategoryTransition Tests
// =============================================================================

describe('dismissCategoryTransition', () => {
  it('sets showCategoryTransition to false', () => {
    useSurveyStore.setState({ showCategoryTransition: true })
    useSurveyStore.getState().dismissCategoryTransition()

    expect(useSurveyStore.getState().showCategoryTransition).toBe(false)
  })
})

// =============================================================================
// completeSurvey Tests
// =============================================================================

describe('completeSurvey', () => {
  it('sets isCompleted to true', () => {
    useSurveyStore.getState().completeSurvey()
    expect(useSurveyStore.getState().isCompleted).toBe(true)
  })

  it('sets completedAt to current ISO string', () => {
    const before = new Date().toISOString()
    useSurveyStore.getState().completeSurvey()
    const after = new Date().toISOString()

    const completedAt = useSurveyStore.getState().completedAt
    expect(completedAt).not.toBeNull()
    expect(completedAt! >= before).toBe(true)
    expect(completedAt! <= after).toBe(true)
  })
})

// =============================================================================
// resetSurvey Tests
// =============================================================================

describe('resetSurvey', () => {
  it('clears all answers', () => {
    useSurveyStore.getState().setAnswer('ds_001', true)
    useSurveyStore.getState().setAnswer('ds_002', false)
    useSurveyStore.getState().resetSurvey()

    expect(Object.keys(useSurveyStore.getState().answers)).toHaveLength(0)
  })

  it('resets question index to 0', () => {
    useSurveyStore.setState({ currentQuestionIndex: 15 })
    useSurveyStore.getState().resetSurvey()

    expect(useSurveyStore.getState().currentQuestionIndex).toBe(0)
  })

  it('resets category index to 0', () => {
    useSurveyStore.setState({ currentCategoryIndex: 3 })
    useSurveyStore.getState().resetSurvey()

    expect(useSurveyStore.getState().currentCategoryIndex).toBe(0)
  })

  it('resets isStarted to false', () => {
    useSurveyStore.getState().startSurvey()
    useSurveyStore.getState().resetSurvey()

    expect(useSurveyStore.getState().isStarted).toBe(false)
  })

  it('resets isCompleted to false', () => {
    useSurveyStore.getState().completeSurvey()
    useSurveyStore.getState().resetSurvey()

    expect(useSurveyStore.getState().isCompleted).toBe(false)
  })

  it('clears completedAt', () => {
    useSurveyStore.getState().completeSurvey()
    useSurveyStore.getState().resetSurvey()

    expect(useSurveyStore.getState().completedAt).toBeNull()
  })
})

// =============================================================================
// Computed Getter Tests
// =============================================================================

describe('getCurrentQuestion', () => {
  it('returns first question when at index 0', () => {
    const question = useSurveyStore.getState().getCurrentQuestion()
    expect(question?.id).toBe('ds_001')
  })

  it('returns correct question for current index', () => {
    useSurveyStore.setState({ currentQuestionIndex: 7 })
    const question = useSurveyStore.getState().getCurrentQuestion()

    expect(question?.id).toBe('tf_001')
  })

  it('returns null for out-of-bounds index', () => {
    useSurveyStore.setState({ currentQuestionIndex: 100 })
    const question = useSurveyStore.getState().getCurrentQuestion()

    expect(question).toBeNull()
  })
})

describe('getCurrentCategory', () => {
  it('returns first category when at index 0', () => {
    const category = useSurveyStore.getState().getCurrentCategory()
    expect(category?.id).toBe('daily_sessions')
  })

  it('returns correct category for current index', () => {
    useSurveyStore.setState({ currentCategoryIndex: 2 })
    const category = useSurveyStore.getState().getCurrentCategory()

    expect(category?.id).toBe('data_analysis')
  })
})

describe('getProgress', () => {
  it('returns correct progress for start', () => {
    const progress = useSurveyStore.getState().getProgress()

    expect(progress.current).toBe(1)
    expect(progress.total).toBe(TOTAL_QUESTIONS)
    expect(progress.percentage).toBe(4) // 1/28 ≈ 3.57%
  })

  it('returns correct progress for middle', () => {
    useSurveyStore.setState({ currentQuestionIndex: 13 })
    const progress = useSurveyStore.getState().getProgress()

    expect(progress.current).toBe(14)
    expect(progress.percentage).toBe(50)
  })

  it('returns 100% for last question', () => {
    useSurveyStore.setState({ currentQuestionIndex: TOTAL_QUESTIONS - 1 })
    const progress = useSurveyStore.getState().getProgress()

    expect(progress.current).toBe(TOTAL_QUESTIONS)
    expect(progress.percentage).toBe(100)
  })
})

describe('getScores', () => {
  it('returns null when not all questions answered', () => {
    useSurveyStore.getState().setAnswer('ds_001', true)
    const scores = useSurveyStore.getState().getScores()

    expect(scores).toBeNull()
  })

  it('returns scores when all questions answered', () => {
    const allAnswers = createAllAnswers(true)
    useSurveyStore.setState({ answers: allAnswers })

    const scores = useSurveyStore.getState().getScores()

    expect(scores).not.toBeNull()
    expect(scores?.total).toBe(28)
    expect(scores?.percentage).toBe(100)
  })
})

describe('canGoNext', () => {
  it('returns false when current question not answered', () => {
    expect(useSurveyStore.getState().canGoNext()).toBe(false)
  })

  it('returns true when current question is answered', () => {
    useSurveyStore.getState().setAnswer('ds_001', true)
    expect(useSurveyStore.getState().canGoNext()).toBe(true)
  })

  it('returns true when answer is false (No)', () => {
    useSurveyStore.getState().setAnswer('ds_001', false)
    expect(useSurveyStore.getState().canGoNext()).toBe(true)
  })
})

describe('canGoPrevious', () => {
  it('returns false at first question', () => {
    expect(useSurveyStore.getState().canGoPrevious()).toBe(false)
  })

  it('returns true when not at first question', () => {
    useSurveyStore.setState({ currentQuestionIndex: 1 })
    expect(useSurveyStore.getState().canGoPrevious()).toBe(true)
  })
})

describe('isLastQuestion', () => {
  it('returns false at first question', () => {
    expect(useSurveyStore.getState().isLastQuestion()).toBe(false)
  })

  it('returns true at last question', () => {
    useSurveyStore.setState({ currentQuestionIndex: TOTAL_QUESTIONS - 1 })
    expect(useSurveyStore.getState().isLastQuestion()).toBe(true)
  })
})

describe('isFirstQuestion', () => {
  it('returns true at first question', () => {
    expect(useSurveyStore.getState().isFirstQuestion()).toBe(true)
  })

  it('returns false when not at first question', () => {
    useSurveyStore.setState({ currentQuestionIndex: 5 })
    expect(useSurveyStore.getState().isFirstQuestion()).toBe(false)
  })
})

describe('getAnsweredCount', () => {
  it('returns 0 when no answers', () => {
    expect(useSurveyStore.getState().getAnsweredCount()).toBe(0)
  })

  it('returns correct count', () => {
    useSurveyStore.getState().setAnswer('ds_001', true)
    useSurveyStore.getState().setAnswer('ds_002', false)
    useSurveyStore.getState().setAnswer('ds_003', true)

    expect(useSurveyStore.getState().getAnsweredCount()).toBe(3)
  })
})

// =============================================================================
// Helper Function Tests
// =============================================================================

describe('getCategoryProgress', () => {
  it('returns 0% progress when no answers', () => {
    const progress = getCategoryProgress({}, 'daily_sessions')

    expect(progress.answered).toBe(0)
    expect(progress.total).toBe(7)
    expect(progress.percentage).toBe(0)
  })

  it('returns correct progress for partial answers', () => {
    const answers: SurveyAnswers = {
      ds_001: true,
      ds_002: false,
      ds_003: true,
    }

    const progress = getCategoryProgress(answers, 'daily_sessions')

    expect(progress.answered).toBe(3)
    expect(progress.total).toBe(7)
    expect(progress.percentage).toBe(43) // 3/7 ≈ 42.86%
  })

  it('returns 100% when all category questions answered', () => {
    const answers = createCategoryAnswers('daily_sessions', true)
    const progress = getCategoryProgress(answers, 'daily_sessions')

    expect(progress.answered).toBe(7)
    expect(progress.percentage).toBe(100)
  })

  it('handles supervision category (4 questions)', () => {
    const answers = createCategoryAnswers('supervision', true)
    const progress = getCategoryProgress(answers, 'supervision')

    expect(progress.total).toBe(4)
    expect(progress.answered).toBe(4)
  })
})

describe('isCategoryComplete', () => {
  it('returns false when no answers', () => {
    expect(isCategoryComplete({}, 'daily_sessions')).toBe(false)
  })

  it('returns false when partially answered', () => {
    const answers: SurveyAnswers = {
      ds_001: true,
      ds_002: false,
    }

    expect(isCategoryComplete(answers, 'daily_sessions')).toBe(false)
  })

  it('returns true when all category questions answered', () => {
    const answers = createCategoryAnswers('daily_sessions', true)
    expect(isCategoryComplete(answers, 'daily_sessions')).toBe(true)
  })

  it('considers false answers as complete', () => {
    const answers = createCategoryAnswers('daily_sessions', false)
    expect(isCategoryComplete(answers, 'daily_sessions')).toBe(true)
  })
})

describe('isSurveyComplete', () => {
  it('returns false when no answers', () => {
    expect(isSurveyComplete({})).toBe(false)
  })

  it('returns false when partially complete', () => {
    const answers = createCategoryAnswers('daily_sessions', true)
    expect(isSurveyComplete(answers)).toBe(false)
  })

  it('returns true when all 28 questions answered', () => {
    const answers = createAllAnswers(true)
    expect(isSurveyComplete(answers)).toBe(true)
  })

  it('returns true with mix of true/false answers', () => {
    const answers: SurveyAnswers = {}
    QUESTIONS.forEach((q, i) => {
      answers[q.id] = i % 2 === 0
    })

    expect(isSurveyComplete(answers)).toBe(true)
  })
})
