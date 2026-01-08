# Quick Quality Assessment Survey - Decision Log

**Last Updated:** January 2026

This document logs all architectural, design, and implementation decisions with their rationale.

---

## Decision Log Format

Each decision follows this structure:
- **Date:** When decided
- **Context:** Why decision was needed
- **Options Considered:** Alternatives evaluated
- **Decision:** What was chosen
- **Rationale:** Why this option
- **Consequences:** Trade-offs and implications

---

## Architecture Decisions

### DEC-001: Normalized Answer Storage (Not JSONB)

**Date:** January 2026

**Context:** Need to store survey answers (27 Yes/No responses) and support reporting queries like "What % of agencies answered Yes to question X?"

**Options Considered:**
| Option | Pros | Cons |
|--------|------|------|
| JSONB blob | Simple writes, flexible | Complex aggregation queries |
| Normalized rows | Clean SQL for reporting | More rows (27 per response) |
| Hybrid (both) | Best of both | Data duplication |

**Decision:** Normalized rows in `survey_answers` table.

**Rationale:** Reporting is a core feature. Clean SQL aggregations outweigh the cost of more rows. PostgreSQL handles this scale easily.

**Consequences:**
- 27 INSERT statements per survey submission (can batch)
- Simple GROUP BY queries for per-question stats
- Easier to add question-level analytics later

---

### DEC-002: Static Questions with Versioning

**Date:** January 2026

**Context:** Where to store the 27 survey questions? How to handle question evolution over time?

**Options Considered:**
| Option | Pros | Cons |
|--------|------|------|
| Database table | Dynamic updates, admin UI possible | Overkill for static content |
| Static TypeScript | Fast, version controlled, type-safe | Redeploy to update |
| CMS | Non-dev can edit | Complexity, another service |

**Decision:** Static TypeScript files with version tracking.

**Rationale:** Questions rarely change. Benefits of type safety and fast loading outweigh flexibility. Version stored with each response for backward compatibility.

**Consequences:**
- Must redeploy to change questions
- Questions are in source control (good for audit)
- Version string stored with each response
- Can support multiple concurrent versions if needed

---

### DEC-003: Email Domain Grouping (V1/V2)

**Date:** January 2026

**Context:** Need to associate users with agencies for reporting, but don't want complex agency management in V1.

**Options Considered:**
| Option | Pros | Cons |
|--------|------|------|
| Agency-first model | Clean data, verified agencies | High friction, over-engineered |
| Free text agency field | Low friction | Duplicates, messy data |
| Email domain grouping | Automatic, zero friction | Personal emails not grouped into agencies |
| No agency tracking | Simplest | Lose valuable segmentation |

**Decision:** All email addresses are accepted. Auto-extract domain for optional agency grouping. Personal emails (gmail, etc.) are fully supported but stored with `email_domain: null` for agency grouping purposes. Work emails can be grouped by domain.

**Rationale:** Maximum accessibility - anyone can take the survey with any email. Agency grouping is a bonus feature for work email users, not a requirement. Full agency model deferred to V3.

**Consequences:**
- All users welcome regardless of email type
- Personal email users fully supported, just not grouped into agencies
- Work email users get automatic agency grouping
- Clean migration path to V3 agency model

---

### DEC-004: Agency-First Model Deferred to V3

**Date:** January 2026

**Context:** Initially considered requiring agency selection for all users.

**Options Considered:**
| Option | Phase |
|--------|-------|
| Required agency selection | V1 |
| Email domain only | V1 |
| Pre-seeded agency database | V3 |

**Decision:** Defer full agency model to V3. Use email domain grouping for V1/V2.

**Rationale:**
- Original requirements specified agency as optional
- Adding friction hurts lead conversion
- Need volume before agency-level features matter
- Need time to research/source agency data (NPI, etc.)

**Consequences:**
- V1/V2: Less accurate agency data
- V3: Will need to migrate domains to agencies
- V3: Will need data sources (NPI database, directories)

---

### DEC-005: Pre-Seeded Agency List (V3)

