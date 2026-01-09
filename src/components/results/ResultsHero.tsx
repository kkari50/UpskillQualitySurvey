"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PerformanceLevel } from "@/data/questions/schema";

interface ResultsHeroProps {
  total: number;
  maxPossible: number;
  percentage: number;
  level: PerformanceLevel;
  label: string;
  color: string;
}

// Colors per style-guide.md Section 3.4:
// Strong (85%+): emerald-500 (#10B981)
// Moderate (60-84%): amber-500 (#F59E0B)
// Needs Improvement (<60%): rose-400 (#FB7185)
const colorMap: Record<string, { badge: string; ring: string; stroke: string }> = {
  emerald: {
    badge: "bg-emerald-100 text-emerald-700",
    ring: "ring-emerald-500/20",
    stroke: "stroke-emerald-500",
  },
  amber: {
    badge: "bg-amber-100 text-amber-700",
    ring: "ring-amber-500/20",
    stroke: "stroke-amber-500",
  },
  rose: {
    badge: "bg-rose-100 text-rose-600",
    ring: "ring-rose-400/20",
    stroke: "stroke-rose-400",
  },
};

// Animated circular progress ring component for the hero score
function HeroCircularProgress({
  percentage,
  strokeColor,
}: {
  percentage: number;
  strokeColor: string;
}) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [displayPercentage, setDisplayPercentage] = useState(0);

  const size = 160; // Slightly larger for hero
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedPercentage / 100) * circumference;

  // Animate the circle fill and counter on mount
  useEffect(() => {
    // Small delay to ensure the component is mounted
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 100);

    return () => clearTimeout(timer);
  }, [percentage]);

  // Animate the number counter
  useEffect(() => {
    if (animatedPercentage === 0) return;

    const duration = 1000; // 1 second
    const steps = 60;
    const increment = percentage / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += increment;
      if (current >= percentage) {
        setDisplayPercentage(percentage);
        clearInterval(interval);
      } else {
        setDisplayPercentage(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [animatedPercentage, percentage]);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-slate-100"
        />
        {/* Progress circle with animation */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={cn(strokeColor)}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            transition: 'stroke-dashoffset 1s ease-out',
          }}
        />
      </svg>
      {/* Center text with animated counter */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-4xl md:text-5xl font-bold text-foreground">
          {displayPercentage}%
        </span>
      </div>
    </div>
  );
}

const emotionalCopy: Record<PerformanceLevel, { headline: string; subheadline: string; message: string }> = {
  strong: {
    headline: "Outstanding work!",
    subheadline: "Your commitment to quality is evident.",
    message: "You've built a strong foundation of quality practices. Your clients and team are benefiting from your dedication to excellence in ABA services.",
  },
  moderate: {
    headline: "You're on the right track!",
    subheadline: "There's real momentum here.",
    message: "You've established solid practices in many areas. With some focused attention on key opportunities, you can elevate your quality even further.",
  },
  needs_improvement: {
    headline: "You've taken an important first step.",
    subheadline: "Awareness is where improvement begins.",
    message: "By completing this assessment, you're already showing commitment to quality. Every practice starts somewhere—let's identify the highest-impact areas to focus on first.",
  },
};

export function ResultsHero({
  total,
  maxPossible,
  percentage,
  level,
  label,
  color,
}: ResultsHeroProps) {
  const colors = colorMap[color] ?? colorMap.amber;
  const copy = emotionalCopy[level];

  return (
    <Card className={cn("shadow-lg border-0 ring-1", colors.ring)}>
      <CardContent className="p-6 md:p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {copy.headline}
          </h2>
          <p className="text-lg text-muted-foreground">
            {copy.subheadline}
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
          {/* Score Circle - Animated Circular Progress Ring */}
          <HeroCircularProgress
            percentage={percentage}
            strokeColor={colors.stroke}
          />

          {/* Copy and Details */}
          <div className="flex-1 text-center md:text-left">
            <Badge className={cn("mb-3", colors.badge)}>{label}</Badge>
            <p className="text-muted-foreground mb-4">
              {copy.message}
            </p>
            <p className="text-xl font-semibold text-foreground">
              {total} of {maxPossible} quality practices aligned
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
