/**
 * Questions Schema Tests
 *
 * Tests for performance level utilities and schema types.
 */

import { describe, it, expect } from 'vitest'
import {
  getPerformanceLevel,
  getPerformanceLabel,
  getPerformanceColor,
  PERFORMANCE_THRESHOLDS,
} from '../schema'
import type { PerformanceLevel } from '../schema'

// =============================================================================
// getPerformanceLevel Tests
// =============================================================================

describe('getPerformanceLevel', () => {
  describe('strong threshold (>= 85%)', () => {
    it('returns "strong" for 85%', () => {
      expect(getPerformanceLevel(85)).toBe('strong')
    })

    it('returns "strong" for 90%', () => {
      expect(getPerformanceLevel(90)).toBe('strong')
    })

    it('returns "strong" for 100%', () => {
      expect(getPerformanceLevel(100)).toBe('strong')
    })

    it('returns "strong" for exactly 85%', () => {
      expect(getPerformanceLevel(85)).toBe('strong')
    })
  })

  describe('moderate threshold (60-84%)', () => {
    it('returns "moderate" for 60%', () => {
      expect(getPerformanceLevel(60)).toBe('moderate')
    })

    it('returns "moderate" for 70%', () => {
      expect(getPerformanceLevel(70)).toBe('moderate')
    })

    it('returns "moderate" for 84%', () => {
      expect(getPerformanceLevel(84)).toBe('moderate')
    })

    it('returns "moderate" for exactly 60%', () => {
      expect(getPerformanceLevel(60)).toBe('moderate')
    })
  })

  describe('needs_improvement threshold (< 60%)', () => {
    it('returns "needs_improvement" for 0%', () => {
      expect(getPerformanceLevel(0)).toBe('needs_improvement')
    })

    it('returns "needs_improvement" for 30%', () => {
      expect(getPerformanceLevel(30)).toBe('needs_improvement')
    })

    it('returns "needs_improvement" for 59%', () => {
      expect(getPerformanceLevel(59)).toBe('needs_improvement')
    })

    it('returns "needs_improvement" for 1%', () => {
      expect(getPerformanceLevel(1)).toBe('needs_improvement')
    })
  })

  describe('boundary values', () => {
    it('returns "needs_improvement" for 59%', () => {
      expect(getPerformanceLevel(59)).toBe('needs_improvement')
    })

    it('returns "moderate" for 60% (threshold)', () => {
      expect(getPerformanceLevel(60)).toBe('moderate')
    })

    it('returns "moderate" for 84%', () => {
      expect(getPerformanceLevel(84)).toBe('moderate')
    })

    it('returns "strong" for 85% (threshold)', () => {
      expect(getPerformanceLevel(85)).toBe('strong')
    })
  })

  describe('edge cases', () => {
    it('handles decimal percentages - rounds down conceptually', () => {
      // 59.9 is still below 60
      expect(getPerformanceLevel(59.9)).toBe('needs_improvement')
      // 84.9 is still below 85
      expect(getPerformanceLevel(84.9)).toBe('moderate')
    })

    it('handles exactly threshold values', () => {
      expect(getPerformanceLevel(60)).toBe('moderate')
      expect(getPerformanceLevel(85)).toBe('strong')
    })
  })
})

// =============================================================================
// getPerformanceLabel Tests
// =============================================================================

describe('getPerformanceLabel', () => {
  it('returns "Strong Alignment" for strong level', () => {
    expect(getPerformanceLabel(100)).toBe('Strong Alignment')
    expect(getPerformanceLabel(90)).toBe('Strong Alignment')
    expect(getPerformanceLabel(85)).toBe('Strong Alignment')
  })

  it('returns "Moderate Alignment" for moderate level', () => {
    expect(getPerformanceLabel(84)).toBe('Moderate Alignment')
    expect(getPerformanceLabel(70)).toBe('Moderate Alignment')
    expect(getPerformanceLabel(60)).toBe('Moderate Alignment')
  })

  it('returns "Needs Improvement" for needs_improvement level', () => {
    expect(getPerformanceLabel(59)).toBe('Needs Improvement')
    expect(getPerformanceLabel(30)).toBe('Needs Improvement')
    expect(getPerformanceLabel(0)).toBe('Needs Improvement')
  })

  it('matches PERFORMANCE_THRESHOLDS labels', () => {
    expect(getPerformanceLabel(100)).toBe(PERFORMANCE_THRESHOLDS.strong.label)
    expect(getPerformanceLabel(70)).toBe(PERFORMANCE_THRESHOLDS.moderate.label)
    expect(getPerformanceLabel(30)).toBe(
      PERFORMANCE_THRESHOLDS.needs_improvement.label
    )
  })
})