**Date:** January 2026

**Context:** For V3 agency model, how to populate agencies table?

**Options Considered:**
| Option | Pros | Cons |
|--------|------|------|
| User-created only | Simple | Cold start, duplicates |
| Pre-seeded + user-created | Good UX, fewer duplicates | Requires data sourcing |
| Verified only | Cleanest data | High friction |

**Decision:** Pre-seed from NPI database and ABA directories, allow user additions with fuzzy duplicate detection.

**Rationale:** Better UX when agencies already exist. Reduces duplicates. NPI is public data.

**Consequences:**
- Need to research and import NPI data
- Need fuzzy search (pg_trgm)
- Still need duplicate management

---

### DEC-006: No Authentication for V1

**Date:** January 2026

**Context:** Should users create accounts to take the survey?

**Options Considered:**
| Option | Pros | Cons |
|--------|------|------|
| Required auth | Clean user model | Friction, fewer leads |
| Optional auth | Flexibility | Complexity |
| No auth (email only) | Lowest friction, max leads | No saved history |

**Decision:** No authentication for V1. Email capture only.

**Rationale:** Primary goal is lead generation. Every friction point loses users. Auth adds complexity without V1 value.

**Consequences:**
- Users can't save/revisit results (unless they save URL)
- Lead-to-user migration needed in V2
- Simpler V1 implementation

---

### DEC-007: Results Token for URLs

**Date:** January 2026

**Context:** How should users access their results?

**Options Considered:**
| Option | Pros | Cons |
|--------|------|------|
| Email in URL | Simple | Security risk, ugly URL |
| Numeric ID | Short | Guessable (sequential) |
| UUID token | Secure, shareable | Long URL |
| Short hash | Compact | Collision risk |

**Decision:** UUID token in URL (`/results/{uuid}`).

**Rationale:** Secure (not guessable), shareable if user wants, standard practice.

**Consequences:**
- URLs are long but not user-typed
- Users must save URL to revisit
- Can share URL with others (by design)

---

### DEC-008: Materialized Views for Stats

**Date:** January 2026

**Context:** Population stats (average scores, percentiles) could be slow to compute on every request.

**Options Considered:**
| Option | Pros | Cons |
|--------|------|------|
| Real-time queries | Always fresh | Slow at scale |
| Materialized views | Fast queries | Slightly stale data |
| Application cache | Fast, flexible | Cache invalidation complexity |
| Pre-computed table | Fast | Update logic complex |

**Decision:** PostgreSQL materialized views refreshed hourly via pg_cron.

**Rationale:** Built into Supabase, no external dependencies, acceptable staleness (1 hour max).

**Consequences:**
- Stats up to 1 hour stale
- Fast queries regardless of data volume
- Automatic refresh, no application logic

---

### DEC-009: Browserless.io for PDF Generation

**Date:** January 2026

**Context:** Need to generate PDF reports with charts/dashboards for V2.

**Options Considered:**
| Option | Pros | Cons |
|--------|------|------|
| Puppeteer (self-hosted) | Full control | Chromium binary management on serverless |
| Browserless.io | Managed, no infra | Vendor dependency, cost |
| @react-pdf/renderer | No browser needed | Limited styling, no charts |
| Client-side (jsPDF) | Simple | Inconsistent quality |

**Decision:** Browserless.io (managed Puppeteer API).

**Rationale:** Dashboard PDFs need full HTML/CSS/JS rendering for charts. Browserless handles Chromium complexity. Free tier sufficient for launch.

**Consequences:**
- Vendor dependency
- Cost at scale ($50+/mo)
- High quality, consistent PDFs
- Can render any chart library

---

### DEC-010: shadcn/ui Component Library

**Date:** January 2026

**Context:** Need UI component library that matches UpskillABA brand and is customizable.

**Options Considered:**
| Option | Pros | Cons |
|--------|------|------|
| shadcn/ui | Own code, Radix primitives, Tailwind | Copy-paste setup |
| Radix UI (raw) | Full control | More styling work |
| Chakra UI | Batteries included | Harder to customize |
| MUI | Comprehensive | Heavy, Material style |
| Custom | Exact match | Time consuming |

