/**
 * GET /api/results/lookup
 *
 * Look up a user's most recent survey results by email address.
 * Returns the results token if found.
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { z } from "zod";

const querySchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    // Validate email
    const parsed = querySchema.safeParse({ email });
    if (!parsed.success) {
      return NextResponse.json(
        {
          found: false,
          message: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Find the lead by email
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("id")
      .eq("email", parsed.data.email.toLowerCase())
      .eq("is_test", false)
      .single();

    if (leadError || !lead) {
      return NextResponse.json({
        found: false,
        message: "No survey found for this email. Would you like to take the survey?",
      });
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
      return NextResponse.json({
        found: false,
        message: "No completed survey found for this email.",
      });
    }

    return NextResponse.json({
      found: true,
      token: response.results_token,
    });
  } catch (error) {
    console.error("Lookup error:", error);
    return NextResponse.json(
      {
        found: false,
        message: "An error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}
