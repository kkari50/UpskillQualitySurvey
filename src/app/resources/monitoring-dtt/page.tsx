"use client";

import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  ChevronDown,
  ChevronUp,
  Info,
  Plus,
  Trash2,
  Copy,
  CheckCircle2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ResourceNotice } from "@/components/layout/ResourceNotice";
import {
  type TrialCriteria,
  createEmptyTrial,
  getTrialCompletion,
  isTrialStarted,
  calculateScores,
} from "./scoring";

// Coding guidelines data
const CODING_GUIDELINES = [
  {
    id: 1,
    title: "Set up of Materials",
    items: [
      "Make sure that the materials that are listed in the program sheet are the ones being presented",
      "Make sure that the materials that are being used are from the proper set number of the program",
      "Make sure that the array on the desk (if applicable) has the correct number of stimuli as listed in the program sheet",
    ],
  },
  {
    id: 2,
    title: "SD Attending",
    items: [
      "Client is playing with the stimulus materials before/during SD delivery",
      "Early responding. The client responds before or during the verbal SD",
      "Client is consuming food or has access to the SR+",
      "Client is not looking at the tutor and/or the stimulus material",
    ],
  },
  {
    id: 3,
    title: "SD as written",
    items: [
      "Repeating the SD more often or less often than specified in the program",
      "Placing learning materials always in the same location. Rotation should occur at least once every 3 trials",
      "Involuntary cueing (pay attention to eye and hand movements; look for patterns)",
    ],
  },
  {
    id: 4,
    title: "SD Intonation",
    items: [
      "The tone of voice is too excited",
      "The tone of voice sounds too low or quiet (it must be neutral)",
      "The tone of voice is harsh sounding",
    ],
  },
  {
    id: 5,
    title: "Correction Timely",
    items: [
      "As soon as the learner makes an error the correction procedure must be implemented following the correct prompt hierarchy",
      "Not implementing the correction procedure",
    ],
  },
  {
    id: 6,
    title: "Correction Attending",
    items: [
      "Client is not attending to the tutor when the tutor provides correction procedure",
      "Client is tantruming",
    ],
  },
  {
    id: 7,
    title: "Correction as Written",
    items: [
      "Reinforcing an incorrect behavior",
      "Tutor performs the behavior, rather than prompting the client",
      "Tutor does not use the hierarchy of prompts",
      'Tutor labels the incorrect behavior (e.g., "No, this is the shoe….and that is the banana")',
    ],
  },
  {
    id: 8,
    title: "Correction Intonation",
    items: [
      "The tone of voice is excited indicating that they made a correct response, correction tone should be neutral",
    ],
  },
  {
    id: 9,
    title: "SR+ (Reinforcer) Timely",
    items: [
      "Delay between R and SR+ >2 s",
      "Tutor records client's response before delivering the SR+",
      'Tutor does not use reinforcer because the client was "naughty" during previous trials',
    ],
  },
  {
    id: 10,
    title: "SR+ Effective",
    items: [
      'Tutor presents a presumed "SR+" that the client refused on a previous trial',
    ],
  },
  {
    id: 11,
    title: "SR+ Descriptive",
    items: [
      'Tutor uses general praise. Use descriptive praise, the tutor should specify what they are praising. (ex. "Good touching your nose.")',
    ],
  },
  {
    id: 12,
    title: "SR+ Intonation",
    items: [
      "The tone of voice is neutral. This intonation is very important we want the student to discriminate a praise statement vs. instructional statement with tone of voice.",
    ],
  },
  {
    id: 13,
    title: "Affection and Play",
    items: [
      "Tutor must use affection (high fives, pat on back, making funny faces, etc.) in addition to any social praise",
      "Tutor must play with the toy when providing the item to the client",
    ],
  },
  {
    id: 14,
    title: "Pacing Error",
    items: [
      "Searching for stimulus material between trials",
      "The ITI exceeds 5 sec., when the tutor is only using praise",
      "The ITI exceeds 25 sec. when the tutor is using an edible/tangible",
    ],
  },
  {
    id: 15,
    title: "Extra Learning Opportunities",
    items: [
      "Tutor must reinforce the client's other appropriate behaviors on average once every two trials in the booth",
      "Tutor must reinforce the client's appropriate behaviors on average once every minute outside of the booth",
    ],
  },
  {
    id: 16,
    title: "Attention for Disruptive Behavior",
    items: [
      "When the client shows disruptive behavior, tutor should instruct the client to go back to the appropriate behavior by following the hierarchy of prompts",
      "Tutor should repeat verbal prompts only when following the hierarchy of prompts",
      "Try not to make any facial expressions following client's disruptive behavior",
      "Tutor should not make any unnecessary comments about client's disruptive behavior",
      "Tutor should not give a choice of reinforcers following disruptive behavior",
    ],
  },
];

