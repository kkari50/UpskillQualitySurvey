"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResponseButtons } from "./ResponseButtons";
import type { Question } from "@/data/questions/schema";
import { CATEGORIES } from "@/lib/constants/categories";

interface QuestionCardProps {
  question: Question;
  answer: boolean | null;
  onAnswer: (value: boolean) => void;
}

export function QuestionCard({ question, answer, onAnswer }: QuestionCardProps) {
  const category = CATEGORIES[question.category];

  return (
    <Card className="shadow-lg border-0 mx-2 md:mx-0">
      <CardContent className="p-4 md:p-8 lg:p-12">
        {/* Category badge */}
        <Badge
          variant="secondary"
          className="mb-4 md:mb-6 bg-primary/10 text-primary hover:bg-primary/10"
        >
          {category?.displayName || question.category}
        </Badge>

        {/* Question text */}
        <p className="text-lg md:text-xl lg:text-2xl font-medium text-foreground leading-relaxed mb-6 md:mb-8">
          {question.text}
        </p>

        {/* Response buttons */}
        <ResponseButtons value={answer} onChange={onAnswer} />
      </CardContent>
    </Card>
  );
}
