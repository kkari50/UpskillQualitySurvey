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
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  MinusCircle,
  RotateCcw,
  CalendarIcon,
  Timer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ResourceNotice } from "@/components/layout/ResourceNotice";

// Types
type Answer = "yes" | "no" | "na" | null;

interface IntervalData {
  behaviorOccurred: boolean | null; // null = not yet answered
  // When behavior is ABSENT (successful interval)
  endedCorrectly: Answer;
  deliveredReinforcer: Answer;
  reinforcedTimely: Answer;
  reinforcedOtherBehaviors: Answer;
  // When behavior OCCURS (interval reset)
  restartedImmediately: Answer;
  withheldReinforcement: Answer;
  noAttentionGiven: Answer;
  continuedReinforcingOthers: Answer;
  // Notes
  notes: string;
}

interface SessionSetup {
  timerSet: Answer;
  materialsReady: Answer;
  dataCollectionAccurate: Answer;
}

const createEmptyInterval = (): IntervalData => ({
  behaviorOccurred: null,
  endedCorrectly: null,
  deliveredReinforcer: null,
  reinforcedTimely: null,
  reinforcedOtherBehaviors: null,
  restartedImmediately: null,
  withheldReinforcement: null,
  noAttentionGiven: null,
  continuedReinforcingOthers: null,
  notes: "",
});

// DRO Info content
const DRO_INFO = {
  title: "What is DRO?",
  description:
    "Differential Reinforcement of Other behavior (DRO) delivers reinforcement when a target maladaptive behavior is ABSENT for a specified interval. If the behavior occurs, the interval resets.",
  keyPoints: [
    "Set a timer for the designated interval length",
    "If interval completes without target behavior → deliver reinforcement",
    "If target behavior occurs → reset the interval timer",
    "Continue reinforcing other appropriate behaviors throughout",
  ],
};

// Criteria info
const CRITERIA_INFO = {
  setup: {
    title: "Session Setup",
    items: [
      "Timer should be set for the exact interval specified in the behavior plan",
      "All designated reinforcers should be accessible and ready",
      "Data collection materials should be prepared",
    ],
  },
  behaviorAbsent: {
    title: "When Behavior is Absent",
    items: [
      "End the interval precisely when the timer goes off",
      "Deliver the specific reinforcer designated in the behavior plan",
      "Reinforcement should be delivered within 3 seconds of interval end",
      "Continue reinforcing other appropriate behaviors during the interval",
    ],
  },
  behaviorOccurs: {
    title: "When Behavior Occurs",
    items: [
      "Immediately restart the interval timer upon behavior occurrence",
      "Withhold the designated reinforcer - do not deliver it",
      "Avoid giving attention or engaging with the behavior",
      "Continue to reinforce other appropriate alternative behaviors",
    ],
  },
};

