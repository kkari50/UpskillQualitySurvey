'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  Tooltip,
} from 'recharts'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'

interface AgencySizeSegment {
  agencySize: string
  totalResponses: number
  avgPercentage: number
  medianScore: number
}

interface AgencySizeComparisonProps {
  segments: AgencySizeSegment[]
  userPercentage: number
  userAgencySize: string | null
}

const agencySizeLabels: Record<string, string> = {
  solo_small: 'Solo / Small (1-10 BCBAs)',
  medium: 'Medium (11-50 BCBAs)',
  large: 'Large (51-200 BCBAs)',
  enterprise: 'Enterprise (200+ BCBAs)',
}

const agencySizeShortLabels: Record<string, string> = {
  solo_small: 'Small',
  medium: 'Medium',
  large: 'Large',
  enterprise: 'Enterprise',
}

export function AgencySizeComparison({
  segments,
  userPercentage,
  userAgencySize,
}: AgencySizeComparisonProps) {
  if (!userAgencySize || segments.length === 0) {
    return null
  }

  const chartData = segments.map((s) => ({
    name: agencySizeShortLabels[s.agencySize] ?? s.agencySize,
    fullName: agencySizeLabels[s.agencySize] ?? s.agencySize,
    avgPercentage: s.avgPercentage,
    totalResponses: s.totalResponses,
    isUserSegment: s.agencySize === userAgencySize,
  }))

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Comparison by Agency Size</CardTitle>
        <CardDescription>
          Average scores by agency size category
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 10, bottom: 5, left: 10 }}
          >
            <XAxis
              dataKey="name"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, 100]}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as (typeof chartData)[number]
                  return (
                    <div className="bg-background border rounded-lg shadow-lg px-3 py-2">
                      <p className="font-medium text-sm">{data.fullName}</p>
                      <p className="text-muted-foreground text-sm">
                        Avg: {data.avgPercentage}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {data.totalResponses} responses
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            {/* User's score reference line */}
            <ReferenceLine
              y={userPercentage}
              stroke="hsl(var(--foreground))"
              strokeWidth={2}
              strokeDasharray="6 3"
              label={{
                value: `Your Score: ${userPercentage}%`,
                position: 'right',
                fontSize: 11,
                fill: 'hsl(var(--foreground))',
              }}
            />
            <Bar
              dataKey="avgPercentage"
              radius={[4, 4, 0, 0]}
              label={{
                position: 'top',
                fontSize: 11,
                fill: 'hsl(var(--muted-foreground))',
                formatter: (value: unknown) => `${value}%`,
              }}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.isUserSegment
                      ? 'hsl(166, 72%, 40%)' // teal (highlighted)
                      : 'hsl(var(--muted-foreground) / 0.3)' // muted
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
