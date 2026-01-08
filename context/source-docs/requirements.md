# Quick Quality Assessment Survey Tool

**Version:** 1.1
**Date:** January 2026
**Owner:** UpskillABA
**Status:** Draft

---

## 1. Executive Summary

A web-based Quick Quality Assessment Survey tool for ABA (Applied Behavior Analysis) provider agencies. The tool enables organizations to conduct self-assessments of their clinical quality practices across five key domains, receiving immediate visual feedback on their alignment with quality standards.

**Key Features:**
- Modern, user-friendly survey interface
- Comprehensive results dashboard with aggregate and category-level scoring
- Lead capture functionality
- Monetization pathway through premium improvement resources

**Tech Stack:**
- **Frontend:** React (Single-page application)
- **Source Control:** GitHub
- **Deployment:** Vercel
- **Database:** Supabase or Firebase
- **Payments:** Stripe

---

## 2. Purpose and Scope

### 2.1 Purpose
A rapid diagnostic instrument for ABA agencies to evaluate adherence to quality standards across critical operational areas:
- Clinical practices
- Treatment fidelity
- Data analysis procedures
- Caregiver engagement
- Supervision protocols

### 2.2 Target Users
- Clinical Directors and Chief Clinical Officers
- BCBA Supervisors and Lead BCBAs
- Quality Assurance Managers
- Agency Owners and Executives
- External Consultants conducting quality audits

### 2.3 Scope
**Initial Release:**
- Survey interface for data collection
- Results dashboard for visualization
- Email capture for lead generation
- Gated access to premium improvement resources

**Future Phases:**
- Multi-user accounts
- Historical tracking
- Benchmarking features

### 2.4 Business Model
**Freemium Model:**
- Survey and basic results: FREE
- Detailed improvement resources and action plans: PAID

---

## 3. Survey Content Structure

**Total:** 27 questions across 5 categories (Yes/No responses)

| Category | Questions | Max Score |
|----------|-----------|-----------|
| Daily Sessions | 7 | 7 |
| Treatment Fidelity | 5 | 5 |
| Data Analysis | 5 | 5 |
| Caregiver Guidance | 6 | 6 |
| Supervision | 4 | 4 |
| **TOTAL** | **27** | **27** |

### 3.1 Category 1: Daily Sessions (7 Questions)
1. Area is organized and necessary materials are readily available consistently
2. Trial count per hour is at least 50 trials on average
3. Each goal opened is run to trial criterion (e.g., 10)
4. Each goal is implemented at least once a session
5. Preference assessments are completed at least once a week
6. The SD, prompting strategy, reinforcement schedules, and target lists are available for all open goals
7. All BT/RBTs are familiar with all the goals and with the client on a consistent basis

### 3.2 Category 2: Treatment Fidelity (5 Questions)
1. Fidelity checks for skill acquisition goals are implemented at least every two weeks
2. All new goals are introduced using Behavior Skills Training (BST) with BT/RBTs
3. Challenging behavior targets have treatment fidelity checklists for each component of the behavior plan (e.g., NCR, DRO, FCT)
4. The implementation of the behavior plan is presented utilizing BST
5. The implementation of the behavior intervention plan is monitored with treatment fidelity checklists at least twice a month

### 3.3 Category 3: Data Analysis (5 Questions)
1. There is a standardized approach to ensure that all clinicians review skill acquisition data every 10 sessions
2. There is a standardized approach for BT/RBTs to alert their supervisors of a problematic goal
3. The percentage of goals mastered for current treatment plan goals are monitored as an organization metric; goals that continue into the next authorization period have had any barriers identified, resolved, and have had protocols modified
4. There is a standardized way to determine the effectiveness of challenging behavior interventions
5. The interventions selected for challenging behavior have reduced challenging behavior to a desired level

### 3.4 Category 4: Caregiver Guidance (6 Questions)
1. Caregiver guidance happens at least once a month
2. There is good adherence to caregiver goals
3. The agency conducts caregiver satisfaction surveys every six months
4. The agency has a structured monthly update interview form to review items such as medication changes with caregivers
5. The initial caregiver interview includes an area for caregivers to express their concerns
6. The initial assessment and the 6-month reassessment include a quality of life measure

### 3.5 Category 5: Supervision (4 Questions)
1. BCBAs arrive to supervision sessions with a structured plan
2. Supervision sessions involve BST with BT/RBTs
3. Supervision happens at least twice a month
4. The percentage of supervision is in alignment with what is clinically necessary

---

## 4. Functional Requirements