**Decision:** shadcn/ui with custom theme matching UpskillABA colors.

**Rationale:** Accessible components (Radix), Tailwind styling, full ownership of code, easy to customize.

**Consequences:**
- Must copy components into project
- Full control over styling
- Accessible by default
- Consistent with Tailwind approach

---

### DEC-011: Minimum 10 Responses for Stats

**Date:** January 2026

**Context:** When should population comparison data be shown?

**Options Considered:**
| Option | Threshold | Rationale |
|--------|-----------|-----------|
| Always show | 0 | Maximum feature availability |
| Low threshold | 5 | Quick to activate |
| Medium threshold | 10 | Statistical relevance |
| High threshold | 50 | High confidence |

**Decision:** Minimum 10 responses before showing population comparison.

**Rationale:** Balance between statistical meaning and quick feature activation. 10 gives directional value without being misleading.

**Consequences:**
- Early users see no comparison (acceptable)
- Feature activates relatively quickly
- Messaging for "not enough data yet" state needed

---

### DEC-012: Upstash Redis for Rate Limiting

**Date:** January 2026

**Context:** Need rate limiting to prevent abuse of public API endpoints.

**Options Considered:**
| Option | Pros | Cons |
|--------|------|------|
| In-memory | Simple | Resets on deploy, per-instance |
| Upstash Redis | Persistent, serverless-native | External dependency |
| Vercel KV | Vercel-native | Vendor lock-in |
| IP-based only | Simple | Can be bypassed |

**Decision:** Upstash Redis with sliding window rate limiting.

**Rationale:** Purpose-built for serverless, generous free tier, shared state across instances.

**Consequences:**
- Additional service dependency
- Reliable rate limiting across deploys
- Can track limits per IP

---

## Design Decisions

### DES-001: Single Question Per Screen

**Date:** January 2026

**Context:** How to display 27 survey questions?

**Decision:** One question at a time with progress indicator.

**Rationale:** Reduces cognitive load, matches reference app pattern, better mobile experience, clearer progress tracking.

---

### DES-002: Teal Primary Color

**Date:** January 2026

**Context:** What primary color to use?

