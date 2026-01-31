"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  Download,
  RotateCcw,
  Loader2,
  CalendarIcon,
  ClipboardCheck,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Plus,
  Trash2,
} from "lucide-react";

import { Header, Footer } from "@/components/layout";
import { ResourceNotice } from "@/components/layout/ResourceNotice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  type EvaluationItem,
  type EvaluationAnswer,
  type ProgramComponent,
} from "@/components/pdf/program-info-sheet-data";

// Initial evaluation items based on the PDF
const INITIAL_EVALUATION_ITEMS: EvaluationItem[] = [
  {
    id: "eval_1",
    text: "Obtains at least one relevant research article to support program development (if yes, include article title in comments)",
    answer: null,
    comment: "",
  },
  {
    id: "eval_2",
    text: "Completes draft in timely fashion (defined as no longer than 5 business days from request to draft program)",
    answer: null,
    comment: "",
  },
  {
    id: "eval_3",
    text: "Objective passes the Behavioral Objective Checklist (see additional checklist)",
    answer: null,
    comment: "",
  },
  {
    id: "eval_4",
    text: "Program sheet includes the following necessary components (only check yes if ALL boxes are checked)",
    answer: null,
    comment: "",
    hasSubChecklist: true,
  },
  {
    id: "eval_5",
    text: "Sends Draft to BCBA via email",
    answer: null,
    comment: "",
  },
  {
    id: "eval_6",
    text: "Sends Draft data sheet to the BCBA via email",
    answer: null,
    comment: "",
  },
  {
    id: "eval_7",
    text: "Excluding aesthetics (e.g., font size, indents, bulleting) or other minor changes such as minor grammatical errors, there are less than 3 changes that need to be made to the document",
    answer: null,
    comment: "",
  },
  {
    id: "eval_8",
    text: "Sends reminder email if applicable",
    answer: null,
    comment: "",
  },
  {
    id: "eval_9",
    text: "Makes necessary changes to the program provided by the BCBA within 3 business days",
    answer: null,
    comment: "",
  },
  {
    id: "eval_10",
    text: "Finalizes document: Prints program and data sheets and adds to client's binder; Sets up training with all technicians",
    answer: null,
    comment: "",
  },
];

// Program components for sub-checklist
const INITIAL_PROGRAM_COMPONENTS: ProgramComponent[] = [
  { id: "comp_1", label: "Objective", checked: false },
  { id: "comp_2", label: "Prerequisite skills", checked: false },
  { id: "comp_3", label: "Materials", checked: false },
  { id: "comp_4", label: "Data sheet explained", checked: false },
  { id: "comp_5", label: "Sets/Phases", checked: false },
  { id: "comp_6", label: "Set up", checked: false },
  { id: "comp_7", label: "Implementation", checked: false },
  { id: "comp_8", label: "Response to correct responding and error correction", checked: false },
  { id: "comp_9", label: "Phase/set change and Mastery Criterion", checked: false },
  { id: "comp_10", label: "Set lists of targets", checked: false },
  { id: "comp_11", label: "References", checked: false },
];

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

