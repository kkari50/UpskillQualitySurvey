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
  ClipboardList,
  BarChart3,
  Users,
  MapPin,
  MessageSquare,
  TrendingUp,
  FileText,
  ListChecks,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ResourceNotice } from "@/components/layout/ResourceNotice";

// Types
interface ChecklistSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  items: {
    id: string;
    label: string;
    hint?: string;
    allowNA?: boolean;
  }[];
}

// Checklist sections
const CHECKLIST_SECTIONS: ChecklistSection[] = [
  {
    id: "clientInfo",
    title: "Client Information",
    icon: <ClipboardList className="w-4 h-4" />,
    color: "bg-blue-500",
    items: [
      {
        id: "verifyMedications",
        label: "Verify current medications and any recent changes",
      },
      {
        id: "medicationPhaseChange",
        label:
          "If changes to medications occurred, make sure to insert a phase change line on the graph",
      },
      {
        id: "checkMedicalUpdates",
        label: "Check for any medical/health updates since last monitoring session",
      },
    ],
  },
  {
    id: "dataReview",
    title: "Data Review and Analysis",
    icon: <BarChart3 className="w-4 h-4" />,
    color: "bg-purple-500",
    items: [
      {
        id: "reviewGraphedData",
        label: "Review graphed behavioral data for target behaviors",
      },
      {
        id: "analyzeTrendLines",
        label: "Analyze trend lines and compare them to previous month's data",
      },
      {
        id: "evaluateFrequency",
        label:
          "Evaluate frequency, duration, and/or intensity of challenging behaviors",
      },
      {
        id: "reviewReplacementData",
        label: "Review replacement behavior acquisition data",
      },
      {
        id: "checkIOA",
        label: "Check inter-observer agreement (IOA) data if available",
      },
      {
        id: "verifyDataCollection",
        label: "Verify data collection procedures are being followed consistently",
      },
    ],
  },
  {
    id: "implementationFidelity",
    title: "Implementation Fidelity",
    icon: <ListChecks className="w-4 h-4" />,
    color: "bg-teal-500",
    items: [
      {
        id: "observeImplementation",
        label: "Observe direct implementation of behavior intervention strategies",
      },
      {
        id: "verifyUnderstanding",
        label: "Verify BT/RBT and caregiver understanding of BIP components",
      },
      {
        id: "assessAntecedent",
        label: "Assess adherence to antecedent modifications",
      },
      {
        id: "evaluateConsequence",
        label: "Evaluate consistency of consequence procedures",
      },
      {
        id: "reviewCrisis",
        label: "Review crisis intervention implementation (if applicable)",
        allowNA: true,
      },
      {
        id: "checkReinforcement",
        label: "Check reinforcement schedule implementation",
      },
      {
        id: "verifyTokenEconomy",
        label: "Verify token economy/point system usage (if applicable)",
        allowNA: true,
      },
    ],
  },
  {
    id: "environmental",
    title: "Environmental Assessment",
    icon: <MapPin className="w-4 h-4" />,
    color: "bg-green-500",
    items: [
      {
        id: "evaluateEnvironment",
        label: "Evaluate physical environment for proper setup",
      },
      {
        id: "reviewMaterials",
        label: "Review availability of required materials and resources",
      },
      {
        id: "assessModifications",
        label: "Assess environmental modifications specified in BIP",
      },
      {
        id: "checkNewFactors",
        label: "Check for any new environmental factors affecting behavior",
      },
    ],
  },
  {
    id: "consultation",
    title: "BT/RBT and Caregiver Consultation",
    icon: <MessageSquare className="w-4 h-4" />,
    color: "bg-orange-500",
    items: [
      {
        id: "interviewImplementers",
        label: "Interview implementers about challenges and successes",
      },
      {
        id: "addressQuestions",
        label: "Address any questions about intervention procedures",
      },
      {
        id: "provideFeedback",
        label: "Provide feedback on implementation fidelity",
      },
      {
        id: "reviewDataProcedures",
        label: "Review data collection procedures and accuracy",
      },
      {
        id: "discussModifications",
        label: "Discuss any needed modifications to training or support",
      },
    ],
  },
  {
    id: "progress",
    title: "Progress Evaluation",
    icon: <TrendingUp className="w-4 h-4" />,
    color: "bg-indigo-500",
    items: [
      {
        id: "compareProgress",
        label: "Compare current progress to intervention goals",
      },
      {
        id: "evaluateReinforcement",
        label: "Evaluate effectiveness of current reinforcement systems",
      },
      {
        id: "assessReplacement",
        label: "Assess progress on replacement behavior acquisition",
      },
      {
        id: "reviewDischarge",
        label: "Review progress toward discharge criteria (if applicable)",
        allowNA: true,
      },
      {
        id: "determineModifications",
        label: "Determine if modifications to BIP are needed",
      },
    ],
  },
  {
    id: "documentation",
    title: "Documentation Review",
    icon: <FileText className="w-4 h-4" />,
    color: "bg-rose-500",
    items: [
      {
        id: "checkIncidents",
        label: "Check incident reports since last monitoring session",
      },
      {
        id: "reviewCommunication",
        label: "Review communication logs",
      },
      {
        id: "verifyRestraint",
        label: "Verify proper documentation of restraint/seclusion (if applicable)",
        allowNA: true,
      },
    ],
  },
  {
    id: "followUp",
    title: "Follow-up Actions",
    icon: <Users className="w-4 h-4" />,
    color: "bg-cyan-500",
    items: [
      {
        id: "listModifications",
        label: "List required modifications to BIP",
      },
      {
        id: "scheduleTrainings",
        label: "Schedule any needed additional trainings",
      },
      {
        id: "documentFindings",
        label: "Document monitoring session findings",
      },
      {
        id: "setNextDate",
        label: "Set date for next monitoring session",
      },
      {
        id: "createActionPlan",
        label: "Create action plan for addressing identified issues",
      },
    ],
  },
];

