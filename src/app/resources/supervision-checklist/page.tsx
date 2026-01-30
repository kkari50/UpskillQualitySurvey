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
  BookOpen,
  Target,
  MessageSquare,
  FileText,
  AlertCircle,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Header, Footer } from "@/components/layout";
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

// Checklist sections based on supervision best practices
const CHECKLIST_SECTIONS: ChecklistSection[] = [
  {
    id: "preparation",
    title: "Pre-Session Preparation",
    icon: <ClipboardList className="w-4 h-4" />,
    color: "bg-blue-500",
    items: [
      {
        id: "reviewClientData",
        label: "Review client's data since last supervision session",
      },
      {
        id: "identifyStaticGoals",
        label: "Identify any static goals that need to be prioritized",
      },
      {
        id: "reviewPreviousNotes",
        label: "Review notes from previous supervision session",
      },
      {
        id: "prepareMaterials",
        label: "Prepare any necessary training materials or visual aids",
      },
      {
        id: "checkSchedule",
        label: "Verify session schedule and any time constraints",
      },
    ],
  },
  {
    id: "dataReview",
    title: "Data Review & Analysis",
    icon: <BarChart3 className="w-4 h-4" />,
    color: "bg-purple-500",
    items: [
      {
        id: "reviewGraphedData",
        label: "Review graphed data for all active skill acquisition goals",
      },
      {
        id: "analyzeTrends",
        label: "Analyze data trends and patterns across goals",
      },
      {
        id: "identifyMasteredGoals",
        label: "Identify goals approaching or meeting mastery criteria",
      },
      {
        id: "identifyStaticGoalsReview",
        label: "Identify goals with static or declining progress",
      },
      {
        id: "reviewBehaviorData",
        label: "Review behavior data for target behaviors",
      },
      {
        id: "checkDataAccuracy",
        label: "Verify data collection accuracy and completeness",
      },
    ],
  },
  {
    id: "goalAnalysis",
    title: "Treatment Plan Goal Analysis",
    icon: <Target className="w-4 h-4" />,
    color: "bg-teal-500",
    items: [
      {
        id: "reviewGoalImplementation",
        label: "Observe implementation of at least one skill acquisition goal",
      },
      {
        id: "verifySDPrompting",
        label: "Verify correct SD presentation and prompting procedures",
      },
      {
        id: "assessReinforcementDelivery",
        label: "Assess appropriate reinforcement delivery",
      },
      {
        id: "checkErrorCorrection",
        label: "Check error correction procedures are implemented correctly",
      },
      {
        id: "reviewPhaseChanges",
        label: "Review if any phase changes are needed",
      },
      {
        id: "discussGoalModifications",
        label: "Discuss any needed modifications to goals",
      },
    ],
  },
  {
    id: "behaviorPlan",
    title: "Behavior Intervention Plan Review",
    icon: <AlertCircle className="w-4 h-4" />,
    color: "bg-rose-500",
    items: [
      {
        id: "observeBIPImplementation",
        label: "Observe implementation of BIP strategies",
        allowNA: true,
      },
      {
        id: "verifyAntecedentStrategies",
        label: "Verify antecedent strategies are being used",
        allowNA: true,
      },
      {
        id: "assessConsequenceStrategies",
        label: "Assess consequence strategies implementation",
        allowNA: true,
      },
      {
        id: "reviewReplacementBehaviors",
        label: "Review teaching of replacement behaviors",
        allowNA: true,
      },
      {
        id: "checkCrisisProtocol",
        label: "Verify crisis protocol understanding (if applicable)",
        allowNA: true,
      },
    ],
  },
  {
    id: "training",
    title: "Staff Training & Feedback",
    icon: <BookOpen className="w-4 h-4" />,
    color: "bg-orange-500",
    items: [
      {
        id: "providePerformanceFeedback",
        label: "Provide specific performance feedback (positive and corrective)",
      },
      {
        id: "modelProcedures",
        label: "Model procedures as needed",
      },
      {
        id: "allowPractice",
        label: "Allow opportunity for practice with feedback",
      },
      {
        id: "reviewWrittenProtocols",
        label: "Review written protocols and ensure understanding",
      },
      {
        id: "addressTrainingNeeds",
        label: "Identify and address specific training needs",
      },
      {
        id: "documentCompetency",
        label: "Document competency on trained skills",
      },
    ],
  },
  {
    id: "communication",
    title: "Communication & Collaboration",
    icon: <MessageSquare className="w-4 h-4" />,
    color: "bg-green-500",
    items: [
      {
        id: "allowQuestions",
        label: "Allow time for BT/RBT questions and concerns",
      },
      {
        id: "discussChallenges",
        label: "Discuss any implementation challenges",
      },
      {
        id: "reviewCaregiverUpdates",
        label: "Review any caregiver updates or concerns",
      },
      {
        id: "collaborateOnSolutions",
        label: "Collaborate on problem-solving strategies",
      },
      {
        id: "provideResources",
        label: "Provide additional resources or materials as needed",
      },
    ],
  },
  {
    id: "documentation",
    title: "Documentation & Planning",
    icon: <FileText className="w-4 h-4" />,
    color: "bg-indigo-500",
    items: [
      {
        id: "documentObservations",
        label: "Document supervision observations and findings",
      },
      {
        id: "recordTrainingProvided",
        label: "Record any training provided during session",
      },
      {
        id: "noteRecommendations",
        label: "Note recommendations for program modifications",
      },
      {
        id: "updateTreatmentPlan",
        label: "Update treatment plan as needed",
      },
      {
        id: "scheduleFollowUp",
        label: "Schedule follow-up or next supervision session",
      },
    ],
  },
  {
    id: "compliance",
    title: "Compliance & Ethics",
    icon: <Users className="w-4 h-4" />,
    color: "bg-cyan-500",
    items: [
      {
        id: "verifySupervisionRatio",
        label: "Verify supervision hours meet required ratio",
      },
      {
        id: "ensureEthicalPractice",
        label: "Ensure ethical practice standards are being followed",
      },
      {
        id: "reviewConfidentiality",
        label: "Review confidentiality and HIPAA compliance",
      },
      {
        id: "addressBoundaries",
        label: "Address any professional boundary concerns",
      },
    ],
  },
];

