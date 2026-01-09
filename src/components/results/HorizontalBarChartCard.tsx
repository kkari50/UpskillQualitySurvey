'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
  LabelList,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ChartData {
  name: string
  value: number
  color?: string
}

interface HorizontalBarChartCardProps {
  title: string
  description?: string
  data: ChartData[]
  className?: string
  maxItems?: number
  color?: string
}

// Modern teal gradient base color
const DEFAULT_COLOR = 'hsl(166, 72%, 40%)'

export function HorizontalBarChartCard({
  title,
  description,
  data,
  className,
  maxItems = 10,
  color = DEFAULT_COLOR,
}: HorizontalBarChartCardProps) {
  const sortedData = [...data]
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, maxItems)

  const total = sortedData.reduce((sum, item) => sum + item.value, 0)

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
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 10, right: 45, left: 10, bottom: 10 }}
            barCategoryGap="20%"
          >
            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={130}
              tick={(props) => {
                const { x, y, payload } = props
                const words = payload.value.split(' ')
                return (
                  <text
                    x={x}
                    y={y}
                    textAnchor="end"
                    fill="hsl(var(--foreground))"
                    fontSize={11}
                  >
                    {words.length > 1 ? (
                      <>
                        <tspan x={x} dy="-0.4em">{words[0]}</tspan>
                        <tspan x={x} dy="1.2em">{words.slice(1).join(' ')}</tspan>
                      </>
                    ) : (
                      payload.value
                    )}
                  </text>
                )
              }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={(value) => [`${value}%`, 'Score']}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="value" radius={[0, 6, 6, 0]}>
              {sortedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || color}
                  fillOpacity={1 - index * 0.12}
                />
              ))}
              <LabelList
                dataKey="value"
                position="right"
                fontSize={11}
                formatter={(value) => `${value}%`}
                className="fill-muted-foreground"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
