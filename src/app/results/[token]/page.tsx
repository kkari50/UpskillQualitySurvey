import { notFound } from "next/navigation";
import { Header, Footer } from "@/components/layout";
import {
  ResultsHero,
  GapsList,
  PopulationComparison,
  ShareButtons,
  TrendOverTime,
  SurveyClearer,
  StatCard,
  HorizontalBarChartCard,
} from "@/components/results";
import { createServiceClient } from "@/lib/supabase/service";
import { calculateScores, getScoreSummary, getGaps } from "@/lib/scoring";
import type { SurveyAnswers } from "@/data/questions";

// Force dynamic rendering - no caching for results pages
export const dynamic = "force-dynamic";

interface ResultsPageProps {
  params: Promise<{ token: string }>;
}

const MIN_RESPONSES = 10;

async function getResultsData(token: string) {
  const supabase = createServiceClient();

  // Get survey response by token
  const { data: response, error: responseError } = await supabase
    .from("survey_responses")
    .select("*, leads(*)")
    .eq("results_token", token)
    .single();

  if (responseError || !response) {
    return null;
  }

  // Get survey answers
  const { data: answersData, error: answersError } = await supabase
    .from("survey_answers")
    .select("question_id, answer")
    .eq("response_id", response.id);

  if (answersError || !answersData) {
    return null;
  }

  // Convert answers to record format
  const answers: SurveyAnswers = answersData.reduce(
    (acc, item) => ({
      ...acc,
      [item.question_id]: item.answer,
    }),
    {} as SurveyAnswers
  );

  // Get population stats using LIVE queries (not materialized views)
  let populationStats = null;
  let percentile: number | null = null;

  try {
    // Get all non-test responses for this survey version
    const { data: allResponses } = await supabase
      .from("survey_responses")
      .select("id, total_score, max_possible_score")
      .eq("survey_version", response.survey_version)
      .eq("is_test", false);

    const totalResponses = allResponses?.length ?? 0;

    if (totalResponses >= MIN_RESPONSES) {
      // Calculate overall stats from live data
      const scores = allResponses!.map((r) => r.total_score ?? 0);
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      const maxPossible = allResponses![0]?.max_possible_score ?? 27;
      const avgPercentage = Math.round((avgScore / maxPossible) * 100);

      // Calculate median
      const sortedScores = [...scores].sort((a, b) => a - b);
      const mid = Math.floor(sortedScores.length / 2);
      const medianScore =
        sortedScores.length % 2 === 0
          ? (sortedScores[mid - 1] + sortedScores[mid]) / 2
          : sortedScores[mid];

      // Get category stats from live answers
      const responseIds = allResponses!.map((r) => r.id);
      const { data: allAnswers } = await supabase
        .from("survey_answers")
        .select("question_id, answer")
        .in("response_id", responseIds);

      // Calculate per-category averages
      const categoryPrefixes: Record<string, string> = {
        ds_: "daily_sessions",
        tf_: "treatment_fidelity",
        da_: "data_analysis",
        cg_: "caregiver_guidance",
        sup_: "supervision",
      };

      const categoryStats: Record<string, { total: number; yes: number }> = {};
      for (const prefix of Object.keys(categoryPrefixes)) {
        categoryStats[categoryPrefixes[prefix]] = { total: 0, yes: 0 };
      }

      allAnswers?.forEach((a) => {
        for (const [prefix, category] of Object.entries(categoryPrefixes)) {
          if (a.question_id.startsWith(prefix)) {
            categoryStats[category].total++;
            if (a.answer) categoryStats[category].yes++;
            break;
          }
        }
      });

      const categories: Record<string, { avgPercentage: number }> = {};
      for (const [category, stats] of Object.entries(categoryStats)) {
        categories[category] = {
          avgPercentage:
            stats.total > 0 ? Math.round((stats.yes / stats.total) * 100) : 0,
        };
      }

      populationStats = {
        available: true,
        overall: {
          avgPercentage,
          medianScore,
          totalResponses,
        },
        categories,
      };

      // Calculate percentile from live data
      const belowCount = scores.filter((s) => s < response.total_score).length;
      const atCount = scores.filter((s) => s === response.total_score).length;
      percentile = Math.round(
        ((belowCount + 0.5 * atCount) / totalResponses) * 100
      );
    } else {
      populationStats = {
        available: false,
      };
    }
  } catch (err) {
    console.error("[Population Stats Error]", err);
    populationStats = { available: false };
  }

  // Get historical responses for trend over time (if repeat user)
  let historicalScores: Array<{
    date: string;
    percentage: number;
    total: number;
  }> = [];

  try {
    const { data: previousResponses } = await supabase
      .from("survey_responses")
      .select("id, total_score, max_possible_score, completed_at")
      .eq("lead_id", response.lead_id)
      .order("completed_at", { ascending: true });

    if (previousResponses && previousResponses.length > 1) {
      historicalScores = previousResponses.map((r) => ({
        date: r.completed_at,
        percentage: Math.round(
          ((r.total_score ?? 0) / (r.max_possible_score ?? 27)) * 100
        ),
        total: r.total_score ?? 0,
      }));
    }
  } catch {
    // Ignore errors, just don't show trend
  }

  return {
    response,
    answers,
    populationStats,
    percentile,
    historicalScores,
  };
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { token } = await params;
  const data = await getResultsData(token);

  if (!data) {
    notFound();
  }

  const { answers, populationStats, percentile, historicalScores } = data;

  // Calculate scores and summary
  const scores = calculateScores(answers);
  const summary = getScoreSummary(scores);
  const gaps = getGaps(answers);

  const resultsUrl = `/results/${token}`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Clear survey state from localStorage after viewing results */}
      <SurveyClearer />
      <Header />

      <main className="flex-1 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Your Quality Assessment Results
            </h1>
            <p className="text-muted-foreground">
              You&apos;ve taken an important step toward improving quality in your practice.
            </p>
          </div>

          <div className="space-y-6">
            {/* Summary Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                value={`${summary.percentage}%`}
                label="Overall Score"
                trend={summary.percentage >= 85 ? 'up' : summary.percentage >= 60 ? 'neutral' : 'down'}
              />
              <StatCard
                value={`${summary.total}/${summary.maxPossible}`}
                label="Questions Aligned"
              />
              <StatCard
                value={percentile !== null ? `Top ${100 - percentile}%` : 'N/A'}
                label="Percentile Rank"
              />
              <StatCard
                value={gaps.length}
                label="Areas to Improve"
              />
            </div>

            {/* 1. Results Hero - "Here's your overall score!" */}
            <ResultsHero
              total={summary.total}
              maxPossible={summary.maxPossible}
              percentage={summary.percentage}
              level={summary.level}
              label={summary.label}
              color={summary.color}
            />

            {/* Category Breakdown Bar Chart */}
            <HorizontalBarChartCard
              title="Category Breakdown"
              description="Your scores by category"
              data={summary.categories.map((c) => ({
                name: c.name,
                value: c.percentage,
                color: c.percentage >= 85
                  ? 'hsl(160, 84%, 39%)' // emerald-500
                  : c.percentage >= 60
                  ? 'hsl(38, 92%, 50%)' // amber-500
                  : 'hsl(351, 95%, 71%)', // rose-400 #FB7185
              }))}
            />

            {/* 3. Gaps List - "Here's what to focus on" */}
            <GapsList gaps={gaps} />

            {/* 4. Population Comparison - "Here's how you compare to others" */}
            <PopulationComparison
              userPercentage={summary.percentage}
              userCategories={summary.categories.map(c => ({
                id: c.id,
                name: c.name,
                percentage: c.percentage,
              }))}
              populationStats={populationStats}
              percentile={percentile}
            />

            {/* 5. Trend Over Time - "Here's your progress over time" (repeat users only) */}
            <TrendOverTime historicalScores={historicalScores} />

            {/* 6. Share Your Results - "Share your results" */}
            <ShareButtons
              resultsUrl={resultsUrl}
              percentage={summary.percentage}
            />
          </div>

          {/* Call to action */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">
              Want to improve your quality practices? Check back soon for
              resources and tools.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export async function generateMetadata() {
  return {
    title: "Your Results | Quick Quality Assessment",
    description: "View your ABA quality assessment results and recommendations.",
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: "My ABA Quality Assessment Results",
      description:
        "See how your ABA agency practices align with quality standards.",
    },
  };
}
