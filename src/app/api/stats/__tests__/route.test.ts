import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the service client before importing the route
const mockFrom = vi.fn()

vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: () => ({
    from: mockFrom,
  }),
}))

// Import after mocking
import { GET } from '../route'
import { NextRequest } from 'next/server'

function createRequest(version = '1.0'): NextRequest {
  return new NextRequest(
    `http://localhost:3000/api/stats?version=${version}`
  )
}

describe('GET /api/stats', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('distribution and histogram queries use all responses', () => {
    it('queries survey_responses with is_test filter for score distribution', async () => {
      // Track which table each .from() call targets
      const fromCalls: string[] = []

      mockFrom.mockImplementation((table: string) => {
        fromCalls.push(table)

        if (table === 'survey_stats') {
          return {
            select: () => ({
              eq: () => ({
                single: () =>
                  Promise.resolve({
                    data: {
                      survey_version: '1.0',
                      total_responses: 15,
                      avg_score: 20,
                      avg_percentage: 71.4,
                      median_score: 21,
                      p25_score: 18,
                      p75_score: 24,
                      min_score: 10,
                      max_score: 28,
                      last_updated: '2026-01-01T00:00:00Z',
                    },
                    error: null,
                  }),
              }),
            }),
          }
        }

        if (table === 'question_stats') {
          return {
            select: () => ({
              eq: () => Promise.resolve({ data: [], error: null }),
            }),
          }
        }

        if (table === 'category_stats') {
          return {
            select: () => ({
              eq: () => Promise.resolve({ data: [], error: null }),
            }),
          }
        }

        // This is the distribution/histogram query — should target survey_responses
        if (table === 'survey_responses') {
          return {
            select: () => ({
              eq: () => ({
                eq: () =>
                  Promise.resolve({
                    data: [
                      { total_score: 22 },
                      { total_score: 25 },
                      { total_score: 27 },
                    ],
                    error: null,
                  }),
              }),
            }),
          }
        }

        // Fallback for unexpected tables
        return {
          select: () => ({
            eq: () => ({
              eq: () => Promise.resolve({ data: [], error: null }),
              single: () => Promise.resolve({ data: null, error: null }),
            }),
          }),
        }
      })

      const response = await GET(createRequest())
      const body = await response.json()

      // Verify survey_responses was queried (not latest_survey_responses)
      expect(fromCalls).toContain('survey_responses')
      expect(fromCalls).not.toContain('latest_survey_responses')
      expect(body.available).toBe(true)
    })
  })

  describe('distribution counting with all scores', () => {
    it('correctly computes distribution tiers from all response data', async () => {
      mockFrom.mockImplementation((table: string) => {
        if (table === 'survey_stats') {
          return {
            select: () => ({
              eq: () => ({
                single: () =>
                  Promise.resolve({
                    data: {
                      survey_version: '1.0',
                      total_responses: 12,
                      avg_score: 20,
                      avg_percentage: 71.4,
                      median_score: 20,
                      p25_score: 15,
                      p75_score: 25,
                      min_score: 5,
                      max_score: 28,
                      last_updated: '2026-01-01T00:00:00Z',
                    },
                    error: null,
                  }),
              }),
            }),
          }
        }

        if (table === 'question_stats') {
          return {
            select: () => ({
              eq: () => Promise.resolve({ data: [], error: null }),
            }),
          }
        }

        if (table === 'category_stats') {
          return {
            select: () => ({
              eq: () => Promise.resolve({ data: [], error: null }),
            }),
          }
        }

        if (table === 'survey_responses') {
          return {
            select: () => ({
              eq: () => ({
                eq: () =>
                  Promise.resolve({
                    data: [
                      { total_score: 5 },   // needs improvement (0-19)
                      { total_score: 15 },  // needs improvement
                      { total_score: 19 },  // needs improvement
                      { total_score: 20 },  // moderate (20-25)
                      { total_score: 22 },  // moderate
                      { total_score: 25 },  // moderate
                      { total_score: 26 },  // strong (26-28)
                      { total_score: 27 },  // strong
                      { total_score: 28 },  // strong
                    ],
                    error: null,
                  }),
              }),
            }),
          }
        }

        return {
          select: () => ({
            eq: () => Promise.resolve({ data: [], error: null }),
          }),
        }
      })

      const response = await GET(createRequest())
      const body = await response.json()

      expect(body.data.distribution).toEqual({
        strong: 3,
        moderate: 3,
        needsImprovement: 3,
      })
    })
  })

  describe('histogram bins with all scores', () => {
    it('correctly bins scores into histogram ranges', async () => {
      mockFrom.mockImplementation((table: string) => {
        if (table === 'survey_stats') {
          return {
            select: () => ({
              eq: () => ({
                single: () =>
                  Promise.resolve({
                    data: {
                      survey_version: '1.0',
                      total_responses: 10,
                      avg_score: 15,
                      avg_percentage: 53.6,
                      median_score: 15,
                      p25_score: 8,
                      p75_score: 22,
                      min_score: 2,
                      max_score: 28,
                      last_updated: '2026-01-01T00:00:00Z',
                    },
                    error: null,
                  }),
              }),
            }),
          }
        }

        if (table === 'question_stats') {
          return {
            select: () => ({
              eq: () => Promise.resolve({ data: [], error: null }),
            }),
          }
        }

        if (table === 'category_stats') {
          return {
            select: () => ({
              eq: () => Promise.resolve({ data: [], error: null }),
            }),
          }
        }

        if (table === 'survey_responses') {
          return {
            select: () => ({
              eq: () => ({
                eq: () =>
                  Promise.resolve({
                    data: [
                      { total_score: 2 },   // bin 0-4
                      { total_score: 7 },   // bin 5-9
                      { total_score: 8 },   // bin 5-9
                      { total_score: 12 },  // bin 10-14
                      { total_score: 17 },  // bin 15-19
                      { total_score: 18 },  // bin 15-19
                      { total_score: 22 },  // bin 20-25
                      { total_score: 24 },  // bin 20-25
                      { total_score: 25 },  // bin 20-25
                      { total_score: 28 },  // bin 26-28
                    ],
                    error: null,
                  }),
              }),
            }),
          }
        }

        return {
          select: () => ({
            eq: () => Promise.resolve({ data: [], error: null }),
          }),
        }
      })

      const response = await GET(createRequest())
      const body = await response.json()

      expect(body.data.histogram).toEqual([
        { range: '0-4', label: 'Needs Improvement', tier: 'needs_improvement', count: 1 },
        { range: '5-9', label: 'Needs Improvement', tier: 'needs_improvement', count: 2 },
        { range: '10-14', label: 'Needs Improvement', tier: 'needs_improvement', count: 1 },
        { range: '15-19', label: 'Needs Improvement', tier: 'needs_improvement', count: 2 },
        { range: '20-25', label: 'Moderate', tier: 'moderate', count: 3 },
        { range: '26-28', label: 'Strong', tier: 'strong', count: 1 },
      ])
    })
  })

  describe('edge cases', () => {
    it('returns available: true even with few responses (no threshold)', async () => {
      mockFrom.mockImplementation((table: string) => {
        if (table === 'survey_stats') {
          return {
            select: () => ({
              eq: () => ({
                single: () =>
                  Promise.resolve({
                    data: {
                      survey_version: '1.0',
                      total_responses: 3,
                      avg_score: 20,
                      avg_percentage: 71,
                      median_score: 20,
                      p25_score: 18,
                      p75_score: 22,
                      min_score: 15,
                      max_score: 25,
                      last_updated: '2026-01-01T00:00:00Z',
                    },
                    error: null,
                  }),
              }),
            }),
          }
        }

        if (table === 'question_stats') {
          return {
            select: () => ({
              eq: () => Promise.resolve({ data: [], error: null }),
            }),
          }
        }

        if (table === 'category_stats') {
          return {
            select: () => ({
              eq: () => Promise.resolve({ data: [], error: null }),
            }),
          }
        }

        if (table === 'survey_responses') {
          return {
            select: () => ({
              eq: () => ({
                eq: () =>
                  Promise.resolve({
                    data: [
                      { total_score: 15 },
                      { total_score: 20 },
                      { total_score: 25 },
                    ],
                    error: null,
                  }),
              }),
            }),
          }
        }

        return {
          select: () => ({
            eq: () => Promise.resolve({ data: [], error: null }),
          }),
        }
      })

      const response = await GET(createRequest())
      const body = await response.json()

      expect(body.available).toBe(true)
      expect(body.data.overall.totalResponses).toBe(3)
    })

    it('returns available: false when zero responses', async () => {
      mockFrom.mockImplementation((table: string) => {
        if (table === 'survey_stats') {
          return {
            select: () => ({
              eq: () => ({
                single: () =>
                  Promise.resolve({
                    data: {
                      survey_version: '1.0',
                      total_responses: 0,
                    },
                    error: null,
                  }),
              }),
            }),
          }
        }

        return {
          select: () => ({
            eq: () => Promise.resolve({ data: [], error: null }),
          }),
        }
      })

      const response = await GET(createRequest())
      const body = await response.json()

      expect(body.available).toBe(false)
      expect(body.data).toBeNull()
      expect(body.meta.currentCount).toBe(0)
    })

    it('returns available: false when no stats exist', async () => {
      mockFrom.mockImplementation((table: string) => {
        if (table === 'survey_stats') {
          return {
            select: () => ({
              eq: () => ({
                single: () =>
                  Promise.resolve({
                    data: null,
                    error: { code: 'PGRST116', message: 'No rows found' },
                  }),
              }),
            }),
          }
        }

        return {
          select: () => ({
            eq: () => Promise.resolve({ data: [], error: null }),
          }),
        }
      })

      const response = await GET(createRequest())
      const body = await response.json()

      expect(body.available).toBe(false)
      expect(body.data).toBeNull()
    })

    it('returns 400 for invalid version format', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/stats?version=invalid'
      )

      const response = await GET(request)

      expect(response.status).toBe(400)
      const body = await response.json()
      expect(body.available).toBe(false)
    })
  })
})
