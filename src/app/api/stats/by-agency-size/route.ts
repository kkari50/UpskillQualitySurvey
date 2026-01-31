/**
 * GET /api/stats/by-agency-size
 *
 * Get segmented population statistics by agency size.
 * Reads from the stats_by_agency_size materialized view.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { statsQuerySchema } from '@/lib/validation/survey';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const version = searchParams.get('version') ?? '1.0';

    const parsed = statsQuerySchema.safeParse({ version });
    if (!parsed.success) {
      return NextResponse.json(
        {
          available: false,
          message: 'Invalid version format',
          data: [],
        },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    const { data: segments, error } = await supabase
      .from('stats_by_agency_size')
      .select('*')
      .eq('survey_version', parsed.data.version);

    if (error) {
      console.error('Agency size stats error:', error);
      return NextResponse.json(
        {
          available: false,
          message: 'Failed to fetch agency size statistics',
          data: [],
        },
        { status: 500 }
      );
    }

    if (!segments || segments.length === 0) {
      return NextResponse.json({
        available: false,
        data: [],
      });
    }

    return NextResponse.json({
      available: true,
      data: segments.map((s) => ({
        agencySize: s.agency_size,
        totalResponses: s.total_responses,
        avgPercentage: Math.round(s.avg_percentage ?? 0),
        medianScore: s.median_score,
      })),
    });
  } catch (error) {
    console.error('Agency size stats error:', error);
    return NextResponse.json(
      {
        available: false,
        message: 'Failed to fetch agency size statistics',
        data: [],
      },
      { status: 500 }
    );
  }
}
