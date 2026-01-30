"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Download,
  Printer,
  RotateCcw,
  Loader2,
  Plus,
  Trash2,
  CalendarIcon,
  Sparkles,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  type PreferenceEntry,
  type Category,
  type Reaction,
} from "@/components/pdf/building-new-preferences-data";

const INITIAL_ENTRY: PreferenceEntry = {
  id: "",
  category: null,
  description: "",
  reaction: null,
};

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export default function BuildingNewPreferencesPage() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [clientName, setClientName] = useState("");
  const [therapistName, setTherapistName] = useState("");
  const [entries, setEntries] = useState<PreferenceEntry[]>([
    { ...INITIAL_ENTRY, id: generateId() },
  ]);
  const [notes, setNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAddEntry = () => {
    setEntries([...entries, { ...INITIAL_ENTRY, id: generateId() }]);
  };

  const handleRemoveEntry = (id: string) => {
    if (entries.length > 1) {
      setEntries(entries.filter((e) => e.id !== id));
    }
  };

  const handleEntryChange = (
    id: string,
    field: keyof PreferenceEntry,
    value: Category | Reaction | string | null
  ) => {
    setEntries(
      entries.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const handleReset = () => {
    setDate(undefined);
    setClientName("");
    setTherapistName("");
    setEntries([{ ...INITIAL_ENTRY, id: generateId() }]);
    setNotes("");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      // Dynamic imports - only load PDF libraries when user clicks download
      const [{ pdf }, { BuildingNewPreferencesPDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/pdf/BuildingNewPreferencesPDF"),
      ]);

      const displayDate = date ? format(date, "MMM d, yyyy") : "";
      const fileDate = date ? format(date, "yyyy-MM-dd") : "";
      const logoUrl = `${window.location.origin}/images/logo-medium.png`;

      const blob = await pdf(
        <BuildingNewPreferencesPDF
          data={{
            date: displayDate,
            clientName,
            therapistName,
            entries,
            notes,
            logoUrl,
          }}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const filename = `building-new-preferences${fileDate ? `-${fileDate}` : ""}${clientName ? `-${clientName.replace(/\s+/g, "-")}` : ""}.pdf`;
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

  const completedEntries = entries.filter(
    (e) => e.category && e.description && e.reaction
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <Header />

      <main className="flex-1 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 mb-4">
              <Sparkles className="w-8 h-8 text-teal-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Building New Preferences
            </h1>
            <p className="text-slate-600 max-w-xl mx-auto">
              Track and document new social interactions, activities, and
              tangibles introduced to your client to build new preferences.
            </p>
          </div>

          {/* Tips Section */}
          <Card className="mb-8 shadow-sm border border-slate-200 print:hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-slate-800">
                Tips for Building New Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <h4 className="font-medium text-slate-800 mb-1.5 text-sm">
                  Timing Matters
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Deliver items/interactions multiple times over several days
                  and at different times during therapy sessions.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <h4 className="font-medium text-slate-800 mb-1.5 text-sm">
                  Be Creative
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Try delivering tangibles/interactions in different ways - add
                  different actions, try silly voices, softer voice, etc.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <h4 className="font-medium text-slate-800 mb-1.5 text-sm">
                  New Items Only
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  These should not be currently known preferred items - the goal
                  is to build NEW preferences.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Notice */}
          <ResourceNotice className="mb-8" />

          {/* Info Card with Date/Names */}
          <Card className="mb-6 shadow-sm border border-slate-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Session Details</CardTitle>
              <CardDescription>
                Enter session information for the assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    placeholder="Enter client name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="therapistName">Therapist Name</Label>
                  <Input
                    id="therapistName"
                    placeholder="Enter therapist name"
                    value={therapistName}
                    onChange={(e) => setTherapistName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
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
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Bar */}
          <Card className="mb-6 shadow-sm border border-slate-200">
            <CardContent className="py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">
                  Progress
                </span>
                <span className="text-sm text-slate-500">
                  {completedEntries} of {entries.length} entries completed
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300"
                  style={{
                    width: `${entries.length > 0 ? (completedEntries / entries.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Preference Entries */}
          <Card className="mb-6 shadow-sm border border-slate-200">
            <CardHeader className="bg-slate-50 rounded-t-lg border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-slate-800">
                    Preference Entries
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Record each item or interaction presented
                  </CardDescription>
                </div>
                <Button
                  onClick={handleAddEntry}
                  size="sm"
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Entry
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {entries.map((entry, index) => (
                <div
                  key={entry.id}
                  className={cn(
                    "p-4 hover:bg-slate-50/50 transition-colors",
                    index !== entries.length - 1 && "border-b border-slate-100"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-medium text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-4">
                      {/* Category */}
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-500 uppercase tracking-wide">
                          Category
                        </Label>
                        <div className="flex gap-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`category-${entry.id}`}
                              checked={entry.category === "tangible"}
                              onChange={() =>
                                handleEntryChange(
                                  entry.id,
                                  "category",
                                  "tangible"
                                )
                              }
                              className="w-4 h-4 text-teal-600 border-slate-300 focus:ring-teal-500"
                            />
                            <span className="text-sm text-slate-700">
                              Tangible
                            </span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`category-${entry.id}`}
                              checked={entry.category === "social"}
                              onChange={() =>
                                handleEntryChange(entry.id, "category", "social")
                              }
                              className="w-4 h-4 text-teal-600 border-slate-300 focus:ring-teal-500"
                            />
                            <span className="text-sm text-slate-700">
                              Social Interaction
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-500 uppercase tracking-wide">
                          Description (what item was presented and how)
                        </Label>
                        <Input
                          placeholder="e.g., Presented bubbles with silly voice..."
                          value={entry.description}
                          onChange={(e) =>
                            handleEntryChange(
                              entry.id,
                              "description",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      {/* Client Reaction */}
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-500 uppercase tracking-wide">
                          Client Reaction
                        </Label>
                        <div className="flex flex-wrap gap-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`reaction-${entry.id}`}
                              checked={entry.reaction === "enjoyed"}
                              onChange={() =>
                                handleEntryChange(entry.id, "reaction", "enjoyed")
                              }
                              className="w-4 h-4 text-emerald-600 border-slate-300 focus:ring-emerald-500"
                            />
                            <span className="text-sm text-slate-700">
                              Smiled, engaged, enjoyed
                            </span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`reaction-${entry.id}`}
                              checked={entry.reaction === "neutral"}
                              onChange={() =>
                                handleEntryChange(entry.id, "reaction", "neutral")
                              }
                              className="w-4 h-4 text-amber-600 border-slate-300 focus:ring-amber-500"
                            />
                            <span className="text-sm text-slate-700">
                              Neutral, tolerated briefly
                            </span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`reaction-${entry.id}`}
                              checked={entry.reaction === "rejected"}
                              onChange={() =>
                                handleEntryChange(
                                  entry.id,
                                  "reaction",
                                  "rejected"
                                )
                              }
                              className="w-4 h-4 text-rose-600 border-slate-300 focus:ring-rose-500"
                            />
                            <span className="text-sm text-slate-700">
                              Did not engage, pushed away
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    {entries.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveEntry(entry.id)}
                        className="flex-shrink-0 text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Notes Section */}
          <Card className="mb-6 shadow-sm border border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg text-slate-800">
                Notes / Comments
              </CardTitle>
              <CardDescription>
                Add any additional observations or follow-up items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter any notes, observations, or patterns noticed..."
                className="w-full min-h-[100px] p-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-y"
              />
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
              onClick={handlePrint}
              size="lg"
              variant="outline"
              className="border-slate-300 hover:bg-slate-50"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
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

      <style jsx global>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
