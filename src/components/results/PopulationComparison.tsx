"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

interface CategoryScore {
  id: string;
  name: string;
  percentage: number;
}

interface PopulationStats {
  available: boolean;
  overall?: {
    avgPercentage: number;
    medianScore: number | null;
    totalResponses: number | null;
  };
  categories?: Record<string, { avgPercentage: number }>;
}

interface PopulationComparisonProps {
  userPercentage: number;
  userCategories: CategoryScore[];
  populationStats: PopulationStats | null;
  percentile: number | null;
}

export function PopulationComparison({
  userPercentage,
  userCategories,
  populationStats,
  percentile,
}: PopulationComparisonProps) {
  if (!populationStats?.available) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Population Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📊</span>
            </div>
            <p className="text-lg font-medium text-foreground">Coming Soon</p>
            <p className="text-muted-foreground">
              Population comparison data will be available once we have enough
              responses to ensure statistical significance.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const avgPercentage = populationStats.overall?.avgPercentage ?? 0;
  const diff = userPercentage - avgPercentage;
  const isAboveAverage = diff > 0;

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle>How You Compare</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall comparison */}
        <div className="text-center p-4 rounded-lg bg-muted/50">
          {percentile !== null && (
            <p className="text-3xl font-bold text-primary mb-1">
              {percentile >= 50 ? `Top ${100 - percentile}%` : `${getOrdinalSuffix(percentile)} Percentile`}
            </p>
          )}
          <p className="text-muted-foreground">
            Your score is{" "}
            <span
              className={cn(
                "font-semibold",
                isAboveAverage ? "text-emerald-600" : "text-rose-600"
              )}
            >
              {Math.abs(diff)}%{" "}
              {isAboveAverage ? "above" : "below"}
            </span>{" "}
            the population average
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Based on {populationStats.overall?.totalResponses ?? 0} responses
          </p>
        </div>

        {/* Category comparison mini cards */}
        {populationStats.categories && userCategories.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-foreground text-sm">By Category</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {userCategories.map((category) => {
                const popAvg =
                  populationStats.categories?.[category.id]?.avgPercentage ?? 0;
                const catDiff = category.percentage - popAvg;
                const isAbove = catDiff > 0;
                const isEqual = catDiff === 0;

                return (
                  <div
                    key={category.id}
                    className="bg-muted/30 rounded-lg p-3 text-center"
                  >
                    <p className="text-xs text-muted-foreground font-medium truncate mb-2">
                      {category.name}
                    </p>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      {isEqual ? (
                        <Minus className="h-3 w-3 text-muted-foreground" />
                      ) : isAbove ? (
                        <ArrowUp className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <ArrowDown className="h-3 w-3 text-rose-500" />
                      )}
                      <span
                        className={cn(
                          "text-lg font-bold",
                          isEqual
                            ? "text-muted-foreground"
                            : isAbove
                            ? "text-emerald-600"
                            : "text-rose-600"
                        )}
                      >
                        {isAbove ? "+" : ""}
                        {catDiff}%
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      <p>You: {category.percentage}%</p>
                      <p>Avg: {popAvg}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
