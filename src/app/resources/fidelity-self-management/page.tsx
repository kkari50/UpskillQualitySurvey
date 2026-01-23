"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  CalendarIcon,
  Download,
  Loader2,
  CheckCircle2,
  XCircle,
  MinusCircle,
  ArrowLeft,
  Info,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ResourceNotice } from "@/components/layout/ResourceNotice";
import Link from "next/link";

// Types
type Answer = "yes" | "no" | "na" | null;

interface CriteriaItem {
  id: string;
  label: string;
  description?: string;
  answer: Answer;
}

// Self-management implementation criteria
const CRITERIA_ITEMS: Omit<CriteriaItem, "answer">[] = [
  {
    id: "prompt_self_record",
    label: "BT/RBT prompts client to self-record accurately at the appropriate time",
    description: "The technician provides timely prompts for the client to record their own behavior accurately.",
  },
  {
    id: "reinforce_self_recordings",
    label: "BT/RBT reinforces all accurate self-recordings at the appropriate times",
    description: "Accurate self-recording is consistently reinforced to encourage continued self-monitoring.",
  },
  {
    id: "fade_prompts",
    label: "BT/RBT fades prompts as needed",
    description: "Prompts are systematically reduced to promote independence in self-management.",
  },
  {
    id: "prompt_reinforcement_access",
    label: "BT/RBT prompts learner to gain access to reinforcement when appropriate criteria is reached",
    description: "When the client meets their self-management goal, they are prompted to access their earned reinforcement.",
  },
  {
    id: "model_behavior",
    label: "When modeling, BT/RBT appropriately models correct behavior",
    description: "The technician demonstrates the target behavior correctly when modeling is part of the intervention.",
  },
  {
    id: "collect_data",
    label: "BT/RBT collects accurate data",
    description: "The technician maintains accurate data collection alongside the client's self-recording.",
  },
  {
    id: "reinforce_demonstrations",
    label: "BT/RBT reinforces all correct demonstrations of the behavior",
    description: "Correct demonstrations of the target behavior are consistently reinforced.",
  },
  {
    id: "provide_cues",
    label: "When applicable, BT/RBT provides learner with cues that signal when the client should use the self-management system",
    description: "Environmental or verbal cues are provided to prompt use of the self-management system when appropriate.",
  },
];

