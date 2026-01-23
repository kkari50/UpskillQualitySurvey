# Quick Quality Assessment Survey - Tasks

**Last Updated:** January 2026

This is the source of truth for all project tasks. Update status as work progresses.

---

## Task Status Legend

| Status | Meaning |
|--------|---------|
| `[ ]` | Not started |
| `[~]` | In progress |
| `[x]` | Completed |
| `[!]` | Blocked |
| `[-]` | Cancelled/Deferred |

---

## Critical Gaps (Priority 0 - Must Fix Before Development)

### Documentation Sync
- [x] Clean up requirements.md - remove tech stack, style guide, scope (business requirements only)
- [x] Update architecture.md schema to include `is_test` column (DEC-020)
- [x] Sync role enum between content.md and api-design.md

### Database Migrations (Blocks All API Work)
- [x] Create `supabase/migrations/001_initial_schema.sql`
- [x] Create `supabase/migrations/002_materialized_views.sql`
- [x] Create `supabase/migrations/003_rls_policies.sql`
- [x] Create `supabase/migrations/004_test_data_cleanup.sql` (pg_cron job)

### Legal Content (Required Before Launch)
- [ ] Write Privacy Policy page content
- [ ] Write Terms of Service page content

### Implementation Utilities (Blocks API/Components)
- [x] Create `src/lib/scoring.ts` - Score calculation logic
- [x] Create `src/lib/validation/survey.ts` - Zod schemas
- [x] Create `src/lib/supabase/client.ts` - Browser client
- [x] Create `src/lib/supabase/server.ts` - Server client
- [x] Create `src/lib/supabase/service.ts` - Service role client (for API routes)
- [x] Create `src/stores/survey.ts` - Zustand store definition

---

## Phase 0: Pre-Development Setup

### Context & Documentation
- [x] Create requirements.md
- [x] Create style-guide.md (shadcn/ui, colors, components)
- [x] Create architecture.md (schema, tech stack, phases)
- [x] Create api-design.md (endpoints, validation)
- [x] Create tasks.md (this file)
- [x] Create decisions.md (decision log)
- [x] Update CLAUDE.md with project specifics
- [x] Create content.md (landing page copy, CTAs)

### Data Files
- [x] Create `src/data/questions/schema.ts` - TypeScript types
- [x] Create `src/data/questions/v1.0.ts` - All 28 questions structured
- [x] Create `src/data/questions/index.ts` - Export current version
- [x] Create `src/lib/constants/email-domains.ts` - Email domain utils
- [x] Create `src/lib/constants/categories.ts` - Category metadata

### Database Setup
- [x] Create Supabase project
- [x] Run migrations
- [x] Generate TypeScript types from schema

### Environment Setup
- [x] Create `.env.example` with required variables
- [ ] Update `.env.example` with Upstash Redis vars
- [ ] Update `.env.example` with Resend API key
- [ ] Set up Upstash Redis account (rate limiting)
- [ ] Set up Resend account (magic link emails)
- [ ] Configure Vercel project
- [ ] Set environment variables in Vercel

---

## Testing Infrastructure (TDD Requirement)

### Test Setup
- [x] Configure Vitest for unit/integration tests
- [x] Configure React Testing Library for component tests
- [x] Configure Playwright for E2E tests
- [x] Create test utilities and mock helpers
- [ ] Set up test database seeding scripts

### Test File Structure
- [x] Define test directory structure (`src/test/`, `*.test.ts` patterns)
- [x] Create mock data fixtures for surveys
- [ ] Create mock data fixtures for API responses
- [ ] Document testing conventions

### Accessibility Testing
- [ ] Set up axe-core for automated a11y testing
- [ ] Define WCAG 2.1 AA checklist for manual testing
- [ ] Create a11y test helpers

### Performance Testing
- [ ] Define Core Web Vitals benchmarks (LCP, FID, CLS)
- [ ] Set up Lighthouse CI or similar
- [ ] Create performance budget

---

## Content Gaps

### Legal Pages
- [ ] Privacy Policy - full legal content
- [ ] Terms of Service - full legal content

### Error & Empty States
- [ ] 404 page content and design
- [ ] 500 error page content
- [ ] Maintenance mode page
- [ ] Empty state for insufficient comparison data

### Email Templates (V1 - Magic Links)
- [ ] Magic link email template (results access)
- [ ] Survey invitation email template (for non-existing emails)

