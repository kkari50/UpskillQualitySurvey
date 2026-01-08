"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationButtonsProps {
  onBack: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  hasAnswer: boolean;
}

export function NavigationButtons({
  onBack,
  onNext,
  isFirst,
  isLast,
  hasAnswer,
}: NavigationButtonsProps) {
  return (
    <div className="flex justify-between mt-8">
      <Button
        type="button"
        variant="ghost"
        disabled={isFirst}
        onClick={onBack}
        className="text-muted-foreground"
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <Button
        type="button"
        disabled={!hasAnswer}
        onClick={onNext}
        className="px-8"
      >
        {isLast ? "Submit" : "Next"}
        {!isLast && <ChevronRight className="w-4 h-4 ml-2" />}
      </Button>
    </div>
  );
}
