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
  CheckSquare,
  Square,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ResourceNotice } from "@/components/layout/ResourceNotice";

// Checklist items from the PDF
const CHECKLIST_ITEMS = [
  {
    id: "multipleBehaviors",
    label: "Case involves multiple challenging behaviors or severe behaviors posing safety risks",
  },
  {
    id: "medicalComplications",
    label: "Client has medical complications or comorbid conditions requiring specialized monitoring",
  },
  {
    id: "newBIP",
    label: "Team is implementing new or complex behavior intervention plans",
  },
  {
    id: "newRBT",
    label: "RBT is in the initial training period or new to the case",
  },
  {
    id: "multipleRBTs",
    label: "There are multiple RBTs assigned to the case",
  },
  {
    id: "medicationChanges",
    label: "Recent changes in client medication that may affect behavior or treatment response",
  },
  {
    id: "crisisProtocols",
    label: "Case involves crisis intervention protocols or restraint procedures",
  },
  {
    id: "lackOfProgress",
    label: "Client is not making expected progress despite consistent implementation",
  },
  {
    id: "transitionalPeriod",
    label: "Client is experiencing a transitional period (changing settings, significant life events)",
  },
  {
    id: "limitedCommunication",
    label: "Client has limited communication abilities",
  },
  {
    id: "multipleProviders",
    label: "Case requires coordination with multiple service providers or systems of care",
  },
];

// Form info
const FORM_INFO = {
  title: "Checklist for More Than 5% Supervision",
  description:
    "Use this checklist to help determine when more than the minimum 5% supervision may be warranted for a client case. These scenarios indicate increased complexity or risk that may benefit from higher supervision percentages.",
  keyPoints: [
    "Clinical judgment should always guide supervision decisions",
    "The 5% minimum is a regulatory baseline, not a clinical guideline",
    "Complex cases often benefit from 10-15% or higher supervision",
    "Document justification for increased supervision in clinical notes",
  ],
};

// Checkbox item component
function CheckboxItem({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors border",
        checked
          ? "bg-amber-50 border-amber-200"
          : "bg-white border-gray-200 hover:bg-gray-50"
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
      <span
        className={cn("text-sm", checked ? "text-amber-900" : "text-gray-700")}
      >
        {label}
      </span>
    </label>
  );
}

export default function SupervisionPercentageChecklistPage() {
  // Session info state
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [client, setClient] = useState("");
  const [bcba, setBcba] = useState("");
  const [rbt, setRbt] = useState("");

  // Checked items state
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  // Notes
  const [notes, setNotes] = useState("");
  const [recommendedPercentage, setRecommendedPercentage] = useState("");

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

  // Calculate recommendation
  const recommendation = useMemo(() => {
    const count = checkedItems.size;
    if (count === 0) {
      return {
        level: "standard",
        text: "Standard 5% supervision may be appropriate",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      };
    } else if (count <= 2) {
      return {
        level: "moderate",
        text: "Consider 7-10% supervision",
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
      };
    } else if (count <= 5) {
      return {
        level: "elevated",
        text: "Consider 10-15% supervision",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
      };
    } else {
      return {
        level: "high",
        text: "Consider 15%+ supervision",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      };
    }
  }, [checkedItems]);

  // Reset form
  const handleReset = () => {
    setDate(undefined);
    setClient("");
    setBcba("");
    setRbt("");
    setCheckedItems(new Set());
    setNotes("");
    setRecommendedPercentage("");
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      // Dynamic imports - only load PDF libraries when user clicks download
      const [{ pdf }, { SupervisionPercentageChecklistPDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/pdf/SupervisionPercentageChecklistPDF"),
      ]);

      const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
      const doc = (
        <SupervisionPercentageChecklistPDF
          date={date ? format(date, "PPP") : ""}
          client={client}
          bcba={bcba}
          rbt={rbt}
          checkedItems={Array.from(checkedItems)}
          items={CHECKLIST_ITEMS}
          recommendation={recommendation.text}
          notes={notes}
          recommendedPercentage={recommendedPercentage}
        />
      );
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `supervision-percentage-checklist-${client || "client"}-${
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
              Checklist for More Than 5% Supervision
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
            Determine when more than the minimum 5% supervision may be warranted.
          </p>
        </div>

        {/* Privacy Notice */}
        <ResourceNotice className="mb-6" />

        {/* Recommendation Summary */}
        <Card
          className={cn(
            "mb-6 border-2",
            recommendation.borderColor,
            recommendation.bgColor
          )}
        >
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <AlertTriangle
                className={cn("w-6 h-6", recommendation.color)}
              />
              <div>
                <p className={cn("font-semibold", recommendation.color)}>
                  {recommendation.text}
                </p>
                <p className="text-sm text-gray-600">
                  {checkedItems.size} of {CHECKLIST_ITEMS.length} factors identified
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Case Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Assessment Date</Label>
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
                  placeholder="Enter client name/ID"
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
                <Label htmlFor="rbt">RBT</Label>
                <Input
                  id="rbt"
                  value={rbt}
                  onChange={(e) => setRbt(e.target.value)}
                  placeholder="Enter RBT name"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Checklist */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">
              Factors Warranting Increased Supervision
            </CardTitle>
            <p className="text-sm text-gray-600">
              Check all factors that apply to this case. More factors indicate a
              stronger need for supervision above the 5% minimum.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {CHECKLIST_ITEMS.map((item) => (
                <CheckboxItem
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  checked={checkedItems.has(item.id)}
                  onChange={() => toggleItem(item.id)}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendation */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recommended Supervision</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="recommendedPercentage">
                Recommended Supervision Percentage
              </Label>
              <Input
                id="recommendedPercentage"
                value={recommendedPercentage}
                onChange={(e) => setRecommendedPercentage(e.target.value)}
                placeholder="e.g., 10%, 15%"
              />
            </div>
            <div>
              <Label htmlFor="notes">Clinical Justification</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Document clinical justification for the recommended supervision percentage..."
                rows={4}
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
