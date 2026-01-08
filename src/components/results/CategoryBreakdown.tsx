"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CategoryScore {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
  level: string;
  label: string;
  color: string;
}

interface CategoryBreakdownProps {
  categories: CategoryScore[];
}

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

function CircularProgress({
  percentage,
  size = 80,
  strokeWidth = 8,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  // Color based on score per style-guide.md Section 3.4
  const getStrokeColor = () => {
    if (percentage >= 85) return "stroke-emerald-500"; // Strong - #10B981
    if (percentage >= 60) return "stroke-amber-500";   // Moderate - #F59E0B
    return "stroke-rose-400";                          // Needs Improvement - #FB7185
  };

  const strokeColor = getStrokeColor();

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-100"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={cn("transition-all duration-700 ease-out", strokeColor)}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-foreground">{percentage}%</span>
      </div>
    </div>
  );
}

// Badge colors per style-guide.md Section 3.2 (soft backgrounds)
const levelConfig: Record<string, { badge: string; bgColor: string }> = {
  strong: { badge: "Strong", bgColor: "bg-emerald-100 text-emerald-700" },
  moderate: { badge: "Moderate", bgColor: "bg-amber-100 text-amber-700" },
  "needs-improvement": { badge: "Focus Area", bgColor: "bg-rose-100 text-rose-600" },
};

export function CategoryBreakdown({ categories }: CategoryBreakdownProps) {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category) => {
            const config = levelConfig[category.level] ?? levelConfig.moderate;

            return (
              <div
                key={category.id}
                className="flex flex-col items-center text-center space-y-3"
              >
                <CircularProgress
                  percentage={category.percentage}
                  size={80}
                  strokeWidth={8}
                />
                <div className="space-y-1">
                  <h4 className="font-medium text-sm text-foreground leading-tight">
                    {category.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {category.score}/{category.maxScore} aligned
                  </p>
                  <span className={cn(
                    "inline-block text-xs font-medium px-2 py-0.5 rounded-full",
                    config.bgColor
                  )}>
                    {config.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
