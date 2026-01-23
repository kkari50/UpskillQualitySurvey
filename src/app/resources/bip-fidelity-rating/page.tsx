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
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ResourceNotice } from "@/components/layout/ResourceNotice";
import { BIPFidelityRatingPDF } from "@/components/pdf/BIPFidelityRatingPDF";
import { pdf } from "@react-pdf/renderer";

// Types
type Answer = "yes" | "no" | null;

interface CriteriaAnswers {
  hasRequiredFields: Answer;
  hasAntecedentDescription: Answer;
  hasConsequenceDescription: Answer;
  hasImplementationRating: Answer;
  hasCommentsSection: Answer;
  hasOverallScoreSystem: Answer;
}

// Form info
const FORM_INFO = {
  title: "What is this form for?",
  description:
    "This form evaluates whether a Behavior Intervention Plan (BIP) fidelity checklist contains all necessary components for proper implementation monitoring.",
  keyPoints: [
    "Ensures fidelity checklists are comprehensive",
    "Requires 100% score to pass - all components must be present",
    "Based on Codding et al. (2005) research on behavior support plan implementation",
    "Missing components reduce ability to monitor implementation fidelity",
  ],
  reference:
    "Codding, R. S., Feinberg, A. B., Dunn, E. K., & Pace, G. M. (2005). Effects of immediate performance feedback on implementation of behavior support plans. Journal of Applied Behavior Analysis, 38(2), 205-219.",
};

// Criteria definitions
const CRITERIA = [
  {
    id: "hasRequiredFields",
    label:
      "Does the fidelity checklist have a space for: date, time, patient name, RBT name/caregiver name, and supervisor name?",
    hint: "All identification fields must be present for proper documentation",
  },
  {
    id: "hasAntecedentDescription",
    label:
      "Does the checklist provide a description of the plan components for antecedent procedure steps?",
    hint: "Antecedent strategies should be clearly listed for fidelity monitoring",
  },
  {
    id: "hasConsequenceDescription",
    label:
      "Does the checklist provide a description of the plan components for consequence procedure steps?",
    hint: "Consequence procedures should be clearly listed for fidelity monitoring",
  },
  {
    id: "hasImplementationRating",
    label:
      "Does the checklist provide an implementation rating for each step?",
    hint: "Each step should have a way to rate if it was implemented correctly",
  },
  {
    id: "hasCommentsSection",
    label: "Does the checklist have a section for comments?",
    hint: "Space for notes and observations during monitoring",
  },
  {
    id: "hasOverallScoreSystem",
    label: "Does the checklist have an overall score system?",
    hint: "A way to calculate total fidelity percentage",
  },
];

