import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ScoreHistogramCard } from '../ScoreHistogramCard'

// Mock Recharts to avoid rendering issues in test environment
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <svg data-testid="bar-chart">{children}</svg>
  ),
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Cell: () => <div data-testid="cell" />,
  LabelList: () => <div data-testid="label-list" />,
}))

const sampleData = [
  { range: '0-4', label: 'Needs Improvement', tier: 'needs_improvement', count: 2 },
  { range: '5-9', label: 'Needs Improvement', tier: 'needs_improvement', count: 5 },
  { range: '10-14', label: 'Needs Improvement', tier: 'needs_improvement', count: 8 },
  { range: '15-19', label: 'Needs Improvement', tier: 'needs_improvement', count: 12 },
  { range: '20-25', label: 'Moderate', tier: 'moderate', count: 20 },
  { range: '26-28', label: 'Strong', tier: 'strong', count: 15 },
]

describe('ScoreHistogramCard', () => {
  it('renders the card with title', () => {
    render(<ScoreHistogramCard data={sampleData} />)
    expect(screen.getByText('Score Distribution')).toBeInTheDocument()
  })

  it('renders the description', () => {
    render(<ScoreHistogramCard data={sampleData} />)
    expect(
      screen.getByText('Number of respondents in each score range')
    ).toBeInTheDocument()
  })

  it('renders the Recharts chart container', () => {
    render(<ScoreHistogramCard data={sampleData} />)
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
  })

  it('renders empty state when all counts are zero', () => {
    const emptyData = sampleData.map((d) => ({ ...d, count: 0 }))
    render(<ScoreHistogramCard data={emptyData} />)
    expect(screen.getByText('No data available yet')).toBeInTheDocument()
  })

  it('renders empty state when data is empty array', () => {
    render(<ScoreHistogramCard data={[]} />)
    expect(screen.getByText('No data available yet')).toBeInTheDocument()
  })

  it('renders chart when data has values', () => {
    render(<ScoreHistogramCard data={sampleData} />)
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
  })

  it('accepts optional totalResponses prop', () => {
    render(<ScoreHistogramCard data={sampleData} totalResponses={100} />)
    expect(screen.getByText('Score Distribution')).toBeInTheDocument()
  })

  it('shows empty state when totalResponses is 0', () => {
    render(<ScoreHistogramCard data={sampleData} totalResponses={0} />)
    expect(screen.getByText('No data available yet')).toBeInTheDocument()
  })
})
