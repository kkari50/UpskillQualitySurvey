'use client'

import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  value: number | string
  label: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  subtext?: string
  className?: string
}

export function StatCard({
  value,
  label,
  trend,
  trendValue,
  subtext,
  className,
}: StatCardProps) {
  const formatValue = (val: number | string) => {
    if (typeof val === 'number') {
      return val.toLocaleString()
    }
    return val
  }

  const TrendIcon = {
    up: TrendingUp,
    down: TrendingDown,
    neutral: Minus,
  }[trend || 'neutral']

  const trendColor = {
    up: 'text-emerald-600',
    down: 'text-rose-600',
    neutral: 'text-muted-foreground',
  }[trend || 'neutral']

  return (
    <Card className={cn('shadow-lg border-0', className)}>
      <CardContent className="pt-6">
        <div className="text-3xl font-bold text-primary">
          {formatValue(value)}
        </div>
        <p className="text-sm text-muted-foreground mt-1">{label}</p>
        {subtext && (
          <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
        )}
        {trend && (
          <div className={cn('flex items-center gap-1 mt-2 text-sm', trendColor)}>
            <TrendIcon className="h-4 w-4" />
            {trendValue && <span>{trendValue}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