// Form info
const FORM_INFO = {
  title: "BIP Monthly Monitoring Checklist",
  description:
    "A comprehensive checklist for monthly monitoring of Behavior Intervention Plan implementation. Use this during scheduled BIP reviews to ensure all aspects are evaluated.",
  keyPoints: [
    "Covers 8 essential monitoring areas",
    "38 items across client info, data review, fidelity, environment, consultation, progress, documentation, and follow-up",
    "Helps ensure consistent and thorough monthly reviews",
    "Supports data-driven decision making for BIP modifications",
  ],
};

// Checkbox item component
function CheckboxItem({
  id,
  label,
  hint,
  checked,
  isNA,
  allowNA,
  onChange,
  onToggleNA,
}: {
  id: string;
  label: string;
  hint?: string;
  checked: boolean;
  isNA: boolean;
  allowNA?: boolean;
  onChange: (checked: boolean) => void;
  onToggleNA?: () => void;
}) {
  return (
    <div
      className={cn(
        "p-3 rounded-lg transition-colors",
        isNA ? "bg-gray-50" : checked ? "bg-green-50" : "hover:bg-gray-50"
      )}
    >
      <label
        htmlFor={id}
        className={cn(
          "flex items-start gap-3 cursor-pointer",
          isNA && "cursor-default"
        )}
      >
        <button
          type="button"
          id={id}
          role="checkbox"
          aria-checked={isNA ? false : checked}
          disabled={isNA}
          onClick={() => !isNA && onChange(!checked)}
          className={cn("mt-0.5 flex-shrink-0", isNA && "opacity-40")}
        >
          {!isNA && checked ? (
            <CheckSquare className="w-5 h-5 text-green-600" />
          ) : (
            <Square className={cn("w-5 h-5", isNA ? "text-gray-300" : "text-gray-400")} />
          )}
        </button>
        <div className="flex-1">
          <span
            className={cn(
              "text-sm transition-colors",
              isNA
                ? "text-slate-400 line-through"
                : checked
                  ? "text-green-800"
                  : "text-gray-700"
            )}
          >
            {label}
          </span>
          {hint && !isNA && (
            <p className="text-xs text-gray-500 mt-0.5">{hint}</p>
          )}
        </div>
      </label>
      {allowNA && onToggleNA && (
        <button
          type="button"
          className={cn(
            "mt-1.5 ml-8 text-xs transition-colors",
            isNA
              ? "text-slate-500 font-medium"
              : "text-slate-400 hover:text-slate-600"
          )}
          onClick={onToggleNA}
        >
          {isNA ? (
            <span className="flex items-center gap-1">
              <Minus className="w-3 h-3" />
              Not applicable
              <span className="text-slate-400 font-normal ml-1">(undo)</span>
            </span>
          ) : (
            "Mark as not applicable"
          )}
        </button>
      )}
    </div>
  );
}

