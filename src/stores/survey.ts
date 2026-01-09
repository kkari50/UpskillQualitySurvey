/**
 * Survey State Management
 *
 * Zustand store for managing survey state including:
 * - Current question index
 * - Answers (Yes/No for each question)
 * - Navigation state
 * - LocalStorage backup
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { SurveyAnswers, CategoryId } from '@/data/questions/schema'
import {
  QUESTIONS,
  CATEGORIES,
  TOTAL_QUESTIONS,
  CURRENT_VERSION,
  getQuestionsByCategory,
} from '@/data/questions'
import { calculateScores } from '@/lib/scoring'

/**
 * Survey store state interface
 */
interface SurveyState {
  // Survey data
  answers: SurveyAnswers
  surveyVersion: string

  // Navigation
  currentQuestionIndex: number
  currentCategoryIndex: number
  showCategoryTransition: boolean

  // Status
  isStarted: boolean
  isCompleted: boolean
  completedAt: string | null

  // Actions
  startSurvey: () => void
  setAnswer: (questionId: string, answer: boolean) => void
  goToNextQuestion: () => void
  goToPreviousQuestion: () => void
  goToQuestion: (index: number) => void
  dismissCategoryTransition: () => void
  completeSurvey: () => void
  resetSurvey: () => void

  // Computed getters
  getCurrentQuestion: () => (typeof QUESTIONS)[number] | null
  getCurrentCategory: () => (typeof CATEGORIES)[number] | null
  getProgress: () => {
    current: number
    total: number
    percentage: number
  }
  getScores: () => ReturnType<typeof calculateScores> | null
  canGoNext: () => boolean
  canGoPrevious: () => boolean
  isLastQuestion: () => boolean
  isFirstQuestion: () => boolean
  getAnsweredCount: () => number
}

/**
 * Storage key for persisted state
 */
const STORAGE_KEY = 'upskill-survey-state'

/**
 * Create the survey store with persistence
 */
