# Quick Quality Assessment Survey - Business Requirements

**Version:** 2.0
**Date:** January 2026
**Owner:** UpskillABA
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

**Total:** 27 questions across 5 categories (Yes/No responses)

| Category | Questions | Max Score |
|----------|-----------|-----------|
| Daily Sessions | 7 | 7 |
| Treatment Fidelity | 5 | 5 |
| Data Analysis | 5 | 5 |
| Caregiver Guidance | 6 | 6 |
| Supervision | 4 | 4 |
| **TOTAL** | **27** | **27** |

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

### Category 3: Data Analysis (5 Questions)
1. There is a standardized approach to ensure that all clinicians review skill acquisition data every 10 sessions
2. There is a standardized approach for BT/RBTs to alert their supervisors of a problematic goal
3. The percentage of goals mastered for current treatment plan goals are monitored as an organization metric; goals that continue into the next authorization period have had any barriers identified, resolved, and have had protocols modified
4. There is a standardized way to determine the effectiveness of challenging behavior interventions
5. The interventions selected for challenging behavior have reduced challenging behavior to a desired level

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
- Show progress indicator (e.g., "Question 5 of 27")
- Visual transition between categories

**Response Options:**
- Binary Yes/No response for each question
- Visual feedback on selection
- All questions required before submission

**Navigation:**
- Next/Back buttons
- Keyboard navigation support

### 5.2 Email Capture

**Required Fields:**
- Email address (validated)

**Optional Fields:**
- Name
- Organization/Agency name
- Role/Title (dropdown)

**Compliance:**
- Marketing consent checkbox
- Privacy policy link
- GDPR-compliant language

### 5.3 Results Dashboard

**Overall Score:**
- Aggregate score: "X out of 27"
- Percentage calculation
- Visual indicator (gauge or progress)
- Performance level label

**Performance Thresholds:**
| Level | Score Range | Meaning |
|-------|-------------|---------|
| Strong Alignment | 85-100% (23-27) | Well-established practices |
| Moderate Alignment | 60-84% (16-22) | Room for improvement |
| Needs Improvement | <60% (0-15) | Significant gaps |

**Category Breakdown:**
- Individual score per category
- Visual representation (charts/bars)
- Color-coded by performance level

**Population Comparison:**
- Percentile rank vs other respondents
- Average score comparison
- Per-question benchmarks ("72% answered Yes")
- Minimum 10 responses before showing comparisons

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
- Total possible = 27 points

---

## 6. Non-Functional Requirements

### 6.1 User Experience
- Survey completion under 5 minutes
- Intuitive, no instructions needed
- Mobile-responsive

### 6.2 Performance
- Page load under 2 seconds
- Instant question transitions
- Results generation under 1 second

### 6.3 Privacy & Security
- HTTPS encryption
- Secure data storage
- Privacy policy compliance
- GDPR-compliant data handling

### 6.4 Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support

---

## 7. User Flow

```
Landing Page → Survey (27 questions) → Email Capture → Results Dashboard
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

- [ ] All 27 survey questions displayed in correct category order
- [ ] Users can navigate forward and backward through survey
- [ ] Yes/No responses captured for all questions
- [ ] Email capture validates and stores email addresses
- [ ] Results page displays overall score with visual indicator
- [ ] Results page displays 5 category scores
- [ ] Color-coding applied based on score thresholds
- [ ] Detailed breakdown shows individual question responses
- [ ] Population comparison shows when sufficient data exists
- [ ] Application is mobile-responsive
- [ ] Application is publicly accessible

---

## 10. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Survey completion rate | >80% | Started vs completed |
| Email capture rate | >90% | Completed surveys with valid email |
| Time to complete | <5 min | Average completion time |
| Mobile usage | Track | % of mobile vs desktop |
| Return visits | Track | Users viewing results multiple times |