**Decision:** Teal (#0D9488, Tailwind `teal-600`) as primary, matching UpskillABA brand.

**Rationale:** Brand consistency with upskillaba.com. Modern variant of their original #07887e.

---

### DES-003: Soft Semantic Colors

**Date:** January 2026

**Context:** What colors for Yes/No responses and score levels?

**Decision:**
- Success: Emerald (#10B981) - not harsh green
- Warning: Amber (#F59E0B)
- Attention: Rose (#FB7185) - soft, not dark red

**Rationale:** User requested "no dark colors for danger." Soft rose is modern, less alarming than traditional red.

---

### DES-004: Prominent Score Display

**Date:** January 2026

**Context:** How prominent should the score be on results page?

**Decision:** Score is the hero - large typography (7xl/8xl), centered, with percentage and label.

**Rationale:** User explicitly requested prominent scores. This is the primary value users get.

---

## Process Decisions

### PRO-001: Three-Phase Release

**Date:** January 2026

**Context:** How to scope releases?

**Decision:**
- V1: Public survey, online results, population comparison
- V2: Auth, PDF email, Stripe payments
- V3: Full agency model, agency dashboards

**Rationale:** Ship value quickly, iterate based on usage. V1 validates core value proposition before adding complexity.

---

### PRO-002: Context Directory as Source of Truth

**Date:** January 2026

**Context:** How to maintain project documentation?

**Decision:** All context documents live in `/context/` directory:
- requirements.md
- architecture.md
- style-guide.md
- api-design.md
- tasks.md (this file's source of truth)
- decisions.md (this file)

**Rationale:** Single location for all project context. AI assistant can reference for consistent implementation.

---

## Rejected Decisions

### REJ-001: Agency-First Model for V1

**Date:** January 2026

**What was proposed:** Require agency selection for all survey takers.

**Why rejected:** Over-engineered for V1 needs. Adds friction to lead capture. Requirements specified optional. Deferred to V3.

---

### REJ-002: JSONB for Answer Storage

**Date:** January 2026

**What was proposed:** Store all 27 answers as JSONB blob.

**Why rejected:** Reporting queries become complex. Normalized rows are cleaner for per-question analytics.

---

### REJ-003: Invite-Based Agency Model

**Date:** January 2026

**What was proposed:** Agencies register first, share invite codes with team.

**Why rejected:** Too much friction for lead-gen tool. Good for enterprise, wrong for this use case.

---

### REJ-004: Client-Side PDF Generation

**Date:** January 2026

**What was proposed:** Use jsPDF or html2canvas on client.

**Why rejected:** Dashboard with charts needs full HTML/CSS rendering. Client-side quality is inconsistent. Server-side via Browserless.io is better.

---

## Versioning Decisions

### DEC-013: Cross-Version Population Comparison

**Date:** January 2026

**Context:** When comparing user scores to population averages, should we compare only within the same version or across all versions?

**Options Considered:**
| Option | Pros | Cons |
|--------|------|------|
| Same version only | Apples-to-apples comparison | Fragmented data, slow stats buildup |
| All versions (percentage-based) | Larger comparison pool | Slight drift if questions change |
| Weighted by version | Balanced | Complex implementation |

**Decision:** Compare across all versions using percentage-based comparison.

**Rationale:** Questions are expected to be stable. Using percentages normalizes across different max_scores. Larger comparison pool gives more meaningful stats faster.

**Consequences:**
- Stats are meaningful from day one of new versions
- Must track both raw score and max_score
- Slight comparison drift possible if questions change significantly

---

### DEC-014: Deprecated Question Handling

**Date:** January 2026

**Context:** How should deprecated questions be handled in reporting and analysis?

**Options Considered:**
| Option | Pros | Cons |
|--------|------|------|
| Include all historical | Complete data | May skew if question was problematic |
| Skip deprecated | Cleaner analysis | Lose historical data |
| Weight by deprecation | Balanced | Complex |

**Decision:** Skip deprecated questions in population analysis.

**Rationale:** If a question is deprecated, it was likely problematic or irrelevant. Including it skews insights. Historical responses still stored but excluded from active stats.

**Consequences:**
- Cleaner reporting
- Historical data preserved in database
- Need `deprecated_at` field and filter in queries

---

### DEC-015: Users Always Get Latest Survey Version

**Date:** January 2026

**Context:** Should users be able to choose or be assigned different survey versions?

**Options Considered:**
| Option | Pros | Cons |
|--------|------|------|
| Version selection | A/B testing possible | Fragmented UX |
| Assigned version | Controlled rollout | Complex logic |
| Always latest | Simple, consistent | No rollback |

**Decision:** All users receive the latest survey version.

**Rationale:** Simplicity. Questions are stable. No need for version management complexity. If issues arise, can deprecate and add new questions.

**Consequences:**
- Simple implementation
- No version routing logic
- All users have same experience
- Can't run A/B tests on questions (acceptable for V1)

---

### DEC-016: Survey Immutability After Submission

**Date:** January 2026

**Context:** Can users edit their survey responses after submission?

**Options Considered:**
| Option | Pros | Cons |
|--------|------|------|
| Allow edits | User flexibility | Data integrity issues, version drift |
| Time-limited edits | Grace period | Added complexity |
| No edits (new survey) | Data integrity | User must retake entirely |

**Decision:** Surveys are immutable after submission. Users must take a new survey to update responses.

**Rationale:** Maintains data integrity for population stats. Prevents version drift issues if questions change between submission and edit. Users wanting updated scores can simply retake (it's quick).

**Consequences:**
- Clean data model
- No edit logic needed
- Users must bookmark results URL
- Retaking creates new response (tracks progress over time)

---

## Development Practices

### DEC-017: Test-Driven Development (TDD) Mandatory

**Date:** January 2026

**Context:** Establishing development methodology for the project.

**Decision:** Test-Driven Development is mandatory. All tests must be written BEFORE implementation code.

**Rationale:** TDD ensures code quality, prevents regressions, and creates living documentation. Catching bugs early is cheaper than fixing them later.

**Consequences:**
- Slower initial development, faster long-term velocity
- Higher confidence in refactoring
- Tests serve as documentation
- CI/CD can gate deployments on test passage

**Testing Stack:**
- Unit tests: Vitest
- Component tests: React Testing Library
- E2E tests: Playwright
- API tests: Supertest or Vitest

---

### DEC-018: Mobile-First Responsive Design

**Date:** January 2026

**Context:** Defining the approach to responsive design.

**Decision:** Mobile-first responsive design is mandatory. All features must work on mobile before desktop.

**Rationale:** Survey takers may use phones. Mobile-first forces focus on essential content and interactions. Scaling up is easier than scaling down.

**Consequences:**
- Design starts at smallest breakpoint
- Progressive enhancement for larger screens
- Touch-friendly interactions (44px minimum tap targets)
- Must test on real mobile devices

**Breakpoints:**
- Default: mobile
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

---

### DEC-019: Modern Best Practices (2025/2026 Standards)

**Date:** January 2026

**Context:** Ensuring the application uses current industry standards.

**Decision:** Follow modern React/Next.js patterns and current best practices.

**Implementation:**
- React 18+ with Server Components where appropriate
- Next.js 14 App Router, Server Actions, streaming
- TypeScript strict mode, no `any` types
- Tailwind CSS utility-first with CSS variables
- shadcn/ui for accessible components
- Core Web Vitals compliance (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- WCAG 2.1 AA accessibility
- Security: Zod validation, rate limiting, secure headers

**Consequences:**
- Higher initial learning curve
- Better performance and accessibility
- Future-proof architecture
- Easier maintenance

---

### DEC-020: Test Data Flagging and Cleanup

**Date:** January 2026

**Context:** E2E tests (Playwright) will submit surveys, creating records in the database. Need a way to identify and clean up test data to prevent database bloat.

**Options Considered:**
| Option | Pros | Cons |
|--------|------|------|
| Special email domain (@test.example.com) | Easy to identify, no schema change | Relies on convention |
| `is_test` boolean column | Explicit, queryable | Schema change, default false |
| Test header + server flag | No visible difference | Complex implementation |
| Separate test database | Complete isolation | Infrastructure overhead |

**Decision:** Combine two approaches:
1. Add `is_test` boolean column to `leads` and `survey_responses` tables (default `false`)
2. Use special test email pattern: `test+*@playwright.local` or `*@test.example.com`
3. API detects test emails and auto-sets `is_test: true`
4. Scheduled cleanup job deletes records where `is_test = true` and older than 24 hours

**Implementation:**
```sql
-- Add to schema
ALTER TABLE leads ADD COLUMN is_test BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE survey_responses ADD COLUMN is_test BOOLEAN NOT NULL DEFAULT false;

-- Cleanup query (run daily via cron)
DELETE FROM survey_answers WHERE response_id IN (
  SELECT id FROM survey_responses WHERE is_test = true AND created_at < NOW() - INTERVAL '24 hours'
);
DELETE FROM survey_responses WHERE is_test = true AND created_at < NOW() - INTERVAL '24 hours';
DELETE FROM leads WHERE is_test = true AND created_at < NOW() - INTERVAL '24 hours';
```

**Test Email Patterns:**
- `test+anything@playwright.local`
- `*@test.example.com`
- `e2e-*@example.com`

**Rationale:** Explicit flagging prevents accidental deletion of real data. Email pattern detection makes it easy for tests to trigger. 24-hour retention allows debugging failed tests.

**Consequences:**
- Schema includes `is_test` column
- API must detect test email patterns
- Need pg_cron or external job for cleanup
- Test data visible briefly but auto-cleaned
