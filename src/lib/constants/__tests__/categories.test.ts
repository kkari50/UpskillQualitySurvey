/**
 * Category Constants Tests
 *
 * Tests for category utility functions and constants.
 */

import { describe, it, expect } from 'vitest'
import {
  getCategoryFromQuestionId,
  getCategoryIndex,
  isFirstQuestionOfCategory,
  CATEGORY_ORDER,
  CATEGORIES,
  CATEGORY_ICONS,
  CATEGORY_COLORS,
  CATEGORY_PREFIXES,
} from '../categories'
import type { CategoryId } from '../categories'

// =============================================================================
// getCategoryFromQuestionId Tests
// =============================================================================

describe('getCategoryFromQuestionId', () => {
  it('returns "daily_sessions" for ds_ prefix', () => {
    expect(getCategoryFromQuestionId('ds_001')).toBe('daily_sessions')
    expect(getCategoryFromQuestionId('ds_007')).toBe('daily_sessions')
  })

  it('returns "treatment_fidelity" for tf_ prefix', () => {
    expect(getCategoryFromQuestionId('tf_001')).toBe('treatment_fidelity')
    expect(getCategoryFromQuestionId('tf_005')).toBe('treatment_fidelity')
  })

  it('returns "data_analysis" for da_ prefix', () => {
    expect(getCategoryFromQuestionId('da_001')).toBe('data_analysis')
    expect(getCategoryFromQuestionId('da_006')).toBe('data_analysis')
  })

  it('returns "caregiver_guidance" for cg_ prefix', () => {
    expect(getCategoryFromQuestionId('cg_001')).toBe('caregiver_guidance')
    expect(getCategoryFromQuestionId('cg_006')).toBe('caregiver_guidance')
  })

  it('returns "supervision" for sup_ prefix', () => {
    expect(getCategoryFromQuestionId('sup_001')).toBe('supervision')
    expect(getCategoryFromQuestionId('sup_004')).toBe('supervision')
  })

  it('returns null for unknown prefix', () => {
    expect(getCategoryFromQuestionId('xx_001')).toBeNull()
    expect(getCategoryFromQuestionId('unknown_001')).toBeNull()
  })

  it('returns null for malformed question ID', () => {
    expect(getCategoryFromQuestionId('')).toBeNull()
    expect(getCategoryFromQuestionId('noprefix')).toBeNull()
  })

  it('handles edge case of just prefix (returns category when prefix matches)', () => {
    // 'ds' without underscore - splits to ['ds'], prefix 'ds' matches daily_sessions
    // This is the actual behavior of the implementation
    expect(getCategoryFromQuestionId('ds')).toBe('daily_sessions')
  })

  it('matches against prefix before underscore', () => {
    // Should split on first underscore and check prefix
    expect(getCategoryFromQuestionId('ds_extra_stuff')).toBe('daily_sessions')
  })
})

// =============================================================================
// getCategoryIndex Tests
// =============================================================================

describe('getCategoryIndex', () => {
  it('returns 1 for daily_sessions (first category)', () => {
    expect(getCategoryIndex('daily_sessions')).toBe(1)
  })

  it('returns 2 for treatment_fidelity', () => {
    expect(getCategoryIndex('treatment_fidelity')).toBe(2)
  })

  it('returns 3 for data_analysis', () => {
    expect(getCategoryIndex('data_analysis')).toBe(3)
  })

  it('returns 4 for caregiver_guidance', () => {
    expect(getCategoryIndex('caregiver_guidance')).toBe(4)
  })

  it('returns 5 for supervision (last category)', () => {
    expect(getCategoryIndex('supervision')).toBe(5)
  })

  it('returns 0 for invalid category', () => {
    // @ts-expect-error - Testing invalid input
    expect(getCategoryIndex('invalid_category')).toBe(0)
  })

  it('matches CATEGORY_ORDER positions', () => {
    for (let i = 0; i < CATEGORY_ORDER.length; i++) {
      const categoryId = CATEGORY_ORDER[i]
      expect(getCategoryIndex(categoryId)).toBe(i + 1)
    }
  })
})

