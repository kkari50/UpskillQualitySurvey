# Project: Quick Quality Assessment Survey

## Quick Context

- **Purpose:** 27-question quality assessment tool for ABA agencies with population benchmarking
- **Tech Stack:** Next.js 14 (App Router), Supabase, Tailwind CSS, shadcn/ui, Vercel
- **Status:** Phase 0 - Pre-Development Setup

## GitHub Repository

- **Owner:** `kkari50`
- **Repo:** `UpskillQualitySurvey`
- **URL:** https://github.com/kkari50/UpskillQualitySurvey
- **Default branch:** `main`

When using GitHub MCP tools, always use:
```
owner: "kkari50"
repo: "UpskillQualitySurvey"
```

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

## MCP Servers

The following MCP servers are configured in `.mcp.json` for enhanced capabilities:

| Server | Package | Use When |
|--------|---------|----------|
| **supabase** | `@supabase/mcp-server-supabase` | Database queries, table operations, migrations |
| **playwright** | `@anthropic/mcp-playwright` | Browser automation, E2E testing, screenshots |
| **context7** | `@upstash/context7-mcp` | Looking up library documentation (React, Next.js, Tailwind, etc.) |
| **sequential-thinking** | `@modelcontextprotocol/server-sequential-thinking` | Complex multi-step reasoning, breaking down problems |
| **github** | `@modelcontextprotocol/server-github` | PR operations, issues, repo management |
| **filesystem** | `@modelcontextprotocol/server-filesystem` | Advanced file operations within project |

### When to Use Each MCP Server

**Supabase MCP** - Prefer for:
- Running SQL queries directly
- Creating/modifying tables
- Checking database state
- Debugging data issues

**Playwright MCP** - Prefer for:
- E2E test development
- Visual regression testing
- Taking screenshots of UI states
- Browser automation tasks

**Context7 MCP** - Prefer for:
- Looking up latest API documentation
- Checking library-specific patterns (shadcn/ui, Tailwind, Next.js)
- Finding code examples from official docs

**Sequential Thinking MCP** - Prefer for:
- Planning complex implementations
- Breaking down multi-step tasks
- Analyzing architectural decisions

**GitHub MCP** - Prefer for:
- Creating/reviewing PRs
- Managing issues
- Checking CI/CD status
- Repository operations

Always use these values for this project:
```javascript
owner: "kkari50"
repo: "WebAppTemplate"
```

**Filesystem MCP** - Prefer for:
- Batch file operations
- Directory tree operations
- File watching/monitoring

### MCP Server Configuration

Environment variables required (in `.env.local`):
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GITHUB_TOKEN=ghp_your_github_token
```

## Database

- Supabase project: `hrimxqdjbhlraadgowcf` (configured in `.env.local`)
- Use **Supabase MCP** for direct database operations
- Run migrations: `npx supabase db push` or execute SQL files in Supabase dashboard
- Generate types: `npx supabase gen types typescript --project-id hrimxqdjbhlraadgowcf > src/types/database.ts`
- Migrations: `supabase/migrations/*.sql`

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

## Git Workflow & Branching Strategy

### Branch Requirements

**Major features MUST use feature branches and Pull Requests:**

| Change Type | Branch Required | PR Required |
|-------------|-----------------|-------------|
| New feature/component | Yes | Yes |
| API endpoint | Yes | Yes |
| Database changes | Yes | Yes |
| Bug fixes (non-trivial) | Yes | Yes |
| Documentation updates | No | No |
| Small config changes | No | No |

### Branch Naming Convention

```bash
feature/<description>   # New features (feature/landing-page)
fix/<description>       # Bug fixes (fix/score-calculation)
refactor/<description>  # Code restructuring (refactor/api-routes)
test/<description>      # Test additions (test/survey-e2e)
```

### Feature Development Process

1. **Create feature branch from main:**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   ```

2. **Develop with frequent commits:**
   - Write tests first (TDD)
   - Make small, focused commits
   - Push regularly to remote

3. **Create Pull Request:**
   - Push branch to GitHub
   - Create PR with descriptive title and summary
   - Request Claude review

4. **Claude PR Review:**
   - Claude will review code for:
     - Test coverage (TDD compliance)
     - Mobile responsiveness
     - Code quality and patterns
     - Security concerns
     - Performance implications
   - Address review feedback
   - Get approval before merging

5. **Merge to main:**
   - Squash and merge preferred
   - Delete feature branch after merge

### PR Template

When creating PRs, include:

```markdown
## Summary
Brief description of changes

## Changes Made
- List of specific changes

## Test Plan
- [ ] Unit tests added
- [ ] E2E tests pass
- [ ] Tested on mobile

## Screenshots (if UI)
[Add screenshots]
```

### Claude Review Checklist

When reviewing PRs, Claude will verify:

- [ ] Tests written FIRST (TDD compliance)
- [ ] All tests pass (`npm run test:run`)
- [ ] Mobile-responsive design
- [ ] No TypeScript errors (`npm run build`)
- [ ] Follows style guide patterns
- [ ] No security vulnerabilities
- [ ] No console.log in production code
- [ ] Meaningful commit messages
- [ ] Documentation updated if needed

### Quick Reference

```bash
# Start feature
git checkout -b feature/my-feature

# Commit changes
git add .
git commit -m "feat: add component"

# Push and create PR
git push -u origin feature/my-feature

# After PR approved, merge via GitHub UI
# Then clean up
git checkout main
git pull origin main
git branch -d feature/my-feature
```

See `CONTRIBUTING.md` for complete Git workflow documentation.

---

## Development Workflow

1. **Create feature branch** for major work
2. **Write tests first** - TDD is mandatory
3. Check `context/tasks.md` for current task status
4. Read `context/requirements.md` before implementing features
5. Check `context/architecture.md` for technical decisions
6. Follow `context/style-guide.md` for UI consistency
7. **Test on mobile and desktop** before marking complete
8. Log decisions in `context/decisions.md`
9. Use `/plan` skill before major features
10. **Create PR and request Claude review**
11. Use `/commit` skill for clean commit messages

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
