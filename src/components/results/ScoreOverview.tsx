"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ScoreOverviewProps {
  total: number;
  maxPossible: number;
  percentage: number;
  level: string;
  label: string;
  color: string;
}

// Colors per style-guide.md Section 3.4:
// Strong (90%+): emerald-500 (#10B981)
// Moderate (70-89%): amber-500 (#F59E0B)
// Needs Improvement (<70%): rose-400 (#FB7185)
const colorMap: Record<string, { bg: string; text: string; badge: string }> = {
  emerald: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
    badge: "bg-emerald-100 text-emerald-700",
  },
  amber: {
    bg: "bg-amber-500/10",
    text: "text-amber-500",
    badge: "bg-amber-100 text-amber-700",
  },
  rose: {
    bg: "bg-rose-400/10",
    text: "text-rose-400",
    badge: "bg-rose-100 text-rose-600",
  },
};

export function ScoreOverview({
  total,
  maxPossible,
  percentage,
  label,
  color,
}: ScoreOverviewProps) {
  const colors = colorMap[color] ?? colorMap.amber;

  return (
    <Card className="shadow-lg border-0">
      <CardContent className="p-6 md:p-8 text-center">
        <Badge className={cn("mb-4", colors.badge)}>{label}</Badge>

        <div
          className={cn(
            "w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center",
            colors.bg
          )}
        >
          <div className="text-center">
            <span className={cn("text-4xl font-bold", colors.text)}>
              {percentage}%
            </span>
          </div>
        </div>

        <p className="text-2xl font-semibold text-foreground mb-1">
          {total} / {maxPossible}
        </p>
        <p className="text-muted-foreground">
          Quality practices aligned
        </p>
      </CardContent>
    </Card>
  );
}
