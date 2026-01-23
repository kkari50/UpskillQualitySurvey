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
  ChevronDown,
  CheckSquare,
  Square,
  Brain,
  MapPin,
  BookOpen,
  Users,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ResourceNotice } from "@/components/layout/ResourceNotice";
import { BarrierIdentificationPDF } from "@/components/pdf/BarrierIdentificationPDF";
import { pdf } from "@react-pdf/renderer";

// Types
interface BarrierCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  items: {
    id: string;
    label: string;
    description?: string;
  }[];
}

// Barrier categories
const BARRIER_CATEGORIES: BarrierCategory[] = [
  {
    id: "skillDeficits",
    title: "Skill Deficits",
    icon: <Brain className="w-4 h-4" />,
    color: "bg-purple-500",
    description: "Gaps in learner's current skill repertoire",
    items: [
      {
        id: "communicationBarriers",
        label: "Communication barriers (expressive/receptive language)",
        description: "Difficulty understanding or expressing language",
      },
      {
        id: "selfRegulation",
        label: "Self-regulation/emotional control deficits",
        description: "Challenges managing emotions or behavior",
      },
      {
        id: "executiveFunctioning",
        label: "Executive functioning challenges",
        description: "Difficulties with planning, organization, working memory",
      },
      {
        id: "prerequisiteSkills",
        label: "Prerequisite skill gaps",
        description: "Missing foundational skills needed for target behavior",
      },
      {
        id: "generalization",
        label: "Generalization difficulties",
        description: "Unable to apply learned skills across settings/people",
      },
      {
        id: "promptDependency",
        label: "Prompt dependency",
        description: "Relies heavily on prompts to perform skills",
      },
    ],
  },
  {
    id: "environmentalBarriers",
    title: "Environmental Barriers",
    icon: <MapPin className="w-4 h-4" />,
    color: "bg-green-500",
    description: "Physical or contextual factors affecting learning",
    items: [
      {
        id: "physicalEnvironment",
        label: "Physical environment limitations",
        description: "Space, equipment, or setup issues",
      },
      {
        id: "sensorySensitivities",
        label: "Sensory sensitivities/overstimulation",
        description: "Environmental triggers causing distress",
      },
      {
        id: "inconsistentExpectations",
        label: "Inconsistent expectations across settings",
        description: "Different rules/expectations at home, school, clinic",
      },
      {
        id: "limitedReinforcement",
        label: "Limited access to reinforcement",
        description: "Preferred items/activities not available",
      },
      {
        id: "competingContingencies",
        label: "Competing contingencies",
        description: "Other behaviors provide easier/better reinforcement",
      },
      {
        id: "scheduleDisruptions",
        label: "Schedule/routine disruptions",
        description: "Inconsistent schedules affecting predictability",
      },
    ],
  },
  {
    id: "instructionalBarriers",
    title: "Instructional Barriers",
    icon: <BookOpen className="w-4 h-4" />,
    color: "bg-blue-500",
    description: "Issues with how skills are being taught",
    items: [
      {
        id: "taskDifficulty",
        label: "Task difficulty mismatched to current abilities",
        description: "Goals too easy or too hard for learner",
      },
      {
        id: "ineffectiveMethods",
        label: "Ineffective instructional methods",
        description: "Teaching strategies not working for this learner",
      },
      {
        id: "inadequateReinforcement",
        label: "Inadequate reinforcement systems",
        description: "Reinforcers not motivating or delivered inconsistently",
      },
      {
        id: "poorStimulusControl",
        label: "Poor stimulus control",
        description: "Learner not responding to correct discriminative stimuli",
      },
      {
        id: "responseEffort",
        label: "Response effort too high",
        description: "Target behavior requires too much effort",
      },
      {
        id: "limitedPractice",
        label: "Limited opportunities for practice",
        description: "Not enough trials or practice sessions",
      },
    ],
  },
  {
    id: "socialBarriers",
    title: "Social Barriers",
    icon: <Users className="w-4 h-4" />,
    color: "bg-orange-500",
    description: "Social factors impacting skill development",
    items: [
      {
        id: "peerModeling",
        label: "Peer modeling limitations",
        description: "Limited access to appropriate peer models",
      },
      {
        id: "socialReinforcement",
        label: "Social reinforcement deficits",
        description: "Social praise/interaction not reinforcing",
      },
      {
        id: "socialAcceptance",
        label: "Limited social acceptance/inclusion",
        description: "Exclusion or rejection by peers",
      },
      {
        id: "socialAnxiety",
        label: "Social anxiety/avoidance",
        description: "Fear or avoidance of social situations",
      },
    ],
  },
];

// Form info
const FORM_INFO = {
  title: "Barrier Identification Planning Checklist",
  description:
    "Use this checklist to systematically identify barriers that may be preventing a learner from acquiring or demonstrating skills. Identifying barriers is the first step to developing effective intervention modifications.",
  keyPoints: [
    "Review all categories to ensure comprehensive barrier identification",
    "Multiple barriers often interact - look for patterns",
    "Use identified barriers to guide protocol modifications",
    "Re-evaluate barriers when goals continue without progress",
  ],
};

// Checkbox item component
function CheckboxItem({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors",
        checked ? "bg-amber-50 border border-amber-200" : "hover:bg-gray-50"
      )}
    >
      <button
        type="button"
        id={id}
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="mt-0.5 flex-shrink-0"
      >
        {checked ? (
          <CheckSquare className="w-5 h-5 text-amber-600" />
        ) : (
          <Square className="w-5 h-5 text-gray-400" />
        )}
      </button>
      <div className="flex-1">
        <span
          className={cn(
            "text-sm font-medium",
            checked ? "text-amber-800" : "text-gray-700"
          )}
        >
          {label}
        </span>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
    </label>
  );
}

