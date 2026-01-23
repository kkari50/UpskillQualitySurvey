"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FileDown,
  Info,
  RotateCcw,
  CalendarIcon,
  AlertTriangle,
  Plus,
  Minus,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ResourceNotice } from "@/components/layout/ResourceNotice";

// Types
type Answer = "yes" | "no" | "na" | null;

interface CriteriaAnswers {
  // Setup (Items 1-3)
  dataSheetsAccessible: Answer;
  confirmedPhase: Answer;
  timerSetCorrectly: Answer;
  // Implementation (Items 4-7)
  immediateDelivery: Answer;
  waitedForTrial: Answer; // Reversed - "No" is correct
  noncomplianceHandled: Answer;
  timerReset: Answer;
  // Data & Decision Making (Items 8-11)
  occurrencesRecorded: Answer;
  rateCalculated: Answer;
  phaseAdvancementNoted: Answer;
  phaseRegressionChecked: Answer;
}

// NCR Info content
const NCR_INFO = {
  title: "What is NCR?",
  description:
    "Noncontingent Reinforcement (NCR) delivers reinforcement on a fixed time schedule, regardless of behavior. This reduces the establishing operation for problem behavior by providing free access to the reinforcer.",
  keyPoints: [
    "Reinforcer is delivered on a time-based schedule (not contingent on behavior)",
    "Interval duration is progressively thinned across phases",
    "Timer-based delivery helps reduce problem behavior maintained by access to tangibles",
    "Noncompliance during delivery requires a brief wait before providing access",
  ],
};

// Criteria categories with info
const CRITERIA_CATEGORIES = {
  setup: {
    title: "Session Setup",
    description: "Preparation steps before beginning the NCR session",
    items: [
      "Ensure data sheets are accessible and client information is entered",
      "Confirm the correct phase for this session",
      "Set timer for the correct duration based on current phase",
    ],
  },
  implementation: {
    title: "Implementation",
    description: "Core NCR delivery procedures during the session",
    items: [
      "Deliver tangible immediately when timer goes off (within 30 seconds)",
      "Do NOT wait to finish skill acquisition trials - deliver immediately",
      "If noncompliance occurs at timer, wait 30 seconds then deliver",
      "Reset timer for next interval after each delivery",
    ],
  },
  dataDecision: {
    title: "Data & Decision Making",
    description: "Recording and phase change decisions",
    items: [
      "Record all occurrences of noncompliance on data sheet",
      "Calculate noncompliance rate at end of each day",
      "Note phase advancement when criterion is met",
      "Check for phase regression if rate exceeds criterion for 2 consecutive days",
    ],
  },
};

