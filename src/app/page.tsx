"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Shield, Clock, CheckCircle2, Users, BarChart3, BookOpen, Target, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header, Footer } from "@/components/layout";
import { useSurveyStore } from "@/stores/survey";

const categories = [
  { name: "Daily Sessions", count: 7, icon: Target, color: "text-teal-600", bg: "bg-teal-50" },
  { name: "Treatment Fidelity", count: 5, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
  { name: "Data Analysis", count: 6, icon: BarChart3, color: "text-blue-600", bg: "bg-blue-50" },
  { name: "Caregiver Guidance", count: 6, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
  { name: "Supervision", count: 4, icon: BookOpen, color: "text-amber-600", bg: "bg-amber-50" },
];

const sampleScores = [
  { name: "Sessions", score: 85 },
  { name: "Fidelity", score: 80 },
  { name: "Data", score: 60 },
  { name: "Caregivers", score: 83 },
  { name: "Supervision", score: 75 },
];

// Mini circular progress for landing page preview
function MiniProgress({ percentage, delay }: { percentage: number; delay: number }) {
  const size = 48;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  // Color based on score
  const getStrokeColor = () => {
    if (percentage >= 85) return "stroke-emerald-500";
    if (percentage >= 60) return "stroke-amber-500";
    return "stroke-rose-400";
  };

  return (
    <div
      className="relative animate-fade-in-up"
      style={{ width: size, height: size, animationDelay: `${delay}ms` }}
    >
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-100"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={`${getStrokeColor()} transition-all duration-1000 ease-out`}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            transitionDelay: `${delay}ms`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[11px] font-bold text-foreground">{percentage}%</span>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { isCompleted, resetSurvey } = useSurveyStore();

  // Reset survey state when returning to landing page after completion
  useEffect(() => {
    if (isCompleted) {
      resetSurvey();
    }
  }, [isCompleted, resetSurvey]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-teal-50/30 to-emerald-50/40">
      <Header />

      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-teal-200/40 to-emerald-200/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-teal-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl" />
      </div>

      <main className="flex-1 flex items-center px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16 relative">
        <div className="w-full max-w-7xl mx-auto">
          {/* Two-column layout on desktop */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

            {/* Left Column - Content */}
            <div className="text-center lg:text-left order-1">
              {/* Badge */}
              <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-teal-100 shadow-sm mb-6">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span className="text-sm font-medium text-teal-700">Free Quality Assessment</span>
              </div>

              {/* Headline */}
              <h1 className="animate-fade-in-up delay-100 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                How Strong Is Your{" "}
                <span className="gradient-text">ABA Quality</span>{" "}
                Infrastructure?
              </h1>

              <p className="animate-fade-in-up delay-200 text-muted-foreground mb-8 text-lg md:text-xl max-w-xl mx-auto lg:mx-0">
                Discover your agency&apos;s strengths and growth areas in just 5 minutes with 28 research-backed questions
              </p>

              {/* CTA Button */}
              <div className="animate-fade-in-up delay-300 mb-8">
                <Button
                  asChild
                  size="lg"
                  className="h-14 px-10 text-lg font-semibold shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 w-full sm:w-auto"
                >
                  <Link href="/survey">
                    Take the Assessment
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="animate-fade-in-up delay-400 flex flex-wrap items-center justify-center lg:justify-start gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5 bg-white/70 px-4 py-2 rounded-full shadow-sm">
                  <Clock className="w-4 h-4 text-teal-600" />
                  5 minutes
                </span>
                <span className="flex items-center gap-1.5 bg-white/70 px-4 py-2 rounded-full shadow-sm">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  100% Confidential
                </span>
                <span className="flex items-center gap-1.5 bg-white/70 px-4 py-2 rounded-full shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  Free Forever
                </span>
              </div>
            </div>

            {/* Right Column - Preview Card */}
            <div className="order-2 flex justify-center lg:justify-end">
              <div className="animate-fade-in-up delay-200 glass-card rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md relative overflow-hidden">
                {/* Shimmer effect overlay */}
                <div className="absolute inset-0 animate-shimmer opacity-30" />

                <p className="text-xs text-teal-600 font-semibold uppercase tracking-wider mb-5">
                  Sample Results Preview
                </p>

                {/* Score Circle + Label */}
                <div className="flex items-center justify-center gap-5 mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-teal-500 via-emerald-500 to-teal-600 flex items-center justify-center shadow-lg animate-pulse-glow">
                      <span className="text-3xl md:text-4xl font-bold text-white">78%</span>
                    </div>
                    {/* Decorative ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-teal-200/50 scale-110" />
                  </div>
                  <div className="text-left">
                    <p className="text-2xl md:text-3xl font-bold text-foreground">Strong</p>
                    <p className="text-sm text-muted-foreground">22 of 28 aligned</p>
                    <div className="flex items-center gap-1 mt-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs text-emerald-600 font-medium">Above average</span>
                    </div>
                  </div>
                </div>

                {/* Category Circular Progress Grid */}
                <div className="grid grid-cols-5 gap-2">
                  {sampleScores.map((cat, index) => (
                    <div key={cat.name} className="flex flex-col items-center gap-1.5">
                      <MiniProgress percentage={cat.score} delay={(index + 1) * 150} />
                      <span className="text-[10px] text-muted-foreground font-medium text-center leading-tight">
                        {cat.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Categories Section - Full Width */}
          <div className="animate-fade-in-up delay-500 mt-16 lg:mt-20 pt-10 border-t border-slate-200/60">
            <div className="text-center mb-8">
              <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-2">
                What You&apos;ll Discover
              </p>
              <p className="text-2xl md:text-3xl font-bold text-foreground">
                5 Categories • 28 Research-Backed Questions
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={cat.name}
                    className="group flex flex-col items-center gap-3 p-5 lg:p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl ${cat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 lg:w-7 lg:h-7 ${cat.color}`} />
                    </div>
                    <span className="text-sm lg:text-base font-semibold text-foreground text-center leading-tight">{cat.name}</span>
                    <span className="text-xs text-muted-foreground bg-slate-100 px-2 py-0.5 rounded-full">{cat.count} questions</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
