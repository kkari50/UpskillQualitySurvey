"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORIES, type CategoryId } from "@/lib/constants/categories";

interface CategoryTransitionProps {
  categoryId: CategoryId;
  categoryNumber: number;
  totalCategories: number;
  questionCount: number;
  onContinue: () => void;
}

const transitionMessages: Record<CategoryId, string> = {
  daily_sessions: "Let's start with Daily Sessions practices.",
  treatment_fidelity: "Great progress! Now let's look at Treatment Fidelity.",
  data_analysis: "Moving on to Data Analysis practices.",
  caregiver_guidance: "Now let's assess your Caregiver Guidance.",
  supervision: "Almost there! Final section: Supervision.",
};

export function CategoryTransition({
  categoryId,
  categoryNumber,
  totalCategories,
  questionCount,
  onContinue,
}: CategoryTransitionProps) {
  const category = CATEGORIES[categoryId];

  return (
    <Card className="shadow-lg border-0 mx-2 md:mx-0">
      <CardContent className="p-8 md:p-12 text-center">
        <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">
          Section {categoryNumber} of {totalCategories}
        </Badge>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          {category?.displayName}
        </h2>
        <p className="text-muted-foreground mb-2">
          {transitionMessages[categoryId]}
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          {questionCount} questions
        </p>
        <Button onClick={onContinue} className="px-8">
          Continue
        </Button>
      </CardContent>
    </Card>
  );
}