// Helper component for info popover
function InfoPopover({
  title,
  description,
  items,
}: {
  title: string;
  description?: string;
  items?: string[];
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 hover:bg-teal-100 text-slate-500 hover:text-teal-600 transition-colors"
          aria-label="View information"
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 max-h-80 overflow-y-auto p-0" align="start">
        <div className="p-3 border-b bg-slate-50">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
            {title}
          </p>
        </div>
        <div className="p-3">
          {description && (
            <p className="text-xs text-slate-600 mb-2">{description}</p>
          )}
          {items && (
            <ul className="space-y-1.5">
              {items.map((item, idx) => (
                <li
                  key={idx}
                  className="text-xs text-slate-600 flex items-start gap-1.5"
                >
                  <span className="text-teal-500 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Tri-state answer button component
function AnswerButton({
  value,
  currentValue,
  onChange,
  label,
  color,
}: {
  value: Answer;
  currentValue: Answer;
  onChange: (value: Answer) => void;
  label: string;
  color: "green" | "red" | "gray";
}) {
  const isSelected = currentValue === value;
  const colorClasses = {
    green: isSelected
      ? "bg-green-500 text-white border-green-500"
      : "bg-white text-green-600 border-green-300 hover:bg-green-50",
    red: isSelected
      ? "bg-red-500 text-white border-red-500"
      : "bg-white text-red-600 border-red-300 hover:bg-red-50",
    gray: isSelected
      ? "bg-gray-500 text-white border-gray-500"
      : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50",
  };

  return (
    <button
      type="button"
      onClick={() => onChange(isSelected ? null : value)}
      className={cn(
        "px-3 py-1.5 text-xs font-medium rounded-md border transition-colors",
        colorClasses[color]
      )}
    >
      {label}
    </button>
  );
}

// Criteria row component with optional reverse scoring indicator
function CriteriaRow({
  label,
  value,
  onChange,
  hint,
  reversed,
  warning,
}: {
  label: string;
  value: Answer;
  onChange: (value: Answer) => void;
  hint?: string;
  reversed?: boolean;
  warning?: string;
}) {
  const showWarning = reversed && value === "yes";

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100 last:border-0 gap-2",
        showWarning && "bg-amber-50 -mx-4 px-4 rounded"
      )}
    >
      <div className="flex-1 pr-4">
        <div className="flex items-start gap-2">
          <p className="text-sm text-gray-800">{label}</p>
          {reversed && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-700">
              Expect &quot;No&quot;
            </span>
          )}
        </div>
        {hint && <p className="text-xs text-gray-500 mt-0.5">{hint}</p>}
        {showWarning && warning && (
          <div className="flex items-center gap-1 mt-1 text-xs text-amber-700">
            <AlertTriangle className="w-3 h-3" />
            <span>{warning}</span>
          </div>
        )}
      </div>
      <div className="flex gap-1.5 flex-shrink-0">
        <AnswerButton
          value="yes"
          currentValue={value}
          onChange={onChange}
          label="Yes"
          color={reversed ? "red" : "green"}
        />
        <AnswerButton
          value="no"
          currentValue={value}
          onChange={onChange}
          label="No"
          color={reversed ? "green" : "red"}
        />
        <AnswerButton
          value="na"
          currentValue={value}
          onChange={onChange}
          label="N/A"
          color="gray"
        />
      </div>
    </div>
  );
}

// Noncompliance counter component
function NoncomplianceCounter({
  count,
  onChange,
  sessionDuration,
}: {
  count: number;
  onChange: (count: number) => void;
  sessionDuration: number;
}) {
  const rate = sessionDuration > 0 ? (count / sessionDuration) * 60 : 0;

  return (
    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-700 mb-1">
          Noncompliance Occurrences
        </p>
        <p className="text-xs text-gray-500">
          Rate: {rate.toFixed(2)}/hour
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, count - 1))}
          className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
          aria-label="Decrease count"
        >
          <Minus className="w-4 h-4 text-gray-600" />
        </button>
        <span className="w-12 text-center text-lg font-semibold text-gray-800">
          {count}
        </span>
        <button
          type="button"
          onClick={() => onChange(count + 1)}
          className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
          aria-label="Increase count"
        >
          <Plus className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
}

export default function NCRFidelityPage() {
  // Session info state
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [client, setClient] = useState("");
  const [btRbt, setBtRbt] = useState("");
  const [bcba, setBcba] = useState("");
  const [tangibleItem, setTangibleItem] = useState("");
  const [currentPhase, setCurrentPhase] = useState("");
  const [intervalDuration, setIntervalDuration] = useState("");
  const [sessionDuration, setSessionDuration] = useState(60); // minutes
  const [regressionCriterion, setRegressionCriterion] = useState("");

  // Noncompliance tracking
  const [noncomplianceCount, setNoncomplianceCount] = useState(0);

  // Criteria answers
  const [answers, setAnswers] = useState<CriteriaAnswers>({
    dataSheetsAccessible: null,
    confirmedPhase: null,
    timerSetCorrectly: null,
    immediateDelivery: null,
    waitedForTrial: null,
    noncomplianceHandled: null,
    timerReset: null,
    occurrencesRecorded: null,
    rateCalculated: null,
    phaseAdvancementNoted: null,
    phaseRegressionChecked: null,
  });

  // Notes
  const [notes, setNotes] = useState("");

  // Update answer
  const updateAnswer = (key: keyof CriteriaAnswers, value: Answer) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  // Calculate scores
  const scores = useMemo(() => {
    // Setup items
    const setupItems = [
      answers.dataSheetsAccessible,
      answers.confirmedPhase,
      answers.timerSetCorrectly,
    ];

    // Implementation items (note: waitedForTrial is reversed)
    const implementationItems = [
      answers.immediateDelivery,
      answers.waitedForTrial === "yes"
        ? "no"
        : answers.waitedForTrial === "no"
          ? "yes"
          : answers.waitedForTrial, // Reverse the score
      answers.noncomplianceHandled,
      answers.timerReset,
    ];

    // Data & Decision items
    const dataItems = [
      answers.occurrencesRecorded,
      answers.rateCalculated,
      answers.phaseAdvancementNoted,
      answers.phaseRegressionChecked,
    ];

    const calculateCategoryScore = (items: (Answer | string | null)[]) => {
      const yes = items.filter((a) => a === "yes").length;
      const total = items.filter((a) => a === "yes" || a === "no").length;
      return total > 0 ? Math.round((yes / total) * 100) : 0;
    };

    const allItems = [...setupItems, ...implementationItems, ...dataItems];
    const totalYes = allItems.filter((a) => a === "yes").length;
    const totalAnswered = allItems.filter(
      (a) => a === "yes" || a === "no"
    ).length;

    return {
      setup: calculateCategoryScore(setupItems),
      implementation: calculateCategoryScore(implementationItems),
      dataDecision: calculateCategoryScore(dataItems),
      overall: totalAnswered > 0 ? Math.round((totalYes / totalAnswered) * 100) : 0,
      answeredCount: totalAnswered,
      totalCount: 11,
    };
  }, [answers]);

  // Calculate noncompliance rate
  const noncomplianceRate = useMemo(() => {
    if (sessionDuration <= 0) return 0;
    return (noncomplianceCount / sessionDuration) * 60; // per hour
  }, [noncomplianceCount, sessionDuration]);

  // Reset form
  const handleReset = () => {
    setDate(undefined);
    setClient("");
    setBtRbt("");
    setBcba("");
    setTangibleItem("");
    setCurrentPhase("");
    setIntervalDuration("");
    setSessionDuration(60);
    setRegressionCriterion("");
    setNoncomplianceCount(0);
    setAnswers({
      dataSheetsAccessible: null,
      confirmedPhase: null,
      timerSetCorrectly: null,
      immediateDelivery: null,
      waitedForTrial: null,
      noncomplianceHandled: null,
      timerReset: null,
      occurrencesRecorded: null,
      rateCalculated: null,
      phaseAdvancementNoted: null,
      phaseRegressionChecked: null,
    });
    setNotes("");
  };

  // PDF generation state
  const [isGenerating, setIsGenerating] = useState(false);

  // Handle PDF download - dynamically import PDF libraries to reduce initial bundle
  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      // Dynamic imports - only load PDF libraries when user clicks download
      const [{ pdf }, { NCRFidelityPDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/pdf/NCRFidelityPDF"),
      ]);

      const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
      const doc = (
        <NCRFidelityPDF
          date={date ? format(date, "PPP") : ""}
          client={client}
          btRbt={btRbt}
          bcba={bcba}
          tangibleItem={tangibleItem}
          currentPhase={currentPhase}
          intervalDuration={intervalDuration}
          sessionDuration={sessionDuration}
          regressionCriterion={regressionCriterion}
          noncomplianceCount={noncomplianceCount}
          noncomplianceRate={noncomplianceRate}
          answers={answers}
          scores={scores}
          notes={notes}
        />
      );
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ncr-fidelity-${client || "form"}-${
        formattedDate || new Date().toISOString().split("T")[0]
      }.pdf`;
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
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">
              NCR Fidelity Checklist
            </h1>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 hover:bg-teal-200 text-teal-600 transition-colors"
                  aria-label="What is NCR?"
                >
                  <Info className="w-4 h-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-0" align="start">
                <div className="p-3 border-b bg-teal-50">
                  <p className="text-sm font-semibold text-teal-800">
                    {NCR_INFO.title}
                  </p>
                </div>
                <div className="p-3">
                  <p className="text-sm text-gray-700 mb-3">
                    {NCR_INFO.description}
                  </p>
                  <ul className="space-y-1.5">
                    {NCR_INFO.keyPoints.map((point, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-gray-600 flex items-start gap-1.5"
                      >
                        <span className="text-teal-500 mt-0.5">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <p className="text-gray-600">
            Monitor NCR implementation fidelity for tangible item delivery.
          </p>
        </div>

        {/* Privacy Notice */}
        <ResourceNotice className="mb-6" />

        {/* Score Summary */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">
                Overall Fidelity
              </span>
              <span
                className={cn(
                  "text-lg font-bold",
                  scores.overall >= 85
                    ? "text-green-600"
                    : scores.overall >= 70
                      ? "text-amber-600"
                      : "text-red-600"
                )}
              >
                {scores.overall}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  scores.overall >= 85
                    ? "bg-green-500"
                    : scores.overall >= 70
                      ? "bg-amber-500"
                      : "bg-red-500"
                )}
                style={{ width: `${scores.overall}%` }}
              />
            </div>
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-2 bg-slate-50 rounded">
                <div className="font-semibold text-slate-700">Setup</div>
                <div className="text-slate-600">{scores.setup}%</div>
              </div>
              <div className="p-2 bg-teal-50 rounded">
                <div className="font-semibold text-teal-700">Implementation</div>
                <div className="text-teal-600">{scores.implementation}%</div>
              </div>
              <div className="p-2 bg-blue-50 rounded">
                <div className="font-semibold text-blue-700">Data & Decisions</div>
                <div className="text-blue-600">{scores.dataDecision}%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Session Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="client">Client</Label>
                <Input
                  id="client"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="Enter client name"
                />
              </div>
              <div>
                <Label htmlFor="btRbt">BT/RBT</Label>
                <Input
                  id="btRbt"
                  value={btRbt}
                  onChange={(e) => setBtRbt(e.target.value)}
                  placeholder="Enter BT/RBT name"
                />
              </div>
              <div>
                <Label htmlFor="bcba">BCBA</Label>
                <Input
                  id="bcba"
                  value={bcba}
                  onChange={(e) => setBcba(e.target.value)}
                  placeholder="Enter BCBA name"
                />
              </div>
            </div>

            {/* NCR-specific fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
              <div>
                <Label htmlFor="tangibleItem">Tangible Item</Label>
                <Input
                  id="tangibleItem"
                  value={tangibleItem}
                  onChange={(e) => setTangibleItem(e.target.value)}
                  placeholder="e.g., iPad"
                />
              </div>
              <div>
                <Label htmlFor="currentPhase">Current Phase</Label>
                <Input
                  id="currentPhase"
                  value={currentPhase}
                  onChange={(e) => setCurrentPhase(e.target.value)}
                  placeholder="e.g., Phase 2"
                />
              </div>
              <div>
                <Label htmlFor="intervalDuration">Interval Duration</Label>
                <Input
                  id="intervalDuration"
                  value={intervalDuration}
                  onChange={(e) => setIntervalDuration(e.target.value)}
                  placeholder="e.g., 5 minutes"
                />
              </div>
              <div>
                <Label htmlFor="sessionDuration">Session Length (min)</Label>
                <Input
                  id="sessionDuration"
                  type="number"
                  value={sessionDuration}
                  onChange={(e) => setSessionDuration(Number(e.target.value))}
                  placeholder="60"
                />
              </div>
            </div>

            {/* Regression criterion */}
            <div className="mt-4 pt-4 border-t">
              <Label htmlFor="regressionCriterion">
                Phase Regression Criterion (noncompliance rate/hour)
              </Label>
              <Input
                id="regressionCriterion"
                value={regressionCriterion}
                onChange={(e) => setRegressionCriterion(e.target.value)}
                placeholder="e.g., 2 per hour"
                className="mt-1 max-w-xs"
              />
            </div>
          </CardContent>
        </Card>

        {/* Noncompliance Tracking */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-600" />
              <CardTitle className="text-lg">Noncompliance Tracking</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <NoncomplianceCounter
              count={noncomplianceCount}
              onChange={setNoncomplianceCount}
              sessionDuration={sessionDuration}
            />
            {regressionCriterion && noncomplianceRate > parseFloat(regressionCriterion) && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium">Rate exceeds criterion</p>
                  <p className="text-xs mt-0.5">
                    Current rate ({noncomplianceRate.toFixed(2)}/hr) exceeds the
                    regression criterion ({regressionCriterion}/hr). If this continues
                    for 2 consecutive days, consider moving back one phase.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Setup Criteria */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">Session Setup</CardTitle>
              <InfoPopover
                title={CRITERIA_CATEGORIES.setup.title}
                description={CRITERIA_CATEGORIES.setup.description}
                items={CRITERIA_CATEGORIES.setup.items}
              />
            </div>
          </CardHeader>
          <CardContent>
            <CriteriaRow
              label="Data sheets are accessible and appropriate information is entered"
              value={answers.dataSheetsAccessible}
              onChange={(v) => updateAnswer("dataSheetsAccessible", v)}
            />
            <CriteriaRow
              label="BT/RBT confirms the correct phase for the session"
              value={answers.confirmedPhase}
              onChange={(v) => updateAnswer("confirmedPhase", v)}
            />
            <CriteriaRow
              label="BT/RBT sets timer for the correct duration for the current phase"
              value={answers.timerSetCorrectly}
              onChange={(v) => updateAnswer("timerSetCorrectly", v)}
            />
          </CardContent>
        </Card>

        {/* Implementation Criteria */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">Implementation</CardTitle>
              <InfoPopover
                title={CRITERIA_CATEGORIES.implementation.title}
                description={CRITERIA_CATEGORIES.implementation.description}
                items={CRITERIA_CATEGORIES.implementation.items}
              />
            </div>
          </CardHeader>
          <CardContent>
            <CriteriaRow
              label="When the timer goes off, the BT/RBT immediately delivers the tangible for 30 seconds"
              value={answers.immediateDelivery}
              onChange={(v) => updateAnswer("immediateDelivery", v)}
            />
            <CriteriaRow
              label="BT/RBT waits to finish a skill acquisition trial before delivering the tangible"
              value={answers.waitedForTrial}
              onChange={(v) => updateAnswer("waitedForTrial", v)}
              reversed={true}
              hint="Tangible should be delivered immediately, not delayed for trial completion"
              warning="Waiting to finish trials reduces NCR effectiveness. Deliver the tangible immediately when the timer goes off."
            />
            <CriteriaRow
              label="If client engaged in noncompliance when timer went off, BT/RBT waited 30 seconds then delivered 30 seconds of access"
              value={answers.noncomplianceHandled}
              onChange={(v) => updateAnswer("noncomplianceHandled", v)}
              hint="N/A if no noncompliance occurred during timer"
            />
            <CriteriaRow
              label="Timer is reset for next interval"
              value={answers.timerReset}
              onChange={(v) => updateAnswer("timerReset", v)}
            />
          </CardContent>
        </Card>

        {/* Data & Decision Making Criteria */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">Data & Decision Making</CardTitle>
              <InfoPopover
                title={CRITERIA_CATEGORIES.dataDecision.title}
                description={CRITERIA_CATEGORIES.dataDecision.description}
                items={CRITERIA_CATEGORIES.dataDecision.items}
              />
            </div>
          </CardHeader>
          <CardContent>
            <CriteriaRow
              label="Occurrences of noncompliance are recorded on the data sheet"
              value={answers.occurrencesRecorded}
              onChange={(v) => updateAnswer("occurrencesRecorded", v)}
            />
            <CriteriaRow
              label="Rate of noncompliance is calculated at the end of each day"
              value={answers.rateCalculated}
              onChange={(v) => updateAnswer("rateCalculated", v)}
            />
            <CriteriaRow
              label="If phase change criterion is met, BT/RBT makes a note in the session log to proceed to the next phase"
              value={answers.phaseAdvancementNoted}
              onChange={(v) => updateAnswer("phaseAdvancementNoted", v)}
              hint="N/A if phase change criterion was not met"
            />
            <CriteriaRow
              label="If client engaged in noncompliance at criterion rate for 2 consecutive days after passing Phase 1, move back one phase"
              value={answers.phaseRegressionChecked}
              onChange={(v) => updateAnswer("phaseRegressionChecked", v)}
              hint="N/A if not applicable to current situation"
            />
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any observations, feedback, or recommendations..."
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="flex-1 gap-2"
          >
            <FileDown className="w-4 h-4" />
            {isGenerating ? "Generating..." : "Download PDF"}
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Form
          </Button>
        </div>
      </div>
    </div>
  );
}
