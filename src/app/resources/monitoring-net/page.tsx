"use client";

import { useState, useCallback } from "react";
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
  CalendarIcon,
  RotateCcw,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ResourceNotice } from "@/components/layout/ResourceNotice";

// Assessment phases
type Phase = "initial" | "remediation" | "reassessment";

const PHASES: { id: Phase; label: string; description: string }[] = [
  { id: "initial", label: "Initial", description: "First observation" },
  { id: "remediation", label: "Remediation", description: "After training" },
  { id: "reassessment", label: "Re-Assessment", description: "Final check" },
];

// Criteria structure for each phase
interface PhaseCriteria {
  // Organization
  areaIsNeat: boolean;
  materialsReady: boolean;
  beginsPromptly: boolean;
  // Instructional Delivery
  followsMO: boolean;
  beginsWithManding: boolean;
  appropriateEnthusiasm: boolean;
  mixesVerbalOperants: boolean;
  usesErrorlessTeaching: boolean;
  correctResponseRate: boolean;
  taughtAppropriateTargets: boolean;
  exposedToNewActivities: boolean;
  varietyOfActivities: boolean;
  variesProcedures: boolean;
  // Reinforcement
  reinforcerCompetes: boolean;
  pairsSocialReinforcement: boolean;
  // Behavior Management/Data
  implementsBehaviorReduction: boolean;
  maintainsComposure: boolean;
  recordsDataAccurately: boolean;
}

interface PhaseData {
  date: Date | undefined;
  criteria: PhaseCriteria;
  recommendation: string;
}

const createEmptyPhaseCriteria = (): PhaseCriteria => ({
  areaIsNeat: false,
  materialsReady: false,
  beginsPromptly: false,
  followsMO: false,
  beginsWithManding: false,
  appropriateEnthusiasm: false,
  mixesVerbalOperants: false,
  usesErrorlessTeaching: false,
  correctResponseRate: false,
  taughtAppropriateTargets: false,
  exposedToNewActivities: false,
  varietyOfActivities: false,
  variesProcedures: false,
  reinforcerCompetes: false,
  pairsSocialReinforcement: false,
  implementsBehaviorReduction: false,
  maintainsComposure: false,
  recordsDataAccurately: false,
});

const createEmptyPhaseData = (): PhaseData => ({
  date: undefined,
  criteria: createEmptyPhaseCriteria(),
  recommendation: "",
});

// Criteria definitions organized by area
const CRITERIA_AREAS = [
  {
    id: "organization",
    title: "Organization",
    color: "bg-blue-50 border-blue-200",
    headerColor: "bg-blue-100 text-blue-800",
    items: [
      { field: "areaIsNeat" as const, label: "Instructional area is neat and clean" },
      { field: "materialsReady" as const, label: "All materials needed are organized and ready" },
      { field: "beginsPromptly" as const, label: "Begins promptly/avoids wasting time" },
    ],
  },
  {
    id: "instructional",
    title: "Instructional Delivery",
    color: "bg-teal-50 border-teal-200",
    headerColor: "bg-teal-100 text-teal-800",
    items: [
      { field: "followsMO" as const, label: "Follows MO of learner" },
      { field: "beginsWithManding" as const, label: "Begins NET session with manding" },
      { field: "appropriateEnthusiasm" as const, label: "Appropriate level of enthusiasm" },
      { field: "mixesVerbalOperants" as const, label: "Mixes verbal operants" },
      { field: "usesErrorlessTeaching" as const, label: "Uses errorless teaching" },
      { field: "correctResponseRate" as const, label: "Averages correct number of responses per min" },
      { field: "taughtAppropriateTargets" as const, label: "Taught appropriate targets" },
      { field: "exposedToNewActivities" as const, label: "Exposed learner to new activities" },
      { field: "varietyOfActivities" as const, label: "Uses appropriate variety of activities" },
      { field: "variesProcedures" as const, label: "Varies elements of teaching procedures based on unique teaching situation" },
    ],
  },
  {
    id: "reinforcement",
    title: "Reinforcement",
    color: "bg-amber-50 border-amber-200",
    headerColor: "bg-amber-100 text-amber-800",
    items: [
      { field: "reinforcerCompetes" as const, label: "SR+ reinforcer competes with Sr-/SrA+" },
      { field: "pairsSocialReinforcement" as const, label: "Pairs social reinforcement with tangible items" },
    ],
  },
  {
    id: "behavior",
    title: "Behavior Management/Data",
    color: "bg-rose-50 border-rose-200",
    headerColor: "bg-rose-100 text-rose-800",
    items: [
      { field: "implementsBehaviorReduction" as const, label: "Correctly implements behavior reduction procedures" },
      { field: "maintainsComposure" as const, label: "Maintains composure during behavior reduction procedures" },
      { field: "recordsDataAccurately" as const, label: "Accurately records behavior data/ABC" },
    ],
  },
];

