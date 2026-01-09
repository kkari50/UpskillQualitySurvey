"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header, Footer } from "@/components/layout";
import { EmailCapture } from "@/components/forms";
import { useSurveyStore, isSurveyComplete } from "@/stores/survey";

export default function SurveyCompletePage() {
  const router = useRouter();
  const { answers, isCompleted } = useSurveyStore();

  // Redirect if survey not complete
  useEffect(() => {
    if (!isSurveyComplete(answers) && !isCompleted) {
      router.push("/survey");
    }
  }, [answers, isCompleted, router]);

  // Don't render until we've checked completion
  if (!isSurveyComplete(answers) && !isCompleted) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-8 md:py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎉</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Survey Complete!
            </h1>
            <p className="text-muted-foreground">
              You&apos;ve answered all 28 questions. Enter your email to see your results.
            </p>
          </div>

          <EmailCapture />
        </div>
      </main>

      <Footer />
    </div>
  );
}