export default function SelfManagementFidelityPage() {
  // Session info
  const [date, setDate] = useState<Date>();
  const [client, setClient] = useState("");
  const [btRbt, setBtRbt] = useState("");
  const [bcba, setBcba] = useState("");

  // Criteria answers
  const [criteria, setCriteria] = useState<CriteriaItem[]>(
    CRITERIA_ITEMS.map((item) => ({ ...item, answer: null }))
  );

  // PDF generation state
  const [isGenerating, setIsGenerating] = useState(false);

  // Calculate scores
  const calculateScores = () => {
    const answered = criteria.filter(
      (c) => c.answer === "yes" || c.answer === "no"
    );
    const yesCount = criteria.filter((c) => c.answer === "yes").length;
    const totalAnswered = answered.length;
    const score = totalAnswered > 0 ? Math.round((yesCount / totalAnswered) * 100) : 0;

    return {
      score,
      totalAnswered,
      totalYes: yesCount,
      totalNo: totalAnswered - yesCount,
      totalNA: criteria.filter((c) => c.answer === "na").length,
      totalUnanswered: criteria.filter((c) => c.answer === null).length,
    };
  };

  const scores = calculateScores();

  // Update criteria answer
  const updateCriteria = (id: string, answer: Answer) => {
    setCriteria((prev) =>
      prev.map((c) => (c.id === id ? { ...c, answer } : c))
    );
  };

  // Reset form
  const resetForm = () => {
    setDate(undefined);
    setClient("");
    setBtRbt("");
    setBcba("");
    setCriteria(CRITERIA_ITEMS.map((item) => ({ ...item, answer: null })));
  };

  // Generate PDF
  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      // Dynamic imports - only load PDF libraries when user clicks download
      const [{ pdf }, { SelfManagementFidelityPDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/pdf/SelfManagementFidelityPDF"),
      ]);

      const pdfData = {
        date: date ? format(date, "MMMM d, yyyy") : "",
        client,
        btRbt,
        bcba,
        criteria: criteria.map((c) => ({
          id: c.id,
          label: c.label,
          answer: c.answer,
        })),
        score: scores.score,
        totalAnswered: scores.totalAnswered,
        totalYes: scores.totalYes,
      };

      const blob = await pdf(<SelfManagementFidelityPDF {...pdfData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const dateStr = date ? format(date, "yyyy-MM-dd") : "undated";
      const clientStr = client ? `-${client.replace(/\s+/g, "-")}` : "";
      link.download = `self-management-fidelity-${dateStr}${clientStr}.pdf`;
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

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-teal-600";
    if (score >= 70) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return "bg-green-50 border-green-200";
    if (score >= 80) return "bg-teal-50 border-teal-200";
    if (score >= 70) return "bg-amber-50 border-amber-200";
    return "bg-red-50 border-red-200";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <Link
          href="/results"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Results
        </Link>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Self-Management Fidelity Checklist
          </h1>
          <p className="text-gray-600">
            Monitor implementation fidelity of self-management interventions.
          </p>
        </div>

        {/* Privacy Notice */}
        <ResourceNotice className="mb-6" />

        {/* Score Summary Card */}
        <Card className={cn("mb-6 border-2", getScoreBg(scores.score))}>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className={cn("text-3xl font-bold", getScoreColor(scores.score))}>
                    {scores.score}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Fidelity Score</div>
                </div>
                <div className="h-12 w-px bg-gray-200" />
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600">{scores.totalYes} Yes</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-gray-600">{scores.totalNo} No</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MinusCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{scores.totalNA} N/A</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetForm}
                  className="gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
                <Button
                  onClick={handleDownloadPDF}
                  disabled={isGenerating}
                  size="sm"
                  className="gap-1.5 bg-teal-600 hover:bg-teal-700"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  Download PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Information */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Session Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
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

              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Input
                  id="client"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="Client name or ID"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="btRbt">BT/RBT</Label>
                <Input
                  id="btRbt"
                  value={btRbt}
                  onChange={(e) => setBtRbt(e.target.value)}
                  placeholder="Technician name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bcba">BCBA</Label>
                <Input
                  id="bcba"
                  value={bcba}
                  onChange={(e) => setBcba(e.target.value)}
                  placeholder="Supervisor name"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Implementation Criteria */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Implementation Criteria</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Assess each criterion during the observation. Select N/A if the criterion is not applicable to this session.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {criteria.map((item, idx) => (
                <div
                  key={item.id}
                  className={cn(
                    "p-4 rounded-lg border transition-colors",
                    item.answer === "yes" && "bg-green-50 border-green-200",
                    item.answer === "no" && "bg-red-50 border-red-200",
                    item.answer === "na" && "bg-gray-50 border-gray-200",
                    item.answer === null && "bg-white border-gray-200"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-3">
                        <p className="text-sm font-medium text-gray-900 flex-1">
                          {item.label}
                        </p>
                        {item.description && (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-5 w-5 p-0 text-gray-400 hover:text-gray-600"
                              >
                                <Info className="w-4 h-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80" side="top">
                              <p className="text-sm text-gray-600">
                                {item.description}
                              </p>
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={item.answer === "yes" ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateCriteria(item.id, item.answer === "yes" ? null : "yes")}
                          className={cn(
                            "min-w-[60px]",
                            item.answer === "yes" && "bg-green-600 hover:bg-green-700"
                          )}
                        >
                          Yes
                        </Button>
                        <Button
                          type="button"
                          variant={item.answer === "no" ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateCriteria(item.id, item.answer === "no" ? null : "no")}
                          className={cn(
                            "min-w-[60px]",
                            item.answer === "no" && "bg-red-600 hover:bg-red-700"
                          )}
                        >
                          No
                        </Button>
                        <Button
                          type="button"
                          variant={item.answer === "na" ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateCriteria(item.id, item.answer === "na" ? null : "na")}
                          className={cn(
                            "min-w-[60px]",
                            item.answer === "na" && "bg-gray-500 hover:bg-gray-600"
                          )}
                        >
                          N/A
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bottom Action Bar */}
        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {scores.totalUnanswered > 0
              ? `${scores.totalUnanswered} item${scores.totalUnanswered > 1 ? "s" : ""} remaining`
              : "All items assessed"}
          </p>
          <Button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="gap-2 bg-teal-600 hover:bg-teal-700"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