// =============================================================================
// isFirstQuestionOfCategory Tests
// =============================================================================

describe('isFirstQuestionOfCategory', () => {
  it('returns true when previousQuestionId is null', () => {
    expect(isFirstQuestionOfCategory('ds_001', null)).toBe(true)
    expect(isFirstQuestionOfCategory('tf_001', null)).toBe(true)
  })

  it('returns true when categories differ', () => {
    // Moving from daily_sessions to treatment_fidelity
    expect(isFirstQuestionOfCategory('tf_001', 'ds_007')).toBe(true)

    // Moving from treatment_fidelity to data_analysis
    expect(isFirstQuestionOfCategory('da_001', 'tf_005')).toBe(true)

    // Moving from data_analysis to caregiver_guidance
    expect(isFirstQuestionOfCategory('cg_001', 'da_006')).toBe(true)

    // Moving from caregiver_guidance to supervision
    expect(isFirstQuestionOfCategory('sup_001', 'cg_006')).toBe(true)
  })

  it('returns false when categories are the same', () => {
    expect(isFirstQuestionOfCategory('ds_002', 'ds_001')).toBe(false)
    expect(isFirstQuestionOfCategory('ds_007', 'ds_006')).toBe(false)
    expect(isFirstQuestionOfCategory('tf_003', 'tf_002')).toBe(false)
  })

  it('handles middle-of-category questions', () => {
    expect(isFirstQuestionOfCategory('da_003', 'da_002')).toBe(false)
    expect(isFirstQuestionOfCategory('cg_004', 'cg_003')).toBe(false)
    expect(isFirstQuestionOfCategory('sup_002', 'sup_001')).toBe(false)
  })

  it('handles unknown question IDs gracefully', () => {
    // Both unknown - should return true since categories differ (null !== null is false, but logic depends on impl)
    // Based on implementation: null !== null is false, so returns false
    expect(isFirstQuestionOfCategory('xx_001', 'yy_001')).toBe(false)
  })
})

// =============================================================================
// CATEGORY_ORDER Constant Tests
// =============================================================================

describe('CATEGORY_ORDER', () => {
  it('has 5 categories', () => {
    expect(CATEGORY_ORDER).toHaveLength(5)
  })

  it('starts with daily_sessions', () => {
    expect(CATEGORY_ORDER[0]).toBe('daily_sessions')
  })

  it('ends with supervision', () => {
    expect(CATEGORY_ORDER[4]).toBe('supervision')
  })

  it('contains all category IDs in correct order', () => {
    expect(CATEGORY_ORDER).toEqual([
      'daily_sessions',
      'treatment_fidelity',
      'data_analysis',
      'caregiver_guidance',
      'supervision',
    ])
  })
})

// =============================================================================
// CATEGORIES Constant Tests
// =============================================================================

describe('CATEGORIES', () => {
  it('has entry for each category ID', () => {
    for (const categoryId of CATEGORY_ORDER) {
      expect(CATEGORIES[categoryId]).toBeDefined()
    }
  })

  it('has displayName for each category', () => {
    expect(CATEGORIES.daily_sessions.displayName).toBe('Daily Sessions')
    expect(CATEGORIES.treatment_fidelity.displayName).toBe('Treatment Fidelity')
    expect(CATEGORIES.data_analysis.displayName).toBe('Data Analysis')
    expect(CATEGORIES.caregiver_guidance.displayName).toBe('Caregiver Guidance')
    expect(CATEGORIES.supervision.displayName).toBe('Supervision')
  })

  it('has shortName for each category', () => {
    expect(CATEGORIES.daily_sessions.shortName).toBe('Sessions')
    expect(CATEGORIES.treatment_fidelity.shortName).toBe('Fidelity')
    expect(CATEGORIES.data_analysis.shortName).toBe('Data')
    expect(CATEGORIES.caregiver_guidance.shortName).toBe('Caregiver')
    expect(CATEGORIES.supervision.shortName).toBe('Supervision')
  })
})

