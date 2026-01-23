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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  FileDown,
  Info,
  RotateCcw,
  CalendarIcon,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ResourceNotice } from "@/components/layout/ResourceNotice";
import { ChallengingBehaviorChecklistPDF } from "@/components/pdf/ChallengingBehaviorChecklistPDF";
import { pdf } from "@react-pdf/renderer";

// Types
type Answer = "yes" | "no" | "na" | null;

interface CriteriaAnswers {
  isMeasurableObservable: Answer;
  isCulturallySensitive: Answer;
  canSeeOrHear: Answer;
  freeOfInternalStates: Answer;
  includesDimension: Answer;
  appropriateMeasurement: Answer;
}

// Form info
const FORM_INFO = {
  title: "Evaluating Challenging Behavior Definitions",
  description:
    "This checklist helps ensure that behavior definitions are properly written to be observable, measurable, and repeatable - the foundation of reliable data collection.",
  keyPoints: [
    "Definitions must be observable - can see or hear the behavior",
    "Definitions must be measurable - can count or time the behavior",
    "Avoid internal states (frustrated, anxious) - stick to observable actions",
    "Include intensity dimensions when relevant (leaves a mark, breaks skin)",
  ],
};

// Criteria definitions
const CRITERIA = [
  {
    id: "isMeasurableObservable",
    label: "Is the maladaptive behavior measurable and observable?",
    hint: "Can the behavior be counted, timed, or otherwise measured objectively?",
  },
  {
    id: "isCulturallySensitive",
    label:
      "Is the maladaptive behavior label culturally sensitive and age appropriate?",
    hint: "Avoid stigmatizing language; use clinical, respectful terminology",
  },
  {
    id: "canSeeOrHear",
    label: "Observer can see or hear the occurrence of the maladaptive behavior.",
    hint: "The behavior must be detectable through direct observation",
  },
  {
    id: "freeOfInternalStates",
    label:
      "Is the definition free of any reference to internal states (e.g., frustrated, overstimulated)?",
    hint: "Internal states cannot be observed directly - describe observable actions instead",
  },
  {
    id: "includesDimension",
    label:
      "Does the definition (if applicable) include a dimension of the behavior such as intensity (e.g., leaves a red mark, breaks the skin)?",
    hint: "N/A if intensity dimension is not relevant to this behavior",
    hasNA: true,
  },
  {
    id: "appropriateMeasurement",
    label:
      "Is the selected measurement procedure appropriate? (Use job aid with decision tree.)",
    hint: "Frequency, duration, latency, or other measurement should match the behavior",
  },
];

// Example definitions
const EXAMPLE_DEFINITIONS = [
  {
    behavior: "Task Refusal",
    definition:
      "Any response that does not match the delivered instruction within 20 seconds from the time the instruction was delivered, often accompanied by vocal protesting and swiping of materials to the floor.",
  },
  {
    behavior: "Teeth Grinding",
    definition:
      "Any time the person has a closed mouth and also moves his/her clenched lower jaw forward and backwards either slowly or rapidly. The movement may create an audible grating sound.",
  },
  {
    behavior: "Physical Aggression (Scratching)",
    definition:
      "Any occurrence of digging the fingernails into another person's skin and/or moving them across another person's skin or clothing, often resulting in red marks on the skin or breaking of the skin.",
  },
  {
    behavior: "Aggression Towards Staff",
    definition:
      "An instance where the learner aggresses towards a staff member by pulling the staff's clothes or hair, and/or pinching a part of the staff's body by applying pressure between his thumb and at least one other finger, and/or scratching the staff with his fingers to the intensity that it leaves a red mark or breaks the skin.",
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
        "px-3 py-1.5 text-sm font-medium rounded-md border transition-colors",
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
  hasNA = false,
}: {
  label: string;
  value: Answer;
  onChange: (value: Answer) => void;
  hint?: string;
  index: number;
  hasNA?: boolean;
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
        {hasNA && (
          <AnswerButton
            value="na"
            currentValue={value}
            onChange={onChange}
            label="N/A"
            color="gray"
          />
        )}
      </div>
    </div>
  );
}

