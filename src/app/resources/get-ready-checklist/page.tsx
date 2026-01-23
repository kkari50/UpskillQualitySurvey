"use client";

import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Download, Printer, RotateCcw, Loader2, Check, X, CalendarIcon } from "lucide-react";

import { Header, Footer } from "@/components/layout";
import { ResourceNotice } from "@/components/layout/ResourceNotice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  DATA_COLLECTION_ITEMS,
  GENERAL_ITEMS,
  type Answer,
} from "@/components/pdf/GetReadyChecklistPDF";

export default function GetReadyChecklistPage() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAnswerChange = (itemId: string, value: Answer) => {
    const currentValue = answers[itemId];
    setAnswers({
      ...answers,
      [itemId]: currentValue === value ? null : value,
    });
  };

  const handleReset = () => {
    setDate(undefined);
    setName("");
    setNotes("");
    setAnswers({});
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      // Dynamic imports - only load PDF libraries when user clicks download
      const [{ pdf }, { GetReadyChecklistPDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/pdf/GetReadyChecklistPDF"),
      ]);

      // Format date for display if provided
      const displayDate = date ? format(date, "MMM d, yyyy") : "";
      const fileDate = date ? format(date, "yyyy-MM-dd") : "";
      // Get the absolute URL for the logo
      const logoUrl = `${window.location.origin}/images/logo-medium.png`;
      const blob = await pdf(
        <GetReadyChecklistPDF data={{ date: displayDate, name, notes, answers, logoUrl }} />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const filename = `get-ready-checklist${fileDate ? `-${fileDate}` : ""}${name ? `-${name.replace(/\s+/g, "-")}` : ""}.pdf`;
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

  const completedCount = Object.values(answers).filter(a => a !== null).length;
  const totalItems = DATA_COLLECTION_ITEMS.length + GENERAL_ITEMS.length;
  const yesCount = Object.values(answers).filter(a => a === "Y").length;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <Header />

      <main className="flex-1 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 mb-4">
              <Check className="w-8 h-8 text-teal-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Get Ready Checklist
            </h1>
            <p className="text-slate-600 max-w-xl mx-auto">
              Ensure you&apos;re fully prepared before each session. Complete the checklist and download your personalized PDF.
            </p>
          </div>

          {/* Tips Section */}
          <Card className="mb-8 shadow-sm border border-slate-200 print:hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-slate-800">Tips for Session Preparation</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <h4 className="font-medium text-slate-800 mb-1.5 text-sm">Clinic Settings</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Each learner should have a &quot;home base&quot; for materials. Consider a fanny pouch for timers and visual schedules.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <h4 className="font-medium text-slate-800 mb-1.5 text-sm">In-Home Services</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Work with caregivers to restrict materials during non-therapy time and dedicate a space for sessions.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <h4 className="font-medium text-slate-800 mb-1.5 text-sm">Why This Matters</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Organized materials allow BTs/RBTs to work efficiently through assigned goals.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Notice */}
          <ResourceNotice className="mb-8" />

          {/* Info Card with Date/Name */}
          <Card className="mb-6 shadow-sm border border-slate-200">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-lg">Session Details</CardTitle>
                  <CardDescription>Enter your information for the checklist</CardDescription>
                </div>
                <Image
                  src="/images/logo-medium.png"
                  alt="UpskillABA"
                  width={140}
                  height={40}
                  className="h-10 w-auto"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                <span className="text-sm font-medium text-slate-700">Progress</span>
                <span className="text-sm text-slate-500">
                  {completedCount} of {totalItems} completed
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300"
                  style={{ width: `${(completedCount / totalItems) * 100}%` }}
                />
              </div>
              {completedCount === totalItems && (
                <p className="text-sm text-emerald-600 mt-2 font-medium">
                  All items completed! {yesCount} of {totalItems} marked Yes.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Data Collection Section */}
          <Card className="mb-6 shadow-sm border border-slate-200">
            <CardHeader className="bg-slate-50 rounded-t-lg border-b border-slate-200">
              <CardTitle className="text-slate-800 flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center">
                  <span className="text-white font-medium text-xs">1</span>
                </div>
                Data Collection
              </CardTitle>
              <CardDescription className="text-slate-600 ml-8.5">
                Verify your data collection readiness
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {DATA_COLLECTION_ITEMS.map((item, index) => (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-center justify-between gap-4 p-4 hover:bg-slate-50 transition-colors",
                    index !== DATA_COLLECTION_ITEMS.length - 1 && "border-b border-slate-100"
                  )}
                >
                  <span className="text-sm text-slate-700 flex-1 leading-relaxed">
                    {item.text}
                  </span>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant={answers[item.id] === "Y" ? "default" : "outline"}
                      className={cn(
                        "w-12 h-10 transition-all",
                        answers[item.id] === "Y"
                          ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md"
                          : "hover:border-emerald-300 hover:text-emerald-600"
                      )}
                      onClick={() => handleAnswerChange(item.id, "Y")}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={answers[item.id] === "N" ? "default" : "outline"}
                      className={cn(
                        "w-12 h-10 transition-all",
                        answers[item.id] === "N"
                          ? "bg-rose-400 hover:bg-rose-500 text-white shadow-md"
                          : "hover:border-rose-300 hover:text-rose-500"
                      )}
                      onClick={() => handleAnswerChange(item.id, "N")}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* General Section */}
          <Card className="mb-6 shadow-sm border border-slate-200">
            <CardHeader className="bg-slate-50 rounded-t-lg border-b border-slate-200">
              <CardTitle className="text-slate-800 flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-slate-500 flex items-center justify-center">
                  <span className="text-white font-medium text-xs">2</span>
                </div>
                General Preparation
              </CardTitle>
              <CardDescription className="text-slate-600 ml-8.5">
                Ensure general session readiness
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {GENERAL_ITEMS.map((item, index) => (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-center justify-between gap-4 p-4 hover:bg-slate-50 transition-colors",
                    index !== GENERAL_ITEMS.length - 1 && "border-b border-slate-100"
                  )}
                >
                  <span className="text-sm text-slate-700 flex-1 leading-relaxed">
                    {item.text}
                  </span>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant={answers[item.id] === "Y" ? "default" : "outline"}
                      className={cn(
                        "w-12 h-10 transition-all",
                        answers[item.id] === "Y"
                          ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md"
                          : "hover:border-emerald-300 hover:text-emerald-600"
                      )}
                      onClick={() => handleAnswerChange(item.id, "Y")}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={answers[item.id] === "N" ? "default" : "outline"}
                      className={cn(
                        "w-12 h-10 transition-all",
                        answers[item.id] === "N"
                          ? "bg-rose-400 hover:bg-rose-500 text-white shadow-md"
                          : "hover:border-rose-300 hover:text-rose-500"
                      )}
                      onClick={() => handleAnswerChange(item.id, "N")}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Notes Section */}
          <Card className="mb-6 shadow-sm border border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg text-slate-800">Notes / Comments</CardTitle>
              <CardDescription>
                Add any additional notes or follow-up items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter any notes, reminders, or follow-up items here..."
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
