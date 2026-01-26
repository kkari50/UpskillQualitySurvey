"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  Pill,
  Brain,
  Home,
  MessageCircle,
  Target,
  ClipboardList,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Header, Footer } from "@/components/layout";
import { ResourceNotice } from "@/components/layout/ResourceNotice";

// Form state interface
interface FormData {
  // Basic Info
  clientName: string;
  date: Date | undefined;
  bcbaName: string;

  // Medical Updates
  medicationChanges: "yes" | "no" | "";
  currentMedications: string;
  recentChanges: string;
  sideEffects: string;
  medicalAppointments: string;
  followUpNeeded: string;

  // Behavioral Updates - New Challenging Behaviors
  newChallengingBehaviors: "yes" | "no" | "";
  newBehaviorDescription: string;
  newBehaviorFrequency: string;
  newBehaviorTimeOfDay: string;
  currentResponseToBehavior: string;

  // Behavioral Updates - Existing Target Behaviors
  frequencyChanges: "increase" | "decrease" | "same" | "";
  behaviorsImproved: string;
  behaviorsWorsened: string;
  specificConcerns: string;

  // Daily Living Skills
  sleepPatterns: string;
  eatingHabits: string;
  toileting: string;
  selfCareRoutines: string;

  // Social/Communication
  communicationAttempts: string;
  socialInteractions: string;
  newWordsPhrases: string;

  // Home Implementation
  whatsWorkingWell: string;
  whatsChallenging: string;
  additionalSupportNeeded: string;

  // Goals and Priorities
  progressOnGoals: string;
  newConcerns: string;
  familyPriorities: string;

  // Additional Notes
  additionalNotes: string;

  // Follow-up Items
  immediateAttention: string;
  nextTeamMeetingTopics: string;
  resourcesRequested: string;

  // Signatures
  parentSignature: string;
  parentSignatureDate: Date | undefined;
  bcbaSignature: string;
  bcbaSignatureDate: Date | undefined;
}

const initialFormData: FormData = {
  clientName: "",
  date: undefined,
  bcbaName: "",
  medicationChanges: "",
  currentMedications: "",
  recentChanges: "",
  sideEffects: "",
  medicalAppointments: "",
  followUpNeeded: "",
  newChallengingBehaviors: "",
  newBehaviorDescription: "",
  newBehaviorFrequency: "",
  newBehaviorTimeOfDay: "",
  currentResponseToBehavior: "",
  frequencyChanges: "",
  behaviorsImproved: "",
  behaviorsWorsened: "",
  specificConcerns: "",
  sleepPatterns: "",
  eatingHabits: "",
  toileting: "",
  selfCareRoutines: "",
  communicationAttempts: "",
  socialInteractions: "",
  newWordsPhrases: "",
  whatsWorkingWell: "",
  whatsChallenging: "",
  additionalSupportNeeded: "",
  progressOnGoals: "",
  newConcerns: "",
  familyPriorities: "",
  additionalNotes: "",
  immediateAttention: "",
  nextTeamMeetingTopics: "",
  resourcesRequested: "",
  parentSignature: "",
  parentSignatureDate: undefined,
  bcbaSignature: "",
  bcbaSignatureDate: undefined,
};

