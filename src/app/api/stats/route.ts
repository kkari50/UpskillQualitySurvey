/**
 * GET /api/stats
 *
 * Get population statistics for comparison display.
 * Returns aggregated stats only when minimum responses threshold is met.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { statsQuerySchema } from '@/lib/validation/survey';

const MIN_RESPONSES = 10;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const version = searchParams.get('version') ?? '1.0';

    // Validate query parameters
    const parsed = statsQuerySchema.safeParse({ version });
    if (!parsed.success) {
      return NextResponse.json(
        {
          available: false,
          message: 'Invalid version format',
          data: null,
          meta: { surveyVersion: version },
        },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Get overall stats from materialized view
    const { data: surveyStats, error: statsError } = await supabase
      .from('survey_stats')
      .select('*')
      .eq('survey_version', parsed.data.version)
      .single();

    if (statsError && statsError.code !== 'PGRST116') {
      // PGRST116 = no rows found, which is expected if no responses yet
      console.error('Survey stats error:', statsError);
    }

    // Check minimum responses threshold
    if (!surveyStats || (surveyStats.total_responses ?? 0) < MIN_RESPONSES) {
      return NextResponse.json({
        available: false,
        message: 'Not enough responses for comparison data',
        data: null,
        meta: {
          surveyVersion: parsed.data.version,
          minRequired: MIN_RESPONSES,
          currentCount: surveyStats?.total_responses ?? 0,
        },
      });
    }

    // Get question-level stats
    const { data: questionStats } = await supabase
      .from('question_stats')
      .select('*')
      .eq('survey_version', parsed.data.version);

    // Get category-level stats
    const { data: categoryStats } = await supabase
      .from('category_stats')
      .select('*')
      .eq('survey_version', parsed.data.version);

    // Get performance distribution (count by tier)
    // Strong: 85%+ (24-28), Moderate: 60-84% (17-23), Needs Improvement: <60% (0-16)
    const { data: allScores } = await supabase
      .from('survey_responses')
      .select('total_score')
      .eq('survey_version', parsed.data.version)
      .eq('is_test', false);

    const distribution = {
      strong: 0,      // 85%+ (score >= 24)
      moderate: 0,    // 60-84% (score 17-23)
      needsImprovement: 0,  // <60% (score <= 16)
    };

    if (allScores) {
      allScores.forEach((r) => {
        const score = r.total_score ?? 0;
        if (score >= 24) {
          distribution.strong++;
        } else if (score >= 17) {
          distribution.moderate++;
        } else {
          distribution.needsImprovement++;
        }
      });
    }

    // Format response
    return NextResponse.json({
      available: true,
      data: {
        overall: {
          totalResponses: surveyStats.total_responses,
          avgScore: Math.round((surveyStats.avg_score ?? 0) * 10) / 10,
          avgPercentage: Math.round(surveyStats.avg_percentage ?? 0),
          medianScore: surveyStats.median_score,
          p25Score: surveyStats.p25_score,
          p75Score: surveyStats.p75_score,
        },
        questions:
          questionStats?.reduce(
            (acc, q) => ({
              ...acc,
              [q.question_id!]: {
                yesPercentage: Math.round(q.yes_percentage ?? 0),
                totalResponses: q.total_responses,
              },
            }),
            {} as Record<string, { yesPercentage: number; totalResponses: number | null }>
          ) ?? {},
        categories:
          categoryStats?.reduce(
            (acc, c) => ({
              ...acc,
              [c.category!]: {
                avgPercentage: Math.round(c.avg_percentage ?? 0),
              },
            }),
            {} as Record<string, { avgPercentage: number }>
          ) ?? {},
        distribution,
      },
      meta: {
        surveyVersion: parsed.data.version,
        lastUpdated: surveyStats.last_updated ?? new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      {
        available: false,
        message: 'Failed to fetch statistics',
        data: null,
        meta: { error: 'Internal server error' },
      },
      { status: 500 }
    );
  }
}