// =============================================================================
// getPerformanceColor Tests
// =============================================================================

describe('getPerformanceColor', () => {
  it('returns "emerald" for strong level', () => {
    expect(getPerformanceColor(100)).toBe('emerald')
    expect(getPerformanceColor(90)).toBe('emerald')
    expect(getPerformanceColor(85)).toBe('emerald')
  })

  it('returns "amber" for moderate level', () => {
    expect(getPerformanceColor(84)).toBe('amber')
    expect(getPerformanceColor(70)).toBe('amber')
    expect(getPerformanceColor(60)).toBe('amber')
  })

  it('returns "rose" for needs_improvement level', () => {
    expect(getPerformanceColor(59)).toBe('rose')
    expect(getPerformanceColor(30)).toBe('rose')
    expect(getPerformanceColor(0)).toBe('rose')
  })

  it('matches PERFORMANCE_THRESHOLDS colors', () => {
    expect(getPerformanceColor(100)).toBe(PERFORMANCE_THRESHOLDS.strong.color)
    expect(getPerformanceColor(70)).toBe(PERFORMANCE_THRESHOLDS.moderate.color)
    expect(getPerformanceColor(30)).toBe(
      PERFORMANCE_THRESHOLDS.needs_improvement.color
    )
  })
})

// =============================================================================
// PERFORMANCE_THRESHOLDS Constant Tests
// =============================================================================

describe('PERFORMANCE_THRESHOLDS', () => {
  it('has three performance levels', () => {
    expect(Object.keys(PERFORMANCE_THRESHOLDS)).toHaveLength(3)
    expect(PERFORMANCE_THRESHOLDS).toHaveProperty('strong')
    expect(PERFORMANCE_THRESHOLDS).toHaveProperty('moderate')
    expect(PERFORMANCE_THRESHOLDS).toHaveProperty('needs_improvement')
  })

  it('has correct min thresholds', () => {
    expect(PERFORMANCE_THRESHOLDS.strong.min).toBe(85)
    expect(PERFORMANCE_THRESHOLDS.moderate.min).toBe(60)
    expect(PERFORMANCE_THRESHOLDS.needs_improvement.min).toBe(0)
  })

  it('has label for each level', () => {
    expect(PERFORMANCE_THRESHOLDS.strong.label).toBe('Strong Alignment')
    expect(PERFORMANCE_THRESHOLDS.moderate.label).toBe('Moderate Alignment')
    expect(PERFORMANCE_THRESHOLDS.needs_improvement.label).toBe(
      'Needs Improvement'
    )
  })

  it('has color for each level', () => {
    expect(PERFORMANCE_THRESHOLDS.strong.color).toBe('emerald')
    expect(PERFORMANCE_THRESHOLDS.moderate.color).toBe('amber')
    expect(PERFORMANCE_THRESHOLDS.needs_improvement.color).toBe('rose')
  })

  it('thresholds are non-overlapping and cover 0-100', () => {
    // needs_improvement: 0-59
    // moderate: 60-84
    // strong: 85-100
    expect(PERFORMANCE_THRESHOLDS.needs_improvement.min).toBe(0)
    expect(PERFORMANCE_THRESHOLDS.moderate.min).toBe(60)
    expect(PERFORMANCE_THRESHOLDS.strong.min).toBe(85)
  })
})

// =============================================================================
// Type Tests (compile-time checks)
// =============================================================================

describe('PerformanceLevel type', () => {
  it('can be assigned valid levels', () => {
    const strong: PerformanceLevel = 'strong'
    const moderate: PerformanceLevel = 'moderate'
    const needsImprovement: PerformanceLevel = 'needs_improvement'

    expect(strong).toBe('strong')
    expect(moderate).toBe('moderate')
    expect(needsImprovement).toBe('needs_improvement')
  })

  it('getPerformanceLevel returns valid type', () => {
    const result: PerformanceLevel = getPerformanceLevel(75)
    expect(['strong', 'moderate', 'needs_improvement']).toContain(result)
  })
})
