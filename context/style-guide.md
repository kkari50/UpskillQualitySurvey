# Quick Quality Assessment Survey - Style Guide

**Version:** 1.0
**Last Updated:** January 2026
**Component Library:** shadcn/ui + Radix UI + Tailwind CSS

---

## 1. Design Philosophy

### 1.1 Core Principles
- **Trust-First:** Healthcare context requires professional, credible appearance
- **One Thing at a Time:** Single question per screen reduces cognitive load
- **Prominent Feedback:** Scores displayed large and clear, not hidden
- **Modern & Clean:** Contemporary design with soft colors and smooth transitions
- **Accessible:** WCAG 2.1 AA compliant, mobile-first responsive

### 1.2 Reference Inspiration
- **Brand:** [upskillaba.com](https://upskillaba.com) - teal brand colors, pill buttons
- **UX Pattern:** [immigrant-sentiment-survey.vercel.app](https://immigrant-sentiment-survey.vercel.app) - centered cards, progress indication, trust signals

---

## 2. Component Library: shadcn/ui

### 2.1 Why shadcn/ui
- **Own your code** - components copied into project, fully customizable
- **Radix UI primitives** - accessible, keyboard navigation, focus management built-in
- **Tailwind styling** - consistent with our stack
- **Tree-shakeable** - only include what you need

### 2.2 Installation
```bash
npx shadcn@latest init
```

### 2.3 Required Components
```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add checkbox
npx shadcn@latest add progress
npx shadcn@latest add accordion
npx shadcn@latest add badge
npx shadcn@latest add separator
```

### 2.4 Custom Theme Configuration
Update `tailwind.config.ts` with UpskillABA brand colors (see Section 3).

---

## 3. Color Palette (Modern)

### 3.1 Brand Colors (UpskillABA)

| Token | Hex | CSS Variable | Usage |
|-------|-----|--------------|-------|
| `primary` | `#0D9488` | `--primary` | Buttons, links, focus rings |
| `primary-hover` | `#0F766E` | `--primary-hover` | Hover states |
| `primary-soft` | `#CCFBF1` | `--primary-soft` | Light backgrounds, selected states |
| `primary-muted` | `#99F6E4` | `--primary-muted` | Badges, subtle accents |

> Note: Using Tailwind's `teal-600` (`#0D9488`) as it's the modern equivalent of UpskillABA's `#07887e`

### 3.2 Semantic Colors (Soft & Modern)

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| `success` | `#10B981` | `emerald-500` | Yes responses, high scores |
| `success-soft` | `#D1FAE5` | `emerald-100` | Success backgrounds |
| `warning` | `#F59E0B` | `amber-500` | Moderate scores (60-84%) |
| `warning-soft` | `#FEF3C7` | `amber-100` | Warning backgrounds |
| `attention` | `#FB7185` | `rose-400` | No responses, low scores (<60%) |
| `attention-soft` | `#FFE4E6` | `rose-100` | Attention backgrounds |

> Using `rose-400` instead of dark red - softer, modern, less alarming

### 3.3 Neutral Colors

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| `background` | `#FAFAFA` | `neutral-50` | Page background |
| `surface` | `#FFFFFF` | `white` | Cards, modals |
| `surface-raised` | `#F5F5F5` | `neutral-100` | Elevated sections |
| `border` | `#E5E5E5` | `neutral-200` | Borders, dividers |
| `border-strong` | `#D4D4D4` | `neutral-300` | Emphasized borders |
| `text-primary` | `#171717` | `neutral-900` | Headings |
| `text-secondary` | `#525252` | `neutral-600` | Body text |
| `text-muted` | `#A3A3A3` | `neutral-400` | Placeholders, captions |

### 3.4 Score Threshold Colors

| Performance Level | Score Range | Color | Hex |
|-------------------|-------------|-------|-----|
| Strong Alignment | 85-100% (23-27) | Emerald | `#10B981` |
| Moderate Alignment | 60-84% (16-22) | Amber | `#F59E0B` |
| Needs Improvement | <60% (0-15) | Rose | `#FB7185` |

---

## 4. Typography

### 4.1 Font Stack
```tsx
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})
```

### 4.2 Type Scale

| Element | Size | Weight | Tailwind | Usage |
|---------|------|--------|----------|-------|
| Display | 48px | 700 | `text-5xl font-bold` | Landing hero |
| H1 | 36px | 700 | `text-4xl font-bold` | Page titles |
| H2 | 30px | 600 | `text-3xl font-semibold` | Section headers |
| H3 | 24px | 600 | `text-2xl font-semibold` | Card titles |
| H4 | 20px | 500 | `text-xl font-medium` | Subsections |
| Body Large | 18px | 400 | `text-lg` | Question text |
| Body | 16px | 400 | `text-base` | General content |
| Body Small | 14px | 400 | `text-sm` | Labels, captions |
| Caption | 12px | 500 | `text-xs font-medium` | Badges, tags |

### 4.3 Question Text (Special)
Survey questions use larger, highly readable text:
```tsx
<p className="text-xl md:text-2xl font-medium text-neutral-900 leading-relaxed">
  {questionText}
</p>
```

---

## 5. Spacing & Layout

### 5.1 Spacing Scale
Use Tailwind's default 4px base unit consistently:

| Token | Value | Usage |
|-------|-------|-------|
| `1` | 4px | Tight inline spacing |
| `2` | 8px | Icon gaps, small padding |
| `3` | 12px | Button padding-x |
| `4` | 16px | Standard gaps |
| `6` | 24px | Card padding |
| `8` | 32px | Section spacing |
| `12` | 48px | Large sections |
| `16` | 64px | Page sections |

### 5.2 Container Widths

| Context | Max Width | Tailwind |
|---------|-----------|----------|
| Survey card | 672px | `max-w-2xl` |
| Results page | 896px | `max-w-4xl` |
| Full content | 1152px | `max-w-6xl` |

### 5.3 Standard Layout
```tsx
<main className="min-h-screen bg-neutral-50 py-8 md:py-16 px-4">
  <div className="max-w-2xl mx-auto">
    {/* Content */}
  </div>
</main>
```

---

## 6. Survey Components

### 6.1 Survey Card (Question Container)
```tsx
import { Card, CardContent } from "@/components/ui/card"

<Card className="shadow-lg border-0">
  <CardContent className="p-8 md:p-12">
    {/* Category badge */}
    <Badge variant="secondary" className="mb-6 bg-teal-100 text-teal-700 hover:bg-teal-100">
      Daily Sessions
    </Badge>

    {/* Question */}
    <p className="text-xl md:text-2xl font-medium text-neutral-900 leading-relaxed mb-8">
      {question}
    </p>

    {/* Response buttons */}
    <div className="flex gap-4">
      {/* Yes/No */}
    </div>
  </CardContent>
</Card>
```

### 6.2 Response Buttons (Yes/No)
Large, touch-friendly, with clear selected states:

```tsx
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

// Unselected
<Button
  variant="outline"
  className="flex-1 h-14 text-lg font-semibold border-2 border-neutral-200
    hover:border-teal-300 hover:bg-teal-50 transition-all"
>
  Yes
</Button>

// Selected: Yes
<Button
  className="flex-1 h-14 text-lg font-semibold bg-emerald-500 hover:bg-emerald-600
    text-white border-2 border-emerald-500"
>
  <Check className="w-5 h-5 mr-2" />
  Yes
</Button>

// Selected: No
<Button
  className="flex-1 h-14 text-lg font-semibold bg-rose-400 hover:bg-rose-500
    text-white border-2 border-rose-400"
>
  <X className="w-5 h-5 mr-2" />
  No
</Button>
```

### 6.3 Progress Bar
```tsx
import { Progress } from "@/components/ui/progress"

<div className="mb-8">
  <div className="flex justify-between text-sm text-neutral-500 mb-2">
    <span>Question {current} of {total}</span>
    <span>{percentage}%</span>
  </div>
  <Progress value={percentage} className="h-2" />
</div>
```

### 6.4 Navigation Buttons
```tsx
<div className="flex justify-between mt-8">
  <Button
    variant="ghost"
    disabled={isFirst}
    className="text-neutral-600"
  >
    <ChevronLeft className="w-4 h-4 mr-2" />
    Back
  </Button>

  <Button
    disabled={!hasAnswer}
    className="bg-teal-600 hover:bg-teal-700 text-white px-8"
  >
    {isLast ? 'Submit' : 'Next'}
    <ChevronRight className="w-4 h-4 ml-2" />
  </Button>
</div>
```

### 6.5 Category Transition Screen
Brief interstitial between survey sections:

```tsx
<Card className="text-center p-12">
  <Badge className="mb-4 bg-teal-100 text-teal-700">
    Section {sectionNumber} of 5
  </Badge>
  <h2 className="text-2xl font-bold text-neutral-900 mb-2">
    {categoryName}
  </h2>
  <p className="text-neutral-600 mb-6">
    {questionCount} questions
  </p>
  <Button className="bg-teal-600 hover:bg-teal-700">
    Continue
  </Button>
</Card>
```

### 6.6 Not Applicable (N/A) Pattern for Yes/No Lists

When a Yes/No checklist contains items that may not apply to all users (e.g., "Has the token board ratio been updated (if used)?"), **do not** add a third N/A button inline with the Yes/No buttons. A third button on only some rows creates visual misalignment and breaks the consistent 2-button layout.

**Instead, use a text link below the question text.**

#### 6.6.1 Data Model

Items that support N/A declare it via the `allowNA` flag in the data file:

```typescript
// in *-data.ts
export interface ChecklistItem {
  id: string;
  text: string;
  allowNA?: boolean;       // Enables "Mark as not applicable" link
  conditionalOn?: string;  // Show only if parent answered "Y"
}

{ id: "token_board", text: "Has the token board ratio been updated (if used)?", allowNA: true },
```

#### 6.6.2 Web UI

The N/A action is a subtle text link positioned below the question text. When selected, the Yes/No buttons disable and the question text dims with a strikethrough.

```tsx
<div className="p-4 hover:bg-slate-50 transition-colors">
  {/* Row: question text + Yes/No buttons (always 2-button layout) */}
  <div className="flex items-center justify-between gap-4">
    <span className={cn(
      "text-sm flex-1 leading-relaxed transition-colors",
      isNA ? "text-slate-400 line-through" : "text-slate-700"
    )}>
      {item.text}
    </span>
    <div className="flex gap-2 shrink-0">
      <Button size="sm" disabled={isNA} className={cn(
        "w-12 h-10 transition-all",
        answers[item.id] === "Y"
          ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md"
          : isNA ? "opacity-40 cursor-not-allowed"
          : "hover:border-emerald-300 hover:text-emerald-600"
      )} onClick={() => handleAnswerChange(item.id, "Y")}>
        <Check className="w-4 h-4" />
      </Button>
      <Button size="sm" disabled={isNA} className={cn(
        "w-12 h-10 transition-all",
        answers[item.id] === "N"
          ? "bg-rose-400 hover:bg-rose-500 text-white shadow-md"
          : isNA ? "opacity-40 cursor-not-allowed"
          : "hover:border-rose-300 hover:text-rose-500"
      )} onClick={() => handleAnswerChange(item.id, "N")}>
        <X className="w-4 h-4" />
      </Button>
    </div>
  </div>

  {/* N/A text link — only rendered for allowNA items */}
  {item.allowNA && (
    <button type="button" className={cn(
      "mt-1.5 text-xs transition-colors",
      isNA ? "text-slate-500 font-medium" : "text-slate-400 hover:text-slate-600"
    )} onClick={() => handleAnswerChange(item.id, "NA")}>
      {isNA ? (
        <span className="flex items-center gap-1">
          <Minus className="w-3 h-3" /> Not applicable
          <span className="text-slate-400 font-normal ml-1">(undo)</span>
        </span>
      ) : "Mark as not applicable"}
    </button>
  )}
</div>
```

**Key design rules:**
- Yes/No buttons always remain in the same position (right-aligned, 2-button layout)
- The N/A text link sits below the question text, not in the button row
- Selecting N/A disables + dims the Yes/No buttons (`opacity-40`, `cursor-not-allowed`)
- The question text gets `text-slate-400` and `line-through`
- The link toggles to show "Not applicable (undo)" when active
- Clicking the link again (or the undo text) clears the N/A state

#### 6.6.3 PDF Rendering

N/A items in the PDF must mirror the web's visual treatment to maintain consistency between on-screen and printed output.

```tsx
// Styles for N/A rows in @react-pdf/renderer
itemTextNA: {
  fontSize: 8,
  color: colors.gray,          // Dimmed text
  lineHeight: 1.3,
  fontStyle: "italic",
  textDecoration: "line-through",
},
naLabel: {
  fontSize: 7,
  color: colors.gray,
  fontStyle: "italic",
},
tableRowNA: {
  backgroundColor: "#F8FAFC",  // Subtle differentiation
},
```

**PDF N/A row treatment:**
- Text: dimmed (`gray`), italic, strikethrough
- "Not applicable" label below the item text (visible even in grayscale print)
- Row number dims to `grayLight`
- Checkbox shows gray box with "—" symbol
- Row background: `#F8FAFC` to visually separate from answered items

#### 6.6.4 When to Use This Pattern

| Scenario | Approach |
|----------|----------|
| Item says "(if used)" or "(if applicable)" | Add `allowNA: true` to the data item |
| All users must answer | Standard Yes/No only (no `allowNA`) |
| Conditional follow-up (e.g., "If yes above...") | Use `conditionalOn` to hide/show the row instead |

> **Reference:** See DES-009 in `context/decisions.md` for the full decision rationale and alternatives considered.

---

## 7. Results Components

### 7.1 Overall Score Display (Circular Progress Ring)
The score is the hero of the results page, displayed as a large circular progress ring matching the category breakdown style:

```tsx
// HeroCircularProgress component - larger version for overall score
function HeroCircularProgress({ percentage, strokeColor }) {
  const size = 144; // 144px diameter
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle cx={size/2} cy={size/2} r={radius} fill="none"
          strokeWidth={strokeWidth} className="stroke-slate-100" />
        {/* Progress circle */}
        <circle cx={size/2} cy={size/2} r={radius} fill="none"
          strokeWidth={strokeWidth} strokeLinecap="round"
          className={cn("transition-all duration-700 ease-out", strokeColor)}
          style={{ strokeDasharray: circumference, strokeDashoffset: offset }} />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-4xl font-bold text-foreground">{percentage}%</span>
      </div>
    </div>
  );
}

// Stroke colors per Section 3.4
const strokeColors = {
  emerald: "stroke-emerald-500", // Strong (85%+)
  amber: "stroke-amber-500",     // Moderate (60-84%)
  rose: "stroke-rose-400",       // Needs Improvement (<60%)
};
```

**Specifications:**
- Size: 144px diameter (larger than category rings at 80px)
- Stroke width: 10px
- Animation: 700ms ease-out transition
- Center text: 4xl font bold

### 7.2 Category Breakdown (Circular Progress)

Category scores use circular progress rings (donut charts) for a modern, clean visualization. Colors follow the score threshold colors from Section 3.4.

```tsx
// CircularProgress component with score-based coloring
function CircularProgress({ percentage, size = 80, strokeWidth = 8 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  // Color based on score per Section 3.4
  const getStrokeColor = () => {
    if (percentage >= 85) return "stroke-emerald-500"; // Strong
    if (percentage >= 60) return "stroke-amber-500";   // Moderate
    return "stroke-rose-400";                          // Needs Improvement
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none"
          stroke="currentColor" strokeWidth={strokeWidth}
          className="text-slate-100" />
        <circle cx={size/2} cy={size/2} r={radius} fill="none"
          strokeWidth={strokeWidth} strokeLinecap="round"
          className={cn("transition-all duration-700", getStrokeColor())}
          style={{ strokeDasharray: circumference, strokeDashoffset: offset }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold">{percentage}%</span>
      </div>
    </div>
  );
}

// Badge colors use soft backgrounds (Section 3.2)
const levelConfig = {
  strong: { badge: "Strong", bgColor: "bg-emerald-100 text-emerald-700" },
  moderate: { badge: "Moderate", bgColor: "bg-amber-100 text-amber-700" },
  "needs-improvement": { badge: "Focus Area", bgColor: "bg-rose-100 text-rose-600" },
};
```

**Layout:** 5-column grid on desktop (lg:grid-cols-5), 3 on tablet, 2 on mobile.

### 7.2.1 Category Score Cards (Alternative - Bar Style)
```tsx
<Card className={`border-l-4 ${borderColorClass}`}>
  <CardContent className="p-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-semibold text-neutral-900">{categoryName}</h3>
      <div className="text-right">
        <span className={`text-3xl font-bold ${textColorClass}`}>{score}</span>
        <span className="text-lg text-neutral-400">/{maxScore}</span>
      </div>
    </div>

    <Progress value={(score / maxScore) * 100} className="h-2" />
  </CardContent>
</Card>
```

### 7.3 Detailed Breakdown (Accordion)
```tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

<Accordion type="multiple">
  {categories.map((category) => (
    <AccordionItem key={category.id} value={category.id}>
      <AccordionTrigger className="text-lg font-semibold">
        {category.name}
        <Badge className="ml-2">{category.score}/{category.maxScore}</Badge>
      </AccordionTrigger>
      <AccordionContent>
        <ul className="space-y-3">
          {category.questions.map((q) => (
            <li key={q.id} className="flex items-start gap-3">
              {q.answer ? (
                <Check className="w-5 h-5 text-emerald-500 mt-0.5" />
              ) : (
                <X className="w-5 h-5 text-rose-400 mt-0.5" />
              )}
              <span className={q.answer ? 'text-neutral-700' : 'text-neutral-900 font-medium'}>
                {q.text}
              </span>
            </li>
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  ))}
</Accordion>
```

### 7.4 Premium Upsell Card
```tsx
<Card className="bg-gradient-to-br from-teal-600 to-teal-700 text-white border-0">
  <CardContent className="p-6">
    <div className="flex items-center gap-2 mb-3">
      <Lock className="w-5 h-5" />
      <span className="font-semibold">Premium Resources</span>
    </div>

    <h3 className="text-xl font-bold mb-2">
      Unlock Improvement Action Plans
    </h3>

    <p className="text-teal-100 mb-4">
      Get detailed templates, checklists, and implementation guides for each area.
    </p>

    <Button className="w-full bg-white text-teal-700 hover:bg-teal-50 font-semibold">
      Unlock Resources — $49
    </Button>
  </CardContent>
</Card>
```

---

## 8. Form Components

### 8.1 Email Capture Form
```tsx
<Card className="shadow-lg border-0">
  <CardContent className="p-8">
    <h2 className="text-2xl font-bold text-neutral-900 mb-2">
      See Your Results
    </h2>
    <p className="text-neutral-600 mb-6">
      Enter your email to view your quality assessment scores.
    </p>

    <form className="space-y-4">
      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@company.com"
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="name">Name (optional)</Label>
        <Input id="name" placeholder="Your name" className="mt-1" />
      </div>

      <div>
        <Label htmlFor="org">Organization (optional)</Label>
        <Input id="org" placeholder="Your agency" className="mt-1" />
      </div>

      <div className="flex items-start gap-3">
        <Checkbox id="consent" />
        <Label htmlFor="consent" className="text-sm text-neutral-600 font-normal">
          I agree to receive quality improvement tips and resources from UpskillABA
        </Label>
      </div>

      <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 h-12 text-lg">
        View My Results
      </Button>

      <p className="text-xs text-neutral-500 text-center">
        By continuing, you agree to our{' '}
        <a href="/privacy" className="underline">Privacy Policy</a>
      </p>
    </form>
  </CardContent>
</Card>
```

---

## 9. Landing Page Components

### 9.1 Trust Signals
```tsx
<div className="grid grid-cols-3 gap-4 mb-8">
  <div className="text-center p-4">
    <p className="text-3xl font-bold text-neutral-900">27</p>
    <p className="text-sm text-neutral-600">Questions</p>
  </div>
  <div className="text-center p-4 border-x border-neutral-200">
    <p className="text-3xl font-bold text-neutral-900">~5</p>
    <p className="text-sm text-neutral-600">Minutes</p>
  </div>
  <div className="text-center p-4">
    <p className="text-3xl font-bold text-neutral-900">5</p>
    <p className="text-sm text-neutral-600">Categories</p>
  </div>
</div>
```

### 9.2 Privacy Badge
```tsx
<div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full">
  <Shield className="w-4 h-4" />
  <span className="text-sm font-medium">Your responses are confidential</span>
</div>
```

### 9.3 CTA Buttons (Landing)
```tsx
<div className="flex flex-col sm:flex-row gap-4 justify-center">
  <Button size="lg" className="bg-teal-600 hover:bg-teal-700 h-12 px-8 text-lg">
    Take the Assessment
  </Button>
  <Button size="lg" variant="outline" className="h-12 px-8 text-lg border-2">
    Learn More
  </Button>
</div>
```

---

## 10. Animations & Transitions

### 10.1 Standard Transitions
```tsx
// Button/interactive hover
"transition-colors duration-200"

// Card hover lift
"transition-all duration-200 hover:shadow-lg"

// Progress bar fill
"transition-all duration-700 ease-out"
```

### 10.2 Question Slide Animation (Framer Motion)
```tsx
import { motion, AnimatePresence } from 'framer-motion'

<AnimatePresence mode="wait">
  <motion.div
    key={questionIndex}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.25, ease: "easeInOut" }}
  >
    {/* Question card */}
  </motion.div>
</AnimatePresence>
```

### 10.3 Score Counter Animation
```tsx
// Use framer-motion's animate or a counter library
<motion.span
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.2 }}
>
  {score}
</motion.span>
```

---

## 11. Responsive Design (Mobile-First)

**IMPORTANT: All development must be mobile-first. Design for mobile, then scale up.**

### 11.1 Breakpoints
| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| Default | 0px | Mobile portrait (START HERE) |
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |

### 11.2 Mobile-First Patterns
```tsx
// Text scaling (mobile size first, then larger)
"text-xl md:text-2xl lg:text-3xl"

// Padding scaling (compact on mobile, spacious on desktop)
"p-4 md:p-6 lg:p-8 xl:p-12"

// Stack to row (vertical on mobile, horizontal on larger)
"flex flex-col sm:flex-row"

// Full width to auto (full width mobile, auto on larger)
"w-full sm:w-auto"

// Grid columns (1 col mobile, 2 tablet, 3 desktop)
"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// Hide on mobile, show on larger
"hidden md:block"

// Show on mobile, hide on larger
"md:hidden"
```

### 11.3 Touch-Friendly Requirements
- **Minimum tap target:** 44x44px (use `min-h-11 min-w-11`)
- **Response buttons:** 56px height (`h-14`)
- **Form inputs:** 48px height (`h-12`)
- **Button spacing:** At least 8px gap between adjacent buttons
- **Scroll areas:** Avoid horizontal scroll on mobile

### 11.4 Mobile-Specific Patterns
```tsx
// Bottom sheet modal on mobile, centered on desktop
"fixed inset-x-0 bottom-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2"

// Sticky footer nav on mobile
"fixed bottom-0 inset-x-0 md:relative md:bottom-auto"

// Safe area padding for notched devices
"pb-safe-area-inset-bottom"

// Single column on mobile, multi-column on desktop
<div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
```

### 11.5 Survey-Specific Mobile Patterns
```tsx
// Question card - compact on mobile
<Card className="shadow-lg border-0 mx-2 md:mx-0">
  <CardContent className="p-4 md:p-8 lg:p-12">
    {/* ... */}
  </CardContent>
</Card>

// Response buttons - stack on small mobile, side by side otherwise
<div className="flex flex-col xs:flex-row gap-3 md:gap-4">
  <Button className="flex-1 h-12 md:h-14">Yes</Button>
  <Button className="flex-1 h-12 md:h-14">No</Button>
</div>

// Progress indicator - simplified on mobile
<div className="text-sm md:text-base">
  <span className="md:hidden">{current}/{total}</span>
  <span className="hidden md:inline">Question {current} of {total}</span>
</div>
```

### 11.6 Results Page Mobile Patterns
```tsx
// Score display - smaller on mobile
<span className="text-5xl md:text-7xl lg:text-8xl font-bold">
  {score}
</span>

// Category cards - single column on mobile
<div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 lg:gap-6">
  {/* Category cards */}
</div>
```

### 11.7 Testing Requirements
- Test on real devices (iPhone SE, standard iPhone, iPad, Android)
- Test in Chrome DevTools with throttled CPU and network
- Verify touch targets with "Show touch areas" in DevTools
- Test landscape orientation on mobile
- Test with system font size increased (accessibility)

---

## 12. Accessibility

### 12.1 Focus States
All interactive elements use visible focus rings:
```tsx
"focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
```

### 12.2 Color Contrast
- All text meets WCAG AA (4.5:1 minimum)
- Using soft colors for backgrounds, stronger colors for text/icons
- Never rely on color alone - icons accompany status colors

### 12.3 Touch Targets
- Minimum 44x44px for all interactive elements
- Response buttons are 56px (h-14) tall
- Adequate spacing between targets

### 12.4 Keyboard Navigation
- Full Tab/Shift+Tab support
- Enter to select/submit
- Arrow keys for survey navigation (optional enhancement)
- Escape to close modals

### 12.5 Screen Reader Support
```tsx
<Progress value={70} aria-label="Survey progress: 70% complete" />
<Button aria-label="Go to next question">Next</Button>
```

---

## 13. Icons

Use [Lucide React](https://lucide.dev/) for consistent, modern icons:

```bash
npm install lucide-react
```

### 13.1 Common Icons
| Icon | Component | Usage |
|------|-----------|-------|
| Check | `<Check />` | Yes responses, success |
| X | `<X />` | No responses, close |
| ChevronLeft | `<ChevronLeft />` | Back navigation |
| ChevronRight | `<ChevronRight />` | Forward navigation |
| Lock | `<Lock />` | Premium content |
| Download | `<Download />` | PDF export |
| Mail | `<Mail />` | Email |
| Shield | `<Shield />` | Privacy/security |
| BarChart3 | `<BarChart3 />` | Results |

### 13.2 Icon Sizing
```tsx
// Inline with text
<Check className="w-4 h-4" />

// In buttons
<Check className="w-5 h-5" />

// Feature icons
<Check className="w-6 h-6" />
```

---

## 14. File Organization

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── progress.tsx
│   │   ├── badge.tsx
│   │   ├── accordion.tsx
│   │   └── checkbox.tsx
│   ├── survey/                # Survey-specific
│   │   ├── QuestionCard.tsx
│   │   ├── ResponseButtons.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── NavigationButtons.tsx
│   │   └── CategoryTransition.tsx
│   ├── results/               # Results page
│   │   ├── OverallScore.tsx
│   │   ├── CategoryScoreCard.tsx
│   │   ├── DetailedBreakdown.tsx
│   │   └── PremiumUpsell.tsx
│   ├── forms/                 # Form components
│   │   └── EmailCapture.tsx
│   └── layout/                # Layout
│       ├── Header.tsx
│       └── Footer.tsx
├── lib/
│   └── utils.ts               # shadcn cn() utility
└── styles/
    └── globals.css            # Tailwind + custom CSS vars
```

---

## 15. CSS Custom Properties

Add to `globals.css` for shadcn/ui theming:

```css
@layer base {
  :root {
    --background: 0 0% 98%;
    --foreground: 0 0% 9%;

    --primary: 168 76% 36%;        /* teal-600 */
    --primary-foreground: 0 0% 100%;

    --secondary: 166 76% 94%;      /* teal-100 */
    --secondary-foreground: 168 76% 36%;

    --muted: 0 0% 96%;
    --muted-foreground: 0 0% 45%;

    --accent: 166 76% 94%;
    --accent-foreground: 168 76% 36%;

    --destructive: 350 89% 60%;    /* rose-400 */
    --destructive-foreground: 0 0% 100%;

    --border: 0 0% 90%;
    --input: 0 0% 90%;
    --ring: 168 76% 36%;

    --radius: 0.75rem;
  }
}
```
