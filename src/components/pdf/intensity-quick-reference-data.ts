/**
 * Intensity Quick Reference - Shared Data
 *
 * Types and constants shared between the page and PDF component.
 * Extracted to avoid loading @react-pdf/renderer when only types/data are needed.
 *
 * Content sourced from: Intensity_Quick_Reference.docx
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Step {
  number: number;
  title: string;
  description: string;
  bullets: string[];
  tip?: string;
}

export interface DoAndDont {
  dont: string;
  do_: string;
}

export interface IntensityLevel {
  level: number;
  example: string;
}

export interface BehaviorExample {
  id: string;
  behaviorName: string;
  definition: string;
  levels: IntensityLevel[];
}

export interface IntensityColorEntry {
  range: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  pdfColor: string;
}

// ---------------------------------------------------------------------------
// Steps (6)
// ---------------------------------------------------------------------------

export const STEPS: Step[] = [
  {
    number: 1,
    title: "Define the Target Behavior",
    description:
      "Write an objective, observable definition of the behavior you want to measure.",
    bullets: [
      "Include physical descriptors (what it looks like)",
      'Avoid vague terms: "angry behavior"',
      'Use specifics: "elevated voice volume + verbal insults"',
    ],
  },
  {
    number: 2,
    title: "Identify Severity Dimensions",
    description:
      "Determine what makes the behavior mild vs. moderate vs. serious.",
    bullets: [
      "Injury risk",
      "Environmental disruption",
      "Staff effort required",
      "Responsiveness to directives",
      "Safety context",
    ],
  },
  {
    number: 3,
    title: "Build a 0\u20137 Scale",
    description:
      "Anchor your scale with clear examples at each level.",
    bullets: [
      "0 = No behavior",
      "1\u20132 = Mild (minor disruption, minimal injury risk)",
      "3\u20135 = Moderate (some disruption, potential injury)",
      "6\u20137 = Serious (major disruption, high injury risk)",
      "Include examples for each level",
    ],
  },
  {
    number: 4,
    title: "Pilot Test",
    description:
      "Score the behavior during an inter-observer agreement (IOA) session.",
    bullets: [
      "Target: \u226580% agreement within \u00B11 point",
      "Low agreement? Revise ambiguous definitions",
    ],
  },
  {
    number: 5,
    title: "Train All Raters",
    description:
      "Ensure every person scoring the behavior understands the scale.",
    bullets: [
      "Review behavior definition",
      "Explain severity dimensions",
      "Walk through each scale level",
      "Conduct IOA sessions",
      "Discuss discrepancies",
      "Provide one-page job aids",
    ],
  },
  {
    number: 6,
    title: "Monitor & Recalibrate",
    description:
      "Keep the scale reliable over time with ongoing checks.",
    bullets: [
      "Monthly: conduct at least 2 IOA sessions with each tech",
      "Target: \u226580% agreement",
      "If agreement drops: review definitions, conduct mini-retraining, revise scale if needed",
    ],
  },
];

// ---------------------------------------------------------------------------
// Do's and Don'ts (6 rows)
// ---------------------------------------------------------------------------

export const DOS_AND_DONTS: DoAndDont[] = [
  {
    dont: "Subjective language (\u2018angry,\u2019 \u2018very loud\u2019)",
    do_: "Objective criteria (\u2018voice >80 dB,\u2019 \u2018insults directed at person\u2019)",
  },
  {
    dont: "One scale for 5 different behaviors",
    do_: "Separate intensity scale for each behavior",
  },
  {
    dont: "Overlapping definitions (levels 2 & 3 are the same)",
    do_: "Each level meaningfully distinct from adjacent levels",
  },
  {
    dont: "Handing out scale with no training",
    do_: "Structured group training with video practice",
  },
  {
    dont: "Never checking if raters agree",
    do_: "Monthly agreement monitoring (\u226580% target)",
  },
  {
    dont: "Scoring based on frequency or duration alone",
    do_: "Score intensity, frequency, & duration separately",
  },
];

// ---------------------------------------------------------------------------
// Behavior-Specific Intensity Examples (5 behaviors, 8 levels each)
// ---------------------------------------------------------------------------

export const BEHAVIOR_EXAMPLES: BehaviorExample[] = [
  {
    id: "aggression",
    behaviorName: "Physical Aggression (Hitting/Pushing)",
    definition:
      "Striking, pushing, kicking, or physically attacking another person.",
    levels: [
      { level: 0, example: "No aggression. Client works cooperatively." },
      {
        level: 1,
        example: "Swinging motion toward staff with no contact.",
      },
      {
        level: 2,
        example: "Gentle push on arm or chest. No injury. Easily redirected.",
      },
      {
        level: 3,
        example: "Light hit on arm or leg with no bruising. Staff redirects.",
      },
      {
        level: 4,
        example:
          "Moderate hit with visible redness. Minor force. Staff steps back.",
      },
      {
        level: 5,
        example:
          "Punch causing pain, visible redness, or minor bruising. Staff requires safety distance.",
      },
      {
        level: 6,
        example:
          "Repeated punching causing visible bruising. Staff needs assistance.",
      },
      {
        level: 7,
        example:
          "Full assault with repeated punching/kicking, high injury risk. Crisis intervention required.",
      },
    ],
  },
  {
    id: "sib",
    behaviorName: "Self-Injurious Behavior (SIB)",
    definition:
      "Hitting self, head-banging, biting, scratching that causes tissue damage.",
    levels: [
      { level: 0, example: "No self-injury. Appropriate behavior." },
      {
        level: 1,
        example: "Gentle skin picking. No visible marks. Stops with redirect.",
      },
      {
        level: 2,
        example:
          "Scratching causing minor surface marks but no bleeding.",
      },
      {
        level: 3,
        example:
          "Light head-banging or self-biting. Visible redness. Brief episode.",
      },
      {
        level: 4,
        example:
          "Moderate head/body hitting with visible redness. Behavior continues 30+ seconds.",
      },
      {
        level: 5,
        example:
          "Repetitive head-banging leaving bruises. Pulls hair in chunks. 1+ minute duration.",
      },
      {
        level: 6,
        example:
          "Intense head-banging causing visible bruising/lacerations. Requires staff blocking.",
      },
      {
        level: 7,
        example:
          "Crisis-level self-injury: severe head-banging, intense scratching with bleeding, risk of fracture. Requires crisis intervention.",
      },
    ],
  },
  {
    id: "property-destruction",
    behaviorName: "Property Destruction",
    definition:
      "Intentional damage to objects, furniture, walls, or property.",
    levels: [
      {
        level: 0,
        example: "No destruction. Handles materials appropriately.",
      },
      {
        level: 1,
        example:
          "Slightly forceful closing of book or setting down toy. No damage.",
      },
      {
        level: 2,
        example:
          "Rips a page from workbook or throws pencil. No major damage.",
      },
      {
        level: 3,
        example:
          "Crumples and tears several pages. Throws toy hard enough to hit wall.",
      },
      {
        level: 4,
        example:
          "Sweeps materials off desk (20\u201330 items). Breaks small object like pencil.",
      },
      {
        level: 5,
        example:
          "Punches furniture hard enough to dent. Creates visible damage.",
      },
      {
        level: 6,
        example:
          "Overturns chair/table, puts hole in wall. Creates moderate property damage.",
      },
      {
        level: 7,
        example:
          "Massive destruction: throwing/breaking multiple items, tipping furniture, safety hazard. Requires emergency response.",
      },
    ],
  },
  {
    id: "noncompliance",
    behaviorName: "Noncompliance",
    definition: "Failure or refusal to follow staff instructions.",
    levels: [
      {
        level: 0,
        example: "Complies with instructions immediately.",
      },
      {
        level: 1,
        example: "Hesitates 5\u201310 seconds before complying.",
      },
      {
        level: 2,
        example:
          "Does not respond to first instruction. Complies after repetition.",
      },
      {
        level: 3,
        example: "Requires 3\u20134 verbal prompts. Takes 1\u20132 minutes.",
      },
      {
        level: 4,
        example:
          "Refuses and requires physical guidance. Compliance delayed 5+ minutes.",
      },
      {
        level: 5,
        example:
          "Active refusal (says \u2018no\u2019). Requires repeated commands and physical redirection.",
      },
      {
        level: 6,
        example:
          "Total refusal. Moves to avoid staff. Significant disruption.",
      },
      {
        level: 7,
        example:
          "Complete refusal with aggressive/destructive behavior to avoid compliance. Crisis intervention required.",
      },
    ],
  },
  {
    id: "tantrums",
    behaviorName: "Tantrums/Crying",
    definition: "Loud crying, screaming, yelling, or emotional outbursts.",
    levels: [
      {
        level: 0,
        example: "No crying or tantrum. Calm engagement.",
      },
      {
        level: 1,
        example: "Quiet whining or complaining. Does not escalate.",
      },
      {
        level: 2,
        example:
          "Loud whining or crying for 20\u201330 seconds. Can continue work or redirect.",
      },
      {
        level: 3,
        example:
          "Crying with sobbing for 1\u20132 minutes. Head on table. Redirectable with support.",
      },
      {
        level: 4,
        example:
          "Screaming and yelling while crying. Lying on floor. 2\u20135 minutes duration.",
      },
      {
        level: 5,
        example:
          "Full tantrum: screaming, thrashing, kicking for 5\u201310+ minutes. Requires staff wait-out.",
      },
      {
        level: 6,
        example:
          "Severe tantrum: high-pitched screaming, violent thrashing. 10+ minutes. Disrupts entire environment.",
      },
      {
        level: 7,
        example:
          "Crisis tantrum: extreme screaming, uncontrollable thrashing, risk of self/other injury. Requires crisis team or emergency response.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Intensity color map (levels 0–7)
// ---------------------------------------------------------------------------

export const INTENSITY_COLOR_MAP: Record<number, IntensityColorEntry> = {
  0: {
    range: "None",
    bgClass: "bg-green-50",
    textClass: "text-green-800",
    borderClass: "border-green-200",
    pdfColor: "#dcfce7",
  },
  1: {
    range: "Mild",
    bgClass: "bg-green-100",
    textClass: "text-green-800",
    borderClass: "border-green-200",
    pdfColor: "#bbf7d0",
  },
  2: {
    range: "Mild",
    bgClass: "bg-lime-50",
    textClass: "text-lime-800",
    borderClass: "border-lime-200",
    pdfColor: "#ecfccb",
  },
  3: {
    range: "Moderate",
    bgClass: "bg-yellow-50",
    textClass: "text-yellow-800",
    borderClass: "border-yellow-200",
    pdfColor: "#fef9c3",
  },
  4: {
    range: "Moderate",
    bgClass: "bg-amber-50",
    textClass: "text-amber-800",
    borderClass: "border-amber-200",
    pdfColor: "#fef3c7",
  },
  5: {
    range: "Moderate",
    bgClass: "bg-orange-50",
    textClass: "text-orange-800",
    borderClass: "border-orange-200",
    pdfColor: "#ffedd5",
  },
  6: {
    range: "Serious",
    bgClass: "bg-red-50",
    textClass: "text-red-800",
    borderClass: "border-red-200",
    pdfColor: "#fee2e2",
  },
  7: {
    range: "Serious",
    bgClass: "bg-red-100",
    textClass: "text-red-900",
    borderClass: "border-red-300",
    pdfColor: "#fecaca",
  },
};
