# Quick Quality Assessment Survey - Content

**Last Updated:** January 2026

This document contains all copywriting and content for the application.

---

## Landing Page

### Hero Section

**Headline:**
> How Strong Is Your ABA Quality Infrastructure?

**Subheadline:**
> Take our free 5-minute assessment and see how your practices compare to industry benchmarks.

**Supporting Text:**
> 27 research-backed questions across 5 critical areas. Get instant results with actionable insights.

**Primary CTA:**
> Start Free Assessment

**Secondary CTA (if needed):**
> See Sample Results

---

### Trust Signals

**Assessment Stats:**
- 27 Questions
- ~5 Minutes
- 5 Categories
- Free Forever

**Privacy Badge:**
> Your data is encrypted and never shared. We use your email only to send your results.

---

### Category Preview (Optional Section)

**Section Headline:**
> What We Measure

**Categories:**

1. **Daily Sessions**
   - Trial implementation, materials prep, and session organization

2. **Treatment Fidelity**
   - Protocol adherence, BST implementation, and behavior plan fidelity

3. **Data Analysis**
   - Data review cadence, intervention effectiveness, and goal monitoring

4. **Caregiver Guidance**
   - Caregiver involvement, communication, and satisfaction

5. **Supervision**
   - Supervision structure, frequency, and clinical alignment

---

### How It Works (Optional Section)

**Section Headline:**
> Simple. Fast. Insightful.

**Steps:**

1. **Answer 27 Questions**
   - Simple Yes/No format. No complex scales or ambiguous options.

2. **Get Your Score**
   - Instant results showing your overall alignment and per-category breakdown.

3. **Compare to Peers**
   - See how you stack up against other ABA providers in our database.

---

### Social Proof (Optional - Future)

**Section Headline:**
> Trusted by ABA Providers

**Placeholder Testimonials:**
> "Finally, a quick way to benchmark our quality practices."
> — BCBA, Midwest Agency

> "The category breakdown helped us identify exactly where to focus."
> — Clinical Director, Southeast

---

## Survey Interface

### Progress Indicator
- "Question {n} of 27"
- "Category: {Category Name}"

### Category Transition Messages

**Daily Sessions → Treatment Fidelity:**
> Great progress! Now let's look at Treatment Fidelity.

**Treatment Fidelity → Data Analysis:**
> Moving on to Data Analysis practices.

**Data Analysis → Caregiver Guidance:**
> Now let's assess your Caregiver Guidance.

**Caregiver Guidance → Supervision:**
> Almost there! Final section: Supervision.

---

### Response Buttons
- **Yes** - Indicates the practice is consistently in place
- **No** - Indicates the practice is not consistently in place

### Navigation
- Back (previous question)
- Next (if answered) / Skip (if not answered - consider removing for data integrity)

---

## Email Capture

### Form Headline
> Get Your Results

### Form Subtext
> Enter your email to receive your personalized quality assessment results.

### Fields
- **Email** (required)
- **Name** (optional) - "Your name (optional)"
- **Role** (optional dropdown):
  | Value | Display Label |
  |-------|---------------|
  | `clinical_director` | Clinical Director |
  | `bcba` | BCBA |
  | `bcaba` | BCaBA |
  | `rbt` | RBT/BT |
  | `owner` | Owner/Founder |
  | `qa_manager` | QA Manager |
  | `consultant` | Consultant |
  | `other` | Other |

### Marketing Consent
> [ ] I'd like to receive occasional tips and resources on ABA quality improvement

### Privacy Note
> We respect your privacy. [View our Privacy Policy](#)

### Submit Button
> View My Results

---

## Results Dashboard

### Overall Score Section

**Headline:**
> Your Quality Score

**Score Display:**
> {score}/{max} ({percentage}%)

**Performance Labels:**
- **Strong Alignment** (90%+): "Excellent! Your quality infrastructure is well-established."
- **Moderate Alignment** (70-89%): "Good foundation with room for targeted improvements."
- **Needs Improvement** (<70%): "Opportunity to strengthen your quality practices."

---

### Population Comparison

**Section Headline:**
> How You Compare

**Comparison Text:**
> Your score is higher than {percentile}% of respondents.

**Average Display:**
> Population Average: {avg}%

**Insufficient Data Message (< 10 responses):**
> Comparison data will be available once we have more responses. Check back soon!

---

### Category Breakdown

**Section Headline:**
> Performance by Category

**Category Card Format:**
- Category Name
- Score: {score}/{max}
- Visual bar or chart
- Performance indicator (Strong/Moderate/Needs Improvement)

---

### Detailed Breakdown (Expandable)

**Section Headline:**
> Question-by-Question Results

**Question Row Format:**
- Question text
- Your answer (Yes/No)
- Population: {percentage}% answered Yes

---

### Call to Action

**Primary CTA:**
> Ready to improve? Schedule a consultation with our quality experts.

**Secondary Actions:**
- Share Results (copy URL)
- Retake Assessment
- Download PDF (V2)

---

## Footer

### Links
- Privacy Policy
- Terms of Service
- Contact Us

### Branding
> Powered by UpskillABA

### Copyright
> © 2026 UpskillABA. All rights reserved.

---

## Error States

### Form Validation
- **Invalid email:** "Please enter a valid email address"
- **Required field:** "This field is required"

### API Errors
- **Rate limited:** "Too many requests. Please try again in a few minutes."
- **Server error:** "Something went wrong. Please try again."
- **Network error:** "Unable to connect. Please check your internet connection."

### Results Not Found
- **Invalid token:** "Results not found. This link may be invalid or expired."

---

## Loading States

### Survey Submission
> Calculating your results...

### Results Loading
> Loading your assessment...

### Stats Loading
> Fetching comparison data...

---

## Email Templates (V2)

### Results Email

**Subject:** Your Quick Quality Assessment Results

**Body:**
```
Hi {name},

Thank you for completing the Quick Quality Assessment!

Your Score: {score}/{max} ({percentage}%)
Performance Level: {level}

View your full results and category breakdown:
{results_url}

[View Full Results Button]

Best regards,
The UpskillABA Team
```

---

## Meta Tags / SEO

### Title
> Quick Quality Assessment | UpskillABA

### Description
> Free 5-minute assessment for ABA agencies. Evaluate your quality practices across 27 research-backed questions and compare to industry benchmarks.

### Keywords (if applicable)
> ABA quality assessment, BCBA benchmarks, ABA provider evaluation, behavior analysis quality, treatment fidelity assessment

---

## Notes for Content Updates

1. All copy should be professional but approachable
2. Avoid jargon unless speaking to BCBA audience specifically
3. Emphasize "quick" and "free" - low commitment
4. Focus on actionable insights, not just scores
5. Privacy and data security messaging is important for healthcare-adjacent audience
