"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, ChevronRight } from "lucide-react";

interface HistoricalScore {
  date: string;
  percentage: number;
  total: number;
  resultsToken: string;
}

interface TrendOverTimeProps {
  historicalScores: HistoricalScore[];
  currentToken: string;
}

export function TrendOverTime({ historicalScores, currentToken }: TrendOverTimeProps) {
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

  // Sort by date descending (newest first) for display
  const sortedScores = [...historicalScores].reverse();

  // Original order for calculations (oldest first)
  const latest = historicalScores[historicalScores.length - 1];
  const previous = historicalScores[historicalScores.length - 2];
  const first = historicalScores[0];

  const recentChange = latest.percentage - previous.percentage;
  const overallChange = latest.percentage - first.percentage;

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
          Click any entry to view those results.
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

        {/* Timeline - newest first */}
        <div className="space-y-3">
          {sortedScores.map((score) => {
            const isCurrentlyViewing = score.resultsToken === currentToken;
            const isLatest = score.resultsToken === latest.resultsToken;

            // Calculate change from previous (in original chronological order)
            const originalIndex = historicalScores.findIndex(
              (s) => s.resultsToken === score.resultsToken
            );
            const changeFromPrevious =
              originalIndex > 0
                ? score.percentage - historicalScores[originalIndex - 1].percentage
                : null;

            const content = (
              <div
                className={cn(
                  "flex items-center gap-4 p-3 rounded-lg transition-colors",
                  isCurrentlyViewing
                    ? "bg-primary/10 ring-2 ring-primary"
                    : "bg-muted/30 hover:bg-muted/50 cursor-pointer"
                )}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "font-semibold",
                        isCurrentlyViewing ? "text-primary" : "text-foreground"
                      )}
                    >
                      {score.percentage}%
                    </span>
                    {isLatest && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                        Latest
                      </span>
                    )}
                    {isCurrentlyViewing && !isLatest && (
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                        Viewing
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

                {!isCurrentlyViewing && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            );

            if (isCurrentlyViewing) {
              return <div key={score.resultsToken}>{content}</div>;
            }

            return (
              <Link
                key={score.resultsToken}
                href={`/results/${score.resultsToken}`}
                className="block"
              >
                {content}
              </Link>
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
