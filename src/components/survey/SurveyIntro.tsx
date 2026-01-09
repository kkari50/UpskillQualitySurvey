"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  TrendingUp,
  Lightbulb,
  Clock,
  ArrowRight,
  Info,
} from "lucide-react";

interface SurveyIntroProps {
  onStart: () => void;
}

export function SurveyIntro({ onStart }: SurveyIntroProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="shadow-lg border-0">
        <CardContent className="p-6 md:p-8">
          <Badge
            variant="secondary"
            className="mb-4 bg-primary/10 text-primary hover:bg-primary/10"
          >
            Quality Assessment
          </Badge>

          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Welcome to the Quick Quality Assessment
          </h1>

          <p className="text-muted-foreground mb-6">
            This 5-minute assessment helps you evaluate your agency&apos;s clinical
            quality practices across 28 research-backed questions.
          </p>

          {/* What You'll Discover */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              What You&apos;ll Discover
            </h2>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Strengths</p>
                  <p className="text-sm text-muted-foreground">
                    Areas where your agency excels in clinical quality
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Growth Opportunities</p>
                  <p className="text-sm text-muted-foreground">
                    Practices that may benefit from additional attention
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Actionable Insights</p>
                  <p className="text-sm text-muted-foreground">
                    Specific recommendations and resources for improvement
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Time estimate */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 p-3 bg-slate-50 rounded-lg">
            <Clock className="w-4 h-4" />
            <span>Complete all 28 questions to receive your personalized results with population benchmarks.</span>
          </div>

          {/* Start Button */}
          <Button
            onClick={onStart}
            size="lg"
            className="w-full h-12 text-lg font-semibold"
          >
            Begin Assessment
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </CardContent>
      </Card>

      {/* Disclaimer Card */}
      <Card className="border-slate-200 bg-slate-50/50">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="font-medium text-foreground">Disclaimer</p>
              <p>
                This assessment is a preliminary screening tool and does not guarantee
                the quality of services being delivered. It should be used alongside
                other evaluation methods.
              </p>
              <p>
                This resource is provided free of charge. While sharing is permitted,
                it may not be sold or incorporated into paid products.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