### 4.1 Survey Interface

#### 4.1.1 Question Display
- Display one question at a time with clear category indication
- Show progress indicator (e.g., "Question 5 of 27" with progress bar showing percentage complete)
- Display current category name as a section header
- Provide visual transition between categories

#### 4.1.2 Response Options
- Binary Yes/No response buttons for each question
- Visual feedback on selection (button state change, color indication)
- Ability to change response before moving to next question
- All questions required before submission

#### 4.1.3 Navigation
- Next button to advance to following question
- Back button to return to previous question
- Submit button appears on final question
- Keyboard navigation support (arrow keys, Enter)

### 4.2 Email Capture and Lead Generation

#### 4.2.1 Email Collection Screen
- Display email capture screen after survey completion, before showing results
- Email field with validation (proper email format required)
- Optional: Name field for personalization
- Optional: Organization/Agency name field
- Optional: Role/Title dropdown (Clinical Director, BCBA, Owner, etc.)
- Clear value proposition messaging

#### 4.2.2 Email Requirements
- Email is required to view results (no skip option for basic implementation)
- Alternative: Allow viewing basic results without email, but require email for detailed breakdown or export
- Privacy policy link displayed near email field
- Checkbox for marketing consent: "I agree to receive quality improvement tips and resources from UpskillABA"
- GDPR/CAN-SPAM compliant language and unsubscribe mention

#### 4.2.3 Data Storage
- Store email address with timestamp
- Associate survey results with email for potential follow-up personalization
- Store optional fields (name, organization, role) if provided
- Record marketing consent status

### 4.3 Results Dashboard

#### 4.3.1 Overall Score Display
- Prominent display of aggregate score: "X out of 27" format
- Percentage calculation displayed alongside raw score
- Visual indicator (circular progress gauge, radial chart, or similar)
- Color-coded performance level:
  - **Green:** 85-100% (23-27 pts)
  - **Yellow:** 60-84% (16-22 pts)
  - **Red:** <60% (0-15 pts)

#### 4.3.2 Category Scores
- Individual score for each of the five categories
- Display format: "X out of Y" where Y is the maximum possible for that category
- Visual representation (bar charts, radial graphs, or progress bars)
- Color-coding consistent with overall score thresholds
- Category names clearly labeled

#### 4.3.3 Detailed Breakdown
- Expandable/collapsible sections for each category
- List of all questions with response indicators (checkmark for Yes, X for No)
- Visual highlighting of "No" responses as areas for improvement
- Clear identification of gaps in quality alignment

#### 4.3.4 Export and Sharing
- Download results as PDF report
- Option to print results directly from browser
- Email results to self (sends copy to captured email address)

### 4.4 Premium Improvement Resources (Paywall)

#### 4.4.1 Free vs. Premium Content

| Free (All Users) | Premium (Paid Access) |
|------------------|----------------------|
| Overall score (X/27) | Detailed action plans for each "No" response |
| Category scores (5 categories) | Downloadable templates and checklists |
| Question-level breakdown (Yes/No) | Implementation guides and SOPs |
| Basic PDF export of scores | Training videos for each quality area |
| Color-coded performance indicators | CEU-eligible content (if applicable) |
| Their scores vs other scores | Comprehensive improvement report PDF |

#### 4.4.2 Premium Resource Categories
- **Daily Sessions Resources:** Session setup checklists, trial tracking templates, preference assessment protocols, material organization guides
- **Treatment Fidelity Resources:** Fidelity checklist templates, BST implementation guides, behavior plan component checklists, monitoring schedules
- **Data Analysis Resources:** Data review protocols, escalation procedures, goal mastery tracking systems, intervention effectiveness frameworks
- **Caregiver Guidance Resources:** Caregiver training curricula, satisfaction survey templates, monthly update forms, quality of life assessment tools
- **Supervision Resources:** Supervision planning templates, BST supervision guides, supervision frequency calculators, clinical necessity documentation

#### 4.4.3 Paywall Implementation
- "Unlock Improvement Resources" CTA prominently displayed on results page
- Teaser content: Show titles and brief descriptions with lock icons
- Contextual prompts next to each "No" response
- Clear pricing display before checkout

#### 4.4.4 Payment and Access
- Integration with Stripe
- Pricing options:
  - One-time purchase for full toolkit
  - Category-specific bundles
  - Subscription model for ongoing access
- Secure checkout flow
- Immediate access upon payment confirmation
- Email delivery of purchase confirmation and resource access links
- Optional account creation for returning users

