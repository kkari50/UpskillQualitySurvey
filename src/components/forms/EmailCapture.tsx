"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useSurveyStore } from "@/stores/survey";
import type { UserRole, AgencySize, PrimarySetting, USState } from "@/lib/validation/survey";

const ROLES: { value: UserRole; label: string }[] = [
  { value: "clinical_director", label: "Clinical Director" },
  { value: "bcba", label: "BCBA" },
  { value: "bcaba", label: "BCaBA" },
  { value: "rbt", label: "RBT/BT" },
  { value: "owner", label: "Owner/Founder" },
  { value: "qa_manager", label: "QA Manager" },
  { value: "consultant", label: "Consultant" },
  { value: "other", label: "Other" },
];

const AGENCY_SIZES: { value: AgencySize; label: string }[] = [
  { value: "solo_small", label: "Small (1-10 BCBAs)" },
  { value: "medium", label: "Medium (11-50 BCBAs)" },
  { value: "large", label: "Large (51-200 BCBAs)" },
  { value: "enterprise", label: "Enterprise (200+ BCBAs)" },
];

const PRIMARY_SETTINGS: { value: PrimarySetting; label: string }[] = [
  { value: "in_home", label: "In-Home Services" },
  { value: "clinic", label: "Center/Clinic-Based" },
  { value: "school", label: "School-Based" },
  { value: "hybrid", label: "Hybrid/Multiple" },
];

const US_STATES: { value: USState; label: string }[] = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "DC", label: "District of Columbia" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];

interface EmailCaptureProps {
  onSubmitStart?: () => void;
  onSubmitEnd?: () => void;
}

export function EmailCapture({ onSubmitStart, onSubmitEnd }: EmailCaptureProps) {
  const router = useRouter();
  const { answers, surveyVersion } = useSurveyStore();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [agencySize, setAgencySize] = useState<AgencySize | "">("");
  const [primarySetting, setPrimarySetting] = useState<PrimarySetting | "">("");
  const [state, setState] = useState<USState | "">("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate all required fields
    if (!email || !name || !role || !agencySize || !primarySetting || !state) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    onSubmitStart?.();

    try {
      const response = await fetch("/api/survey/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          role,
          agencySize,
          primarySetting,
          state,
          marketingConsent: true,
          answers,
          surveyVersion,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error?.message || responseData.error || "Failed to submit survey");
      }

      const resultsToken = responseData.data?.resultsToken || responseData.resultsToken;
      if (!resultsToken) {
        throw new Error("No results token received");
      }

      // Navigate to results first (don't reset here - causes race condition with complete page guard)
      router.push(`/results/${resultsToken}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
      onSubmitEnd?.();
    }
  };

  const selectClassName = "mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  return (
    <Card className="shadow-lg border-0">
      <CardContent className="p-6 md:p-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Get Your Results
        </h2>
        <p className="text-muted-foreground mb-6">
          Enter your email to receive your personalized quality assessment results.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Required: Email */}
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Name field */}
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="Your name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Role field */}
          <div>
            <Label htmlFor="role">Your Role *</Label>
            <select
              id="role"
              required
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole | "")}
              className={selectClassName}
            >
              <option value="">Select your role</option>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Agency Size field */}
          <div>
            <Label htmlFor="agencySize">Agency Size *</Label>
            <select
              id="agencySize"
              required
              value={agencySize}
              onChange={(e) => setAgencySize(e.target.value as AgencySize | "")}
              className={selectClassName}
            >
              <option value="">Select agency size</option>
              {AGENCY_SIZES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Primary Service Setting field */}
          <div>
            <Label htmlFor="primarySetting">Primary Service Setting *</Label>
            <select
              id="primarySetting"
              required
              value={primarySetting}
              onChange={(e) => setPrimarySetting(e.target.value as PrimarySetting | "")}
              className={selectClassName}
            >
              <option value="">Select primary setting</option>
              {PRIMARY_SETTINGS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* State field */}
          <div>
            <Label htmlFor="state">State *</Label>
            <select
              id="state"
              required
              value={state}
              onChange={(e) => setState(e.target.value as USState | "")}
              className={selectClassName}
            >
              <option value="">Select state</option>
              {US_STATES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Calculating your results...
              </>
            ) : (
              "View My Results"
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            We respect your privacy.{" "}
            <a href="/privacy" className="underline hover:text-foreground">
              View our Privacy Policy
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