// Section component for consistent styling
function FormSection({
  icon,
  iconColor,
  title,
  children,
}: {
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white", iconColor)}>
            {icon}
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

export default function CaregiverCheckInPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isGenerating, setIsGenerating] = useState(false);

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFormData(initialFormData);
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const [{ pdf }, { CaregiverCheckInPDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/pdf/CaregiverCheckInPDF"),
      ]);

      const formattedDate = formData.date ? format(formData.date, "yyyy-MM-dd") : "";
      const doc = (
        <CaregiverCheckInPDF
          data={{
            ...formData,
            date: formData.date ? format(formData.date, "PPP") : "",
            parentSignatureDate: formData.parentSignatureDate
              ? format(formData.parentSignatureDate, "PPP")
              : "",
            bcbaSignatureDate: formData.bcbaSignatureDate
              ? format(formData.bcbaSignatureDate, "PPP")
              : "",
          }}
        />
      );
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `caregiver-check-in-${formData.clientName || "form"}-${formattedDate || new Date().toISOString().split("T")[0]}.pdf`;
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
                BCBA Monthly Caregiver Check-In Form
              </h1>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 hover:bg-teal-200 text-teal-600 transition-colors"
                    aria-label="About this form"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-96 p-0" align="start">
                  <div className="p-3 border-b bg-teal-50">
                    <p className="text-sm font-semibold text-teal-800">
                      Monthly Caregiver Check-In
                    </p>
                  </div>
                  <div className="p-3">
                    <p className="text-sm text-gray-700 mb-3">
                      A structured form for conducting monthly caregiver check-ins covering medical updates, behavioral changes, daily living skills, and treatment progress.
                    </p>
                    <ul className="space-y-1.5">
                      <li className="text-xs text-gray-600 flex items-start gap-1.5">
                        <span className="text-teal-500 mt-0.5">•</span>
                        <span>Track medication and medical updates</span>
                      </li>
                      <li className="text-xs text-gray-600 flex items-start gap-1.5">
                        <span className="text-teal-500 mt-0.5">•</span>
                        <span>Document behavioral changes and concerns</span>
                      </li>
                      <li className="text-xs text-gray-600 flex items-start gap-1.5">
                        <span className="text-teal-500 mt-0.5">•</span>
                        <span>Review home implementation progress</span>
                      </li>
                      <li className="text-xs text-gray-600 flex items-start gap-1.5">
                        <span className="text-teal-500 mt-0.5">•</span>
                        <span>Set priorities and follow-up items</span>
                      </li>
                    </ul>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <p className="text-gray-600">
              Structured monthly check-in form for caregiver updates and collaboration.
            </p>
          </div>

          {/* Privacy Notice */}
          <ResourceNotice className="mb-6" />

          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Session Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input
                      id="clientName"
                      value={formData.clientName}
                      onChange={(e) => updateField("clientName", e.target.value)}
                      placeholder="Enter client name"
                    />
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.date ? format(formData.date, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.date}
                          onSelect={(date) => updateField("date", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label htmlFor="bcbaName">BCBA</Label>
                    <Input
                      id="bcbaName"
                      value={formData.bcbaName}
                      onChange={(e) => updateField("bcbaName", e.target.value)}
                      placeholder="Enter BCBA name"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medical Updates */}
            <FormSection
              icon={<Pill className="w-4 h-4" />}
              iconColor="bg-red-500"
              title="Medical Updates"
            >
              <div>
                <Label className="text-sm font-medium">
                  Have there been any changes to medications since our last meeting?
                </Label>
                <RadioGroup
                  value={formData.medicationChanges}
                  onValueChange={(value) => updateField("medicationChanges", value as "yes" | "no")}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="med-yes" />
                    <Label htmlFor="med-yes" className="font-normal">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="med-no" />
                    <Label htmlFor="med-no" className="font-normal">No</Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.medicationChanges === "yes" && (
                <div className="space-y-3 pl-4 border-l-2 border-red-200">
                  <div>
                    <Label htmlFor="currentMedications">Current medications and dosages</Label>
                    <Input
                      id="currentMedications"
                      value={formData.currentMedications}
                      onChange={(e) => updateField("currentMedications", e.target.value)}
                      placeholder="List current medications"
                    />
                  </div>
                  <div>
                    <Label htmlFor="recentChanges">Recent changes</Label>
                    <Input
                      id="recentChanges"
                      value={formData.recentChanges}
                      onChange={(e) => updateField("recentChanges", e.target.value)}
                      placeholder="Describe recent changes"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sideEffects">Side effects observed</Label>
                    <Input
                      id="sideEffects"
                      value={formData.sideEffects}
                      onChange={(e) => updateField("sideEffects", e.target.value)}
                      placeholder="Note any side effects"
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="medicalAppointments">
                  Have there been any medical appointments or procedures?
                </Label>
                <Textarea
                  id="medicalAppointments"
                  value={formData.medicalAppointments}
                  onChange={(e) => updateField("medicalAppointments", e.target.value)}
                  placeholder="Details of appointments or procedures..."
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="followUpNeeded">Follow-up needed</Label>
                <Input
                  id="followUpNeeded"
                  value={formData.followUpNeeded}
                  onChange={(e) => updateField("followUpNeeded", e.target.value)}
                  placeholder="Any follow-up required?"
                />
              </div>
            </FormSection>

            {/* Behavioral Updates */}
            <FormSection
              icon={<Brain className="w-4 h-4" />}
              iconColor="bg-purple-500"
              title="Behavioral Updates"
            >
              {/* New Challenging Behaviors */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-800">New Challenging Behaviors</h4>
                <div>
                  <Label className="text-sm">
                    Have you observed any new challenging behaviors?
                  </Label>
                  <RadioGroup
                    value={formData.newChallengingBehaviors}
                    onValueChange={(value) => updateField("newChallengingBehaviors", value as "yes" | "no")}
                    className="flex gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="new-behavior-yes" />
                      <Label htmlFor="new-behavior-yes" className="font-normal">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="new-behavior-no" />
                      <Label htmlFor="new-behavior-no" className="font-normal">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.newChallengingBehaviors === "yes" && (
                  <div className="space-y-3 pl-4 border-l-2 border-purple-200">
                    <div>
                      <Label htmlFor="newBehaviorDescription">Description</Label>
                      <Textarea
                        id="newBehaviorDescription"
                        value={formData.newBehaviorDescription}
                        onChange={(e) => updateField("newBehaviorDescription", e.target.value)}
                        placeholder="Describe the behavior"
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="newBehaviorFrequency">Frequency</Label>
                        <Input
                          id="newBehaviorFrequency"
                          value={formData.newBehaviorFrequency}
                          onChange={(e) => updateField("newBehaviorFrequency", e.target.value)}
                          placeholder="How often?"
                        />
                      </div>
                      <div>
                        <Label htmlFor="newBehaviorTimeOfDay">Time of day/situations</Label>
                        <Input
                          id="newBehaviorTimeOfDay"
                          value={formData.newBehaviorTimeOfDay}
                          onChange={(e) => updateField("newBehaviorTimeOfDay", e.target.value)}
                          placeholder="When does it occur?"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="currentResponseToBehavior">Current response to behavior</Label>
                      <Input
                        id="currentResponseToBehavior"
                        value={formData.currentResponseToBehavior}
                        onChange={(e) => updateField("currentResponseToBehavior", e.target.value)}
                        placeholder="How are you currently responding?"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Existing Target Behaviors */}
              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-medium text-gray-800">Existing Target Behaviors</h4>
                <div>
                  <Label className="text-sm">Have you noticed any changes in frequency?</Label>
                  <RadioGroup
                    value={formData.frequencyChanges}
                    onValueChange={(value) => updateField("frequencyChanges", value as "increase" | "decrease" | "same")}
                    className="flex gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="increase" id="freq-increase" />
                      <Label htmlFor="freq-increase" className="font-normal">Increase</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="decrease" id="freq-decrease" />
                      <Label htmlFor="freq-decrease" className="font-normal">Decrease</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="same" id="freq-same" />
                      <Label htmlFor="freq-same" className="font-normal">Same</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label htmlFor="behaviorsImproved">Which behaviors have improved?</Label>
                  <Input
                    id="behaviorsImproved"
                    value={formData.behaviorsImproved}
                    onChange={(e) => updateField("behaviorsImproved", e.target.value)}
                    placeholder="List improved behaviors"
                  />
                </div>
                <div>
                  <Label htmlFor="behaviorsWorsened">Which behaviors have worsened?</Label>
                  <Input
                    id="behaviorsWorsened"
                    value={formData.behaviorsWorsened}
                    onChange={(e) => updateField("behaviorsWorsened", e.target.value)}
                    placeholder="List worsened behaviors"
                  />
                </div>
                <div>
                  <Label htmlFor="specificConcerns">Specific concerns</Label>
                  <Textarea
                    id="specificConcerns"
                    value={formData.specificConcerns}
                    onChange={(e) => updateField("specificConcerns", e.target.value)}
                    placeholder="Any specific concerns..."
                    rows={2}
                  />
                </div>
              </div>
            </FormSection>

            {/* Daily Living Skills */}
            <FormSection
              icon={<Home className="w-4 h-4" />}
              iconColor="bg-green-500"
              title="Daily Living Skills"
            >
              <p className="text-sm text-gray-600 -mt-2">Changes in:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sleepPatterns">Sleep patterns</Label>
                  <Input
                    id="sleepPatterns"
                    value={formData.sleepPatterns}
                    onChange={(e) => updateField("sleepPatterns", e.target.value)}
                    placeholder="Describe sleep patterns"
                  />
                </div>
                <div>
                  <Label htmlFor="eatingHabits">Eating habits</Label>
                  <Input
                    id="eatingHabits"
                    value={formData.eatingHabits}
                    onChange={(e) => updateField("eatingHabits", e.target.value)}
                    placeholder="Describe eating habits"
                  />
                </div>
                <div>
                  <Label htmlFor="toileting">Toileting</Label>
                  <Input
                    id="toileting"
                    value={formData.toileting}
                    onChange={(e) => updateField("toileting", e.target.value)}
                    placeholder="Describe toileting"
                  />
                </div>
                <div>
                  <Label htmlFor="selfCareRoutines">Self-care routines</Label>
                  <Input
                    id="selfCareRoutines"
                    value={formData.selfCareRoutines}
                    onChange={(e) => updateField("selfCareRoutines", e.target.value)}
                    placeholder="Describe self-care"
                  />
                </div>
              </div>
            </FormSection>

            {/* Social/Communication */}
            <FormSection
              icon={<MessageCircle className="w-4 h-4" />}
              iconColor="bg-blue-500"
              title="Social/Communication"
            >
              <p className="text-sm text-gray-600 -mt-2">Have you noticed any changes in:</p>
              <div>
                <Label htmlFor="communicationAttempts">Communication attempts</Label>
                <Textarea
                  id="communicationAttempts"
                  value={formData.communicationAttempts}
                  onChange={(e) => updateField("communicationAttempts", e.target.value)}
                  placeholder="Describe changes in communication..."
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="socialInteractions">Social interactions</Label>
                <Textarea
                  id="socialInteractions"
                  value={formData.socialInteractions}
                  onChange={(e) => updateField("socialInteractions", e.target.value)}
                  placeholder="Describe changes in social interactions..."
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="newWordsPhrases">New words/phrases used</Label>
                <Input
                  id="newWordsPhrases"
                  value={formData.newWordsPhrases}
                  onChange={(e) => updateField("newWordsPhrases", e.target.value)}
                  placeholder="List new words or phrases"
                />
              </div>
            </FormSection>

            {/* Home Implementation */}
            <FormSection
              icon={<ClipboardList className="w-4 h-4" />}
              iconColor="bg-orange-500"
              title="Home Implementation"
            >
              <p className="text-sm text-gray-600 -mt-2">Current ABA strategies:</p>
              <div>
                <Label htmlFor="whatsWorkingWell">What&apos;s working well?</Label>
                <Textarea
                  id="whatsWorkingWell"
                  value={formData.whatsWorkingWell}
                  onChange={(e) => updateField("whatsWorkingWell", e.target.value)}
                  placeholder="Describe what's working..."
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="whatsChallenging">What&apos;s challenging?</Label>
                <Textarea
                  id="whatsChallenging"
                  value={formData.whatsChallenging}
                  onChange={(e) => updateField("whatsChallenging", e.target.value)}
                  placeholder="Describe challenges..."
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="additionalSupportNeeded">Additional support needed?</Label>
                <Input
                  id="additionalSupportNeeded"
                  value={formData.additionalSupportNeeded}
                  onChange={(e) => updateField("additionalSupportNeeded", e.target.value)}
                  placeholder="What additional support is needed?"
                />
              </div>
            </FormSection>

            {/* Goals and Priorities */}
            <FormSection
              icon={<Target className="w-4 h-4" />}
              iconColor="bg-indigo-500"
              title="Goals and Priorities"
            >
              <div>
                <Label htmlFor="progressOnGoals">Progress on current goals</Label>
                <Textarea
                  id="progressOnGoals"
                  value={formData.progressOnGoals}
                  onChange={(e) => updateField("progressOnGoals", e.target.value)}
                  placeholder="Describe progress..."
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="newConcerns">New concerns to address</Label>
                <Textarea
                  id="newConcerns"
                  value={formData.newConcerns}
                  onChange={(e) => updateField("newConcerns", e.target.value)}
                  placeholder="List new concerns..."
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="familyPriorities">Family priorities for next month</Label>
                <Textarea
                  id="familyPriorities"
                  value={formData.familyPriorities}
                  onChange={(e) => updateField("familyPriorities", e.target.value)}
                  placeholder="List priorities..."
                  rows={2}
                />
              </div>
            </FormSection>

            {/* Additional Notes */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.additionalNotes}
                  onChange={(e) => updateField("additionalNotes", e.target.value)}
                  placeholder="Any additional notes or observations..."
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* Follow-up Items */}
            <FormSection
              icon={<Users className="w-4 h-4" />}
              iconColor="bg-cyan-500"
              title="Follow-up Items"
            >
              <div>
                <Label htmlFor="immediateAttention">Items requiring immediate attention</Label>
                <Textarea
                  id="immediateAttention"
                  value={formData.immediateAttention}
                  onChange={(e) => updateField("immediateAttention", e.target.value)}
                  placeholder="List urgent items..."
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="nextTeamMeetingTopics">Topics for next team meeting</Label>
                <Input
                  id="nextTeamMeetingTopics"
                  value={formData.nextTeamMeetingTopics}
                  onChange={(e) => updateField("nextTeamMeetingTopics", e.target.value)}
                  placeholder="List topics to discuss"
                />
              </div>
              <div>
                <Label htmlFor="resourcesRequested">Resources requested</Label>
                <Input
                  id="resourcesRequested"
                  value={formData.resourcesRequested}
                  onChange={(e) => updateField("resourcesRequested", e.target.value)}
                  placeholder="List requested resources"
                />
              </div>
            </FormSection>

            {/* Signatures */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Signatures</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700">Parent/Caregiver</h4>
                    <div>
                      <Label htmlFor="parentSignature">Signature</Label>
                      <Input
                        id="parentSignature"
                        value={formData.parentSignature}
                        onChange={(e) => updateField("parentSignature", e.target.value)}
                        placeholder="Type name as signature"
                      />
                    </div>
                    <div>
                      <Label>Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.parentSignatureDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.parentSignatureDate
                              ? format(formData.parentSignatureDate, "PPP")
                              : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.parentSignatureDate}
                            onSelect={(date) => updateField("parentSignatureDate", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700">BCBA</h4>
                    <div>
                      <Label htmlFor="bcbaSignature">Signature</Label>
                      <Input
                        id="bcbaSignature"
                        value={formData.bcbaSignature}
                        onChange={(e) => updateField("bcbaSignature", e.target.value)}
                        placeholder="Type name as signature"
                      />
                    </div>
                    <div>
                      <Label>Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.bcbaSignatureDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.bcbaSignatureDate
                              ? format(formData.bcbaSignatureDate, "PPP")
                              : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.bcbaSignatureDate}
                            onSelect={(date) => updateField("bcbaSignatureDate", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
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
      </main>

      <Footer />
    </div>
  );
}
