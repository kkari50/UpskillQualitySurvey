"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  ArrowRight,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
} from "lucide-react";
import { QUESTIONS } from "@/data/questions/v1.0";
import { StatCard, PieChartCard, HorizontalBarChartCard, FetchResultsForm } from "@/components/results";

interface PopulationStats {
  available: boolean;
  data?: {
    overall: {
      totalResponses: number;
      avgScore: number;
      avgPercentage: number;
      medianScore: number;
      p25Score: number;
      p75Score: number;
    };
    categories: Record<string, { avgPercentage: number }>;
    questions: Record<string, { yesPercentage: number; totalResponses: number | null }>;
    distribution: {
      strong: number;
      moderate: number;
      needsImprovement: number;
    };
  };
  meta?: {
    surveyVersion: string;
    minRequired?: number;
    currentCount?: number;
  };
}


// Category display names and order
const categoryOrder = [
  "daily_sessions",
  "treatment_fidelity",
  "data_analysis",
  "caregiver_guidance",
  "supervision",
];

const categoryNames: Record<string, string> = {
  daily_sessions: "Daily Sessions",
  treatment_fidelity: "Treatment Fidelity",
  data_analysis: "Data Analysis",
  caregiver_guidance: "Caregiver Guidance",
  supervision: "Supervision",
};

// Helper to get question text by ID
function getQuestionText(questionId: string): string {
  const question = QUESTIONS.find((q) => q.id === questionId);
  return question?.text ?? questionId;
}

// Helper to truncate long text
function truncateText(text: string, maxLength: number = 80): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export default function ResultsPage() {
  const [stats, setStats] = useState<PopulationStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch population stats on mount
  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        setStats({ available: false });
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Survey Results
            </h1>
            <p className="text-muted-foreground">
              View population benchmarks or look up your personal results
            </p>
          </div>

          {/* Email Lookup Card - Magic Link */}
          <div className="mb-8 max-w-md mx-auto sm:max-w-none sm:mx-0">
            <FetchResultsForm />
          </div>

          {/* Population Statistics */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Population Benchmarks</h2>
            </div>

            {loading ? (
              <Card>
                <CardContent className="py-12 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </CardContent>
              </Card>
            ) : stats?.available && stats.data ? (
              <>
                {/* Summary Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <StatCard
                    value={stats.data.overall.totalResponses.toLocaleString()}
                    label="Total Responses"
                  />
                  <StatCard
                    value={`${stats.data.overall.avgPercentage}%`}
                    label="Average Score"
                    trend={stats.data.overall.avgPercentage >= 75 ? 'up' : stats.data.overall.avgPercentage >= 60 ? 'neutral' : 'down'}
                  />
                  <StatCard
                    value={stats.data.distribution.strong}
                    label="Strong Alignment"
                    trend="up"
                  />
                  <StatCard
                    value={stats.data.distribution.needsImprovement}
                    label="Needs Improvement"
                    trend="down"
                  />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Performance Distribution Pie Chart */}
                  <PieChartCard
                    title="Performance Distribution"
                    description={`How ${stats.data.overall.totalResponses.toLocaleString()} respondents scored`}
                    data={[
                      {
                        name: 'Strong (85%+)',
                        value: stats.data.distribution.strong,
                        color: 'hsl(160, 84%, 39%)',
                      },
                      {
                        name: 'Moderate (60-84%)',
                        value: stats.data.distribution.moderate,
                        color: 'hsl(38, 92%, 50%)',
                      },
                      {
                        name: 'Needs Work (<60%)',
                        value: stats.data.distribution.needsImprovement,
                        color: 'hsl(351, 95%, 71%)', // rose-400 #FB7185
                      },
                    ]}
                    centerLabel="Total"
                    centerValue={stats.data.overall.totalResponses}
                  />

                  {/* Category Averages Bar Chart */}
                  <HorizontalBarChartCard
                    title="Category Averages"
                    description="Average scores by category across all respondents"
                    data={categoryOrder.map((key) => ({
                      name: categoryNames[key] || key,
                      value: stats.data!.categories[key]?.avgPercentage || 0,
                      color: (stats.data!.categories[key]?.avgPercentage || 0) >= 85
                        ? 'hsl(160, 84%, 39%)' // emerald-500
                        : (stats.data!.categories[key]?.avgPercentage || 0) >= 60
                        ? 'hsl(38, 92%, 50%)' // amber-500
                        : 'hsl(351, 95%, 71%)', // rose-400 #FB7185
                    }))}
                  />
                </div>

                {/* Top & Bottom Practices */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Practice Insights
                    </CardTitle>
                    <CardDescription>
                      Strongest and weakest areas across all respondents
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      // Sort questions by yes percentage
                      const questionEntries = Object.entries(stats.data!.questions)
                        .map(([id, data]) => ({
                          id,
                          text: getQuestionText(id),
                          yesPercentage: data.yesPercentage,
                        }))
                        .sort((a, b) => b.yesPercentage - a.yesPercentage);

                      const top3 = questionEntries.slice(0, 3);
                      const bottom3 = questionEntries.slice(-3).reverse();

                      return (
                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Strongest */}
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <ThumbsUp className="w-4 h-4 text-emerald-600" />
                              <span className="font-semibold text-emerald-700">
                                Strongest Practices
                              </span>
                            </div>
                            <div className="space-y-2">
                              {top3.map((q) => (
                                <div
                                  key={q.id}
                                  className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg"
                                >
                                  <span className="text-emerald-600 font-bold text-sm whitespace-nowrap">
                                    {q.yesPercentage}%
                                  </span>
                                  <span className="text-sm text-foreground leading-tight">
                                    {truncateText(q.text)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Weakest */}
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <ThumbsDown className="w-4 h-4 text-rose-500" />
                              <span className="font-semibold text-rose-600">
                                Areas Needing Attention
                              </span>
                            </div>
                            <div className="space-y-2">
                              {bottom3.map((q) => (
                                <div
                                  key={q.id}
                                  className="flex items-start gap-3 p-3 bg-rose-50 rounded-lg"
                                >
                                  <span className="text-rose-500 font-bold text-sm whitespace-nowrap">
                                    {q.yesPercentage}%
                                  </span>
                                  <span className="text-sm text-foreground leading-tight">
                                    {truncateText(q.text)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>

                {/* CTA */}
                <Card className="bg-gradient-to-r from-teal-50 to-emerald-50 border-teal-200">
                  <CardContent className="py-8 text-center">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Ready to See How You Compare?
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Take our 5-minute assessment to see your personalized results
                    </p>
                    <Button asChild size="lg">
                      <Link href="/survey">
                        Take the Assessment
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Building Our Benchmarks
                  </h3>
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    We need at least {stats?.meta?.minRequired || 10} survey responses to
                    show meaningful population statistics.
                    {stats?.meta?.currentCount !== undefined && (
                      <span className="block mt-2 text-sm">
                        Current: {stats.meta.currentCount} responses
                      </span>
                    )}
                  </p>
                  <Button asChild>
                    <Link href="/survey">
                      Be One of the First
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