### Email Templates (V2 - PDF Delivery)
- [ ] Results PDF email template
- [ ] Email verification template
- [ ] Password reset template

---

## Phase 1: V1 Core Implementation

### Project Scaffolding
- [x] Initialize Next.js 14 project with App Router
- [x] Install and configure Tailwind CSS
- [x] Initialize shadcn/ui (`npx shadcn@latest init`)
- [x] Install required shadcn components
- [x] Set up project folder structure per architecture.md
- [x] Configure ESLint and Prettier
- [x] Set up Husky pre-commit hooks

### Landing Page
- [x] Create landing page layout
- [x] Implement hero section with value proposition
- [x] Add trust signals (28 questions, ~5 min, 5 categories)
- [x] Add privacy badge
- [x] Implement "Start Assessment" CTA
- [x] Mobile responsive design
- [x] Add UpskillABA branding/footer

### Survey Interface
- [x] Create survey state management (Zustand store)
- [x] Implement localStorage backup for answers
- [x] Create QuestionCard component
- [x] Create ResponseButtons component (Yes/No)
- [x] Create ProgressBar component
- [x] Create NavigationButtons component (Back/Next)
- [x] Create CategoryTransition component
- [ ] Implement keyboard navigation (arrow keys, Enter)
- [ ] Add slide animations (Framer Motion)
- [x] Mobile responsive design

### Email Capture
- [x] Create EmailCapture form component
- [x] Implement email validation
- [x] Add optional name field
- [x] Add optional role dropdown
- [x] Add marketing consent checkbox
- [x] Add privacy policy link
- [x] Form submission handling

### API Routes
- [x] Implement `POST /api/survey/submit`
- [x] Implement `GET /api/stats`
- [x] Implement `GET /api/stats/percentile`
- [x] Implement `GET /api/health`

### Results Dashboard
- [x] Create results page route (`/results/[token]`)
- [x] Implement OverallScoreCard component (ScoreOverview)
- [x] Implement CategoryScoreCard component (CategoryBreakdown)
- [ ] Implement CategoryComparisonChart (Recharts)
- [x] Implement DetailedBreakdown accordion (GapsList)
- [x] Implement PopulationComparison component
- [x] Add percentile rank display
- [ ] Implement share URL functionality
- [ ] Add "Retake Survey" button
- [x] Mobile responsive design

### Security & Performance
- [ ] Configure security headers in next.config.ts
- [ ] Test Row Level Security policies
- [ ] Verify rate limiting works
- [ ] Performance audit (Lighthouse)
- [ ] Accessibility audit (WCAG 2.1 AA)

### Deployment
- [ ] Deploy to Vercel preview
- [ ] Test preview deployment
- [ ] Configure production domain
- [ ] Deploy to production
- [ ] Verify production environment variables

---

## V1 New Features (Product Roadmap Meeting III - Jan 2026)

### Magic Link for Results Retrieval
- [ ] Set up Resend account and API key
- [ ] Create `POST /api/results/request-link` endpoint
- [ ] Implement magic link JWT generation
- [ ] Create magic link email template
- [ ] Create survey invitation email template
- [ ] Implement privacy-preserving response (same message for all emails)
- [ ] Add "Fetch Results" page/section
- [ ] Rate limit magic link requests (5/min per IP)
- [ ] E2E tests for magic link flow

