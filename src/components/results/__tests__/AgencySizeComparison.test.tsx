import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AgencySizeComparison } from '../AgencySizeComparison'

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
  ReferenceLine: () => <div data-testid="reference-line" />,
}))

const sampleSegments = [
  { agencySize: 'solo_small', totalResponses: 15, avgPercentage: 72, medianScore: 20 },
  { agencySize: 'medium', totalResponses: 25, avgPercentage: 78, medianScore: 22 },
  { agencySize: 'large', totalResponses: 12, avgPercentage: 85, medianScore: 24 },
]

describe('AgencySizeComparison', () => {
  it('renders the card with title', () => {
    render(
      <AgencySizeComparison
        segments={sampleSegments}
        userPercentage={80}
        userAgencySize="medium"
      />
    )
    expect(screen.getByText('Comparison by Agency Size')).toBeInTheDocument()
  })

  it('renders the description', () => {
    render(
      <AgencySizeComparison
        segments={sampleSegments}
        userPercentage={80}
        userAgencySize="medium"
      />
    )
    expect(
      screen.getByText('Average scores by agency size category')
    ).toBeInTheDocument()
  })

  it('renders the chart container', () => {
    render(
      <AgencySizeComparison
        segments={sampleSegments}
        userPercentage={80}
        userAgencySize="medium"
      />
    )
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
  })

  it('returns null when segments is empty', () => {
    const { container } = render(
      <AgencySizeComparison
        segments={[]}
        userPercentage={80}
        userAgencySize="medium"
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('returns null when userAgencySize is null', () => {
    const { container } = render(
      <AgencySizeComparison
        segments={sampleSegments}
        userPercentage={80}
        userAgencySize={null}
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders with a single segment', () => {
    render(
      <AgencySizeComparison
        segments={[sampleSegments[0]]}
        userPercentage={70}
        userAgencySize="solo_small"
      />
    )
    expect(screen.getByText('Comparison by Agency Size')).toBeInTheDocument()
  })
})
