'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
  LabelList,
} from 'recharts'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'

interface HistogramBin {
  range: string
  label: string
  tier: string
  count: number
}

interface ScoreHistogramCardProps {
  data: HistogramBin[]
  totalResponses?: number
}

const tierColors: Record<string, string> = {
  strong: 'hsl(160, 84%, 39%)',       // emerald-500
  moderate: 'hsl(38, 92%, 50%)',      // amber-500
  needs_improvement: 'hsl(351, 95%, 71%)', // rose-400
}

export function ScoreHistogramCard({ data, totalResponses }: ScoreHistogramCardProps) {
  const totalCount = totalResponses ?? data.reduce((sum, bin) => sum + bin.count, 0)

  if (totalCount === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Score Distribution</CardTitle>
          <CardDescription>
            Number of respondents in each score range
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No data available yet</p>
        </CardContent>
      </Card>
    )
  }

  // Enrich data with percentage and pre-computed bar label
  const enrichedData = data.map((bin) => {
    const percentage = totalCount > 0 ? Math.round((bin.count / totalCount) * 100) : 0
    return {
      ...bin,
      percentage,
      barLabel: bin.count > 0 ? `${percentage}%` : '',
    }
  })

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Score Distribution</CardTitle>
        <CardDescription>
          Number of respondents in each score range
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={enrichedData}
            margin={{ top: 20, right: 10, bottom: 5, left: 10 }}
          >
            <XAxis
              dataKey="range"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              fontSize={11}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const bin = payload[0].payload as (typeof enrichedData)[number]
                  return (
                    <div className="bg-background border rounded-lg shadow-lg px-3 py-2">
                      <p className="font-medium text-sm">
                        Score {bin.range}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {bin.count} respondent{bin.count !== 1 ? 's' : ''} ({bin.percentage}%)
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {bin.label}
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              <LabelList
                dataKey="barLabel"
                position="top"
                fontSize={11}
                fill="hsl(var(--muted-foreground))"
              />
              {enrichedData.map((bin, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={tierColors[bin.tier] ?? tierColors.needs_improvement}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
