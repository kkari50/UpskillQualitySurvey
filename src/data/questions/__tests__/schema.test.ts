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
  describe('strong threshold (>= 90%)', () => {
    it('returns "strong" for 90%', () => {
      expect(getPerformanceLevel(90)).toBe('strong')
    })

    it('returns "strong" for 95%', () => {
      expect(getPerformanceLevel(95)).toBe('strong')
    })

    it('returns "strong" for 100%', () => {
      expect(getPerformanceLevel(100)).toBe('strong')
    })

    it('returns "strong" for exactly 90%', () => {
      expect(getPerformanceLevel(90)).toBe('strong')
    })
  })

  describe('moderate threshold (70-89%)', () => {
    it('returns "moderate" for 70%', () => {
      expect(getPerformanceLevel(70)).toBe('moderate')
    })

    it('returns "moderate" for 80%', () => {
      expect(getPerformanceLevel(80)).toBe('moderate')
    })

    it('returns "moderate" for 89%', () => {
      expect(getPerformanceLevel(89)).toBe('moderate')
    })

    it('returns "moderate" for exactly 70%', () => {
      expect(getPerformanceLevel(70)).toBe('moderate')
    })
  })

  describe('needs_improvement threshold (< 70%)', () => {
    it('returns "needs_improvement" for 0%', () => {
      expect(getPerformanceLevel(0)).toBe('needs_improvement')
    })

    it('returns "needs_improvement" for 30%', () => {
      expect(getPerformanceLevel(30)).toBe('needs_improvement')
    })

    it('returns "needs_improvement" for 69%', () => {
      expect(getPerformanceLevel(69)).toBe('needs_improvement')
    })

    it('returns "needs_improvement" for 1%', () => {
      expect(getPerformanceLevel(1)).toBe('needs_improvement')
    })
  })

  describe('boundary values', () => {
    it('returns "needs_improvement" for 69%', () => {
      expect(getPerformanceLevel(69)).toBe('needs_improvement')
    })

    it('returns "moderate" for 70% (threshold)', () => {
      expect(getPerformanceLevel(70)).toBe('moderate')
    })

    it('returns "moderate" for 89%', () => {
      expect(getPerformanceLevel(89)).toBe('moderate')
    })

    it('returns "strong" for 90% (threshold)', () => {
      expect(getPerformanceLevel(90)).toBe('strong')
    })
  })

  describe('edge cases', () => {
    it('handles decimal percentages - rounds down conceptually', () => {
      // 69.9 is still below 70
      expect(getPerformanceLevel(69.9)).toBe('needs_improvement')
      // 89.9 is still below 90
      expect(getPerformanceLevel(89.9)).toBe('moderate')
    })

    it('handles exactly threshold values', () => {
      expect(getPerformanceLevel(70)).toBe('moderate')
      expect(getPerformanceLevel(90)).toBe('strong')
    })
  })
})

// =============================================================================
// getPerformanceLabel Tests
// =============================================================================

describe('getPerformanceLabel', () => {
  it('returns "Strong Alignment" for strong level', () => {
    expect(getPerformanceLabel(100)).toBe('Strong Alignment')
    expect(getPerformanceLabel(95)).toBe('Strong Alignment')
    expect(getPerformanceLabel(90)).toBe('Strong Alignment')
  })

  it('returns "Moderate Alignment" for moderate level', () => {
    expect(getPerformanceLabel(89)).toBe('Moderate Alignment')
    expect(getPerformanceLabel(80)).toBe('Moderate Alignment')
    expect(getPerformanceLabel(70)).toBe('Moderate Alignment')
  })

  it('returns "Needs Improvement" for needs_improvement level', () => {
    expect(getPerformanceLabel(69)).toBe('Needs Improvement')
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
    expect(getPerformanceColor(95)).toBe('emerald')
    expect(getPerformanceColor(90)).toBe('emerald')
  })

  it('returns "amber" for moderate level', () => {
    expect(getPerformanceColor(89)).toBe('amber')
    expect(getPerformanceColor(80)).toBe('amber')
    expect(getPerformanceColor(70)).toBe('amber')
  })

  it('returns "rose" for needs_improvement level', () => {
    expect(getPerformanceColor(69)).toBe('rose')
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
    expect(PERFORMANCE_THRESHOLDS.strong.min).toBe(90)
    expect(PERFORMANCE_THRESHOLDS.moderate.min).toBe(70)
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
    // needs_improvement: 0-69
    // moderate: 70-89
    // strong: 90-100
    expect(PERFORMANCE_THRESHOLDS.needs_improvement.min).toBe(0)
    expect(PERFORMANCE_THRESHOLDS.moderate.min).toBe(70)
    expect(PERFORMANCE_THRESHOLDS.strong.min).toBe(90)
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
