"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Header, Footer } from "@/components/layout";
import {
  ProgressBar,
  QuestionCard,
  NavigationButtons,
  CategoryTransition,
  SurveyIntro,
} from "@/components/survey";
import { useSurveyStore, isSurveyComplete } from "@/stores/survey";
import { QUESTIONS, TOTAL_QUESTIONS, getQuestionsByCategory } from "@/data/questions";
import { CATEGORY_ORDER, type CategoryId } from "@/lib/constants/categories";

export default function SurveyPage() {
  const router = useRouter();
  const {
    currentQuestionIndex,
    answers,
    showCategoryTransition,
    isStarted,
    setAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
    dismissCategoryTransition,
    startSurvey,
  } = useSurveyStore();

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const currentQuestionId = currentQuestion?.id;
  const currentAnswer = currentQuestionId ? answers[currentQuestionId] ?? null : null;

  // Get category info for transition screen
  const currentCategoryId = currentQuestion?.category as CategoryId | undefined;
  const categoryIndex = currentCategoryId
    ? CATEGORY_ORDER.indexOf(currentCategoryId) + 1
    : 0;
  const questionsInCategory = currentCategoryId
    ? getQuestionsByCategory(currentCategoryId).length
    : 0;

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (showCategoryTransition) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          dismissCategoryTransition();
        }
        return;
      }

      if (!currentQuestionId) return;

      switch (e.key) {
        case "ArrowLeft":
          if (currentQuestionIndex > 0) {
            goToPreviousQuestion();
          }
          break;
        case "ArrowRight":
        case "Enter":
          if (currentAnswer !== null && currentQuestionIndex < TOTAL_QUESTIONS - 1) {
            goToNextQuestion();
          } else if (currentAnswer !== null && currentQuestionIndex === TOTAL_QUESTIONS - 1) {
            if (isSurveyComplete(answers)) {
              router.push("/survey/complete");
            }
          }
          break;
        case "y":
        case "Y":
          setAnswer(currentQuestionId, true);
          break;
        case "n":
        case "N":
          setAnswer(currentQuestionId, false);
          break;
      }
    },
    [
      showCategoryTransition,
      dismissCategoryTransition,
      currentQuestionIndex,
      currentAnswer,
      goToPreviousQuestion,
      goToNextQuestion,
      setAnswer,
      currentQuestionId,
      answers,
      router,
    ]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleNext = () => {
    if (currentQuestionIndex === TOTAL_QUESTIONS - 1) {
      // Last question - check if complete
      if (isSurveyComplete(answers)) {
        router.push("/survey/complete");
      }
    } else {
      goToNextQuestion();
    }
  };

  // Show intro screen if survey hasn't started
  if (!isStarted) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 py-8 md:py-12 px-4">
          <div className="max-w-2xl mx-auto">
            <SurveyIntro onStart={startSurvey} />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-8 md:py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <ProgressBar
            current={currentQuestionIndex + 1}
            total={TOTAL_QUESTIONS}
          />

          {showCategoryTransition && currentCategoryId ? (
            <CategoryTransition
              categoryId={currentCategoryId}
              categoryNumber={categoryIndex}
              totalCategories={CATEGORY_ORDER.length}
              questionCount={questionsInCategory}
              onContinue={dismissCategoryTransition}
            />
          ) : (
            <>
              <QuestionCard
                question={currentQuestion}
                answer={currentAnswer}
                onAnswer={(value) => currentQuestionId && setAnswer(currentQuestionId, value)}
              />

              <NavigationButtons
                onBack={goToPreviousQuestion}
                onNext={handleNext}
                isFirst={currentQuestionIndex === 0}
                isLast={currentQuestionIndex === TOTAL_QUESTIONS - 1}
                hasAnswer={currentAnswer !== null}
              />
            </>
          )}

          {/* Keyboard hint */}
          <p className="text-center text-xs text-muted-foreground mt-8 hidden md:block">
            Tip: Use Y/N keys to answer, arrow keys to navigate
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
