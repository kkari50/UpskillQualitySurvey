/**
 * Results Lookup API
 *
 * GET /api/results/lookup?email=xxx - Look up results token by email
 * POST /api/results/lookup - Send magic link email with results URL
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { z } from "zod";
import { resend, FROM_EMAIL } from "@/lib/email/resend";
import { getResultsLinkEmail } from "@/lib/email/templates/results-link";
import { getSurveyInvitationEmail } from "@/lib/email/templates/survey-invitation";

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Helper function to find results token by email
async function findResultsToken(email: string) {
  const supabase = createServiceClient();

  // Find the lead by email
  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .select("id")
    .eq("email", email.toLowerCase())
    .eq("is_test", false)
    .single();

  if (leadError || !lead) {
    return { found: false, message: "No survey found for this email." };
  }

  // Get the most recent survey response for this lead
  const { data: response, error: responseError } = await supabase
    .from("survey_responses")
    .select("results_token")
    .eq("lead_id", lead.id)
    .eq("is_test", false)
    .order("completed_at", { ascending: false })
    .limit(1)
    .single();

  if (responseError || !response) {
    return { found: false, message: "No completed survey found for this email." };
  }

  return { found: true, token: response.results_token };
}

/**
 * GET - Look up results token by email (returns token directly)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    const parsed = emailSchema.safeParse({ email });
    if (!parsed.success) {
      return NextResponse.json(
        { found: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const result = await findResultsToken(parsed.data.email);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Lookup error:", error);
    return NextResponse.json(
      { found: false, message: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * POST - Send magic link email with results URL
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = emailSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://quality-assessment-upskillaba.com";
    const result = await findResultsToken(email);

    // Always send an email to prevent email enumeration attacks
    // If user exists: send results link
    // If user doesn't exist: send survey invitation
    try {
      if (result.found && result.token) {
        // User has completed a survey - send results link
        const resultsUrl = `${baseUrl}/results/${result.token}`;
        const { subject, html, text } = getResultsLinkEmail({ resultsUrl, baseUrl });

        await resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject,
          html,
          text,
        });
      } else {
        // User hasn't taken the survey - send invitation
        const surveyUrl = `${baseUrl}/survey`;
        const { subject, html, text } = getSurveyInvitationEmail({ surveyUrl, baseUrl });

        await resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject,
          html,
          text,
        });
      }
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      // Don't expose email sending errors to client
    }

    // Always return the same success message to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: "Check your inbox! We've sent you an email.",
    });
  } catch (error) {
    console.error("Lookup error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