// Section component
function ChecklistSectionCard({
  section,
  checkedItems,
  naItems,
  onToggle,
  onToggleNA,
  defaultOpen = false,
}: {
  section: ChecklistSection;
  checkedItems: Set<string>;
  naItems: Set<string>;
  onToggle: (itemId: string) => void;
  onToggleNA: (itemId: string) => void;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const scorableItems = section.items.filter((item) => !naItems.has(item.id));
  const checkedCount = scorableItems.filter((item) =>
    checkedItems.has(item.id)
  ).length;
  const naCount = section.items.filter((item) => naItems.has(item.id)).length;
  const totalCount = scorableItems.length;
  const isComplete = totalCount > 0 && checkedCount === totalCount;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className={cn(isComplete && "ring-2 ring-green-200")}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-white",
                    section.color
                  )}
                >
                  {section.icon}
                </div>
                <div>
                  <CardTitle className="text-base">{section.title}</CardTitle>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {checkedCount} of {totalCount} completed
                    {naCount > 0 && ` (${naCount} N/A)`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isComplete && (
                  <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                    Complete
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
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-3">
              <div
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  isComplete ? "bg-green-500" : "bg-teal-500"
                )}
                style={{ width: `${(checkedCount / totalCount) * 100}%` }}
              />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-1">
              {section.items.map((item) => (
                <CheckboxItem
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  hint={item.hint}
                  checked={checkedItems.has(item.id)}
                  isNA={naItems.has(item.id)}
                  allowNA={item.allowNA}
                  onChange={() => onToggle(item.id)}
                  onToggleNA={() => onToggleNA(item.id)}
                />
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

export default function BIPMonitoringChecklistPage() {
  // Session info state
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [client, setClient] = useState("");
  const [bcba, setBcba] = useState("");
  const [nextMonitoringDate, setNextMonitoringDate] = useState<Date | undefined>(
    undefined
  );

  // Checked items state
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  // N/A items state
  const [naItems, setNaItems] = useState<Set<string>>(new Set());

  // Notes
  const [notes, setNotes] = useState("");

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

  // Toggle N/A
  const toggleNA = (itemId: string) => {
    setNaItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
        // Remove from checked if it was checked
        setCheckedItems((prevChecked) => {
          const nextChecked = new Set(prevChecked);
          nextChecked.delete(itemId);
          return nextChecked;
        });
      }
      return next;
    });
  };

  // Calculate scores
  const scores = useMemo(() => {
    const totalItems = CHECKLIST_SECTIONS.reduce(
      (sum, section) => sum + section.items.length,
      0
    );
    const naCount = naItems.size;
    const scorableItems = totalItems - naCount;
    const checkedCount = checkedItems.size;
    const percentage =
      scorableItems > 0 ? Math.round((checkedCount / scorableItems) * 100) : 0;

    const sectionScores = CHECKLIST_SECTIONS.map((section) => {
      const scorableInSection = section.items.filter(
        (item) => !naItems.has(item.id)
      );
      const sectionChecked = scorableInSection.filter((item) =>
        checkedItems.has(item.id)
      ).length;
      const sectionNA = section.items.filter((item) =>
        naItems.has(item.id)
      ).length;
      return {
        id: section.id,
        title: section.title,
        checked: sectionChecked,
        total: scorableInSection.length,
        naCount: sectionNA,
        complete: scorableInSection.length > 0 && sectionChecked === scorableInSection.length,
      };
    });

    return {
      checkedCount,
      totalItems: scorableItems,
      naCount,
      percentage,
      sectionScores,
      completeSections: sectionScores.filter((s) => s.complete).length,
    };
  }, [checkedItems, naItems]);

  // Reset form
  const handleReset = () => {
    setDate(undefined);
    setClient("");
    setBcba("");
    setNextMonitoringDate(undefined);
    setCheckedItems(new Set());
    setNaItems(new Set());
    setNotes("");
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      // Dynamic imports - only load PDF libraries when user clicks download
      const [{ pdf }, { BIPMonitoringChecklistPDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/pdf/BIPMonitoringChecklistPDF"),
      ]);

      const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
      const doc = (
        <BIPMonitoringChecklistPDF
          date={date ? format(date, "PPP") : ""}
          client={client}
          bcba={bcba}
          nextMonitoringDate={
            nextMonitoringDate ? format(nextMonitoringDate, "PPP") : ""
          }
          checkedItems={Array.from(checkedItems)}
          naItems={Array.from(naItems)}
          sections={CHECKLIST_SECTIONS}
          scores={scores}
          notes={notes}
        />
      );
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `bip-monitoring-${client || "checklist"}-${
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
              BIP Monthly Monitoring Checklist
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
            Comprehensive monthly review checklist for behavior intervention
            plans.
          </p>
        </div>

        {/* Privacy Notice */}
        <ResourceNotice className="mb-6" />

        {/* Overall Progress */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">
                Overall Progress
              </span>
              <span
                className={cn(
                  "text-lg font-bold",
                  scores.percentage === 100
                    ? "text-green-600"
                    : scores.percentage >= 75
                      ? "text-teal-600"
                      : scores.percentage >= 50
                        ? "text-amber-600"
                        : "text-gray-600"
                )}
              >
                {scores.percentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  scores.percentage === 100
                    ? "bg-green-500"
                    : scores.percentage >= 75
                      ? "bg-teal-500"
                      : scores.percentage >= 50
                        ? "bg-amber-500"
                        : "bg-gray-400"
                )}
                style={{ width: `${scores.percentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>
                {scores.checkedCount} of {scores.totalItems} items completed
                {scores.naCount > 0 && ` (${scores.naCount} N/A)`}
              </span>
              <span>
                {scores.completeSections} of {CHECKLIST_SECTIONS.length} sections
                complete
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Session Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Session Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Monitoring Date</Label>
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
                <Label htmlFor="nextDate">Next Monitoring Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !nextMonitoringDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {nextMonitoringDate
                        ? format(nextMonitoringDate, "PPP")
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={nextMonitoringDate}
                      onSelect={setNextMonitoringDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Checklist Sections */}
        <div className="space-y-4 mb-6">
          {CHECKLIST_SECTIONS.map((section, index) => (
            <ChecklistSectionCard
              key={section.id}
              section={section}
              checkedItems={checkedItems}
              naItems={naItems}
              onToggle={toggleItem}
              onToggleNA={toggleNA}
              defaultOpen={index === 0}
            />
          ))}
        </div>

        {/* Notes */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Notes Section</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Document monitoring session findings, action items, and recommendations..."
              rows={6}
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
