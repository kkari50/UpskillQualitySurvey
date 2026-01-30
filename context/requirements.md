# Quick Quality Assessment Survey - Business Requirements

**Version:** 2.1
**Date:** January 2026
**Owner:** Upskill ABA
**Status:** Approved

> **Note:** This document contains business requirements only. For technical details, see:
> - `architecture.md` - Tech stack, database schema, phases
> - `style-guide.md` - UI/UX specifications
> - `api-design.md` - API endpoints and contracts

---

## 1. Executive Summary

A web-based Quick Quality Assessment Survey tool for ABA (Applied Behavior Analysis) provider agencies. The tool enables organizations to conduct self-assessments of their clinical quality practices across five key domains, receiving immediate visual feedback on their alignment with quality standards.

**Key Outcomes:**
- Agencies gain insight into their quality practices
- UpskillABA captures leads for consulting services
- Users can compare their results to industry benchmarks
- Premium resources provide monetization pathway

---

## 2. Target Users

### Primary Users
- Clinical Directors and Chief Clinical Officers
- BCBA Supervisors and Lead BCBAs
- Quality Assurance Managers
- Agency Owners and Executives

### Secondary Users
- External Consultants conducting quality audits
- New agencies establishing quality baselines

---

## 3. Business Model

### Freemium Model

| Tier | Access | Cost |
|------|--------|------|
| **Free** | Survey, results dashboard, population comparison | $0 |
| **Premium** | Detailed action plans, templates, implementation guides | Paid |

### Lead Generation
- Email capture required before viewing results
- Optional marketing consent for follow-up communications
- GDPR/CAN-SPAM compliant

---

## 4. Survey Content

**Total:** 28 questions across 5 categories (Yes/No responses)

| Category | Questions | Max Score |
|----------|-----------|-----------|
| Daily Sessions | 7 | 7 |
| Treatment Fidelity | 5 | 5 |
| Data Analysis | 6 | 6 |
| Caregiver Guidance | 6 | 6 |
| Supervision | 4 | 4 |
| **TOTAL** | **28** | **28** |

### Category 1: Daily Sessions (7 Questions)
1. Area is organized and necessary materials are readily available consistently
2. Trial count per hour is at least 50 trials on average
3. Each goal opened is run to trial criterion (e.g., 10)
4. Each goal is implemented at least once a session
5. Preference assessments are completed at least once a week
6. The SD, prompting strategy, reinforcement schedules, and target lists are available for all open goals
7. All BT/RBTs are familiar with all the goals and with the client on a consistent basis

### Category 2: Treatment Fidelity (5 Questions)
1. Fidelity checks for skill acquisition goals are implemented at least every two weeks
2. All new goals are introduced using Behavior Skills Training (BST) with BT/RBTs
3. Challenging behavior targets have treatment fidelity checklists for each component of the behavior plan (e.g., NCR, DRO, FCT)
4. The implementation of the behavior plan is presented utilizing BST
5. The implementation of the behavior intervention plan is monitored with treatment fidelity checklists at least twice a month

### Category 3: Data Analysis (6 Questions)
1. There is a standardized approach to ensure that all clinicians review skill acquisition data every 10 sessions
2. There is a standardized approach for BT/RBTs to alert their supervisors of a problematic goal
3. The percentage of goals mastered for current treatment plan goals are monitored as an organization metric
4. Goals that continue into the next authorization period have had any barriers identified, resolved, and have had protocols modified
5. There is a standardized way to determine the effectiveness of challenging behavior interventions
6. The interventions selected for challenging behavior have reduced challenging behavior to a desired level

### Category 4: Caregiver Guidance (6 Questions)
1. Caregiver guidance happens at least once a month
2. There is good adherence to caregiver goals
3. The agency conducts caregiver satisfaction surveys every six months
4. The agency has a structured monthly update interview form to review items such as medication changes with caregivers
5. The initial caregiver interview includes an area for caregivers to express their concerns
6. The initial assessment and the 6-month reassessment include a quality of life measure

