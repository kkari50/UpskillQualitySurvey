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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileDown,
  Info,
  RotateCcw,
  CalendarIcon,
  Plus,
  Trash2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ResourceNotice } from "@/components/layout/ResourceNotice";
import { BehaviorIntensityPDF } from "@/components/pdf/BehaviorIntensityPDF";
import { pdf } from "@react-pdf/renderer";

// Types
interface BehaviorObservation {
  id: string;
  time: string;
  behaviorType: string;
  intensity: number;
  notes: string;
}

// Intensity scale definitions
const INTENSITY_LEVELS = [
  {
    value: 0,
    label: "None",
    description: "No problem behaviors exhibited",
    color: "bg-green-500",
    textColor: "text-green-700",
    bgLight: "bg-green-50",
  },
  {
    value: 1,
    label: "Mild",
    description:
      "Would not cause serious injury to the individual or others. Only minor disruption of ongoing activities.",
    examples: [
      "Moving as if to slap someone",
      "Whining",
      "Getting out of seat",
      "Dropping or tossing object",
    ],
    note: "No self-injurious behavior is considered mild.",
    color: "bg-lime-500",
    textColor: "text-lime-700",
    bgLight: "bg-lime-50",
  },
  {
    value: 2,
    label: "Mild-Moderate",
    description: "Between mild and moderate intensity",
    color: "bg-yellow-400",
    textColor: "text-yellow-700",
    bgLight: "bg-yellow-50",
  },
  {
    value: 3,
    label: "Mild-Moderate",
    description: "Between mild and moderate intensity",
    color: "bg-yellow-500",
    textColor: "text-yellow-700",
    bgLight: "bg-yellow-50",
  },
  {
    value: 4,
    label: "Moderate",
    description:
      "Might cause some injury to the individual or others and/or some disruption of ongoing activities.",
    examples: [
      "Slapping (wrist motion only)",
      "Crying",
      "Standing on a table",
      "Clearing table by knocking objects to floor",
      "Hitting head lightly against object or with hand",
    ],
    color: "bg-orange-500",
    textColor: "text-orange-700",
    bgLight: "bg-orange-50",
  },
  {
    value: 5,
    label: "Moderate-Serious",
    description: "Between moderate and serious intensity",
    color: "bg-orange-600",
    textColor: "text-orange-700",
    bgLight: "bg-orange-50",
  },
  {
    value: 6,
    label: "Moderate-Serious",
    description: "Between moderate and serious intensity",
    color: "bg-red-400",
    textColor: "text-red-700",
    bgLight: "bg-red-50",
  },
  {
    value: 7,
    label: "Serious",
    description:
      "Likely to cause serious injury to the individual or others and/or major disruption of ongoing activities.",
    examples: [
      "Full-arm (over head) hitting",
      "Repeated loud yelling or screaming",
      "Beating objects with hands hard enough to break them",
      "Self-directed hand-biting with clearly visible teeth marks",
    ],
    note: "Noncompliance is not considered serious unless other severe behaviors are occurring.",
    color: "bg-red-600",
    textColor: "text-red-700",
    bgLight: "bg-red-50",
  },
];

// Behavior types
const BEHAVIOR_TYPES = [
  { value: "aggression", label: "Aggression" },
  { value: "tantrums", label: "Whining/Tantrums" },
  { value: "noncompliance", label: "Noncompliance" },
  { value: "property-destruction", label: "Property Destruction" },
  { value: "self-injury", label: "Self-Injury" },
  { value: "other", label: "Other" },
];

// Form info
const FORM_INFO = {
  title: "Intensity Rating Scale (IRS)",
  description:
    "A standardized scale for assessing the intensity of problem behaviors during observations. Rate behaviors from 0 (none) to 7 (serious) based on potential for injury and disruption.",
  keyPoints: [
    "0 = No problems, 1 = Mild, 4 = Moderate, 7 = Serious",
    "Consider both injury potential and activity disruption",
    "No self-injurious behavior is considered mild (minimum 4)",
    "Log multiple observations to track patterns within a session",
  ],
  reference:
    "Reeve, C. E., & Carr, E. G. (2000). Prevention of severe behavior problems in children with developmental disorders. Journal of Positive Behavior Interventions, 2(3), 144-160.",
};