#### 4.4.5 Alternative Monetization Options
- **Consultation Upsell:** Free 15-minute consultation leading to paid consulting
- **Quality Initiatives Community:** Free Skool community with premium tier
- **Red Dot System Demo:** Demonstrate value of comprehensive progress monitoring
- **Fractional CCO Services:** Full-service clinical leadership for agencies with significant gaps

### 4.5 Scoring Logic

Binary scoring: Yes = 1 point, No = 0 points

| Performance Level | Score Range | Color Code |
|-------------------|-------------|------------|
| Strong Alignment | 85-100% (23-27 pts) | Green |
| Moderate Alignment | 60-84% (16-22 pts) | Yellow |
| Needs Improvement | <60% (0-15 pts) | Red |

---

## 5. Non-Functional Requirements

### 5.1 User Experience
- Clean, modern interface following current design standards
- Mobile-responsive design for tablet and phone access
- Survey completion time under 5 minutes
- Intuitive navigation requiring no instructions
- Accessibility compliance (WCAG 2.1 AA)

### 5.2 Performance
- Page load time under 2 seconds
- Instant question transitions (no loading delays)
- Results page generation under 1 second

### 5.3 Security and Privacy
- HTTPS encryption for all data transmission
- Secure storage of email addresses and survey data
- PCI-compliant payment processing (via Stripe)
- Privacy policy and terms of service pages
- GDPR-compliant data handling for international users

### 5.4 Technical
- Single-page application architecture (React)
- Deployment on Vercel
- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- Database for storing leads and survey responses (Supabase or Firebase)
- Email service integration for transactional emails

---

## 6. UI/UX Design Specifications

### 6.1 Visual Design Reference
Reference application: immigrant-sentiment-survey.vercel.app
- Centered card-based layout for survey questions
- Progress bar with percentage indicator at top
- Question number and total displayed prominently
- Large, touch-friendly response buttons
- Subtle animations for transitions
- Professional color palette appropriate for healthcare/clinical context

### 6.2 User Flow
1. **Landing Page:** Introduction to assessment, value proposition, "Start Assessment" CTA
2. **Survey Questions:** 27 questions presented one at a time across 5 categories
3. **Email Capture:** Collect email (required) and optional fields before showing results
4. **Results Dashboard:** Display scores with visual indicators and detailed breakdown
5. **Premium Upsell:** CTAs for improvement resources integrated into results page
6. **Checkout (if applicable):** Stripe checkout for premium content purchase

### 6.3 Results Page Layout
- **Header Section:** Overall score with visual gauge or circular progress indicator
- **Category Cards:** Five cards showing individual category scores with visual representations
- **Detail Accordion:** Expandable sections showing individual question responses
- **Premium Resource Prompts:** Contextual CTAs for improvement resources next to gap areas
- **Action Bar:** Buttons for PDF export, print, retake survey, unlock premium resources
- **Footer:** UpskillABA branding, Quality Initiatives community link, contact information

### 6.4 Color Palette

| Element | Color | Usage |
|---------|-------|-------|
| Primary | #2563EB | Buttons, links, focus states |
| Success | #16A34A | Yes responses, high scores |
| Warning | #EAB308 | Moderate scores |
| Danger | #DC2626 | No responses, low scores |
| Background | #F8FAFC | Page background |

---

## 7. Future Considerations

Out of scope for initial release:
- User accounts with saved assessment history
- Organization-level dashboards for multi-site agencies
- Trend tracking over time (quarterly comparisons)
- Industry benchmarking against anonymized aggregate data
- Customizable question sets based on agency size or service type
- Integration with UpskillABA's clinical decision support systems (Red Dot)
- Automated recommendations based on identified gaps
- Email nurture sequences triggered by assessment completion

---

## 8. Acceptance Criteria

The application will be considered complete when:

- [ ] All 27 survey questions are displayed in correct category order
- [ ] Users can navigate forward and backward through the survey
- [ ] Yes/No responses are captured for all questions
- [ ] Email capture screen collects and validates email addresses
- [ ] Email addresses are stored in database with associated survey data
- [ ] Results page displays overall score (X/27) with visual indicator
- [ ] Results page displays individual category scores (5 categories)
- [ ] Color-coding is applied based on score thresholds
- [ ] Detailed breakdown shows individual question responses
- [ ] Premium resource CTAs are displayed on results page
- [ ] Payment integration (Stripe) processes transactions successfully
- [ ] Premium content is accessible only after payment
- [ ] PDF export functionality is operational
- [ ] Application is mobile-responsive
- [ ] Application is deployed and publicly accessible
