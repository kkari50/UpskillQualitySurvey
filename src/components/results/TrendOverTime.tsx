"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface HistoricalScore {
  date: string;
  percentage: number;
  total: number;
}

interface TrendOverTimeProps {
  historicalScores: HistoricalScore[];
}

export function TrendOverTime({ historicalScores }: TrendOverTimeProps) {
  if (historicalScores.length < 2) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const current = historicalScores[historicalScores.length - 1];
  const previous = historicalScores[historicalScores.length - 2];
  const first = historicalScores[0];

  const recentChange = current.percentage - previous.percentage;
  const overallChange = current.percentage - first.percentage;

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-5 w-5 text-emerald-600" />;
    if (change < 0) return <TrendingDown className="h-5 w-5 text-rose-600" />;
    return <Minus className="h-5 w-5 text-muted-foreground" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return "text-emerald-600";
    if (change < 0) return "text-rose-600";
    return "text-muted-foreground";
  };

  const getTrendLabel = (change: number) => {
    if (change > 0) return `+${change}%`;
    if (change < 0) return `${change}%`;
    return "No change";
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Your Progress Over Time
          {getTrendIcon(overallChange)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          You&apos;ve completed this assessment {historicalScores.length} times.
          Here&apos;s how your quality practices have evolved.
        </p>

        {/* Summary stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Since Last Time</p>
            <p className={cn("text-xl font-bold", getTrendColor(recentChange))}>
              {getTrendLabel(recentChange)}
            </p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Overall Change</p>
            <p className={cn("text-xl font-bold", getTrendColor(overallChange))}>
              {getTrendLabel(overallChange)}
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-3">
          {historicalScores.map((score, index) => {
            const isLatest = index === historicalScores.length - 1;
            const changeFromPrevious =
              index > 0
                ? score.percentage - historicalScores[index - 1].percentage
                : null;

            return (
              <div
                key={score.date}
                className={cn(
                  "flex items-center gap-4 p-3 rounded-lg",
                  isLatest ? "bg-primary/5 ring-1 ring-primary/20" : "bg-muted/30"
                )}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "font-semibold",
                        isLatest ? "text-primary" : "text-foreground"
                      )}
                    >
                      {score.percentage}%
                    </span>
                    {isLatest && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                        Latest
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(score.date)}
                  </span>
                </div>

                {changeFromPrevious !== null && (
                  <span
                    className={cn(
                      "text-sm font-medium",
                      getTrendColor(changeFromPrevious)
                    )}
                  >
                    {getTrendLabel(changeFromPrevious)}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {overallChange > 0 && (
          <p className="mt-4 text-sm text-emerald-600 bg-emerald-50 p-3 rounded-lg">
            Great progress! Your quality practices have improved by{" "}
            {overallChange}% since your first assessment.
          </p>
        )}
        {overallChange < 0 && (
          <p className="mt-4 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
            Your score has decreased since your first assessment. Review your
            gaps below to identify areas that may need attention.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