export const useSurveyStore = create<SurveyState>()(
  persist(
    (set, get) => ({
      // Initial state
      answers: {},
      surveyVersion: CURRENT_VERSION,
      currentQuestionIndex: 0,
      currentCategoryIndex: 0,
      showCategoryTransition: false,
      isStarted: false,
      isCompleted: false,
      completedAt: null,

      // Actions
      startSurvey: () => {
        set({
          isStarted: true,
          showCategoryTransition: true, // Show first category intro
        })
      },

      setAnswer: (questionId: string, answer: boolean) => {
        set((state) => ({
          answers: { ...state.answers, [questionId]: answer },
        }))
      },

      goToNextQuestion: () => {
        const state = get()
        const currentQuestion = QUESTIONS[state.currentQuestionIndex]
        const nextIndex = state.currentQuestionIndex + 1

        if (nextIndex >= TOTAL_QUESTIONS) {
          // At the end, don't advance
          return
        }

        const nextQuestion = QUESTIONS[nextIndex]

        // Check if we're moving to a new category
        const showTransition = currentQuestion?.category !== nextQuestion?.category

        // Find the category index for the next question
        const newCategoryIndex = CATEGORIES.findIndex(
          (c) => c.id === nextQuestion?.category
        )

        set({
          currentQuestionIndex: nextIndex,
          currentCategoryIndex: newCategoryIndex >= 0 ? newCategoryIndex : state.currentCategoryIndex,
          showCategoryTransition: showTransition,
        })
      },

      goToPreviousQuestion: () => {
        const state = get()
        if (state.currentQuestionIndex > 0) {
          const prevIndex = state.currentQuestionIndex - 1
          const prevQuestion = QUESTIONS[prevIndex]
          const newCategoryIndex = CATEGORIES.findIndex(
            (c) => c.id === prevQuestion?.category
          )

          set({
            currentQuestionIndex: prevIndex,
            currentCategoryIndex: newCategoryIndex >= 0 ? newCategoryIndex : state.currentCategoryIndex,
            showCategoryTransition: false, // Don't show transition when going back
          })
        }
      },

      goToQuestion: (index: number) => {
        if (index >= 0 && index < TOTAL_QUESTIONS) {
          const question = QUESTIONS[index]
          const categoryIndex = CATEGORIES.findIndex(
            (c) => c.id === question?.category
          )

          set({
            currentQuestionIndex: index,
            currentCategoryIndex: categoryIndex >= 0 ? categoryIndex : 0,
            showCategoryTransition: false,
          })
        }
      },

      dismissCategoryTransition: () => {
        set({ showCategoryTransition: false })
      },

      completeSurvey: () => {
        set({
          isCompleted: true,
          completedAt: new Date().toISOString(),
        })
      },

      resetSurvey: () => {
        set({
          answers: {},
          currentQuestionIndex: 0,
          currentCategoryIndex: 0,
          showCategoryTransition: false,
          isStarted: false,
          isCompleted: false,
          completedAt: null,
        })
      },

      // Computed getters
      getCurrentQuestion: () => {
        const { currentQuestionIndex } = get()
        return QUESTIONS[currentQuestionIndex] ?? null
      },

      getCurrentCategory: () => {
        const { currentCategoryIndex } = get()
        return CATEGORIES[currentCategoryIndex] ?? null
      },

      getProgress: () => {
        const { currentQuestionIndex } = get()
        return {
          current: currentQuestionIndex + 1,
          total: TOTAL_QUESTIONS,
          percentage: Math.round(
            ((currentQuestionIndex + 1) / TOTAL_QUESTIONS) * 100
          ),
        }
      },

      getScores: () => {
        const { answers } = get()
        // Only calculate if all questions answered
        if (Object.keys(answers).length < TOTAL_QUESTIONS) {
          return null
        }
        return calculateScores(answers)
      },

      canGoNext: () => {
        const state = get()
        const currentQuestion = QUESTIONS[state.currentQuestionIndex]
        // Can go next if current question has an answer
        return currentQuestion ? state.answers[currentQuestion.id] !== undefined : false
      },

      canGoPrevious: () => {
        return get().currentQuestionIndex > 0
      },

      isLastQuestion: () => {
        return get().currentQuestionIndex === TOTAL_QUESTIONS - 1
      },

      isFirstQuestion: () => {
        return get().currentQuestionIndex === 0
      },

      getAnsweredCount: () => {
        return Object.keys(get().answers).length
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // Only persist certain fields
      partialize: (state) => ({
        answers: state.answers,
        surveyVersion: state.surveyVersion,
        currentQuestionIndex: state.currentQuestionIndex,
        currentCategoryIndex: state.currentCategoryIndex,
        isStarted: state.isStarted,
        isCompleted: state.isCompleted,
        completedAt: state.completedAt,
      }),
    }
  )
)

/**
 * Helper hook to get survey progress by category
 */
export function getCategoryProgress(
  answers: SurveyAnswers,
  categoryId: CategoryId
): {
  answered: number
  total: number
  percentage: number
} {
  const questions = getQuestionsByCategory(categoryId)
  const answered = questions.filter((q) => answers[q.id] !== undefined).length

  return {
    answered,
    total: questions.length,
    percentage: questions.length > 0 ? Math.round((answered / questions.length) * 100) : 0,
  }
}

/**
 * Check if all questions in a category are answered
 */
export function isCategoryComplete(
  answers: SurveyAnswers,
  categoryId: CategoryId
): boolean {
  const questions = getQuestionsByCategory(categoryId)
  return questions.every((q) => answers[q.id] !== undefined)
}

/**
 * Check if survey is ready to submit (all questions answered)
 */
export function isSurveyComplete(answers: SurveyAnswers): boolean {
  // Check that every question in the current version has been answered
  return QUESTIONS.every((q) => answers[q.id] !== undefined)
}