// Helper component for info popover
function InfoPopover({
  title,
  items,
}: {
  title: string;
  items: string[];
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

// Criteria row component
function CriteriaRow({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: Answer;
  onChange: (value: Answer) => void;
  hint?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <div className="flex-1 pr-4">
        <p className="text-sm text-gray-800">{label}</p>
        {hint && <p className="text-xs text-gray-500 mt-0.5">{hint}</p>}
      </div>
      <div className="flex gap-1.5">
        <AnswerButton
          value="yes"
          currentValue={value}
          onChange={onChange}
          label="Yes"
          color="green"
        />
        <AnswerButton
          value="no"
          currentValue={value}
          onChange={onChange}
          label="No"
          color="red"
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

export default function DROFidelityPage() {
  // Session info state
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [client, setClient] = useState("");
  const [btRbt, setBtRbt] = useState("");
  const [bcba, setBcba] = useState("");
  const [targetBehavior, setTargetBehavior] = useState("");
  const [intervalLength, setIntervalLength] = useState("");
  const [designatedReinforcer, setDesignatedReinforcer] = useState("");

  // Session setup criteria
  const [sessionSetup, setSessionSetup] = useState<SessionSetup>({
    timerSet: null,
    materialsReady: null,
    dataCollectionAccurate: null,
  });

  // Intervals state
  const [intervals, setIntervals] = useState<IntervalData[]>([
    createEmptyInterval(),
  ]);
  const [activeInterval, setActiveInterval] = useState(0);

  // PDF generation state
  const [isGenerating, setIsGenerating] = useState(false);

  // Update session setup
  const updateSessionSetup = (key: keyof SessionSetup, value: Answer) => {
    setSessionSetup((prev) => ({ ...prev, [key]: value }));
  };

  // Update interval data
  const updateInterval = (
    index: number,
    key: keyof IntervalData,
    value: IntervalData[keyof IntervalData]
  ) => {
    setIntervals((prev) =>
      prev.map((interval, i) =>
        i === index ? { ...interval, [key]: value } : interval
      )
    );
  };

  // Add new interval
  const addInterval = () => {
    setIntervals((prev) => [...prev, createEmptyInterval()]);
    setActiveInterval(intervals.length);
  };

  // Remove interval
  const removeInterval = (index: number) => {
    if (intervals.length <= 1) return;
    setIntervals((prev) => prev.filter((_, i) => i !== index));
    if (activeInterval >= intervals.length - 1) {
      setActiveInterval(Math.max(0, intervals.length - 2));
    }
  };

  // Reset form
  const handleReset = () => {
    setDate(undefined);
    setClient("");
    setBtRbt("");
    setBcba("");
    setTargetBehavior("");
    setIntervalLength("");
    setDesignatedReinforcer("");
    setSessionSetup({
      timerSet: null,
      materialsReady: null,
      dataCollectionAccurate: null,
    });
    setIntervals([createEmptyInterval()]);
    setActiveInterval(0);
  };

  // Calculate scores
  const scores = useMemo(() => {
    // Setup score
    const setupAnswers = [
      sessionSetup.timerSet,
      sessionSetup.materialsReady,
      sessionSetup.dataCollectionAccurate,
    ];
    const setupYes = setupAnswers.filter((a) => a === "yes").length;
    const setupTotal = setupAnswers.filter((a) => a === "yes" || a === "no").length;
    const setupScore = setupTotal > 0 ? Math.round((setupYes / setupTotal) * 100) : 0;

    // Per-interval scores
    let totalYes = setupYes;
    let totalAnswered = setupTotal;
    let behaviorAbsentYes = 0;
    let behaviorAbsentTotal = 0;
    let behaviorOccursYes = 0;
    let behaviorOccursTotal = 0;

    intervals.forEach((interval) => {
      if (interval.behaviorOccurred === false) {
        // Behavior absent criteria
        const absentAnswers = [
          interval.endedCorrectly,
          interval.deliveredReinforcer,
          interval.reinforcedTimely,
          interval.reinforcedOtherBehaviors,
        ];
        behaviorAbsentYes += absentAnswers.filter((a) => a === "yes").length;
        behaviorAbsentTotal += absentAnswers.filter(
          (a) => a === "yes" || a === "no"
        ).length;
      } else if (interval.behaviorOccurred === true) {
        // Behavior occurs criteria
        const occursAnswers = [
          interval.restartedImmediately,
          interval.withheldReinforcement,
          interval.noAttentionGiven,
          interval.continuedReinforcingOthers,
        ];
        behaviorOccursYes += occursAnswers.filter((a) => a === "yes").length;
        behaviorOccursTotal += occursAnswers.filter(
          (a) => a === "yes" || a === "no"
        ).length;
      }
    });

    totalYes += behaviorAbsentYes + behaviorOccursYes;
    totalAnswered += behaviorAbsentTotal + behaviorOccursTotal;

    const behaviorAbsentScore =
      behaviorAbsentTotal > 0
        ? Math.round((behaviorAbsentYes / behaviorAbsentTotal) * 100)
        : 0;
    const behaviorOccursScore =
      behaviorOccursTotal > 0
        ? Math.round((behaviorOccursYes / behaviorOccursTotal) * 100)
        : 0;
    const overallScore =
      totalAnswered > 0 ? Math.round((totalYes / totalAnswered) * 100) : 0;

    // Count intervals by type
    const intervalsWithBehavior = intervals.filter(
      (i) => i.behaviorOccurred === true
    ).length;
    const intervalsWithoutBehavior = intervals.filter(
      (i) => i.behaviorOccurred === false
    ).length;

    return {
      setup: setupScore,
      behaviorAbsent: behaviorAbsentScore,
      behaviorOccurs: behaviorOccursScore,
      overall: overallScore,
      intervalsWithBehavior,
      intervalsWithoutBehavior,
      totalIntervals: intervals.length,
    };
  }, [sessionSetup, intervals]);

  // Handle PDF download
  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      // Dynamic imports - only load PDF libraries when user clicks download
      const [{ pdf }, { DROFidelityPDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/pdf/DROFidelityPDF"),
      ]);

      const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
      const doc = (
        <DROFidelityPDF
          date={date ? format(date, "PPP") : ""}
          client={client}
          btRbt={btRbt}
          bcba={bcba}
          targetBehavior={targetBehavior}
          intervalLength={intervalLength}
          designatedReinforcer={designatedReinforcer}
          sessionSetup={sessionSetup}
          intervals={intervals}
          scores={scores}
        />
      );
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `dro-fidelity-${client || "form"}-${
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

  // Get interval status icon
  const getIntervalStatusIcon = (interval: IntervalData) => {
    if (interval.behaviorOccurred === null)
      return <MinusCircle className="w-4 h-4 text-gray-400" />;
    if (interval.behaviorOccurred === false)
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    return <XCircle className="w-4 h-4 text-amber-500" />;
  };

  const currentInterval = intervals[activeInterval];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">
              DRO Fidelity Checklist
            </h1>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 hover:bg-teal-200 text-teal-600 transition-colors"
                  aria-label="What is DRO?"
                >
                  <Info className="w-4 h-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-0" align="start">
                <div className="p-3 border-b bg-teal-50">
                  <p className="text-sm font-semibold text-teal-800">
                    {DRO_INFO.title}
                  </p>
                </div>
                <div className="p-3">
                  <p className="text-sm text-gray-700 mb-3">
                    {DRO_INFO.description}
                  </p>
                  <ul className="space-y-1.5">
                    {DRO_INFO.keyPoints.map((point, idx) => (
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
            Monitor DRO implementation fidelity across multiple intervals.
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
              <div className="p-2 bg-green-50 rounded">
                <div className="font-semibold text-green-700">
                  Behavior Absent
                </div>
                <div className="text-green-600">
                  {scores.behaviorAbsent}% ({scores.intervalsWithoutBehavior})
                </div>
              </div>
              <div className="p-2 bg-amber-50 rounded">
                <div className="font-semibold text-amber-700">
                  Behavior Occurred
                </div>
                <div className="text-amber-600">
                  {scores.behaviorOccurs}% ({scores.intervalsWithBehavior})
                </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="targetBehavior">Target Behavior</Label>
                <Input
                  id="targetBehavior"
                  value={targetBehavior}
                  onChange={(e) => setTargetBehavior(e.target.value)}
                  placeholder="e.g., Hitting"
                />
              </div>
              <div>
                <Label htmlFor="intervalLength">Interval Length</Label>
                <Input
                  id="intervalLength"
                  value={intervalLength}
                  onChange={(e) => setIntervalLength(e.target.value)}
                  placeholder="e.g., 3 minutes"
                />
              </div>
              <div>
                <Label htmlFor="designatedReinforcer">Designated Reinforcer</Label>
                <Input
                  id="designatedReinforcer"
                  value={designatedReinforcer}
                  onChange={(e) => setDesignatedReinforcer(e.target.value)}
                  placeholder="e.g., iPad for 2 min"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Setup Criteria */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">Session Setup</CardTitle>
              <InfoPopover
                title={CRITERIA_INFO.setup.title}
                items={CRITERIA_INFO.setup.items}
              />
            </div>
          </CardHeader>
          <CardContent>
            <CriteriaRow
              label="Timer set for appropriate interval length"
              value={sessionSetup.timerSet}
              onChange={(v) => updateSessionSetup("timerSet", v)}
            />
            <CriteriaRow
              label="All materials/reinforcers set up prior to session"
              value={sessionSetup.materialsReady}
              onChange={(v) => updateSessionSetup("materialsReady", v)}
            />
            <CriteriaRow
              label="Collects accurate data on behavior occurrence/absence"
              value={sessionSetup.dataCollectionAccurate}
              onChange={(v) => updateSessionSetup("dataCollectionAccurate", v)}
            />
          </CardContent>
        </Card>

        {/* Interval Observation */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-teal-600" />
                <CardTitle className="text-lg">Interval Observations</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={addInterval}
                className="gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Interval
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Interval tabs */}
            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
              <button
                type="button"
                onClick={() =>
                  setActiveInterval(Math.max(0, activeInterval - 1))
                }
                disabled={activeInterval === 0}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {intervals.map((interval, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveInterval(idx)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                    activeInterval === idx
                      ? "bg-teal-100 text-teal-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {getIntervalStatusIcon(interval)}
                  <span>#{idx + 1}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() =>
                  setActiveInterval(
                    Math.min(intervals.length - 1, activeInterval + 1)
                  )
                }
                disabled={activeInterval === intervals.length - 1}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              {intervals.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeInterval(activeInterval)}
                  className="p-1.5 rounded text-red-500 hover:bg-red-50 ml-auto"
                  title="Remove interval"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Behavior occurred question */}
            <div className="p-4 bg-slate-50 rounded-lg mb-4">
              <p className="text-sm font-medium text-gray-800 mb-3">
                Did target behavior occur during this interval?
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    updateInterval(activeInterval, "behaviorOccurred", true)
                  }
                  className={cn(
                    "flex-1 py-3 rounded-lg border-2 font-medium transition-colors",
                    currentInterval.behaviorOccurred === true
                      ? "bg-amber-100 border-amber-400 text-amber-800"
                      : "bg-white border-gray-200 text-gray-600 hover:border-amber-300"
                  )}
                >
                  <XCircle
                    className={cn(
                      "w-5 h-5 mx-auto mb-1",
                      currentInterval.behaviorOccurred === true
                        ? "text-amber-600"
                        : "text-gray-400"
                    )}
                  />
                  Yes - Behavior Occurred
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updateInterval(activeInterval, "behaviorOccurred", false)
                  }
                  className={cn(
                    "flex-1 py-3 rounded-lg border-2 font-medium transition-colors",
                    currentInterval.behaviorOccurred === false
                      ? "bg-green-100 border-green-400 text-green-800"
                      : "bg-white border-gray-200 text-gray-600 hover:border-green-300"
                  )}
                >
                  <CheckCircle2
                    className={cn(
                      "w-5 h-5 mx-auto mb-1",
                      currentInterval.behaviorOccurred === false
                        ? "text-green-600"
                        : "text-gray-400"
                    )}
                  />
                  No - Behavior Absent
                </button>
              </div>
            </div>

            {/* Conditional criteria based on behavior */}
            {currentInterval.behaviorOccurred === false && (
              <div className="border rounded-lg p-4 bg-green-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-semibold text-green-800">
                    Successful Interval - Behavior Absent
                  </h3>
                  <InfoPopover
                    title={CRITERIA_INFO.behaviorAbsent.title}
                    items={CRITERIA_INFO.behaviorAbsent.items}
                  />
                </div>
                <CriteriaRow
                  label="Ended interval at correct time"
                  value={currentInterval.endedCorrectly}
                  onChange={(v) =>
                    updateInterval(activeInterval, "endedCorrectly", v)
                  }
                />
                <CriteriaRow
                  label="Delivered designated reinforcer"
                  value={currentInterval.deliveredReinforcer}
                  onChange={(v) =>
                    updateInterval(activeInterval, "deliveredReinforcer", v)
                  }
                />
                <CriteriaRow
                  label="Reinforcement delivered within acceptable time"
                  hint="Typically within 3 seconds"
                  value={currentInterval.reinforcedTimely}
                  onChange={(v) =>
                    updateInterval(activeInterval, "reinforcedTimely", v)
                  }
                />
                <CriteriaRow
                  label="Reinforced other appropriate behaviors during interval"
                  value={currentInterval.reinforcedOtherBehaviors}
                  onChange={(v) =>
                    updateInterval(activeInterval, "reinforcedOtherBehaviors", v)
                  }
                />
              </div>
            )}

            {currentInterval.behaviorOccurred === true && (
              <div className="border rounded-lg p-4 bg-amber-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-semibold text-amber-800">
                    Interval Reset - Behavior Occurred
                  </h3>
                  <InfoPopover
                    title={CRITERIA_INFO.behaviorOccurs.title}
                    items={CRITERIA_INFO.behaviorOccurs.items}
                  />
                </div>
                <CriteriaRow
                  label="Restarted interval immediately"
                  value={currentInterval.restartedImmediately}
                  onChange={(v) =>
                    updateInterval(activeInterval, "restartedImmediately", v)
                  }
                />
                <CriteriaRow
                  label="Withheld reinforcement appropriately"
                  value={currentInterval.withheldReinforcement}
                  onChange={(v) =>
                    updateInterval(activeInterval, "withheldReinforcement", v)
                  }
                />
                <CriteriaRow
                  label="Did not provide attention for behavior"
                  hint="Effectively ignored attention-seeking behavior"
                  value={currentInterval.noAttentionGiven}
                  onChange={(v) =>
                    updateInterval(activeInterval, "noAttentionGiven", v)
                  }
                />
                <CriteriaRow
                  label="Continued reinforcing other appropriate behaviors"
                  value={currentInterval.continuedReinforcingOthers}
                  onChange={(v) =>
                    updateInterval(activeInterval, "continuedReinforcingOthers", v)
                  }
                />
              </div>
            )}

            {currentInterval.behaviorOccurred !== null && (
              <div className="mt-4">
                <Label htmlFor="intervalNotes">Notes for this interval</Label>
                <Textarea
                  id="intervalNotes"
                  value={currentInterval.notes}
                  onChange={(e) =>
                    updateInterval(activeInterval, "notes", e.target.value)
                  }
                  placeholder="Optional: Add any observations or notes..."
                  className="mt-1"
                  rows={2}
                />
              </div>
            )}
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