// Helper to get guidelines by IDs
function getGuidelinesByIds(ids: number[]) {
  return CODING_GUIDELINES.filter((g) => ids.includes(g.id));
}

// GuidelineInfo popover component
function GuidelineInfo({ guidelineIds }: { guidelineIds: number[] }) {
  const guidelines = getGuidelinesByIds(guidelineIds);
  if (guidelines.length === 0) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 hover:bg-teal-100 text-slate-500 hover:text-teal-600 transition-colors"
          aria-label="View guidelines"
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 max-h-80 overflow-y-auto p-0"
        align="start"
        side="right"
      >
        <div className="p-3 border-b bg-slate-50">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Coding Guidelines
          </p>
        </div>
        <div className="p-3 space-y-3">
          {guidelines.map((guideline) => (
            <div key={guideline.id}>
              <p className="text-sm font-medium text-slate-800 mb-1">
                {guideline.title}
              </p>
              <ul className="space-y-1">
                {guideline.items.map((item, idx) => (
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
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function DTTMonitoringPage() {
  // Header state
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [supervisee, setSupervisee] = useState("");
  const [client, setClient] = useState("");
  const [program, setProgram] = useState("");
  const [monitor, setMonitor] = useState("");

  // Trials state (starts with 1 trial, can add more)
  const [trials, setTrials] = useState<TrialCriteria[]>([createEmptyTrial()]);

  // Active trial tab
  const [activeTrial, setActiveTrial] = useState(0);

  // Guidelines collapsed state
  const [guidelinesOpen, setGuidelinesOpen] = useState(false);

  // PDF generation
  const [isGenerating, setIsGenerating] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && activeTrial > 0) {
        setActiveTrial((prev) => prev - 1);
      } else if (e.key === "ArrowRight" && activeTrial < trials.length - 1) {
        setActiveTrial((prev) => prev + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTrial, trials.length]);

  // Add new trial and navigate to it
  const addTrial = () => {
    setTrials((prev) => {
      const newTrials = [...prev, createEmptyTrial()];
      setActiveTrial(newTrials.length - 1);
      return newTrials;
    });
  };

  // Remove trial (keep at least 1 trial)
  const removeTrial = (index: number) => {
    if (trials.length <= 1) return;
    setTrials((prev) => prev.filter((_, i) => i !== index));
    if (activeTrial >= trials.length - 1) {
      setActiveTrial(Math.max(0, trials.length - 2));
    }
  };

  // Copy from previous trial
  const copyFromPrevious = () => {
    if (activeTrial === 0) return;
    setTrials((prev) => {
      const newTrials = [...prev];
      newTrials[activeTrial] = { ...prev[activeTrial - 1] };
      return newTrials;
    });
  };

  // Reset current trial
  const resetCurrentTrial = () => {
    setTrials((prev) => {
      const newTrials = [...prev];
      newTrials[activeTrial] = createEmptyTrial();
      return newTrials;
    });
  };

  // Mark all in category
  const markAllInCategory = (
    category: "sd" | "reinforcer" | "correction",
    value: boolean
  ) => {
    setTrials((prev) => {
      const newTrials = [...prev];
      const trial = { ...newTrials[activeTrial] };

      if (category === "sd") {
        trial.sdAttending = value;
        trial.sdAsWritten = value;
        trial.sdIntonation = value;
      } else if (category === "reinforcer") {
        trial.reinforcerImmediate = value;
        trial.reinforcerEffective = value;
        trial.reinforcerDescriptive = value;
        trial.reinforcerIntonation = value;
        trial.reinforcerAffectPlay = value;
      } else if (category === "correction") {
        trial.correctionTimely = value;
        trial.correctionAttending = value;
        trial.correctionAsWritten = value;
        trial.correctionIntonation = value;
      }

      newTrials[activeTrial] = trial;
      return newTrials;
    });
  };

  // Update trial criteria
  const updateTrialCriteria = (
    trialIndex: number,
    field: keyof TrialCriteria,
    value: boolean | null
  ) => {
    setTrials((prev) => {
      const newTrials = [...prev];
      newTrials[trialIndex] = {
        ...newTrials[trialIndex],
        [field]: value,
      };
      return newTrials;
    });
  };

  // Toggle trial criteria (for checkboxes)
  const toggleTrialCriteria = (
    trialIndex: number,
    field: keyof TrialCriteria
  ) => {
    const currentValue = trials[trialIndex][field];
    const newValue = currentValue === null ? true : !currentValue;
    updateTrialCriteria(trialIndex, field, newValue);
  };

  const scores = calculateScores(trials);

  // Overall progress
  const trialsStarted = trials.filter(isTrialStarted).length;
  const overallProgress = Math.round((trialsStarted / trials.length) * 100);

  // Handle PDF download
  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      // Dynamic imports - only load PDF libraries when user clicks download
      const [{ pdf }, { DTTMonitoringPDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/pdf/DTTMonitoringPDF"),
      ]);

      const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
      const doc = (
        <DTTMonitoringPDF
          date={date ? format(date, "PPP") : ""}
          supervisee={supervisee}
          client={client}
          program={program}
          monitor={monitor}
          trials={trials}
          scores={scores}
        />
      );
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `dtt-monitoring-${client || "form"}-${
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

  // Checkbox component with label
  const CriteriaCheckbox = ({
    label,
    checked,
    onChange,
    isNullable = false,
  }: {
    label: string;
    checked: boolean | null;
    onChange: () => void;
    isNullable?: boolean;
  }) => (
    <div className="flex items-center gap-2 py-1.5">
      <button
        type="button"
        onClick={onChange}
        className={cn(
          "w-6 h-6 rounded border-2 flex items-center justify-center transition-all",
          checked === null
            ? "border-gray-300 bg-gray-100"
            : checked
              ? "border-teal-600 bg-teal-600 text-white"
              : "border-gray-300 bg-white hover:border-teal-400"
        )}
      >
        {checked === true && (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
        {checked === null && isNullable && (
          <span className="text-xs text-gray-400">-</span>
        )}
      </button>
      <span className="text-sm flex-1">{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8" ref={formRef}>
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            DTT Session Monitoring Form
          </h1>
          <p className="text-gray-600">
            Monitor tutor performance across discrete trials. Check each
            criterion that was implemented correctly.
          </p>
        </div>

        {/* Privacy Notice */}
        <ResourceNotice className="mb-6" />

        {/* Progress Bar */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progress: {trialsStarted} of {trials.length} trials started
              </span>
              <span className="text-sm font-bold text-teal-600">
                {overallProgress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Session Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Session Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <Label htmlFor="supervisee">Supervisee</Label>
                <Input
                  id="supervisee"
                  value={supervisee}
                  onChange={(e) => setSupervisee(e.target.value)}
                  placeholder="Enter supervisee name"
                />
              </div>
              <div>
                <Label htmlFor="client">Client</Label>
                <Input
                  id="client"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="Enter client name/ID"
                />
              </div>
              <div>
                <Label htmlFor="program">Program</Label>
                <Input
                  id="program"
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  placeholder="Enter program name"
                />
              </div>
              <div>
                <Label htmlFor="monitor">Monitor</Label>
                <Input
                  id="monitor"
                  value={monitor}
                  onChange={(e) => setMonitor(e.target.value)}
                  placeholder="Enter monitor name"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trial Monitoring */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Trial Monitoring</CardTitle>
              <span className="text-sm text-gray-500">
                {trials.length} trial{trials.length !== 1 ? "s" : ""}
              </span>
            </div>
          </CardHeader>
          <CardContent>
                {/* Trial selector with scroll */}
                <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                  <div className="flex-1 overflow-x-auto">
                    <div className="flex gap-2 min-w-max">
                      {trials.map((trial, index) => {
                        const started = isTrialStarted(trial);
                        const completion = getTrialCompletion(trial);
                        return (
                          <button
                            key={index}
                            onClick={() => setActiveTrial(index)}
                            className={cn(
                              "relative px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5",
                              activeTrial === index
                                ? "bg-teal-600 text-white"
                                : started
                                  ? "bg-teal-100 text-teal-700 hover:bg-teal-200"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            )}
                          >
                            {started && (
                              <CheckCircle2
                                className={cn(
                                  "w-3.5 h-3.5",
                                  activeTrial === index
                                    ? "text-white"
                                    : completion >= 80
                                      ? "text-green-600"
                                      : "text-teal-600"
                                )}
                              />
                            )}
                            <span>Trial {index + 1}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

            {/* Trial actions */}
            <div className="flex flex-wrap items-center gap-2 mb-4 pb-4 border-b">
              {/* Only show Copy from Previous when not on first trial */}
              {activeTrial > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyFromPrevious}
                  className="text-xs"
                >
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  Copy from Previous
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={resetCurrentTrial}
                className="text-xs text-gray-600"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Reset
              </Button>
              {/* Show delete when there's more than 1 trial */}
              {trials.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeTrial(activeTrial)}
                  className="text-xs text-rose-600 hover:bg-rose-50 border-rose-200"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Delete
                </Button>
              )}
              <div className="flex-1" />
              {trials.length > 1 && (
                <span className="text-xs text-gray-500">
                  ← → to navigate
                </span>
              )}
            </div>

                {/* Active trial criteria */}
                <div className="space-y-6">
                  {/* Set up of Materials */}
                  <div className="border-b pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        Set up of Materials
                      </h3>
                      <GuidelineInfo guidelineIds={[1]} />
                    </div>
                    <CriteriaCheckbox
                      label="Materials match program sheet and are set up according to phase/set number"
                      checked={trials[activeTrial].setupMaterials}
                      onChange={() =>
                        toggleTrialCriteria(activeTrial, "setupMaterials")
                      }
                    />
                  </div>

                  {/* SD Section */}
                  <div className="border-b pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                          S<sup>D</sup> (Discriminative Stimulus)
                        </h3>
                        <GuidelineInfo guidelineIds={[2, 3, 4]} />
                      </div>
                      <button
                        onClick={() => markAllInCategory("sd", true)}
                        className="text-xs text-teal-600 hover:text-teal-700 hover:underline"
                      >
                        Mark all ✓
                      </button>
                    </div>
                    <CriteriaCheckbox
                      label="A. Attending - Client is attending before SD delivery"
                      checked={trials[activeTrial].sdAttending}
                      onChange={() =>
                        toggleTrialCriteria(activeTrial, "sdAttending")
                      }
                    />
                    <CriteriaCheckbox
                      label="B. SD as written - Delivered as specified in program"
                      checked={trials[activeTrial].sdAsWritten}
                      onChange={() =>
                        toggleTrialCriteria(activeTrial, "sdAsWritten")
                      }
                    />
                    <CriteriaCheckbox
                      label="C. Intonation - Neutral tone of voice"
                      checked={trials[activeTrial].sdIntonation}
                      onChange={() =>
                        toggleTrialCriteria(activeTrial, "sdIntonation")
                      }
                    />
                  </div>

                  {/* Response */}
                  <div className="border-b pb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Response
                    </h3>
                    <div className="flex items-center gap-4">
                      <span className="text-sm">Response Correct?</span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateTrialCriteria(
                              activeTrial,
                              "responseCorrect",
                              true
                            )
                          }
                          className={cn(
                            "px-4 py-1.5 rounded text-sm font-medium transition-colors",
                            trials[activeTrial].responseCorrect === true
                              ? "bg-green-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          )}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateTrialCriteria(
                              activeTrial,
                              "responseCorrect",
                              false
                            )
                          }
                          className={cn(
                            "px-4 py-1.5 rounded text-sm font-medium transition-colors",
                            trials[activeTrial].responseCorrect === false
                              ? "bg-rose-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          )}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Correction Section - only show if response was incorrect */}
                  {trials[activeTrial].responseCorrect === false && (
                    <div className="border-b pb-4 bg-amber-50 -mx-4 px-4 py-3 rounded">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">
                              Correction Procedure
                            </h3>
                            <GuidelineInfo guidelineIds={[5, 6, 7, 8]} />
                          </div>
                          <p className="text-sm text-amber-700">
                            Rate the correction since response was incorrect
                          </p>
                        </div>
                        <button
                          onClick={() => markAllInCategory("correction", true)}
                          className="text-xs text-teal-600 hover:text-teal-700 hover:underline"
                        >
                          Mark all ✓
                        </button>
                      </div>
                      <CriteriaCheckbox
                        label="A. Timely - Implemented immediately after error"
                        checked={trials[activeTrial].correctionTimely}
                        onChange={() =>
                          toggleTrialCriteria(activeTrial, "correctionTimely")
                        }
                        isNullable
                      />
                      <CriteriaCheckbox
                        label="B. Attending - Client attending during correction"
                        checked={trials[activeTrial].correctionAttending}
                        onChange={() =>
                          toggleTrialCriteria(activeTrial, "correctionAttending")
                        }
                        isNullable
                      />
                      <CriteriaCheckbox
                        label="C. As written - Used correct prompt hierarchy"
                        checked={trials[activeTrial].correctionAsWritten}
                        onChange={() =>
                          toggleTrialCriteria(activeTrial, "correctionAsWritten")
                        }
                        isNullable
                      />
                      <CriteriaCheckbox
                        label="D. Intonation - Neutral tone during correction"
                        checked={trials[activeTrial].correctionIntonation}
                        onChange={() =>
                          toggleTrialCriteria(
                            activeTrial,
                            "correctionIntonation"
                          )
                        }
                        isNullable
                      />
                    </div>
                  )}

                  {/* Reinforcer Section - only show if response was correct */}
                  {trials[activeTrial].responseCorrect === true && (
                    <div className="border-b pb-4 bg-green-50 -mx-4 px-4 py-3 rounded">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">
                              Reinforcer (S<sup>R+</sup>)
                            </h3>
                            <GuidelineInfo guidelineIds={[9, 10, 11, 12, 13]} />
                          </div>
                          <p className="text-sm text-green-700">
                            Rate reinforcement since response was correct
                          </p>
                        </div>
                        <button
                          onClick={() => markAllInCategory("reinforcer", true)}
                          className="text-xs text-teal-600 hover:text-teal-700 hover:underline"
                        >
                          Mark all ✓
                        </button>
                      </div>
                      <CriteriaCheckbox
                        label="A. Immediate - Delivered within 2 seconds"
                        checked={trials[activeTrial].reinforcerImmediate}
                        onChange={() =>
                          toggleTrialCriteria(activeTrial, "reinforcerImmediate")
                        }
                      />
                      <CriteriaCheckbox
                        label="B. Effective - Client accepted reinforcer"
                        checked={trials[activeTrial].reinforcerEffective}
                        onChange={() =>
                          toggleTrialCriteria(activeTrial, "reinforcerEffective")
                        }
                      />
                      <CriteriaCheckbox
                        label="C. Descriptive - Used specific praise"
                        checked={trials[activeTrial].reinforcerDescriptive}
                        onChange={() =>
                          toggleTrialCriteria(activeTrial, "reinforcerDescriptive")
                        }
                      />
                      <CriteriaCheckbox
                        label="D. Intonation - Enthusiastic tone"
                        checked={trials[activeTrial].reinforcerIntonation}
                        onChange={() =>
                          toggleTrialCriteria(activeTrial, "reinforcerIntonation")
                        }
                      />
                      <CriteriaCheckbox
                        label="E. Affect/Play - Used affection and/or play"
                        checked={trials[activeTrial].reinforcerAffectPlay}
                        onChange={() =>
                          toggleTrialCriteria(activeTrial, "reinforcerAffectPlay")
                        }
                      />
                    </div>
                  )}

                  {/* Pacing, Extra SR, Attention */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        Additional Criteria
                      </h3>
                      <GuidelineInfo guidelineIds={[14, 15, 16]} />
                    </div>
                    <CriteriaCheckbox
                      label="Pacing Adequate - ITI within acceptable limits"
                      checked={trials[activeTrial].pacingAdequate}
                      onChange={() =>
                        toggleTrialCriteria(activeTrial, "pacingAdequate")
                      }
                    />
                    <CriteriaCheckbox
                      label="Extra SR - Reinforced other appropriate behaviors"
                      checked={trials[activeTrial].extraSR}
                      onChange={() =>
                        toggleTrialCriteria(activeTrial, "extraSR")
                      }
                    />
                    <CriteriaCheckbox
                      label="No additional attention for disruptive behavior"
                      checked={trials[activeTrial].attentionForDisruptive}
                      onChange={() =>
                        toggleTrialCriteria(
                          activeTrial,
                          "attentionForDisruptive"
                        )
                      }
                    />
                  </div>
                </div>

                {/* Navigation buttons */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setActiveTrial((prev) => Math.max(0, prev - 1))
                    }
                    disabled={activeTrial === 0}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <span className="text-sm text-gray-500">
                    Trial {activeTrial + 1} of {trials.length}
                  </span>
                  {activeTrial < trials.length - 1 ? (
                    <Button
                      variant="outline"
                      onClick={() =>
                        setActiveTrial((prev) =>
                          Math.min(trials.length - 1, prev + 1)
                        )
                      }
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={addTrial}
                      className="text-teal-600 border-teal-200 hover:bg-teal-50"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Trial
                    </Button>
                  )}
                </div>
          </CardContent>
        </Card>

        {/* Scores Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Fidelity Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <ScoreCard label="Setup Materials" score={scores.setupMaterials} />
              <ScoreCard label="SD Delivery" score={scores.sd} />
              <ScoreCard label="Correction" score={scores.correction} />
              <ScoreCard label="Reinforcer" score={scores.reinforcer} />
              <ScoreCard label="Pacing" score={scores.pacing} />
              <ScoreCard label="Extra SR" score={scores.extraSR} />
              <ScoreCard label="Attention" score={scores.attention} />
              <div className="bg-teal-50 rounded-lg p-3 text-center border-2 border-teal-200">
                <div className="text-2xl font-bold text-teal-700">
                  {scores.overall}%
                </div>
                <div className="text-xs text-teal-600 font-medium">OVERALL</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coding Guidelines */}
        <Collapsible open={guidelinesOpen} onOpenChange={setGuidelinesOpen}>
          <Card className="mb-6">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-teal-600" />
                    Monitoring/Coding Guidelines
                  </span>
                  {guidelinesOpen ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {CODING_GUIDELINES.map((guideline) => (
                    <div
                      key={guideline.id}
                      className="border-b pb-3 last:border-b-0"
                    >
                      <h4 className="font-medium text-gray-900 mb-1">
                        {guideline.id}. {guideline.title}
                      </h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {guideline.items.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Actions */}
        <div className="flex justify-center">
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

// Score card component
function ScoreCard({ label, score }: { label: string; score: number }) {
  const getScoreColor = (s: number) => {
    if (s >= 85) return "text-green-600 bg-green-50";
    if (s >= 60) return "text-amber-600 bg-amber-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <div className={`rounded-lg p-3 text-center ${getScoreColor(score)}`}>
      <div className="text-xl font-bold">{score}%</div>
      <div className="text-xs font-medium truncate">{label}</div>
    </div>
  );
}
