"use client";

import { useEffect, useRef } from "react";
import { useSurveyStore } from "@/stores/survey";

/**
 * Client component that clears survey state when mounted.
 * Used on the results page to reset localStorage after successful submission.
 */
export function SurveyClearer() {
  const { resetSurvey, answers } = useSurveyStore();
  const hasReset = useRef(false);

  useEffect(() => {
    // Reset survey if there are any answers stored (user just submitted)
    // Only run once to avoid infinite loops
    const hasAnswers = Object.keys(answers).length > 0;
    if (hasAnswers && !hasReset.current) {
      hasReset.current = true;
      resetSurvey();
    }
  }, [resetSurvey, answers]);

  // This component renders nothing
  return null;
}
