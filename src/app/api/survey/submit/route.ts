/**
 * POST /api/survey/submit
 *
 * Submit completed survey and create/update lead record.
 * Returns results token for accessing the results page.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { calculateScores } from '@/lib/scoring';
import { getAgencyDomain, isTestEmail } from '@/lib/constants/email-domains';
import { surveySubmissionSchema, formatZodErrors } from '@/lib/validation/survey';
import { resend, FROM_EMAIL } from '@/lib/email/resend';
import { getResultsLinkEmail } from '@/lib/email/templates/results-link';
import type { UserRole } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    // Parse and validate input
    const body = await request.json();

    // Support both nested and flat formats from EmailCapture
    const normalizedBody = body.lead
      ? body
      : {
          lead: {
            email: body.email,
            name: body.name,
            role: body.role,
            agencySize: body.agencySize,
            primarySetting: body.primarySetting,
            state: body.state,
            marketingConsent: body.marketingConsent,
          },
          survey: {
            answers: body.answers,
            surveyVersion: body.surveyVersion,
          },
        };

    const parsed = surveySubmissionSchema.safeParse(normalizedBody);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: { fieldErrors: formatZodErrors(parsed.error) },
          },
        },
        { status: 400 }
      );
    }

    const { lead, survey } = parsed.data;
    const supabase = createServiceClient();

    // Extract email domain for agency grouping (null for personal emails)
    const emailDomain = getAgencyDomain(lead.email);

    // Check if this is a test email
    const isTest = isTestEmail(lead.email);

    // Upsert lead record (email is unique key)
    // Try with new demographic columns first, fall back to basic fields if columns don't exist
    let leadRecord;
    let leadError;

    // First attempt: include demographic columns (agency_size, primary_setting, state)
    const fullLeadData = {
      email: lead.email,
      name: lead.name || null,
      role: (lead.role || null) as UserRole | null,
      email_domain: emailDomain,
      agency_size: lead.agencySize || null,
      primary_setting: lead.primarySetting || null,
      state: lead.state || null,
      marketing_consent: lead.marketingConsent,
      is_test: isTest,
    };

    const result = await supabase
      .from('leads')
      .upsert(fullLeadData, { onConflict: 'email' })
      .select()
      .single();

    leadRecord = result.data;
    leadError = result.error;

    // If columns don't exist yet (migration not run), retry without new fields
    if (leadError?.code === 'PGRST204' || leadError?.message?.includes('does not exist')) {
      console.warn('Demographic columns not found, using basic fields only');
      const basicLeadData = {
        email: lead.email,
        name: lead.name || null,
        role: (lead.role || null) as UserRole | null,
        email_domain: emailDomain,
        marketing_consent: lead.marketingConsent,
        is_test: isTest,
      };

      const retryResult = await supabase
        .from('leads')
        .upsert(basicLeadData, { onConflict: 'email' })
        .select()
        .single();

      leadRecord = retryResult.data;
      leadError = retryResult.error;
    }

    if (leadError || !leadRecord) {
      console.error('Lead upsert error:', leadError);
      throw new Error('Failed to save lead information');
    }

    // Calculate scores
    const scores = calculateScores(survey.answers);
    const resultsToken = crypto.randomUUID();

    // Insert survey response
    const { data: response, error: responseError } = await supabase
      .from('survey_responses')
      .insert({
        lead_id: leadRecord.id,
        survey_version: survey.surveyVersion,
        total_score: scores.total,
        max_possible_score: scores.maxPossible,
        results_token: resultsToken,
        is_test: isTest,
        // Snapshot demographics at submission time
        agency_size: lead.agencySize || null,
        role: lead.role || null,
        primary_setting: lead.primarySetting || null,
        state: lead.state || null,
      })
      .select()
      .single();

    if (responseError) {
      console.error('Response insert error:', responseError);
      throw new Error('Failed to save survey response');
    }

    // Insert individual answers (27 rows)
    const answers = Object.entries(survey.answers).map(
      ([questionId, answer]) => ({
        response_id: response.id,
        question_id: questionId,
        answer,
      })
    );

    const { error: answersError } = await supabase
      .from('survey_answers')
      .insert(answers);

    if (answersError) {
      console.error('Answers insert error:', answersError);
      throw new Error('Failed to save survey answers');
    }

    // Send results email (skip for test emails)
    if (!isTest) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://quality-assessment-upskillaba.com';
      const resultsUrl = `${baseUrl}/results/${resultsToken}`;

      try {
        const { subject, html, text } = getResultsLinkEmail({ resultsUrl, baseUrl });
        await resend.emails.send({
          from: FROM_EMAIL,
          to: lead.email,
          subject,
          html,
          text,
        });
      } catch (emailError) {
        // Log error but don't fail the submission
        console.error('Failed to send results email:', emailError);
      }
    }

    // Return success with results token
    return NextResponse.json(
      {
        success: true,
        data: {
          resultsToken,
          resultsUrl: `/results/${resultsToken}`,
          score: {
            total: scores.total,
            maxPossible: scores.maxPossible,
            percentage: scores.percentage,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Survey submission error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message:
            error instanceof Error
              ? error.message
              : 'An error occurred. Please try again.',
        },
      },
      { status: 500 }
    );
  }
}