### Resources and Job Aids
- [!] Create `src/data/resources/schema.ts` - Resource types (Blocked: waiting on Kristen's Excel mapping)
- [!] Create `src/data/resources/v1.0.ts` - Question→Resource mappings (Blocked: waiting on Kristen's Excel mapping)
- [ ] Create `src/data/resources/index.ts` - Export current version
- [ ] Create ResourceAccordion component
- [ ] Implement "Areas for Improvement" tab (default, shows only "No" answers)
- [ ] Implement "All Questions" tab
- [ ] Add resources to results page
- [ ] Mobile responsive design for resources section
- [ ] E2E tests for resources display

### Ranking System
- [ ] Update `GET /api/stats/percentile` to support agency size parameter
- [ ] Create materialized view for stats by agency size
- [ ] Implement overall percentile rank display
- [ ] Implement rank by agency size display
- [ ] Handle insufficient data for agency size categories (<10 responses)
- [ ] Add "Not enough data" messaging for small categories
- [ ] E2E tests for ranking features

### Form Updates
- [ ] Add optional Agency Name text field to EmailCapture form
- [ ] Update Agency Size dropdown to use "BCBAs" wording (not "staff")
- [ ] Update validation schema to include `agencyName` and `agencySize`
- [ ] Update submit API to handle new fields
- [ ] Create migration for `agency_name` column in leads table
- [ ] E2E tests for form changes

### UI Polish
- [ ] Add info tooltips (?) next to "Strongest Questions" section
- [ ] Add info tooltips (?) next to "Weakest Questions" section
- [ ] Implement tooltip text: "Percentage shows how many respondents answered 'Yes'..."
- [ ] Remove "Strong Alignment" count card from benchmarks (redundant with chart)
- [ ] Remove "Needs Improvement" count card from benchmarks (redundant with chart)
- [ ] Verify population benchmark hides when <10 responses

### Branding Integration
- [!] Apply "Upskill ABA" branding (with space, not "UpskillABA") - need web artifacts from Kristen
- [!] Integrate full logo (Blocked: waiting on Kristen)
- [!] Integrate avatar/icon logo (Blocked: waiting on Kristen)
- [!] Apply color palette from brand guide (Blocked: waiting on Kristen)
- [!] Apply fonts from brand guide (Blocked: waiting on Kristen)
- [ ] Update landing page branding
- [ ] Update results page branding
- [ ] Update email templates with branding

---

## Dependencies on Kristen (Blocking Items)

| Item | Blocks | Status |
|------|--------|--------|
| Web artifacts (logo, banners, colors, fonts) | Branding Integration | Pending |
| Question → Resource mapping (Excel) | Resources Feature | Pending |
| Resource files (PDFs, job aids) | Resources Feature | Pending |
| Privacy Policy content | Legal Pages | Pending |
| Terms of Service content | Legal Pages | Pending |

---

## Phase 2: V2 Features (Future)

### Authentication
- [ ] Set up Supabase Auth
- [ ] Create signup/login pages
- [ ] Implement session management
- [ ] Create `POST /api/auth/claim-lead` endpoint
- [ ] Create user dashboard page

### PDF Generation
- [ ] Set up Browserless.io account
- [ ] Create PDF HTML template
- [ ] Create `POST /api/pdf/generate` endpoint
- [ ] Set up Inngest for background jobs
- [ ] Implement email sending with PDF attachment (Resend already set up in V1)

### Payments
- [ ] Set up Stripe account
- [ ] Implement `POST /api/checkout` endpoint
- [ ] Implement `POST /api/webhooks/stripe` endpoint
- [ ] Create purchases table
- [ ] Implement premium content access control

---

## Phase 3: V3 Features (Future)

### Agency Model
- [ ] Research NPI database for agency data
- [ ] Create agencies table with pre-seeded data
- [ ] Implement agency search with fuzzy matching
- [ ] Create agency selection UI component
- [ ] Migrate email domains to proper agencies

### Agency Dashboards
- [ ] Create agency dashboard page
- [ ] Implement team scores view
- [ ] Add intra-agency comparison charts

---

## Backlog (Unprioritized)

### Analytics & Monitoring
- [ ] Add Plausible or GA for usage tracking
- [ ] Set up Sentry for error monitoring
- [ ] Funnel conversion tracking
- [ ] Performance monitoring (Vercel Analytics)

### Enhanced Features
- [ ] Dark mode support
- [ ] Multi-language support (Spanish)
- [ ] Save and resume survey later
- [ ] Social sharing of results

### Admin Features
- [ ] Admin dashboard for viewing responses
- [ ] Lead export functionality
- [ ] Manual stats refresh trigger

### Integrations
- [ ] Zapier integration for lead capture
- [ ] HubSpot CRM integration
- [ ] Calendar booking integration (Calendly)

### Compliance
- [ ] Cookie consent banner
- [ ] GDPR data export/deletion
- [ ] Accessibility statement

---

## Bugs & Issues

_No bugs reported yet._

---

## Notes

- **TDD Required:** All code must have tests written FIRST
- **Mobile-First:** Design for mobile, then scale up
- Questions data must be created before survey implementation
- Database must be set up before API routes
- Stats endpoints require materialized views
- Population comparison requires minimum 10 responses
- Agency size ranking requires minimum 10 responses per category
- Deployment via GitHub → Vercel pipeline
- Magic link emails use Resend (set up in V1, not V2)
- Resources feature blocked on Kristen's Excel mapping
- Branding integration blocked on Kristen's web artifacts