// Calculate phase completion
const getPhaseCompletion = (criteria: PhaseCriteria): number => {
  const total = Object.keys(criteria).length;
  const checked = Object.values(criteria).filter(Boolean).length;
  return Math.round((checked / total) * 100);
};

// Calculate area scores
const getAreaScore = (criteria: PhaseCriteria, areaId: string): { checked: number; total: number } => {
  const area = CRITERIA_AREAS.find((a) => a.id === areaId);
  if (!area) return { checked: 0, total: 0 };
  const checked = area.items.filter((item) => criteria[item.field]).length;
  return { checked, total: area.items.length };
};

export default function NETMonitoringPage() {
  // Header state
  const [supervisee, setSupervisee] = useState("");
  const [client, setClient] = useState("");
  const [observer, setObserver] = useState("");

  // Phase data
  const [phases, setPhases] = useState<Record<Phase, PhaseData>>({
    initial: createEmptyPhaseData(),
    remediation: createEmptyPhaseData(),
    reassessment: createEmptyPhaseData(),
  });

  // Active phase tab
  const [activePhase, setActivePhase] = useState<Phase>("initial");

  // Additional fields
  const [responsesPerMinute, setResponsesPerMinute] = useState("");
  const [additionalComments, setAdditionalComments] = useState("");
  const [targets, setTargets] = useState<string[]>(["", "", "", "", ""]);

  // PDF generation
  const [isGenerating, setIsGenerating] = useState(false);

  // Update phase date
  const updatePhaseDate = (phase: Phase, date: Date | undefined) => {
    setPhases((prev) => ({
      ...prev,
      [phase]: { ...prev[phase], date },
    }));
  };

  // Update phase criteria
  const updatePhaseCriteria = (phase: Phase, field: keyof PhaseCriteria, value: boolean) => {
    setPhases((prev) => ({
      ...prev,
      [phase]: {
        ...prev[phase],
        criteria: { ...prev[phase].criteria, [field]: value },
      },
    }));
  };

  // Toggle criteria
  const toggleCriteria = (field: keyof PhaseCriteria) => {
    const current = phases[activePhase].criteria[field];
    updatePhaseCriteria(activePhase, field, !current);
  };

  // Update recommendation
  const updateRecommendation = (phase: Phase, recommendation: string) => {
    setPhases((prev) => ({
      ...prev,
      [phase]: { ...prev[phase], recommendation },
    }));
  };

  // Mark all in area
  const markAllInArea = (areaId: string, value: boolean) => {
    const area = CRITERIA_AREAS.find((a) => a.id === areaId);
    if (!area) return;

    setPhases((prev) => {
      const newCriteria = { ...prev[activePhase].criteria };
      area.items.forEach((item) => {
        newCriteria[item.field] = value;
      });
      return {
        ...prev,
        [activePhase]: { ...prev[activePhase], criteria: newCriteria },
      };
    });
  };

  // Copy from previous phase
  const copyFromPreviousPhase = () => {
    const phaseOrder: Phase[] = ["initial", "remediation", "reassessment"];
    const currentIndex = phaseOrder.indexOf(activePhase);
    if (currentIndex <= 0) return;

    const previousPhase = phaseOrder[currentIndex - 1];
    setPhases((prev) => ({
      ...prev,
      [activePhase]: {
        ...prev[activePhase],
        criteria: { ...prev[previousPhase].criteria },
      },
    }));
  };

  // Reset current phase
  const resetCurrentPhase = () => {
    setPhases((prev) => ({
      ...prev,
      [activePhase]: createEmptyPhaseData(),
    }));
  };

  // Add/remove targets
  const updateTarget = (index: number, value: string) => {
    setTargets((prev) => {
      const newTargets = [...prev];
      newTargets[index] = value;
      return newTargets;
    });
  };

  const addTarget = () => {
    if (targets.length < 10) {
      setTargets((prev) => [...prev, ""]);
    }
  };

  const removeTarget = (index: number) => {
    if (targets.length > 1) {
      setTargets((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Calculate scores
  const calculateScores = useCallback(() => {
    const scores: Record<Phase, { overall: number; areas: Record<string, { checked: number; total: number }> }> = {
      initial: { overall: 0, areas: {} },
      remediation: { overall: 0, areas: {} },
      reassessment: { overall: 0, areas: {} },
    };

    (["initial", "remediation", "reassessment"] as Phase[]).forEach((phase) => {
      scores[phase].overall = getPhaseCompletion(phases[phase].criteria);
      CRITERIA_AREAS.forEach((area) => {
        scores[phase].areas[area.id] = getAreaScore(phases[phase].criteria, area.id);
      });
    });

    return scores;
  }, [phases]);

  const scores = calculateScores();

  // Check if phase has been started
  const isPhaseStarted = (phase: Phase): boolean => {
    return phases[phase].date !== undefined || Object.values(phases[phase].criteria).some(Boolean);
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      // Dynamic imports - only load PDF libraries when user clicks download
      const [{ pdf }, { NETMonitoringPDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/pdf/NETMonitoringPDF"),
      ]);

      const doc = (
        <NETMonitoringPDF
          supervisee={supervisee}
          client={client}
          observer={observer}
          phases={phases}
          responsesPerMinute={responsesPerMinute}
          additionalComments={additionalComments}
          targets={targets.filter(Boolean)}
          scores={scores}
        />
      );
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const dateStr = phases.initial.date
        ? format(phases.initial.date, "yyyy-MM-dd")
        : new Date().toISOString().split("T")[0];
      link.download = `net-monitoring-${supervisee || "form"}-${dateStr}.pdf`;
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

  // Reset entire form
  const handleReset = () => {
    setSupervisee("");
    setClient("");
    setObserver("");
    setPhases({
      initial: createEmptyPhaseData(),
      remediation: createEmptyPhaseData(),
      reassessment: createEmptyPhaseData(),
    });
    setResponsesPerMinute("");
    setAdditionalComments("");
    setTargets(["", "", "", "", ""]);
    setActivePhase("initial");
  };

  // Checkbox component
  const CriteriaCheckbox = ({
    label,
    checked,
    onChange,
  }: {
    label: string;
    checked: boolean;
    onChange: () => void;
  }) => (
    <div className="flex items-start gap-3 py-2">
      <button
        type="button"
        onClick={onChange}
        className={cn(
          "mt-0.5 w-6 h-6 rounded border-2 flex items-center justify-center transition-all flex-shrink-0",
          checked
            ? "border-teal-600 bg-teal-600 text-white"
            : "border-gray-300 bg-white hover:border-teal-400"
        )}
      >
        {checked && (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      <span className="text-sm leading-relaxed">{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            NET Session Monitoring Form
          </h1>
          <p className="text-gray-600">
            Monitor Natural Environment Teaching competency across assessment phases.
          </p>
        </div>

        {/* Privacy Notice */}
        <ResourceNotice className="mb-6" />

        {/* Progress Summary */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Phase Progress</span>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <TrendingUp className="w-3.5 h-3.5" />
                Track improvement over time
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {PHASES.map((phase) => {
                const started = isPhaseStarted(phase.id);
                const completion = scores[phase.id].overall;
                return (
                  <div
                    key={phase.id}
                    className={cn(
                      "p-3 rounded-lg border text-center",
                      activePhase === phase.id
                        ? "border-teal-500 bg-teal-50"
                        : started
                          ? "border-green-200 bg-green-50"
                          : "border-gray-200 bg-white"
                    )}
                  >
                    <div className="text-xs text-gray-500 mb-1">{phase.label}</div>
                    <div className={cn(
                      "text-lg font-bold",
                      completion >= 85 ? "text-green-600" :
                      completion >= 50 ? "text-amber-600" : "text-gray-400"
                    )}>
                      {completion}%
                    </div>
                    {phases[phase.id].date && (
                      <div className="text-xs text-gray-400 mt-1">
                        {format(phases[phase.id].date!, "MMM d")}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Session Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Session Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="supervisee">Staff/Supervisee</Label>
                <Input
                  id="supervisee"
                  value={supervisee}
                  onChange={(e) => setSupervisee(e.target.value)}
                  placeholder="Enter name"
                />
              </div>
              <div>
                <Label htmlFor="client">Client (Optional)</Label>
                <Input
                  id="client"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="Enter client name"
                />
              </div>
              <div>
                <Label htmlFor="observer">Observer/Monitor</Label>
                <Input
                  id="observer"
                  value={observer}
                  onChange={(e) => setObserver(e.target.value)}
                  placeholder="Enter observer name"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phase Tabs */}
        <Card className="mb-6">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Assessment Criteria</CardTitle>
            </div>
            {/* Phase Tabs */}
            <div className="flex gap-2 mt-4 border-b">
              {PHASES.map((phase) => {
                const started = isPhaseStarted(phase.id);
                return (
                  <button
                    key={phase.id}
                    onClick={() => setActivePhase(phase.id)}
                    className={cn(
                      "px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2",
                      activePhase === phase.id
                        ? "border-teal-600 text-teal-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    )}
                  >
                    {started ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-300" />
                    )}
                    {phase.label}
                  </button>
                );
              })}
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {/* Phase Date */}
            <div className="mb-4 pb-4 border-b">
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex-1 min-w-[200px]">
                  <Label>{PHASES.find((p) => p.id === activePhase)?.label} Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !phases[activePhase].date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {phases[activePhase].date
                          ? format(phases[activePhase].date!, "PPP")
                          : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={phases[activePhase].date}
                        onSelect={(date) => updatePhaseDate(activePhase, date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex gap-2">
                  {activePhase !== "initial" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyFromPreviousPhase}
                      className="text-xs"
                    >
                      Copy from Previous
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetCurrentPhase}
                    className="text-xs text-gray-600"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1" />
                    Reset
                  </Button>
                </div>
              </div>
            </div>

            {/* Criteria by Area */}
            <div className="space-y-4">
              {CRITERIA_AREAS.map((area) => {
                const areaScore = scores[activePhase].areas[area.id];
                return (
                  <div key={area.id} className={cn("rounded-lg border", area.color)}>
                    <div className={cn("px-4 py-2 rounded-t-lg flex items-center justify-between", area.headerColor)}>
                      <h3 className="font-semibold text-sm">{area.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs">
                          {areaScore.checked}/{areaScore.total}
                        </span>
                        <button
                          onClick={() => markAllInArea(area.id, true)}
                          className="text-xs underline hover:no-underline"
                        >
                          Mark all
                        </button>
                      </div>
                    </div>
                    <div className="px-4 py-2">
                      {area.items.map((item) => (
                        <CriteriaCheckbox
                          key={item.field}
                          label={item.label}
                          checked={phases[activePhase].criteria[item.field]}
                          onChange={() => toggleCriteria(item.field)}
                        />
                      ))}
                      {area.id === "organization" && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <Label className="text-xs text-gray-600">
                            Recommendation based on previous competency
                          </Label>
                          <Textarea
                            value={phases[activePhase].recommendation}
                            onChange={(e) => updateRecommendation(activePhase, e.target.value)}
                            placeholder="Enter recommendations..."
                            className="mt-1 text-sm"
                            rows={2}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Additional Fields */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Responses per minute */}
            <div>
              <Label htmlFor="rpm">Responses per minute (1 minute timing)</Label>
              <Input
                id="rpm"
                type="number"
                value={responsesPerMinute}
                onChange={(e) => setResponsesPerMinute(e.target.value)}
                placeholder="Enter RPM"
                className="max-w-[200px]"
              />
            </div>

            {/* Additional Comments */}
            <div>
              <Label htmlFor="comments">Additional Comments</Label>
              <Textarea
                id="comments"
                value={additionalComments}
                onChange={(e) => setAdditionalComments(e.target.value)}
                placeholder="Enter any additional comments..."
                rows={3}
              />
            </div>

            {/* Targets */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Targets</Label>
                {targets.length < 10 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addTarget}
                    className="h-7 text-xs text-teal-600 border-teal-200"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add Target
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {targets.map((target, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 w-6">{index + 1}.</span>
                    <Input
                      value={target}
                      onChange={(e) => updateTarget(index, e.target.value)}
                      placeholder={`Target ${index + 1}`}
                      className="text-sm"
                    />
                    {targets.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTarget(index)}
                        className="h-8 w-8 text-gray-400 hover:text-rose-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparison Summary */}
        {(isPhaseStarted("remediation") || isPhaseStarted("reassessment")) && (
          <Card className="mb-6 border-teal-200 bg-teal-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-600" />
                Progress Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Area</th>
                      <th className="text-center py-2 font-medium">Initial</th>
                      {isPhaseStarted("remediation") && (
                        <th className="text-center py-2 font-medium">Remediation</th>
                      )}
                      {isPhaseStarted("reassessment") && (
                        <th className="text-center py-2 font-medium">Re-Assessment</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {CRITERIA_AREAS.map((area) => (
                      <tr key={area.id} className="border-b">
                        <td className="py-2">{area.title}</td>
                        <td className="text-center py-2">
                          {scores.initial.areas[area.id].checked}/{scores.initial.areas[area.id].total}
                        </td>
                        {isPhaseStarted("remediation") && (
                          <td className="text-center py-2">
                            <span className={cn(
                              scores.remediation.areas[area.id].checked > scores.initial.areas[area.id].checked
                                ? "text-green-600 font-medium"
                                : ""
                            )}>
                              {scores.remediation.areas[area.id].checked}/{scores.remediation.areas[area.id].total}
                            </span>
                          </td>
                        )}
                        {isPhaseStarted("reassessment") && (
                          <td className="text-center py-2">
                            <span className={cn(
                              scores.reassessment.areas[area.id].checked > scores.remediation.areas[area.id].checked
                                ? "text-green-600 font-medium"
                                : ""
                            )}>
                              {scores.reassessment.areas[area.id].checked}/{scores.reassessment.areas[area.id].total}
                            </span>
                          </td>
                        )}
                      </tr>
                    ))}
                    <tr className="font-medium">
                      <td className="py-2">Overall</td>
                      <td className="text-center py-2">{scores.initial.overall}%</td>
                      {isPhaseStarted("remediation") && (
                        <td className="text-center py-2">
                          <span className={cn(
                            scores.remediation.overall > scores.initial.overall ? "text-green-600" : ""
                          )}>
                            {scores.remediation.overall}%
                          </span>
                        </td>
                      )}
                      {isPhaseStarted("reassessment") && (
                        <td className="text-center py-2">
                          <span className={cn(
                            scores.reassessment.overall > scores.remediation.overall ? "text-green-600" : ""
                          )}>
                            {scores.reassessment.overall}%
                          </span>
                        </td>
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Form
          </Button>
          <Button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="bg-teal-600 hover:bg-teal-700"
          >
            <FileDown className="w-4 h-4 mr-2" />
            {isGenerating ? "Generating PDF..." : "Download PDF"}
          </Button>
        </div>
      </div>
    </div>
  );
}
