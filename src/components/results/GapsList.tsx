"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Gap {
  questionId: string;
  questionText: string;
  categoryId: string;
  categoryName: string;
}

interface GapsListProps {
  gaps: Gap[];
}

export function GapsList({ gaps }: GapsListProps) {
  if (gaps.length === 0) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Areas for Improvement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✨</span>
            </div>
            <p className="text-lg font-medium text-foreground">
              Perfect Score!
            </p>
            <p className="text-muted-foreground">
              You&apos;ve aligned with all quality practices.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group gaps by category
  const gapsByCategory = gaps.reduce(
    (acc, gap) => {
      if (!acc[gap.categoryId]) {
        acc[gap.categoryId] = {
          categoryName: gap.categoryName,
          gaps: [],
        };
      }
      acc[gap.categoryId].gaps.push(gap);
      return acc;
    },
    {} as Record<string, { categoryName: string; gaps: Gap[] }>
  );

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle>Areas for Improvement ({gaps.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={Object.keys(gapsByCategory)}>
          {Object.entries(gapsByCategory).map(([categoryId, { categoryName, gaps: categoryGaps }]) => (
            <AccordionItem key={categoryId} value={categoryId}>
              <AccordionTrigger className="hover:no-underline">
                <span className="font-medium">
                  {categoryName} ({categoryGaps.length})
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-3 pt-2">
                  {categoryGaps.map((gap) => (
                    <li
                      key={gap.questionId}
                      className="flex items-start gap-3 text-sm"
                    >
                      <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        ✗
                      </span>
                      <span className="text-muted-foreground">
                        {gap.questionText}
                      </span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
