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
- [ ] Create `supabase/migrations/001_initial_schema.sql`
- [ ] Create `supabase/migrations/002_materialized_views.sql`
- [ ] Create `supabase/migrations/003_rls_policies.sql`
- [ ] Create `supabase/migrations/004_test_data_cleanup.sql` (pg_cron job)

### Legal Content (Required Before Launch)
- [ ] Write Privacy Policy page content
- [ ] Write Terms of Service page content

### Implementation Utilities (Blocks API/Components)
- [ ] Create `src/lib/scoring.ts` - Score calculation logic
- [ ] Create `src/lib/validation/survey.ts` - Zod schemas
- [ ] Create `src/lib/supabase/client.ts` - Browser client
- [ ] Create `src/lib/supabase/server.ts` - Server client (service role)
- [ ] Create `src/stores/survey.ts` - Zustand store definition

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
- [x] Create `src/data/questions/v1.0.ts` - All 27 questions structured
- [x] Create `src/data/questions/index.ts` - Export current version
- [x] Create `src/lib/constants/email-domains.ts` - Email domain utils
- [x] Create `src/lib/constants/categories.ts` - Category metadata

### Database Setup
- [ ] Create Supabase project
- [ ] Run migrations
- [ ] Generate TypeScript types from schema

### Environment Setup
- [x] Create `.env.example` with required variables
- [ ] Update `.env.example` with Upstash Redis vars
- [ ] Set up Upstash Redis account (rate limiting)
- [ ] Configure Vercel project
- [ ] Set environment variables in Vercel

---

## Testing Infrastructure (TDD Requirement)

### Test Setup
- [ ] Configure Vitest for unit/integration tests
- [ ] Configure React Testing Library for component tests
- [ ] Configure Playwright for E2E tests
- [ ] Create test utilities and mock helpers
- [ ] Set up test database seeding scripts

### Test File Structure
- [ ] Define test directory structure (`__tests__/`, `*.test.ts` patterns)
- [ ] Create mock data fixtures for surveys
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

### Email Templates (V2)
- [ ] Results email template
- [ ] Email verification template
- [ ] Password reset template

---

## Phase 1: V1 Core Implementation

### Project Scaffolding
- [ ] Initialize Next.js 14 project with App Router
- [ ] Install and configure Tailwind CSS
- [ ] Initialize shadcn/ui (`npx shadcn@latest init`)
- [ ] Install required shadcn components
- [ ] Set up project folder structure per architecture.md
- [ ] Configure ESLint and Prettier
- [ ] Set up Husky pre-commit hooks

### Landing Page
- [ ] Create landing page layout
- [ ] Implement hero section with value proposition
- [ ] Add trust signals (27 questions, ~5 min, 5 categories)
- [ ] Add privacy badge
- [ ] Implement "Start Assessment" CTA
- [ ] Mobile responsive design
- [ ] Add UpskillABA branding/footer

### Survey Interface
- [ ] Create survey state management (Zustand store)
- [ ] Implement localStorage backup for answers
- [ ] Create QuestionCard component
- [ ] Create ResponseButtons component (Yes/No)
- [ ] Create ProgressBar component
- [ ] Create NavigationButtons component (Back/Next)
- [ ] Create CategoryTransition component
- [ ] Implement keyboard navigation (arrow keys, Enter)
- [ ] Add slide animations (Framer Motion)
- [ ] Mobile responsive design

### Email Capture
- [ ] Create EmailCapture form component
- [ ] Implement email validation
- [ ] Add optional name field
- [ ] Add optional role dropdown
- [ ] Add marketing consent checkbox
- [ ] Add privacy policy link
- [ ] Form submission handling

### API Routes
- [ ] Implement `POST /api/survey/submit`
- [ ] Implement `GET /api/stats`
- [ ] Implement `GET /api/stats/percentile`
- [ ] Implement `GET /api/health`

### Results Dashboard
- [ ] Create results page route (`/results/[token]`)
- [ ] Implement OverallScoreCard component
- [ ] Implement CategoryScoreCard component
- [ ] Implement CategoryComparisonChart (Recharts)
- [ ] Implement DetailedBreakdown accordion
- [ ] Implement QuestionRow with population comparison
- [ ] Add percentile rank display
- [ ] Implement share URL functionality
- [ ] Add "Retake Survey" button
- [ ] Mobile responsive design

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
- [ ] Set up Resend for email
- [ ] Implement email sending with PDF attachment

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
- Deployment via GitHub → Vercel pipeline