### Category 5: Supervision (4 Questions)
1. BCBAs arrive to supervision sessions with a structured plan
2. Supervision sessions involve BST with BT/RBTs
3. Supervision happens at least twice a month
4. The percentage of supervision is in alignment with what is clinically necessary

---

## 5. Functional Requirements

### 5.1 Survey Interface

**Question Display:**
- Display one question at a time with category indication
- Show progress indicator (e.g., "Question 5 of 28")
- Visual transition between categories

**Response Options:**
- Binary Yes/No response for each question
- Visual feedback on selection
- All questions required before submission

**Navigation:**
- Next/Back buttons
- Keyboard navigation support

### 5.1.1 Global Navigation (Header)

**Header Layout:**
- Left side: Upskill ABA logo/brand (links to landing page)
- Right side: "Survey Results" link

**Survey Results Link:**
- Visible on all pages (landing, survey, results)
- Links to `/results` page
- Mobile: Condensed header with same navigation options

**Results Page Behavior:**
- Default view (no email): Shows overall population statistics
  - Average scores across all respondents
  - Score distribution by category
  - Total number of survey completions
  - Benchmarks per question ("X% answered Yes")
- Email lookup: Optional email input to retrieve personal results
  - If email found: Shows individual results with population comparison
  - If email not found: Message prompting user to take the survey

**State Management:**
- Survey progress is saved to localStorage to allow users to continue if they close the browser mid-survey
- After successful submission, localStorage is cleared so returning users see a fresh survey
- Users cannot submit the same survey twice from the same browser without completing it again

### 5.2 Email Capture

**Required Fields:**
- Email address (validated)
- Name
- Role/Title (dropdown: Clinical Director, BCBA, BCaBA, RBT/BT, Owner/Founder, QA Manager, Consultant, Other)
- Agency Size (dropdown based on number of BCBAs):
  - Small: 1-10 BCBAs
  - Medium: 11-50 BCBAs
  - Large: 51-200 BCBAs
  - Enterprise: 200+ BCBAs
- Primary Service Setting (dropdown: In-Home, Clinic/Center-Based, School-Based, Hybrid/Multiple)
- State (all US states and DC)

**Optional Fields:**
- Agency Name (text field, placeholder: "Agency Name (Optional)")
  - Placement: After name/email fields, before survey questions
  - Purpose: Lead generation for agency outreach
- ~~Marketing consent checkbox (opt-in)~~ **Removed** — marketing consent is now granted by default (set to `true`) upon survey submission. The opt-in checkbox has been removed from the email capture form. Users can opt-out of marketing communications at any time per the privacy policy.

**Compliance:**
- Privacy policy link
- GDPR-compliant language

### 5.3 Results Dashboard

**Overall Score:**
- Aggregate score: "X out of 28"
- Percentage calculation
- Visual indicator: Circular progress ring (144px, 10px stroke)
- Performance level label and badge
- Color-coded by performance level (see Section 5.3.1)

**Performance Thresholds:**
| Level | Score Range | Meaning |
|-------|-------------|---------|
| Strong Alignment | 85-100% (24-28) | Well-established practices |
| Moderate Alignment | 60-84% (17-23) | Room for improvement |
| Needs Improvement | <60% (0-16) | Significant gaps |

**Category Breakdown:**
- Individual score per category
- Visual representation (circular progress rings)
- Color-coded by performance level (see Section 5.3.1)

#### 5.3.1 Performance Level Colors

All score visualizations use consistent score-based coloring:

| Performance Level | Score Range | Color | Tailwind |
|-------------------|-------------|-------|----------|
| Strong Alignment | 85-100% | Emerald | `emerald-500` (#10B981) |
| Moderate Alignment | 60-84% | Amber | `amber-500` (#F59E0B) |
| Needs Improvement | <60% | Rose | `rose-400` (#FB7185) |

This applies to:
- Overall score display: Circular progress ring (144px diameter, 10px stroke)
- Category breakdown: Circular progress rings (80px diameter, 8px stroke)
- Performance badges and labels

**Population Comparison:**
- Percentile rank vs other respondents
- Average score comparison
- Per-question benchmarks ("72% answered Yes")
- Minimum 10 responses before showing comparisons
- Hide entire benchmark section until threshold met (show placeholder message)
- Display cards: Average Score, Total Responses only
  - Note: Removed redundant "Strong Alignment" and "Needs Improvement" count cards (redundant with pie chart)

**Strongest/Weakest Questions:**
- Info tooltips (?) next to section headers
- Tooltip text: "Percentage shows how many respondents answered 'Yes' to this question across all surveys"

**Detailed View:**
- Expandable sections per category
- Individual question responses (Yes/No indicators)
- Gap highlighting for "No" responses

### 5.4 Premium Resources (V2)

**Free Content:**
- Overall score and percentage
- Category scores
- Question-level breakdown
- Population comparison

**Premium Content:**
- Detailed action plans for each "No" response
- Downloadable templates and checklists
- Implementation guides and SOPs
- Training resources

### 5.5 Scoring Logic

- Yes = 1 point
- No = 0 points
- Total possible = 28 points

### 5.6 Fetch Results with Magic Link

**Privacy Objective:**
Prevent email enumeration - a malicious user should NOT be able to determine whether someone else has taken the survey by entering their email. The system response must be identical regardless of whether the email exists.

**User Flow (Same UX for ALL emails):**
1. User enters email on "Fetch Results" page
2. System displays: "Check your inbox for a link to your results."
   - Same message regardless of whether email exists
   - Additional text: "If you don't see it, check your spam folder."
3. User clicks link in email → lands directly on results page

**Backend Logic (Email Always Sent):**
- **If email EXISTS:** Send magic link email
  - Subject: "Access Your Quality Assessment Results - Upskill ABA"
  - Body: One-click link to results page
  - Link format: `survey.upskillaba.com/results?token=<signed-token>`
- **If email does NOT exist:** Send survey invitation email
  - Subject: "Complete Your Quality Assessment - Upskill ABA"
  - Body: Invitation to take the survey with direct link
- **Result:** An email is ALWAYS sent - attacker cannot determine if email exists

**Magic Link Technical Specs:**
- Token: Signed JWT or random UUID mapped to email
- **No expiry** - link is a permanent bookmark to their results
- **No usage limits** - user can share with colleagues if they choose
- Results page does NOT display email or identifying info - effectively anonymous to viewers

### 5.7 Resources and Job Aids

**Purpose:**
Provide actionable resources linked to each survey question to help agencies improve their practices.

**Resource Types:**
- PDFs and downloadable job aids
- External links to training materials
- Action statements (inline text guidance)

**UI Implementation:**
- Resources displayed as **expandable accordions** (collapsed by default)
- Two tabs on results page:
  - **"Areas for Improvement"** (default view) - only questions marked "No"
  - **"All Questions"** - all questions with their resources
- Each question shows its linked resource when expanded

**Data Source:**
- Resource mappings provided by Kristen (Excel document)
- Stored as static TypeScript with external links for files

### 5.8 Ranking and Comparison

**Overall Rank:**
- Show user's percentile rank compared to ALL respondents
- Example display: "You're in the top 15% of all respondents"
- Displayed prominently on results page

**Rank by Agency Size:**
- Show rank compared to similar-sized organizations (based on BCBA count)
- **Threshold:** Only enable when at least **10 responses** exist in that agency size category
- If < 10 responses in category: Hide category ranking or show "Not enough data yet"

**Agency Size Categories (for ranking):**
| Category | BCBA Count |
|----------|------------|
| Small | 1-10 BCBAs |
| Medium | 11-50 BCBAs |
| Large | 51-200 BCBAs |
| Enterprise | 200+ BCBAs |

**Multiple Submissions Logic:**
- Same email, multiple submissions: Use **latest score only** for population benchmarks
- Personal progress tracking: Show all historical attempts for that individual

**Viewing Older Results:**
- In the "Progress Over Time" section, entries are displayed in descending order (newest first)
- Each entry is clickable and navigates to that specific result page
- Currently viewed result is highlighted with a "Viewing" badge
- Latest result always shows a "Latest" badge
- Helps users easily navigate between their historical assessments
- Population comparison remains LIVE (reflects current data)

---

## 6. Non-Functional Requirements

### 6.1 User Experience
- Survey completion under 5 minutes
- Intuitive, no instructions needed

### 6.2 Mobile-First Responsive Design (MANDATORY)
**All features must work flawlessly on mobile devices.**

- Design for mobile first, then scale up to desktop
- Test on real devices (iPhone SE, standard iPhone, iPad, Android)
- Minimum touch target: 44x44px
- No horizontal scrolling on mobile
- Readable text without zooming (16px minimum)
- Support all breakpoints: mobile (default), sm (640px), md (768px), lg (1024px), xl (1280px)

**Mobile-Specific Requirements:**
- Survey: One question per screen, large Yes/No buttons
- Results: Stacked layouts, scrollable category cards
- Forms: Full-width inputs, adequate spacing between fields
- Navigation: Thumb-friendly button placement

### 6.3 Performance
- Page load under 2 seconds
- Instant question transitions
- Results generation under 1 second

### 6.4 Privacy & Security
- HTTPS encryption
- Secure data storage
- Privacy policy compliance
- GDPR-compliant data handling

### 6.5 Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support

---

## 7. User Flow

```
Landing Page → Survey (28 questions) → Email Capture → Results Dashboard
                                                              ↓
                                                    Premium Upsell (V2)
```

---

## 8. Future Considerations

**V2:**
- User accounts with saved history
- PDF report generation and email delivery
- Premium resource payments

**V3:**
- Organization-level dashboards
- Team comparisons within agency
- Pre-seeded agency database

**Backlog:**
- Trend tracking over time
- Industry benchmarking by agency size
- Email nurture sequences
- Integration with CRM systems

---

## 9. Acceptance Criteria

The application will be considered complete when:

**Core Survey:**
- [ ] All 28 survey questions displayed in correct category order
- [ ] Users can navigate forward and backward through survey
- [ ] Yes/No responses captured for all questions
- [ ] Email capture validates and stores email addresses
- [ ] Optional Agency Name field available

**Results Dashboard:**
- [ ] Results page displays overall score with visual indicator
- [ ] Results page displays 5 category scores
- [ ] Color-coding applied based on score thresholds
- [ ] Detailed breakdown shows individual question responses
- [ ] Population comparison shows when sufficient data exists (10+ responses)
- [ ] Info tooltips on Strongest/Weakest Questions sections
- [ ] Resources displayed in expandable accordions
- [ ] Two tabs: "Areas for Improvement" and "All Questions"

**Ranking:**
- [ ] Overall percentile rank displayed
- [ ] Rank by agency size displayed (when 10+ in category)

**Magic Link:**
- [ ] Fetch Results page accepts email input
- [ ] Same response message regardless of email existence
- [ ] Magic link email sent for existing users
- [ ] Survey invitation email sent for non-existing users
- [ ] Magic link provides permanent access to results

**General:**
- [ ] Application is mobile-responsive
- [ ] Application is publicly accessible
- [ ] "Upskill ABA" branding applied consistently (with space)
- [x] Browser tab favicon uses Upskill ABA icon (`avatar.png` bar chart graphic), not the default Vercel/Next.js favicon

---

## 10. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Survey completion rate | >80% | Started vs completed |
| Email capture rate | >90% | Completed surveys with valid email |
| Time to complete | <5 min | Average completion time |
| Mobile usage | Track | % of mobile vs desktop |
| Return visits | Track | Users viewing results multiple times |