// =============================================================================
// CATEGORY_ICONS Constant Tests
// =============================================================================

describe('CATEGORY_ICONS', () => {
  it('has icon for each category', () => {
    for (const categoryId of CATEGORY_ORDER) {
      expect(CATEGORY_ICONS[categoryId]).toBeDefined()
      expect(typeof CATEGORY_ICONS[categoryId]).toBe('string')
    }
  })

  it('uses valid Lucide icon names', () => {
    expect(CATEGORY_ICONS.daily_sessions).toBe('Calendar')
    expect(CATEGORY_ICONS.treatment_fidelity).toBe('ClipboardCheck')
    expect(CATEGORY_ICONS.data_analysis).toBe('BarChart3')
    expect(CATEGORY_ICONS.caregiver_guidance).toBe('Users')
    expect(CATEGORY_ICONS.supervision).toBe('UserCheck')
  })
})

// =============================================================================
// CATEGORY_COLORS Constant Tests
// =============================================================================

describe('CATEGORY_COLORS', () => {
  it('has color for each category', () => {
    for (const categoryId of CATEGORY_ORDER) {
      expect(CATEGORY_COLORS[categoryId]).toBeDefined()
      expect(typeof CATEGORY_COLORS[categoryId]).toBe('string')
    }
  })

  it('uses valid Tailwind color names', () => {
    const validColors = ['teal', 'blue', 'purple', 'orange', 'emerald']
    for (const categoryId of CATEGORY_ORDER) {
      expect(validColors).toContain(CATEGORY_COLORS[categoryId])
    }
  })

  it('has unique color for each category', () => {
    const colors = CATEGORY_ORDER.map((id) => CATEGORY_COLORS[id])
    const uniqueColors = new Set(colors)
    expect(uniqueColors.size).toBe(5)
  })
})

// =============================================================================
// CATEGORY_PREFIXES Constant Tests
// =============================================================================

describe('CATEGORY_PREFIXES', () => {
  it('has prefix for each category', () => {
    for (const categoryId of CATEGORY_ORDER) {
      expect(CATEGORY_PREFIXES[categoryId]).toBeDefined()
    }
  })

  it('has correct prefixes', () => {
    expect(CATEGORY_PREFIXES.daily_sessions).toBe('ds')
    expect(CATEGORY_PREFIXES.treatment_fidelity).toBe('tf')
    expect(CATEGORY_PREFIXES.data_analysis).toBe('da')
    expect(CATEGORY_PREFIXES.caregiver_guidance).toBe('cg')
    expect(CATEGORY_PREFIXES.supervision).toBe('sup')
  })

  it('prefixes are consistent with getCategoryFromQuestionId', () => {
    for (const categoryId of CATEGORY_ORDER) {
      const prefix = CATEGORY_PREFIXES[categoryId]
      const testQuestionId = `${prefix}_001`
      expect(getCategoryFromQuestionId(testQuestionId)).toBe(categoryId)
    }
  })
})

// =============================================================================
// Type Safety Tests
// =============================================================================

describe('CategoryId type', () => {
  it('can be assigned valid category IDs', () => {
    const dailySessions: CategoryId = 'daily_sessions'
    const treatmentFidelity: CategoryId = 'treatment_fidelity'
    const dataAnalysis: CategoryId = 'data_analysis'
    const caregiverGuidance: CategoryId = 'caregiver_guidance'
    const supervision: CategoryId = 'supervision'

    expect(dailySessions).toBe('daily_sessions')
    expect(treatmentFidelity).toBe('treatment_fidelity')
    expect(dataAnalysis).toBe('data_analysis')
    expect(caregiverGuidance).toBe('caregiver_guidance')
    expect(supervision).toBe('supervision')
  })
})