// Category card component
function BarrierCategoryCard({
  category,
  checkedItems,
  onToggle,
  defaultOpen = false,
}: {
  category: BarrierCategory;
  checkedItems: Set<string>;
  onToggle: (itemId: string) => void;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const checkedCount = category.items.filter((item) =>
    checkedItems.has(item.id)
  ).length;
  const hasBarriers = checkedCount > 0;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className={cn(hasBarriers && "ring-2 ring-amber-200")}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-white",
                    category.color
                  )}
                >
                  {category.icon}
                </div>
                <div>
                  <CardTitle className="text-base">{category.title}</CardTitle>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {category.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {hasBarriers && (
                  <span className="flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded">
                    <AlertCircle className="w-3 h-3" />
                    {checkedCount} identified
                  </span>
                )}
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-gray-400 transition-transform",
                    isOpen && "rotate-180"
                  )}
                />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-1">
              {category.items.map((item) => (
                <CheckboxItem
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  description={item.description}
                  checked={checkedItems.has(item.id)}
                  onChange={() => onToggle(item.id)}
                />
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

export default function BarrierIdentificationPage() {
  // Session info state
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [client, setClient] = useState("");
  const [bcba, setBcba] = useState("");
  const [goalName, setGoalName] = useState("");

  // Checked items state
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  // Planning notes
  const [planningNotes, setPlanningNotes] = useState("");
  const [interventionPlan, setInterventionPlan] = useState("");

  // PDF generation state
  const [isGenerating, setIsGenerating] = useState(false);

  // Toggle item
  const toggleItem = (itemId: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  // Calculate summary
  const summary = useMemo(() => {
    const totalItems = BARRIER_CATEGORIES.reduce(
      (sum, cat) => sum + cat.items.length,
      0
    );
    const identifiedCount = checkedItems.size;

    const byCategory = BARRIER_CATEGORIES.map((cat) => {
      const catChecked = cat.items.filter((item) =>
        checkedItems.has(item.id)
      ).length;
      return {
        id: cat.id,
        title: cat.title,
        identified: catChecked,
        total: cat.items.length,
      };
    });

    const categoriesWithBarriers = byCategory.filter(
      (c) => c.identified > 0
    ).length;

    return {
      identifiedCount,
      totalItems,
      byCategory,
      categoriesWithBarriers,
    };
  }, [checkedItems]);

  // Reset form
  const handleReset = () => {
    setDate(undefined);
    setClient("");
    setBcba("");
    setGoalName("");
    setCheckedItems(new Set());
    setPlanningNotes("");
    setInterventionPlan("");
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
      const doc = (
        <BarrierIdentificationPDF
          date={date ? format(date, "PPP") : ""}
          client={client}
          bcba={bcba}
          goalName={goalName}
          checkedItems={Array.from(checkedItems)}
          categories={BARRIER_CATEGORIES}
          summary={summary}
          planningNotes={planningNotes}
          interventionPlan={interventionPlan}
        />
      );
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `barrier-identification-${client || "checklist"}-${
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
              Barrier Identification Checklist
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
            Identify barriers preventing skill acquisition or demonstration.
          </p>
        </div>

        {/* Privacy Notice */}
        <ResourceNotice className="mb-6" />

        {/* Summary Card */}
        {summary.identifiedCount > 0 && (
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardContent className="py-4">
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <span className="font-semibold text-amber-800">
                  {summary.identifiedCount} Barrier
                  {summary.identifiedCount !== 1 ? "s" : ""} Identified
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {summary.byCategory.map((cat) => (
                  <div
                    key={cat.id}
                    className={cn(
                      "p-2 rounded text-center text-xs",
                      cat.identified > 0
                        ? "bg-amber-100 text-amber-800"
                        : "bg-white text-gray-500"
                    )}
                  >
                    <div className="font-semibold">{cat.identified}</div>
                    <div className="truncate">{cat.title}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Session Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Assessment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <Label htmlFor="bcba">BCBA</Label>
                <Input
                  id="bcba"
                  value={bcba}
                  onChange={(e) => setBcba(e.target.value)}
                  placeholder="Enter BCBA name"
                />
              </div>
              <div>
                <Label htmlFor="goalName">Goal/Program Name</Label>
                <Input
                  id="goalName"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  placeholder="e.g., Requesting with PECS"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Barrier Categories */}
        <div className="space-y-4 mb-6">
          {BARRIER_CATEGORIES.map((category, index) => (
            <BarrierCategoryCard
              key={category.id}
              category={category}
              checkedItems={checkedItems}
              onToggle={toggleItem}
              defaultOpen={index === 0}
            />
          ))}
        </div>

        {/* Planning Notes */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Planning Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="planningNotes">
                Additional Observations / Context
              </Label>
              <Textarea
                id="planningNotes"
                value={planningNotes}
                onChange={(e) => setPlanningNotes(e.target.value)}
                placeholder="Note any additional context about the identified barriers..."
                rows={3}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="interventionPlan">
                Proposed Intervention Modifications
              </Label>
              <Textarea
                id="interventionPlan"
                value={interventionPlan}
                onChange={(e) => setInterventionPlan(e.target.value)}
                placeholder="Based on identified barriers, what changes will be made to the intervention?"
                rows={4}
                className="mt-1"
              />
            </div>
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