export default function ChallengingBehaviorChecklistPage() {
  // Session info state
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [evaluator, setEvaluator] = useState("");
  const [client, setClient] = useState("");
  const [behaviorName, setBehaviorName] = useState("");
  const [behaviorDefinition, setBehaviorDefinition] = useState("");

  // Criteria answers
  const [answers, setAnswers] = useState<CriteriaAnswers>({
    isMeasurableObservable: null,
    isCulturallySensitive: null,
    canSeeOrHear: null,
    freeOfInternalStates: null,
    includesDimension: null,
    appropriateMeasurement: null,
  });

  // Notes
  const [notes, setNotes] = useState("");

  // Examples expanded
  const [examplesOpen, setExamplesOpen] = useState(false);

  // PDF generation state
  const [isGenerating, setIsGenerating] = useState(false);

  // Update answer
  const updateAnswer = (key: keyof CriteriaAnswers, value: Answer) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  // Calculate scores
  const scores = useMemo(() => {
    const answerEntries = Object.entries(answers) as [
      keyof CriteriaAnswers,
      Answer
    ][];
    const yesCount = answerEntries.filter(([, a]) => a === "yes").length;
    const noCount = answerEntries.filter(([, a]) => a === "no").length;
    const naCount = answerEntries.filter(([, a]) => a === "na").length;
    const answeredCount = yesCount + noCount + naCount;
    const scorableCount = yesCount + noCount; // Exclude N/A from scoring
    const totalCount = 6;
    const percentage =
      scorableCount > 0 ? Math.round((yesCount / scorableCount) * 100) : 0;
    const allAnswered = answeredCount === totalCount;
    const passed = allAnswered && noCount === 0;

    return {
      yesCount,
      noCount,
      naCount,
      answeredCount,
      scorableCount,
      totalCount,
      percentage,
      allAnswered,
      passed,
    };
  }, [answers]);

  // Reset form
  const handleReset = () => {
    setDate(undefined);
    setEvaluator("");
    setClient("");
    setBehaviorName("");
    setBehaviorDefinition("");
    setAnswers({
      isMeasurableObservable: null,
      isCulturallySensitive: null,
      canSeeOrHear: null,
      freeOfInternalStates: null,
      includesDimension: null,
      appropriateMeasurement: null,
    });
    setNotes("");
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
      const doc = (
        <ChallengingBehaviorChecklistPDF
          date={date ? format(date, "PPP") : ""}
          evaluator={evaluator}
          client={client}
          behaviorName={behaviorName}
          behaviorDefinition={behaviorDefinition}
          answers={answers}
          scores={scores}
          notes={notes}
        />
      );
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `behavior-definition-checklist-${client || "form"}-${
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
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Challenging Behavior Definition Checklist
            </h1>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 hover:bg-teal-200 text-teal-600 transition-colors"
                  aria-label="About this checklist"
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
                  <ul className="space-y-1.5">
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
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <p className="text-gray-600">
            Evaluate if a behavior definition is observable, measurable, and
            repeatable.
          </p>
        </div>

        {/* Privacy Notice */}
        <ResourceNotice className="mb-6" />

        {/* Score Summary */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">
                Definition Quality
              </span>
              <div className="flex items-center gap-2">
                {scores.allAnswered && (
                  <>
                    {scores.passed ? (
                      <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4" />
                        MEETS CRITERIA
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600 text-sm font-medium">
                        <XCircle className="w-4 h-4" />
                        NEEDS REVISION
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
                {scores.yesCount} of {scores.scorableCount} criteria met
                {scores.naCount > 0 && ` (${scores.naCount} N/A)`}
              </span>
              <span>
                {scores.answeredCount} of {scores.totalCount} answered
              </span>
            </div>
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
                <Label htmlFor="behaviorName">Behavior Name/Label</Label>
                <Input
                  id="behaviorName"
                  value={behaviorName}
                  onChange={(e) => setBehaviorName(e.target.value)}
                  placeholder="e.g., Physical Aggression"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="behaviorDefinition">
                Behavior Definition Being Evaluated
              </Label>
              <Textarea
                id="behaviorDefinition"
                value={behaviorDefinition}
                onChange={(e) => setBehaviorDefinition(e.target.value)}
                placeholder="Enter the complete behavior definition to evaluate..."
                className="mt-1"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Criteria Checklist */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Definition Criteria</CardTitle>
            <p className="text-sm text-gray-500">
              Remember: objectives should be observable, measurable, and
              repeatable.
            </p>
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
                hasNA={criterion.hasNA}
              />
            ))}
          </CardContent>
        </Card>

        {/* Example Definitions */}
        <Collapsible open={examplesOpen} onOpenChange={setExamplesOpen}>
          <Card className="mb-6">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    <CardTitle className="text-lg">
                      Example Definitions
                    </CardTitle>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-gray-400 transition-transform",
                      examplesOpen && "rotate-180"
                    )}
                  />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {EXAMPLE_DEFINITIONS.map((example, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <p className="text-sm font-medium text-gray-800 mb-1">
                        {idx + 1}. {example.behavior}
                      </p>
                      <p className="text-sm text-gray-600">
                        {example.definition}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Notes */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              Recommendations for Revision
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="If the definition needs revision, note specific recommendations here..."
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
