/**
 * GET /api/stats/percentile
 *
 * Get percentile rank for a specific score.
 * Uses score_distribution view for calculation.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { percentileQuerySchema } from '@/lib/validation/survey';
import { calculatePercentile } from '@/lib/scoring';


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const scoreParam = searchParams.get('score');
    const version = searchParams.get('version') ?? '1.0';

    // Validate query parameters
    const parsed = percentileQuerySchema.safeParse({
      score: scoreParam,
      version,
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid query parameters',
            details: parsed.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    const { score, version: surveyVersion } = parsed.data;
    const supabase = createServiceClient();

    // Get score distribution from view
    const { data: distribution, error } = await supabase
      .from('score_distribution')
      .select('total_score, frequency')
      .eq('survey_version', surveyVersion);

    if (error) {
      console.error('Score distribution error:', error);
      throw new Error('Failed to fetch score distribution');
    }

    // Check if we have enough data
    const totalResponses =
      distribution?.reduce((sum, d) => sum + (d.frequency ?? 0), 0) ?? 0;

    if (totalResponses === 0) {
      return NextResponse.json({
        score,
        percentile: null,
        message: 'No data for percentile calculation',
        meta: {
          currentCount: 0,
        },
      });
    }

    // Format distribution for percentile calculation
    const formattedDistribution =
      distribution?.map((d) => ({
        score: d.total_score ?? 0,
        count: d.frequency ?? 0,
      })) ?? [];

    // Calculate percentile
    const percentile = calculatePercentile(score, formattedDistribution);

    return NextResponse.json({
      score,
      percentile,
      message: `Higher than ${percentile}% of respondents`,
      meta: {
        surveyVersion,
        totalResponses,
      },
    });
  } catch (error) {
    console.error('Percentile error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to calculate percentile',
        },
      },
      { status: 500 }
    );
  }
}