// Form info
const FORM_INFO = {
  title: "BCBA Supervision Session Checklist",
  description:
    "A structured checklist to help BCBAs conduct thorough and effective supervision sessions. Ensures all critical components are addressed during each supervision meeting.",
  keyPoints: [
    "Covers 8 essential supervision areas",
    "42 items across preparation, data review, goal analysis, BIP review, training, communication, documentation, and compliance",
    "Supports systematic and thorough supervision sessions",
    "Helps meet ethical and regulatory supervision requirements",
  ],
};

// Checkbox item component
function CheckboxItem({
  label,
  hint,
  checked,
  isNA,
  allowNA,
  onChange,
  onToggleNA,
}: {
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
      <div
        className={cn(
          "flex items-start gap-3 cursor-pointer",
          isNA && "cursor-default"
        )}
        onClick={() => !isNA && onChange(!checked)}
      >
        <span
          className={cn("mt-0.5 flex-shrink-0", isNA && "opacity-40")}
          aria-hidden="true"
        >
          {!isNA && checked ? (
            <CheckSquare className="w-5 h-5 text-green-600" />
          ) : (
            <Square className={cn("w-5 h-5", isNA ? "text-gray-300" : "text-gray-400")} />
          )}
        </span>
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
      </div>
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

export default function SupervisionChecklistPage() {
  // Session info state
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [supervisee, setSupervisee] = useState("");
  const [bcba, setBcba] = useState("");
  const [client, setClient] = useState("");
  const [supervisionType, setSupervisionType] = useState("");

  // Checked items state
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  // N/A items state
  const [naItems, setNaItems] = useState<Set<string>>(new Set());

  // Notes
  const [notes, setNotes] = useState("");
  const [followUpItems, setFollowUpItems] = useState("");

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
        complete:
          scorableInSection.length > 0 &&
          sectionChecked === scorableInSection.length,
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
    setSupervisee("");
    setBcba("");
    setClient("");
    setSupervisionType("");
    setCheckedItems(new Set());
    setNaItems(new Set());
    setNotes("");
    setFollowUpItems("");
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const [{ pdf }, { SupervisionChecklistPDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/pdf/SupervisionChecklistPDF"),
      ]);

      const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
      // Strip React elements (icons) before passing to PDF
      const pdfSections = CHECKLIST_SECTIONS.map((section) => ({
        id: section.id,
        title: section.title,
        items: section.items.map((item) => ({
          id: item.id,
          label: item.label,
        })),
      }));
      const doc = (
        <SupervisionChecklistPDF
          date={date ? format(date, "PPP") : ""}
          supervisee={supervisee}
          bcba={bcba}
          client={client}
          supervisionType={supervisionType}
          checkedItems={Array.from(checkedItems)}
          naItems={Array.from(naItems)}
          sections={pdfSections}
          scores={scores}
          notes={notes}
          followUpItems={followUpItems}
        />
      );
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `supervision-checklist-${supervisee || "session"}-${
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">
                BCBA Supervision Session Checklist
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
              Structured checklist for thorough and effective supervision sessions.
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
                  <Label htmlFor="supervisionType">Supervision Type</Label>
                  <Input
                    id="supervisionType"
                    value={supervisionType}
                    onChange={(e) => setSupervisionType(e.target.value)}
                    placeholder="e.g., Direct, Indirect, Group"
                  />
                </div>
                <div>
                  <Label htmlFor="supervisee">Supervisee (BT/RBT)</Label>
                  <Input
                    id="supervisee"
                    value={supervisee}
                    onChange={(e) => setSupervisee(e.target.value)}
                    placeholder="Enter supervisee name"
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
                <div className="sm:col-span-2">
                  <Label htmlFor="client">Client</Label>
                  <Input
                    id="client"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="Enter client name"
                  />
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
              <CardTitle className="text-lg">Session Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Document supervision observations, training provided, and recommendations..."
                rows={6}
              />
            </CardContent>
          </Card>

          {/* Follow-up Items */}
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Follow-up Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={followUpItems}
                onChange={(e) => setFollowUpItems(e.target.value)}
                placeholder="List items to follow up on next session..."
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
      </main>

      <Footer />
    </div>
  );
}