// Answer button component
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
  color: "green" | "red";
}) {
  const isSelected = currentValue === value;
  const colorClasses = {
    green: isSelected
      ? "bg-green-500 text-white border-green-500"
      : "bg-white text-green-600 border-green-300 hover:bg-green-50",
    red: isSelected
      ? "bg-red-500 text-white border-red-500"
      : "bg-white text-red-600 border-red-300 hover:bg-red-50",
  };

  return (
    <button
      type="button"
      onClick={() => onChange(isSelected ? null : value)}
      className={cn(
        "px-4 py-2 text-sm font-medium rounded-md border transition-colors",
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
  index,
}: {
  label: string;
  value: Answer;
  onChange: (value: Answer) => void;
  hint?: string;
  index: number;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between py-4 border-b border-gray-100 last:border-0 gap-3">
      <div className="flex-1 pr-4">
        <div className="flex items-start gap-2">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 text-teal-700 text-sm font-medium flex items-center justify-center">
            {index}
          </span>
          <div>
            <p className="text-sm text-gray-800">{label}</p>
            {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
          </div>
        </div>
      </div>
      <div className="flex gap-2 flex-shrink-0 ml-8 sm:ml-0">
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
      </div>
    </div>
  );
}

export default function BIPFidelityRatingPage() {
  // Session info state
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [evaluator, setEvaluator] = useState("");
  const [maladaptiveBehavior, setMaladaptiveBehavior] = useState("");

  // Criteria answers
  const [answers, setAnswers] = useState<CriteriaAnswers>({
    hasRequiredFields: null,
    hasAntecedentDescription: null,
    hasConsequenceDescription: null,
    hasImplementationRating: null,
    hasCommentsSection: null,
    hasOverallScoreSystem: null,
  });

  // Notes
  const [notes, setNotes] = useState("");

  // PDF generation state
  const [isGenerating, setIsGenerating] = useState(false);

  // Update answer
  const updateAnswer = (key: keyof CriteriaAnswers, value: Answer) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  // Calculate scores
  const scores = useMemo(() => {
    const answerValues = Object.values(answers);
    const yesCount = answerValues.filter((a) => a === "yes").length;
    const noCount = answerValues.filter((a) => a === "no").length;
    const answeredCount = yesCount + noCount;
    const totalCount = 6;
    const percentage =
      answeredCount > 0 ? Math.round((yesCount / totalCount) * 100) : 0;
    const passed = percentage === 100;

    return {
      yesCount,
      noCount,
      answeredCount,
      totalCount,
      percentage,
      passed,
    };
  }, [answers]);

  // Reset form
  const handleReset = () => {
    setDate(undefined);
    setEvaluator("");
    setMaladaptiveBehavior("");
    setAnswers({
      hasRequiredFields: null,
      hasAntecedentDescription: null,
      hasConsequenceDescription: null,
      hasImplementationRating: null,
      hasCommentsSection: null,
      hasOverallScoreSystem: null,
    });
    setNotes("");
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
      const doc = (
        <BIPFidelityRatingPDF
          date={date ? format(date, "PPP") : ""}
          evaluator={evaluator}
          maladaptiveBehavior={maladaptiveBehavior}
          answers={answers}
          scores={scores}
          notes={notes}
        />
      );
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `bip-fidelity-rating-${formattedDate || new Date().toISOString().split("T")[0]}.pdf`;
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
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">
              BIP Fidelity Rating Form
            </h1>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 hover:bg-teal-200 text-teal-600 transition-colors"
                  aria-label="About this form"
                >
                  <Info className="w-4 h-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-0" align="start">
                <div className="p-3 border-b bg-teal-50">
                  <p className="text-sm font-semibold text-teal-800">
                    {FORM_INFO.title}
                  </p>
                </div>
                <div className="p-3">
                  <p className="text-sm text-gray-700 mb-3">
                    {FORM_INFO.description}
                  </p>
                  <ul className="space-y-1.5 mb-3">
                    {FORM_INFO.keyPoints.map((point, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-gray-600 flex items-start gap-1.5"
                      >
                        <span className="text-teal-500 mt-0.5">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[10px] text-gray-500 border-t pt-2">
                    {FORM_INFO.reference}
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <p className="text-gray-600">
            Evaluate if a BIP fidelity checklist contains all required
            components.
          </p>
        </div>

        {/* Privacy Notice */}
        <ResourceNotice className="mb-6" />

        {/* Score Summary */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">
                Rating Score
              </span>
              <div className="flex items-center gap-2">
                {scores.answeredCount === scores.totalCount && (
                  <>
                    {scores.passed ? (
                      <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4" />
                        PASSED
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600 text-sm font-medium">
                        <XCircle className="w-4 h-4" />
                        NOT PASSED
                      </span>
                    )}
                  </>
                )}
                <span
                  className={cn(
                    "text-lg font-bold",
                    scores.percentage === 100
                      ? "text-green-600"
                      : scores.percentage >= 80
                        ? "text-amber-600"
                        : "text-red-600"
                  )}
                >
                  {scores.percentage}%
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  scores.percentage === 100
                    ? "bg-green-500"
                    : scores.percentage >= 80
                      ? "bg-amber-500"
                      : "bg-red-500"
                )}
                style={{ width: `${scores.percentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>
                {scores.yesCount} of {scores.totalCount} criteria met
              </span>
              <span>{scores.answeredCount} of {scores.totalCount} answered</span>
            </div>
            {scores.answeredCount === scores.totalCount && !scores.passed && (
              <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-800">
                  A score of 100% must be reached to pass this rating form. All
                  components are required for proper fidelity monitoring.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Session Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Evaluation Information</CardTitle>
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
                <Label htmlFor="evaluator">Evaluator</Label>
                <Input
                  id="evaluator"
                  value={evaluator}
                  onChange={(e) => setEvaluator(e.target.value)}
                  placeholder="Enter evaluator name"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="maladaptiveBehavior">
                Maladaptive Behavior Being Observed
              </Label>
              <Input
                id="maladaptiveBehavior"
                value={maladaptiveBehavior}
                onChange={(e) => setMaladaptiveBehavior(e.target.value)}
                placeholder="e.g., Physical aggression, Self-injurious behavior"
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Criteria Checklist */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Checklist Components</CardTitle>
          </CardHeader>
          <CardContent>
            {CRITERIA.map((criterion, index) => (
              <CriteriaRow
                key={criterion.id}
                label={criterion.label}
                value={answers[criterion.id as keyof CriteriaAnswers]}
                onChange={(v) =>
                  updateAnswer(criterion.id as keyof CriteriaAnswers, v)
                }
                hint={criterion.hint}
                index={index + 1}
              />
            ))}
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
              placeholder="Add any observations or recommendations for improving the checklist..."
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
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset Form
          </Button>
        </div>
      </div>
    </div>
  );
}
