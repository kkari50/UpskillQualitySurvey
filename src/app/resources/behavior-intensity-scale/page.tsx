"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FileDown, X, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  STEPS,
  DOS_AND_DONTS,
  BEHAVIOR_EXAMPLES,
  INTENSITY_COLOR_MAP,
} from "@/components/pdf/intensity-quick-reference-data";

export default function IntensityQuickReferencePage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleCard = (id: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const [{ pdf }, { IntensityQuickReferencePDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/pdf/IntensityQuickReferencePDF"),
      ]);

      const logoUrl = `${window.location.origin}/images/logo-medium.png`;
      const doc = <IntensityQuickReferencePDF logoUrl={logoUrl} />;
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `intensity-quick-reference-${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Logo */}
        <div className="mb-6">
          <Image
            src="/images/logo.png"
            alt="Upskill ABA"
            width={150}
            height={45}
            className="mb-3"
          />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Intensity Measure Development Quick Reference
          </h1>
          <p className="text-slate-500">
            A step-by-step job aid for developing behavior-specific intensity
            scales (0–7) with inter-observer agreement targets and rater
            training guidance.
          </p>
        </div>

        {/* 6 Steps */}
        <div className="space-y-5 mb-8">
          {STEPS.map((step) => (
            <div key={step.number} className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                {step.number}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 mb-2">
                  {step.description}
                </p>
                <ul className="space-y-1">
                  {step.bullets.map((bullet, i) => (
                    <li
                      key={i}
                      className="text-sm text-slate-500 flex items-start gap-1.5"
                    >
                      <span className="text-teal-500 mt-0.5">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Do's and Don'ts */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Do&rsquo;s and Don&rsquo;ts
          </h2>

          {/* Desktop table */}
          <div className="hidden md:block border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-4 py-3 text-sm font-semibold text-red-600">
                    <X className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                    Avoid
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-green-600 border-l border-slate-200">
                    <Check className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                    Do This
                  </th>
                </tr>
              </thead>
              <tbody>
                {DOS_AND_DONTS.map((row, idx) => (
                  <tr
                    key={idx}
                    className={cn(
                      "border-t border-slate-100",
                      idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                    )}
                  >
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {row.dont}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 border-l border-slate-200">
                      {row.do_}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked cards */}
          <div className="md:hidden space-y-3">
            {DOS_AND_DONTS.map((row, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-lg overflow-hidden"
              >
                <div className="px-4 py-3 bg-red-50 border-b border-slate-200">
                  <p className="text-xs font-semibold text-red-600 mb-1 flex items-center gap-1">
                    <X className="w-3.5 h-3.5" />
                    Avoid
                  </p>
                  <p className="text-sm text-slate-700">{row.dont}</p>
                </div>
                <div className="px-4 py-3 bg-green-50">
                  <p className="text-xs font-semibold text-green-600 mb-1 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Do This
                  </p>
                  <p className="text-sm text-slate-700">{row.do_}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Appendix A: Behavior Examples */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-1">
            Appendix A: Behavior-Specific Intensity Examples
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            Real-world examples of challenging behaviors at each intensity level
            (0–7). Use these for rater training and to develop your own scales.
          </p>

          <div className="space-y-4">
            {BEHAVIOR_EXAMPLES.map((behavior) => {
              const isExpanded = expandedCards.has(behavior.id);
              return (
                <div
                  key={behavior.id}
                  className={cn(
                    "rounded-xl bg-white shadow-sm border transition-shadow",
                    isExpanded
                      ? "border-teal-200 shadow-md"
                      : "border-slate-200 hover:shadow-md"
                  )}
                >
                  {/* Card face — always visible */}
                  <button
                    type="button"
                    onClick={() => toggleCard(behavior.id)}
                    className="w-full text-left px-5 py-4 flex items-start justify-between gap-3"
                  >
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {behavior.behaviorName}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {behavior.definition}
                      </p>
                    </div>
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 text-slate-400 transition-transform duration-200 flex-shrink-0 mt-0.5",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </button>

                  {/* Expanded detail — intensity table */}
                  {isExpanded && (
                    <div className="px-5 pb-5">
                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        {/* Table header */}
                        <div className="flex bg-slate-50 border-b border-slate-200">
                          <div className="w-14 px-2 py-2 text-xs font-semibold text-slate-500">
                            Level
                          </div>
                          <div className="flex-1 px-3 py-2 text-xs font-semibold text-slate-500">
                            Example
                          </div>
                        </div>
                        {/* Intensity rows */}
                        {behavior.levels.map((lvl, i) => {
                          const color = INTENSITY_COLOR_MAP[lvl.level];
                          return (
                            <div
                              key={lvl.level}
                              className={cn(
                                "flex",
                                i < behavior.levels.length - 1 &&
                                  "border-b border-slate-100",
                                color?.bgClass
                              )}
                            >
                              <div
                                className={cn(
                                  "w-14 px-2 py-2 text-center text-sm font-bold flex-shrink-0",
                                  color?.textClass
                                )}
                              >
                                {lvl.level}
                              </div>
                              <div
                                className={cn(
                                  "flex-1 px-3 py-2 text-sm",
                                  color?.textClass
                                )}
                              >
                                {lvl.example}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Download Button */}
        <Button
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          className="gap-2"
        >
          <FileDown className="w-4 h-4" />
          {isGenerating ? "Generating..." : "Download PDF"}
        </Button>
      </div>
    </div>
  );
}
