import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the service client before importing the route
const mockFrom = vi.fn()
const mockSelect = vi.fn()
const mockEq = vi.fn()

vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: () => ({
    from: mockFrom,
  }),
}))

// Import after mocking
import { GET } from '../by-agency-size/route'
import { NextRequest } from 'next/server'

function createRequest(version = '1.0'): NextRequest {
  return new NextRequest(
    `http://localhost:3000/api/stats/by-agency-size?version=${version}`
  )
}

describe('GET /api/stats/by-agency-size', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Default mock chain: from → select → eq (no gte threshold)
    mockFrom.mockReturnValue({ select: mockSelect })
    mockSelect.mockReturnValue({ eq: mockEq })
  })

  it('returns available: false when no data exists', async () => {
    mockEq.mockResolvedValue({ data: [], error: null })

    const response = await GET(createRequest())
    const body = await response.json()

    expect(body.available).toBe(false)
    expect(body.data).toEqual([])
  })

  it('returns data for all segments', async () => {
    mockEq.mockResolvedValue({
      data: [
        {
          agency_size: 'solo_small',
          total_responses: 5,
          avg_percentage: 75.5,
          median_score: 21,
        },
        {
          agency_size: 'medium',
          total_responses: 2,
          avg_percentage: 82.3,
          median_score: 23,
        },
      ],
      error: null,
    })

    const response = await GET(createRequest())
    const body = await response.json()

    expect(body.available).toBe(true)
    expect(body.data).toHaveLength(2)
    expect(body.data[0].agencySize).toBe('solo_small')
    expect(body.data[0].totalResponses).toBe(5)
    expect(body.data[0].avgPercentage).toBe(76)
    expect(body.data[0].medianScore).toBe(21)
  })

  it('queries the correct view with version filter', async () => {
    mockEq.mockResolvedValue({ data: [], error: null })

    await GET(createRequest('1.0'))

    expect(mockFrom).toHaveBeenCalledWith('stats_by_agency_size')
    expect(mockSelect).toHaveBeenCalledWith('*')
    expect(mockEq).toHaveBeenCalledWith('survey_version', '1.0')
  })

  it('returns 500 on database error', async () => {
    mockEq.mockResolvedValue({
      data: null,
      error: { message: 'DB error' },
    })

    const response = await GET(createRequest())

    expect(response.status).toBe(500)
    const body = await response.json()
    expect(body.available).toBe(false)
  })

  it('returns 400 for invalid version format', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/stats/by-agency-size?version=invalid'
    )

    const response = await GET(request)

    expect(response.status).toBe(400)
    const body = await response.json()
    expect(body.available).toBe(false)
  })
})