// Toggle Button Component for Yes/No/N/A
function AnswerToggle({
  value,
  onChange,
}: {
  value: EvaluationAnswer;
  onChange: (answer: EvaluationAnswer) => void;
}) {
  const options: { value: EvaluationAnswer; label: string; color: string }[] = [
    { value: "yes", label: "Yes", color: "bg-emerald-500 hover:bg-emerald-600 text-white" },
    { value: "no", label: "No", color: "bg-rose-500 hover:bg-rose-600 text-white" },
    { value: "na", label: "N/A", color: "bg-amber-500 hover:bg-amber-600 text-white" },
  ];

  return (
    <div className="flex gap-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(value === option.value ? null : option.value)}
          className={cn(
            "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
            value === option.value
              ? option.color
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default function ProgramInfoSheetPage() {
  // Header fields
  const [supervisee, setSupervisee] = useState("");
  const [overseeingBCBA, setOverseeingBCBA] = useState("");
  const [dateStart, setDateStart] = useState<Date | undefined>(undefined);
  const [dateEnd, setDateEnd] = useState<Date | undefined>(undefined);
  const [programName, setProgramName] = useState("");

  // Evaluation items
  const [evaluationItems, setEvaluationItems] = useState<EvaluationItem[]>(
    INITIAL_EVALUATION_ITEMS.map((item) => ({ ...item, id: generateId() }))
  );

  // Program components
  const [programComponents, setProgramComponents] = useState<ProgramComponent[]>(
    INITIAL_PROGRAM_COMPONENTS.map((comp) => ({ ...comp }))
  );

  // Skills sections (dynamic arrays)
  const [skillsToMaintain, setSkillsToMaintain] = useState([""]);
  const [skillsToWorkOn, setSkillsToWorkOn] = useState([""]);

  // Notes
  const [notes, setNotes] = useState("");

  // Signatures
  const [bcbaSignature, setBcbaSignature] = useState("");
  const [bcbaSignatureDate, setBcbaSignatureDate] = useState<Date | undefined>(undefined);
  const [superviseeSignature, setSuperviseeSignature] = useState("");
  const [superviseeSignatureDate, setSuperviseeSignatureDate] = useState<Date | undefined>(undefined);

  // UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  // Calculate score
  const score = useMemo(() => {
    const yesCount = evaluationItems.filter((item) => item.answer === "yes").length;
    const percentage = Math.round((yesCount / 10) * 100);
    return { yesCount, percentage };
  }, [evaluationItems]);

  // Count answered items
  const answeredCount = evaluationItems.filter((item) => item.answer !== null).length;

  // Check if all program components are checked
  const allComponentsChecked = programComponents.every((comp) => comp.checked);

  // Auto-update question #4 based on program components
  const checkedComponentsCount = programComponents.filter((comp) => comp.checked).length;

  // Handle evaluation item answer change
  const handleAnswerChange = (id: string, answer: EvaluationAnswer) => {
    setEvaluationItems((items) =>
      items.map((item) => (item.id === id ? { ...item, answer } : item))
    );
  };

  // Handle evaluation item comment change
  const handleCommentChange = (id: string, comment: string) => {
    setEvaluationItems((items) =>
      items.map((item) => (item.id === id ? { ...item, comment } : item))
    );
  };

  // Handle program component toggle - also auto-updates question #4
  const handleComponentToggle = (id: string) => {
    setProgramComponents((comps) => {
      const newComps = comps.map((comp) =>
        comp.id === id ? { ...comp, checked: !comp.checked } : comp
      );
      // Auto-update question #4 based on whether all components are checked
      const allChecked = newComps.every((c) => c.checked);
      setEvaluationItems((items) =>
        items.map((item) =>
          item.hasSubChecklist ? { ...item, answer: allChecked ? "yes" : "no" } : item
        )
      );
      return newComps;
    });
  };

  // Toggle comment expansion
  const toggleComment = (id: string) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Handle skills change
  const handleSkillChange = (
    type: "maintain" | "workOn",
    index: number,
    value: string
  ) => {
    if (type === "maintain") {
      const newSkills = [...skillsToMaintain];
      newSkills[index] = value;
      setSkillsToMaintain(newSkills);
    } else {
      const newSkills = [...skillsToWorkOn];
      newSkills[index] = value;
      setSkillsToWorkOn(newSkills);
    }
  };

  // Add skill
  const handleAddSkill = (type: "maintain" | "workOn") => {
    if (type === "maintain") {
      setSkillsToMaintain([...skillsToMaintain, ""]);
    } else {
      setSkillsToWorkOn([...skillsToWorkOn, ""]);
    }
  };

  // Remove skill
  const handleRemoveSkill = (type: "maintain" | "workOn", index: number) => {
    if (type === "maintain" && skillsToMaintain.length > 1) {
      setSkillsToMaintain(skillsToMaintain.filter((_, i) => i !== index));
    } else if (type === "workOn" && skillsToWorkOn.length > 1) {
      setSkillsToWorkOn(skillsToWorkOn.filter((_, i) => i !== index));
    }
  };

  // Reset form
  const handleReset = () => {
    setSupervisee("");
    setOverseeingBCBA("");
    setDateStart(undefined);
    setDateEnd(undefined);
    setProgramName("");
    setEvaluationItems(
      INITIAL_EVALUATION_ITEMS.map((item) => ({ ...item, id: generateId() }))
    );
    setProgramComponents(INITIAL_PROGRAM_COMPONENTS.map((comp) => ({ ...comp })));
    setSkillsToMaintain([""]);
    setSkillsToWorkOn([""]);
    setNotes("");
    setBcbaSignature("");
    setBcbaSignatureDate(undefined);
    setSuperviseeSignature("");
    setSuperviseeSignatureDate(undefined);
    setExpandedComments(new Set());
  };

  // Download PDF
  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      // Dynamic imports - only load PDF libraries when user clicks download
      const [{ pdf }, { ProgramInfoSheetPDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/pdf/ProgramInfoSheetPDF"),
      ]);

      const logoUrl = `${window.location.origin}/images/logo-medium.png`;

      // Reconstruct evaluation items with original text for PDF
      const pdfEvaluationItems = evaluationItems.map((item, index) => ({
        ...item,
        text: INITIAL_EVALUATION_ITEMS[index].text,
        hasSubChecklist: INITIAL_EVALUATION_ITEMS[index].hasSubChecklist,
      }));

      const blob = await pdf(
        <ProgramInfoSheetPDF
          data={{
            supervisee,
            overseeingBCBA,
            dateStart: dateStart ? format(dateStart, "MMM d, yyyy") : "",
            dateEnd: dateEnd ? format(dateEnd, "MMM d, yyyy") : "",
            programName,
            evaluationItems: pdfEvaluationItems,
            programComponents,
            skillsToMaintain,
            skillsToWorkOn,
            notes,
            bcbaSignature,
            bcbaSignatureDate: bcbaSignatureDate ? format(bcbaSignatureDate, "MMM d, yyyy") : "",
            superviseeSignature,
            superviseeSignatureDate: superviseeSignatureDate
              ? format(superviseeSignatureDate, "MMM d, yyyy")
              : "",
            logoUrl,
          }}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const fileDate = dateEnd ? format(dateEnd, "yyyy-MM-dd") : "";
      const filename = `program-evaluation${fileDate ? `-${fileDate}` : ""}${supervisee ? `-${supervisee.replace(/\s+/g, "-")}` : ""}.pdf`;
      link.download = filename;
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <Header />

      <main className="flex-1 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 mb-4">
              <ClipboardCheck className="w-8 h-8 text-teal-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Program Evaluation Feedback
            </h1>
            <p className="text-slate-600 max-w-xl mx-auto">
              Evaluate skill acquisition program development competency with this
              structured feedback form.
            </p>
          </div>

          {/* Instructions */}
          <Card className="mb-8 shadow-sm border border-slate-200 print:hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-slate-800">
                How to Use This Form
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <h4 className="font-medium text-slate-800 mb-1.5 text-sm">
                  1. Complete Header
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Enter supervisee name, overseeing BCBA, evaluation dates, and
                  program name.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <h4 className="font-medium text-slate-800 mb-1.5 text-sm">
                  2. Evaluate Each Criterion
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Mark Yes, No, or N/A for each item. Add comments as needed.
                  100% is required for competency sign-off.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <h4 className="font-medium text-slate-800 mb-1.5 text-sm">
                  3. Document Skills
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Note skills to maintain and areas for improvement. Sign and
                  download the PDF.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Notice */}
          <ResourceNotice className="mb-8" />

          {/* Session Details */}
          <Card className="mb-6 shadow-sm border border-slate-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Evaluation Details</CardTitle>
              <CardDescription>
                Enter information about the evaluation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supervisee">Supervisee</Label>
                  <Input
                    id="supervisee"
                    placeholder="Enter supervisee name"
                    value={supervisee}
                    onChange={(e) => setSupervisee(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="overseeingBCBA">Overseeing BCBA</Label>
                  <Input
                    id="overseeingBCBA"
                    placeholder="Enter BCBA name"
                    value={overseeingBCBA}
                    onChange={(e) => setOverseeingBCBA(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Date Start</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateStart && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateStart ? format(dateStart, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateStart}
                        onSelect={setDateStart}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Date End</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateEnd && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateEnd ? format(dateEnd, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateEnd}
                        onSelect={setDateEnd}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="programName">Program Name</Label>
                  <Input
                    id="programName"
                    placeholder="Enter program name"
                    value={programName}
                    onChange={(e) => setProgramName(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress & Score */}
          <Card className="mb-6 shadow-sm border border-slate-200">
            <CardContent className="py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">
                      Progress
                    </span>
                    <span className="text-sm text-slate-500">
                      {answeredCount} of {evaluationItems.length} answered
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300"
                      style={{
                        width: `${(answeredCount / evaluationItems.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-600">Score:</span>
                  <span
                    className={cn(
                      "text-2xl font-bold",
                      score.percentage === 100
                        ? "text-emerald-600"
                        : score.percentage >= 80
                          ? "text-amber-600"
                          : "text-rose-600"
                    )}
                  >
                    {score.yesCount}/10
                  </span>
                  <span
                    className={cn(
                      "text-sm font-medium px-2 py-0.5 rounded",
                      score.percentage === 100
                        ? "bg-emerald-100 text-emerald-700"
                        : score.percentage >= 80
                          ? "bg-amber-100 text-amber-700"
                          : "bg-rose-100 text-rose-700"
                    )}
                  >
                    {score.percentage}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Evaluation Checklist */}
          <Card className="mb-6 shadow-sm border border-slate-200">
            <CardHeader className="bg-slate-50 rounded-t-lg border-b border-slate-200">
              <CardTitle className="text-slate-800">Evaluation Criteria</CardTitle>
              <CardDescription className="text-slate-600">
                Evaluate each criterion by selecting Yes, No, or N/A
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {evaluationItems.map((item, index) => {
                const originalItem = INITIAL_EVALUATION_ITEMS[index];
                const isCommentExpanded = expandedComments.has(item.id);

                return (
                  <div
                    key={item.id}
                    className={cn(
                      "p-4 hover:bg-slate-50/50 transition-colors",
                      index !== evaluationItems.length - 1 && "border-b border-slate-100"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-medium text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 space-y-3">
                        {/* Criterion text */}
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {originalItem.text}
                        </p>

                        {/* Sub-checklist for program components */}
                        {originalItem.hasSubChecklist && (
                          <div className="ml-1 p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                                Program Components
                              </p>
                              <span className={cn(
                                "text-xs font-medium px-2 py-0.5 rounded",
                                allComponentsChecked
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-slate-200 text-slate-600"
                              )}>
                                {checkedComponentsCount}/{programComponents.length} checked
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {programComponents.map((comp) => (
                                <label
                                  key={comp.id}
                                  className="flex items-center gap-2 cursor-pointer text-sm"
                                >
                                  <input
                                    type="checkbox"
                                    checked={comp.checked}
                                    onChange={() => handleComponentToggle(comp.id)}
                                    className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                  />
                                  <span
                                    className={cn(
                                      "text-slate-600",
                                      comp.checked && "text-slate-900"
                                    )}
                                  >
                                    {comp.label}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Answer toggle and comment */}
                        <div className="flex flex-wrap items-center gap-3">
                          {/* For question #4 (hasSubChecklist), show auto-calculated status instead of toggle */}
                          {originalItem.hasSubChecklist ? (
                            <div className={cn(
                              "px-3 py-1.5 text-xs font-medium rounded-md",
                              allComponentsChecked
                                ? "bg-emerald-500 text-white"
                                : "bg-rose-500 text-white"
                            )}>
                              {allComponentsChecked ? "Yes" : "No"} (auto-calculated)
                            </div>
                          ) : (
                            <AnswerToggle
                              value={item.answer}
                              onChange={(answer) => handleAnswerChange(item.id, answer)}
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => toggleComment(item.id)}
                            className={cn(
                              "inline-flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors",
                              isCommentExpanded || item.comment
                                ? "bg-teal-50 text-teal-700"
                                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            )}
                          >
                            <MessageSquare className="w-3 h-3" />
                            {item.comment ? "Edit Comment" : "Add Comment"}
                            {isCommentExpanded ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </button>
                        </div>

                        {/* Comment input */}
                        {isCommentExpanded && (
                          <Input
                            placeholder="Add a comment..."
                            value={item.comment}
                            onChange={(e) => handleCommentChange(item.id, e.target.value)}
                            className="text-sm"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Skills Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Skills to Maintain */}
            <Card className="shadow-sm border border-slate-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base text-slate-800">
                      Skills to Maintain
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Skills improved/changed from last evaluation
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddSkill("maintain")}
                    className="h-8 px-2 text-teal-600 border-teal-200 hover:bg-teal-50"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {skillsToMaintain.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm text-slate-500 w-4">{index + 1}.</span>
                    <Input
                      placeholder={`Skill ${index + 1}`}
                      value={skill}
                      onChange={(e) =>
                        handleSkillChange("maintain", index, e.target.value)
                      }
                      className="text-sm"
                    />
                    {skillsToMaintain.length > 1 && (
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => handleRemoveSkill("maintain", index)}
                        className="h-8 w-8 text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Skills to Work On */}
            <Card className="shadow-sm border border-slate-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base text-slate-800">
                      Skills to Work On
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Areas for improvement and development
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddSkill("workOn")}
                    className="h-8 px-2 text-teal-600 border-teal-200 hover:bg-teal-50"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {skillsToWorkOn.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm text-slate-500 w-4">{index + 1}.</span>
                    <Input
                      placeholder={`Skill ${index + 1}`}
                      value={skill}
                      onChange={(e) =>
                        handleSkillChange("workOn", index, e.target.value)
                      }
                      className="text-sm"
                    />
                    {skillsToWorkOn.length > 1 && (
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => handleRemoveSkill("workOn", index)}
                        className="h-8 w-8 text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Notes */}
          <Card className="mb-6 shadow-sm border border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-slate-800">Notes</CardTitle>
              <CardDescription>
                Additional observations or comments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter any additional notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="text-sm resize-y"
              />
            </CardContent>
          </Card>

          {/* Signatures */}
          <Card className="mb-6 shadow-sm border border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg text-slate-800">Signatures</CardTitle>
              <CardDescription>
                Enter names to serve as electronic signatures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bcbaSignature">BCBA Signature</Label>
                  <Input
                    id="bcbaSignature"
                    placeholder="Type full name"
                    value={bcbaSignature}
                    onChange={(e) => setBcbaSignature(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>BCBA Signature Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !bcbaSignatureDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {bcbaSignatureDate ? (
                          format(bcbaSignatureDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={bcbaSignatureDate}
                        onSelect={setBcbaSignatureDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="superviseeSignature">Supervisee Signature</Label>
                  <Input
                    id="superviseeSignature"
                    placeholder="Type full name"
                    value={superviseeSignature}
                    onChange={(e) => setSuperviseeSignature(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Supervisee Signature Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !superviseeSignatureDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {superviseeSignatureDate ? (
                          format(superviseeSignatureDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={superviseeSignatureDate}
                        onSelect={setSuperviseeSignatureDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center print:hidden">
            <Button
              onClick={handleDownloadPDF}
              size="lg"
              disabled={isGenerating}
              className="bg-teal-600 hover:bg-teal-700 shadow-md"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {isGenerating ? "Generating..." : "Download PDF"}
            </Button>
            <Button
              onClick={handleReset}
              size="lg"
              variant="outline"
              className="border-slate-300 text-slate-600 hover:bg-slate-50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </main>

      <Footer />

    </div>
  );
}
