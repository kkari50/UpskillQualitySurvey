# Project: Quick Quality Assessment Survey

## Quick Context

- **Purpose:** 27-question quality assessment tool for ABA agencies with population benchmarking
- **Tech Stack:** Next.js 14 (App Router), Supabase, Tailwind CSS, shadcn/ui, Vercel
- **Status:** Phase 0 - Pre-Development Setup

## Development Principles

### Test-Driven Development (TDD) - MANDATORY

**Tests must be written FIRST before any implementation code.**

1. Write failing tests that define expected behavior
2. Write minimal code to make tests pass
3. Refactor while keeping tests green
4. No feature is complete without tests

**Testing Stack:**
- Unit tests: Vitest
- Component tests: React Testing Library
- E2E tests: Playwright
- API tests: Supertest or Vitest

**Test Coverage Requirements:**
- All API endpoints must have integration tests
- All components must have unit tests
- Critical user flows must have E2E tests
- Aim for >80% code coverage

**E2E Test Data Handling:**
- Test submissions use special email patterns that auto-flag as test data
- Test emails: `test+*@playwright.local`, `*@test.example.com`, `e2e-*@example.com`
- Test data is flagged with `is_test: true` in the database
- Scheduled job auto-deletes test data older than 24 hours
- See `src/lib/constants/email-domains.ts` for `isTestEmail()` function

### Responsive Design - Mobile-First

**The application MUST be fully responsive.**

1. Design mobile-first, then scale up
2. Test on real devices, not just browser DevTools
3. Support breakpoints: mobile (default), sm (640px), md (768px), lg (1024px), xl (1280px)
4. Touch-friendly interactions (min 44px tap targets)
5. Optimize for both mobile and desktop experiences

**Key Responsive Patterns:**
- Single-column layouts on mobile
- Card stacks instead of side-by-side on small screens
- Collapsible navigation on mobile
- Bottom-sheet modals on mobile, centered modals on desktop

### Modern Best Practices

**Follow current 2025/2026 standards:**

- **React 18+:** Use Server Components where appropriate, Suspense boundaries
- **Next.js 14:** App Router, Server Actions, streaming
- **TypeScript:** Strict mode, no `any` types, exhaustive type checking
- **Tailwind CSS:** Utility-first, design tokens via CSS variables
- **shadcn/ui:** Accessible components built on Radix primitives
- **Performance:** Core Web Vitals targets (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- **Accessibility:** WCAG 2.1 AA compliance, keyboard navigation, screen reader support
- **Security:** Input validation (Zod), CSRF protection, rate limiting, secure headers

## Key Files

- Requirements: `context/requirements.md`
- Architecture: `context/architecture.md`
- Style Guide: `context/style-guide.md`
- API Design: `context/api-design.md`
- Tasks: `context/tasks.md` (source of truth for all tasks)
- Decisions: `context/decisions.md` (decision log with rationale)

## Data Files

- Questions Schema: `src/data/questions/schema.ts`
- Questions v1.0: `src/data/questions/v1.0.ts`
- Questions Index: `src/data/questions/index.ts`
- Category Constants: `src/lib/constants/categories.ts`
- Email Domain Utils: `src/lib/constants/email-domains.ts`

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
npm run test     # Run tests
npm run test:e2e # Run E2E tests
npm run start    # Start production server
```

## Database

- Supabase project: [TO BE CREATED]
- Run migrations: `npx supabase db push`
- Generate types: `npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts`

### Key Tables (V1)
- `leads` - Email capture and optional agency domain grouping
- `survey_responses` - Survey metadata and scores
- `survey_answers` - Individual answers (27 rows per response)
- `population_stats` - Materialized view for averages

## Deployment

- Vercel project: [TO BE CONFIGURED]
- Preview deploys on every PR
- Production deploys on merge to `main`

## Release Phases

- **V1:** Public survey, online results dashboard, population comparison
- **V2:** Auth, PDF email, Stripe payments
- **V3:** Full agency model with pre-seeded data

## Important Notes

- All context documents live in the `context/` folder
- Use Zod for input validation on all API endpoints
- Supabase client configuration is in `src/lib/supabase/`
- UI primitives go in `src/components/ui/`
- Layout components go in `src/components/layout/`
- Questions are stored as static TypeScript (not database)
- All email types accepted - personal emails just aren't grouped into agencies
- Minimum 10 responses required before showing population comparison

## Development Workflow

1. **Write tests first** - TDD is mandatory
2. Check `context/tasks.md` for current task status
3. Read `context/requirements.md` before implementing features
4. Check `context/architecture.md` for technical decisions
5. Follow `context/style-guide.md` for UI consistency
6. **Test on mobile and desktop** before marking complete
7. Log decisions in `context/decisions.md`
8. Use `/plan` skill before major features
9. Use `/commit` skill for clean commit messages

## Survey Structure

- 27 Yes/No questions across 5 categories
- Categories: Daily Sessions (7), Treatment Fidelity (5), Data Analysis (5), Caregiver Guidance (6), Supervision (4)
- Score = count of "Yes" answers
- Performance levels: Strong (85%+), Moderate (60-84%), Needs Improvement (<60%)

## Brand

- Primary color: Teal (#0D9488)
- Success: Emerald (#10B981)
- Warning: Amber (#F59E0B)
- Attention: Rose (#FB7185) - soft, not dark red

## Code Quality Standards

- ESLint + Prettier for formatting
- Husky pre-commit hooks for linting and tests
- No console.log in production code
- Meaningful variable and function names
- Small, focused functions (< 50 lines preferred)
- Components should do one thing well