// Intensity slider component
function IntensitySlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const currentLevel = INTENSITY_LEVELS[value];

  return (
    <div className="space-y-4">
      {/* Scale header */}
      <div className="flex justify-between text-xs text-gray-500 px-1">
        <span>None</span>
        <span>Mild</span>
        <span>Moderate</span>
        <span>Serious</span>
      </div>

      {/* Visual scale */}
      <div className="relative">
        {/* Track */}
        <div className="h-3 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-600" />

        {/* Tick marks */}
        <div className="absolute inset-x-0 top-0 h-3 flex justify-between px-0.5">
          {INTENSITY_LEVELS.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => onChange(level.value)}
              className={cn(
                "w-4 h-4 -mt-0.5 rounded-full border-2 border-white shadow-md transition-transform hover:scale-125",
                level.color,
                value === level.value && "ring-2 ring-offset-1 ring-gray-400 scale-125"
              )}
              aria-label={`Select intensity ${level.value}: ${level.label}`}
            />
          ))}
        </div>
      </div>

      {/* Number labels */}
      <div className="flex justify-between text-xs font-medium text-gray-600 px-0.5">
        {INTENSITY_LEVELS.map((level) => (
          <span
            key={level.value}
            className={cn(
              "w-4 text-center",
              value === level.value && "font-bold text-gray-900"
            )}
          >
            {level.value}
          </span>
        ))}
      </div>

      {/* Current selection info */}
      <div className={cn("p-4 rounded-lg border", currentLevel.bgLight)}>
        <div className="flex items-center gap-2 mb-2">
          <div className={cn("w-3 h-3 rounded-full", currentLevel.color)} />
          <span className={cn("font-semibold", currentLevel.textColor)}>
            {value} - {currentLevel.label}
          </span>
        </div>
        <p className="text-sm text-gray-700">{currentLevel.description}</p>
        {currentLevel.examples && (
          <div className="mt-2">
            <p className="text-xs font-medium text-gray-600 mb-1">Examples:</p>
            <ul className="text-xs text-gray-600 space-y-0.5">
              {currentLevel.examples.map((example, idx) => (
                <li key={idx} className="flex items-start gap-1">
                  <span className="text-gray-400">•</span>
                  <span>{example}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {currentLevel.note && (
          <p className="mt-2 text-xs text-amber-700 flex items-start gap-1">
            <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
            {currentLevel.note}
          </p>
        )}
      </div>
    </div>
  );
}

// Observation card component
function ObservationCard({
  observation,
  onDelete,
  index,
}: {
  observation: BehaviorObservation;
  onDelete: () => void;
  index: number;
}) {
  const level = INTENSITY_LEVELS[observation.intensity];
  const behaviorType = BEHAVIOR_TYPES.find(
    (b) => b.value === observation.behaviorType
  );

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg border",
        level.bgLight
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0",
          level.color
        )}
      >
        {observation.intensity}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-600">{observation.time}</span>
          <span className="text-gray-300">|</span>
          <span className="font-medium text-gray-800">
            {behaviorType?.label || observation.behaviorType}
          </span>
        </div>
        <p className={cn("text-sm font-medium mt-1", level.textColor)}>
          {level.label} Intensity
        </p>
        {observation.notes && (
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
            {observation.notes}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onDelete}
        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
        aria-label="Delete observation"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function BehaviorIntensityScalePage() {
  // Session info state
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [client, setClient] = useState("");
  const [observer, setObserver] = useState("");
  const [sessionStart, setSessionStart] = useState("");
  const [sessionEnd, setSessionEnd] = useState("");

  // Current observation state
  const [currentTime, setCurrentTime] = useState("");
  const [currentBehaviorType, setCurrentBehaviorType] = useState("");
  const [currentIntensity, setCurrentIntensity] = useState(0);
  const [currentNotes, setCurrentNotes] = useState("");

  // Observations list
  const [observations, setObservations] = useState<BehaviorObservation[]>([]);

  // Session notes
  const [sessionNotes, setSessionNotes] = useState("");

  // PDF generation state
  const [isGenerating, setIsGenerating] = useState(false);

  // Add observation
  const addObservation = () => {
    if (!currentBehaviorType) return;

    const newObservation: BehaviorObservation = {
      id: Date.now().toString(),
      time: currentTime || format(new Date(), "HH:mm"),
      behaviorType: currentBehaviorType,
      intensity: currentIntensity,
      notes: currentNotes,
    };

    setObservations((prev) => [...prev, newObservation]);

    // Reset current observation fields
    setCurrentTime("");
    setCurrentBehaviorType("");
    setCurrentIntensity(0);
    setCurrentNotes("");
  };

  // Delete observation
  const deleteObservation = (id: string) => {
    setObservations((prev) => prev.filter((o) => o.id !== id));
  };

  // Calculate summary stats
  const summary = useMemo(() => {
    if (observations.length === 0) {
      return {
        count: 0,
        avgIntensity: 0,
        maxIntensity: 0,
        byType: {},
        byLevel: { none: 0, mild: 0, moderate: 0, serious: 0 },
      };
    }

    const sum = observations.reduce((acc, o) => acc + o.intensity, 0);
    const max = Math.max(...observations.map((o) => o.intensity));

    const byType: Record<string, number> = {};
    observations.forEach((o) => {
      byType[o.behaviorType] = (byType[o.behaviorType] || 0) + 1;
    });

    const byLevel = {
      none: observations.filter((o) => o.intensity === 0).length,
      mild: observations.filter((o) => o.intensity >= 1 && o.intensity <= 2).length,
      moderate: observations.filter((o) => o.intensity >= 3 && o.intensity <= 5).length,
      serious: observations.filter((o) => o.intensity >= 6).length,
    };

    return {
      count: observations.length,
      avgIntensity: Math.round((sum / observations.length) * 10) / 10,
      maxIntensity: max,
      byType,
      byLevel,
    };
  }, [observations]);

  // Reset form
  const handleReset = () => {
    setDate(undefined);
    setClient("");
    setObserver("");
    setSessionStart("");
    setSessionEnd("");
    setCurrentTime("");
    setCurrentBehaviorType("");
    setCurrentIntensity(0);
    setCurrentNotes("");
    setObservations([]);
    setSessionNotes("");
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
      const doc = (
        <BehaviorIntensityPDF
          date={date ? format(date, "PPP") : ""}
          client={client}
          observer={observer}
          sessionStart={sessionStart}
          sessionEnd={sessionEnd}
          observations={observations}
          summary={summary}
          sessionNotes={sessionNotes}
          intensityLevels={INTENSITY_LEVELS}
          behaviorTypes={BEHAVIOR_TYPES}
        />
      );
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `behavior-intensity-${client || "session"}-${
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
              Behavior Intensity Scale
            </h1>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 hover:bg-teal-200 text-teal-600 transition-colors"
                  aria-label="About this scale"
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
            Log and track behavior intensity during observation sessions.
          </p>
        </div>

        {/* Privacy Notice */}
        <ResourceNotice className="mb-6" />

        {/* Session Summary */}
        {observations.length > 0 && (
          <Card className="mb-6">
            <CardContent className="py-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {summary.count}
                  </p>
                  <p className="text-xs text-gray-500">Observations</p>
                </div>
                <div>
                  <p
                    className={cn(
                      "text-2xl font-bold",
                      summary.avgIntensity >= 5
                        ? "text-red-600"
                        : summary.avgIntensity >= 3
                          ? "text-orange-600"
                          : summary.avgIntensity >= 1
                            ? "text-yellow-600"
                            : "text-green-600"
                    )}
                  >
                    {summary.avgIntensity}
                  </p>
                  <p className="text-xs text-gray-500">Avg Intensity</p>
                </div>
                <div>
                  <p
                    className={cn(
                      "text-2xl font-bold",
                      summary.maxIntensity >= 5
                        ? "text-red-600"
                        : summary.maxIntensity >= 3
                          ? "text-orange-600"
                          : "text-yellow-600"
                    )}
                  >
                    {summary.maxIntensity}
                  </p>
                  <p className="text-xs text-gray-500">Max Intensity</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">
                    {summary.byLevel.serious}
                  </p>
                  <p className="text-xs text-gray-500">Serious (6-7)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
                <Label htmlFor="client">Client</Label>
                <Input
                  id="client"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="Enter client name"
                />
              </div>
              <div>
                <Label htmlFor="observer">Observer</Label>
                <Input
                  id="observer"
                  value={observer}
                  onChange={(e) => setObserver(e.target.value)}
                  placeholder="Enter observer name"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="sessionStart">Start Time</Label>
                  <Input
                    id="sessionStart"
                    type="time"
                    value={sessionStart}
                    onChange={(e) => setSessionStart(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="sessionEnd">End Time</Label>
                  <Input
                    id="sessionEnd"
                    type="time"
                    value={sessionEnd}
                    onChange={(e) => setSessionEnd(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Log New Observation */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Log Observation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="observationTime">Time</Label>
                <Input
                  id="observationTime"
                  type="time"
                  value={currentTime}
                  onChange={(e) => setCurrentTime(e.target.value)}
                  placeholder="HH:MM"
                />
              </div>
              <div>
                <Label htmlFor="behaviorType">Behavior Type</Label>
                <Select
                  value={currentBehaviorType}
                  onValueChange={setCurrentBehaviorType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select behavior type" />
                  </SelectTrigger>
                  <SelectContent>
                    {BEHAVIOR_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Intensity Slider */}
            <div>
              <Label className="mb-3 block">Intensity Rating (0-7)</Label>
              <IntensitySlider
                value={currentIntensity}
                onChange={setCurrentIntensity}
              />
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="observationNotes">Notes (optional)</Label>
              <Textarea
                id="observationNotes"
                value={currentNotes}
                onChange={(e) => setCurrentNotes(e.target.value)}
                placeholder="Describe the behavior, antecedent, consequence..."
                rows={2}
              />
            </div>

            {/* Add button */}
            <Button
              onClick={addObservation}
              disabled={!currentBehaviorType}
              className="w-full gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Observation
            </Button>
          </CardContent>
        </Card>

        {/* Observations List */}
        {observations.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">
                Observations ({observations.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {observations.map((observation, index) => (
                  <ObservationCard
                    key={observation.id}
                    observation={observation}
                    onDelete={() => deleteObservation(observation.id)}
                    index={index + 1}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Session Notes */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Session Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              placeholder="Overall session observations, patterns noticed, recommendations..."
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleDownloadPDF}
            disabled={isGenerating || observations.length === 0}
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
