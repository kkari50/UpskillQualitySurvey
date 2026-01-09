'use client'

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ChartData {
  name: string
  value: number
  color?: string
  [key: string]: string | number | undefined
}

interface PieChartCardProps {
  title: string
  description?: string
  data: ChartData[]
  className?: string
  centerLabel?: string
  centerValue?: string | number
}

/**
 * DONUT CHART CENTERING RULES (see DES-008 in decisions.md):
 * ==========================================================
 * Use the CardContent container as reference, NOT Recharts' coordinate system.
 *
 * 1. CardContent has `position: relative` and fixed height (h-[300px])
 * 2. Center label uses `absolute inset-0` overlay with flexbox centering
 * 3. Apply `paddingBottom: 50px` to offset for the legend at bottom
 * 4. Add `pointer-events-none` so overlay doesn't block chart interactions
 * 5. Keep Pie's `cy="45%"` to position chart properly with legend
 *
 * DO NOT use Recharts Label component with manual viewBox offsets - they're
 * fragile and vary with chart size.
 */

// Colors matching style guide - teal primary with complementary palette
const COLORS = [
  'hsl(166, 72%, 40%)', // Teal (primary)
  'hsl(160, 84%, 39%)', // Emerald
  'hsl(38, 92%, 50%)', // Amber
  'hsl(280, 40%, 60%)', // Purple
  'hsl(200, 50%, 55%)', // Blue
]

export function PieChartCard({
  title,
  description,
  data,
  className,
  centerLabel = 'Total',
  centerValue,
}: PieChartCardProps) {
  const filteredData = data.filter((item) => item.value > 0)
  const total = filteredData.reduce((sum, item) => sum + item.value, 0)
  const displayValue = centerValue ?? total

  if (total === 0) {
    return (
      <Card className={cn('shadow-sm', className)}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No data available yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('shadow-sm', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="h-[300px] relative">
        {/* Center label - positioned relative to card, not SVG */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ paddingBottom: '50px' }} /* Account for legend space */
        >
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-foreground">{displayValue}</span>
            <span className="text-sm text-muted-foreground">{centerLabel}</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={filteredData}
              cx="50%"
              cy="45%"
              labelLine={false}
              innerRadius={60}
              outerRadius={90}
              fill="#8884d8"
              dataKey="value"
              label={({ percent, cx, cy, midAngle, outerRadius }) => {
                if ((percent ?? 0) <= 0.05) return null
                const RADIAN = Math.PI / 180
                const radius = (outerRadius ?? 90) + 20
                const angle = midAngle ?? 0
                const x = (cx ?? 0) + radius * Math.cos(-angle * RADIAN)
                const y = (cy ?? 0) + radius * Math.sin(-angle * RADIAN)
                return (
                  <text
                    x={x}
                    y={y}
                    fill="hsl(var(--foreground))"
                    textAnchor={x > (cx ?? 0) ? 'start' : 'end'}
                    dominantBaseline="central"
                    fontSize={12}
                    fontWeight={600}
                  >
                    {`${((percent ?? 0) * 100).toFixed(0)}%`}
                  </text>
                )
              }}
            >
              {filteredData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0]
                  const value = data.value as number
                  const name = data.name as string
                  return (
                    <div className="bg-background border rounded-lg shadow-lg px-3 py-2">
                      <p className="font-medium text-sm">{name}</p>
                      <p className="text-muted-foreground text-sm">
                        {value} ({((value / total) * 100).toFixed(1)}%)
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
