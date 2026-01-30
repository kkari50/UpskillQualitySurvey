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

### DES-004: Prominent Score Display with Circular Progress Ring

**Date:** January 2026

**Context:** How prominent should the score be on results page?

**Decision:** Score is the hero - displayed as a large circular progress ring (144px diameter) with percentage in center, matching the category breakdown visualization style.

**Implementation:**
- Circular progress ring (donut chart) with 10px stroke width
- Colors follow Section 3.4 score thresholds (emerald-500, amber-500, rose-400)
- Percentage displayed prominently in center (4xl font)
- Animated fill transition (700ms)
- Consistent visual language with category breakdown rings

**Rationale:** User explicitly requested prominent scores and consistent visualization. Circular progress ring matches category breakdown for visual cohesion across the results page.

---

### DES-005: Circular Progress Rings for Category Breakdown

**Date:** January 2026

**Context:** How to visualize per-category scores on the results page?

**Options Considered:**
| Option | Pros | Cons |
|--------|------|------|
| Horizontal bar charts | Familiar, easy to compare | Bold colors felt too harsh |
| Circular progress rings (donuts) | Modern, clean, compact | Less familiar pattern |
| Stacked cards with meters | Rich detail | Takes more vertical space |
| Spider/radar chart | Shows all at once | Complex, not intuitive |

**Decision:** Circular progress rings (donut charts) with score-based coloring.

**Implementation:**
- SVG-based circular progress with animated fill
- Colors follow Section 3.4 score thresholds:
  - Strong (85%+): `emerald-500` (#10B981)
  - Moderate (60-84%): `amber-500` (#F59E0B)
  - Needs Improvement (<60%): `rose-400` (#FB7185)
- 5-column grid on desktop (lg:grid-cols-5), responsive grid on smaller screens
- Percentage displayed in center of ring

**Rationale:** User requested softer visual appearance after bar charts appeared too bold. Circular progress rings provide a modern, clean look that's compact and visually appealing. Score-based coloring maintains consistency with overall results display.

**Consequences:**
- Consistent color language across all score displays
- More modern/polished appearance
- Slightly less familiar than bar charts
- Works well across all screen sizes

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

---

### DES-006: Global Navigation with Survey Results Link

**Date:** January 2026

**Context:** Users need a way to look up their previous survey results from any page in the application.

**Options Considered:**
| Option | Pros | Cons |
|--------|------|------|
| No global nav | Simpler | Users can't easily find past results |
| Footer link only | Unobtrusive | Low visibility |
| Header right-side link | Visible, consistent | Takes header space |
| Hamburger menu | Clean header | Extra click on mobile |

**Decision:** Add "Survey Results" link to the right side of the global header, visible on all pages.

**Implementation:**
- Header: Logo/brand on left, "Survey Results" link on right
- Links to `/results` page
- Mobile: Same layout, responsive header

**Results Page Behavior:**
- Default view (no email entered): Display population-level statistics
  - Average scores across all respondents
  - Score distribution by category
  - Total survey completions
  - Per-question benchmarks ("X% answered Yes")
- Email lookup: Optional email input field
  - If email found: Show individual results + population comparison
  - If email not found: Prompt user to take the survey

**Rationale:** Maximum visibility for result lookup feature. Showing population stats by default provides value even to non-participants, encouraging them to take the survey. Right-side placement follows common navigation patterns.

**Consequences:**
- `/results` page serves dual purpose: population stats + individual lookup
- Consistent navigation across all pages
- Mobile header must accommodate link
- Population stats API endpoint needed

---

### DES-007: Split Compound Data Analysis Question

**Date:** January 2026

**Context:** Question da_003 in the Data Analysis category was a compound question covering two distinct concepts:
> "The percentage of goals mastered for current treatment plan goals are monitored as an organization metric; goals that continue into the next authorization period have had any barriers identified, resolved, and have had protocols modified"

This made the question difficult to answer accurately since respondents might have "Yes" for one part and "No" for the other.

**Decision:** Split into two separate questions:
1. **da_003:** "The percentage of goals mastered for current treatment plan goals are monitored as an organization metric"
2. **da_004:** "Goals that continue into the next authorization period have had any barriers identified, resolved, and have had protocols modified"

**Impact:**
- Data Analysis category: 5 → 6 questions
- Total survey questions: 27 → 28
- Max score: 27 → 28
- Performance thresholds updated:
  - Strong: 85%+ (24-28)
  - Moderate: 60-84% (17-23)
  - Needs Improvement: <60% (0-16)

**Rationale:** Each question should measure a single, clear practice. Compound questions create ambiguity and reduce data quality. Splitting allows more precise identification of improvement areas.

**Consequences:**
- Clearer survey responses
- Better granularity in Data Analysis category
- All documentation and code updated to reflect 28 questions

---

### DES-008: Donut Chart Center Label Alignment

**Date:** January 2026

**Context:** When displaying donut charts (pie charts with inner radius), center labels were misaligning. Multiple approaches were tried before finding the correct solution.

**Problem:** Two approaches were attempted and failed:
1. **Recharts Label component** - Using `viewBox.cx` and `viewBox.cy` coordinates inside `<Pie>` required manual offset calculations that varied with chart size and were difficult to get right
2. **Absolute positioning with percentages** - Using `top: X%` relative to the container didn't account for the chart's internal coordinate system

**Decision:** Use the **card container as the reference frame** with CSS flexbox centering and padding offset for legend space.

**Implementation Rules:**

```tsx
// CORRECT: Position relative to CardContent boundaries
<CardContent className="h-[300px] relative">
  {/* Center label - positioned relative to card, not SVG */}
  <div
    className="absolute inset-0 flex items-center justify-center pointer-events-none"
    style={{ paddingBottom: '50px' }} /* Account for legend space */
  >
    <div className="flex flex-col items-center">
      <span className="text-4xl font-bold text-foreground">{displayValue}</span>
      <span className="text-sm text-muted-foreground">{centerLabel}</span>
    </div>
  </div>
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie cx="50%" cy="45%" innerRadius={60} outerRadius={90} dataKey="value">
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Legend verticalAlign="bottom" />
    </PieChart>
  </ResponsiveContainer>
</CardContent>

// WRONG: Don't use Recharts Label with manual offset calculations
<Label content={({ viewBox }) => {
  // This requires guessing y-offset values that vary with chart size
  return <tspan y={(cy ?? 0) - 10}>...</tspan>
}} />

// WRONG: Don't use percentage-based absolute positioning
<div style={{ top: '42%' }}>
  {/* Doesn't account for legend or chart position */}
</div>
```

**Key Points:**
1. Use `CardContent` with `position: relative` as the reference container
2. Center label uses `absolute inset-0` to cover the entire card content area
3. Use `flex items-center justify-center` for perfect horizontal and vertical centering
4. Apply `paddingBottom: 50px` (or similar) to offset for legend space at bottom
5. Add `pointer-events-none` so the overlay doesn't block chart interactions
6. Keep the Pie's `cy="45%"` to position the chart appropriately with legend

**Rationale:** Using the card container as reference provides predictable centering that:
- Works regardless of ResponsiveContainer sizing
- Doesn't require coordinate system calculations
- Uses standard CSS flexbox (well-understood, reliable)
- Only needs one offset value (paddingBottom for legend)

**Consequences:**
- Center labels always align perfectly within the donut hole
- Works at all screen sizes and responsive breakpoints
- Simple to understand and maintain
- Consistent behavior across different chart configurations

---

### DES-009: Not Applicable Pattern for Yes/No Checklists

**Date:** January 2026

**Context:** The Get Ready Checklist uses Yes/No buttons for each item. Some items include a qualifier like "(if used)" — meaning the item may not apply to every user. An N/A option is needed for those items, but not for all items.

The initial implementation added a third N/A button (minus icon) inline with the Yes/No buttons on applicable rows. This caused a visual inconsistency: rows with N/A had 3 buttons while all others had 2, shifting the Yes/No buttons out of alignment and making the interface look unpolished.

**Options Considered:**
| Option | Pros | Cons |
|--------|------|------|
| Inline 3rd button on applicable rows | Discoverable, grouped with Yes/No | Misaligns button layout, looks inconsistent |
| 3 buttons on all rows (disable N/A where not applicable) | Consistent width | Wastes space, confusing disabled buttons |
| Text link below question text | Keeps 2-button alignment, subtle, clear | Second interaction zone below the row |
| Make "(if used)" text clickable | Contextual, no extra UI | Not discoverable, accessibility concerns |

**Decision:** Use a subtle text link ("Mark as not applicable") positioned below the question text. When selected, the Yes/No buttons disable and dim, the question text gets a strikethrough, and the link shows "Not applicable (undo)".

**Implementation:**
- **Data model:** `allowNA?: boolean` flag on `ChecklistItem` interface
- **Web UI:** Text link below question text; Yes/No buttons disable + dim on N/A; question text gets `line-through` + `text-slate-400`
- **PDF:** N/A rows render with italic strikethrough text, dimmed row number, "Not applicable" label below item text, and subtle `#F8FAFC` background

**Rationale:** This approach preserves the clean 2-button layout across all rows. The N/A action is visually separated from the answer action, making it clear that "not applicable" is a different kind of response. The text link is discoverable without disrupting the primary Yes/No interaction pattern. The PDF mirrors the web treatment for consistency between on-screen and printed output.

**Consequences:**
- All rows maintain consistent Yes/No button alignment
- N/A items are visually distinct in both web and PDF
- Pattern is reusable: any future checklist item can opt in with `allowNA: true`
- Slightly more vertical space used on N/A rows (text link adds ~20px)

**Reference files:**
- Data: `src/components/pdf/get-ready-checklist-data.ts`
- Web UI: `src/app/resources/get-ready-checklist/page.tsx`
- PDF: `src/components/pdf/GetReadyChecklistPDF.tsx`
- Style guide: Section 6.6 in `context/style-guide.md`

---

### DEC-021: Magic Link for Results Retrieval

**Date:** January 2026

**Context:** Users need a way to retrieve their survey results by email. The implementation must prevent email enumeration attacks (where attackers can determine if an email exists in the database).

**Options Considered:**
| Option | Pros | Cons |
|--------|------|------|
| 6-digit verification code | Familiar UX, short-lived | Allows enumeration if different responses |
| Magic link (privacy-preserving) | No enumeration, permanent access | Requires email service |
| Email lookup with CAPTCHA | Reduces abuse | Still allows enumeration |
| No email lookup (save URL only) | Simplest | Poor UX, users lose access |

**Decision:** Magic link with privacy-preserving design:
- Same response message regardless of email existence
- Email EXISTS: Send magic link with results token
- Email does NOT exist: Send survey invitation
- Email is ALWAYS sent, preventing enumeration

**Technical Details:**
- Magic link uses signed JWT containing email and latest results_token
- No expiry - permanent bookmark to results
- No usage limits - users can share if they choose
- Results page does not display email (anonymous to viewers)

**Rationale:** Privacy is paramount. Users should not be able to discover if someone else has taken the survey. The magic link approach provides excellent UX while maintaining security.

**Consequences:**
- Requires email service (Resend) in V1
- Slightly higher operational cost (emails sent even for non-users)
- Excellent privacy protection
- Users have permanent access to their results

---

### DEC-022: Resources Storage Strategy

**Date:** January 2026

**Context:** Each survey question needs linked resources (PDFs, job aids, action statements) to help agencies improve. Need to determine storage approach.

**Options Considered:**
| Option | Pros | Cons |
|--------|------|------|
| Database table | Dynamic updates | Over-engineered, sync complexity |
| Static TypeScript | Version controlled, type-safe | Redeploy for updates |
| External links only | Kristen updates directly | No metadata, fragile |
| Hybrid (TypeScript + external links) | Best of both | Slight complexity |

**Decision:** Hybrid approach:
- Resource metadata stored as static TypeScript (version controlled)
- External links for actual files (Google Drive, etc.)
- Inline text for action statements
- TypeScript provides structure, external links allow Kristen to update files

**Implementation:**
```typescript
interface Resource {
  questionId: string           // Links to question
  type: 'pdf' | 'link' | 'text'
  title: string
  description?: string
  url?: string                 // For pdf and link types
  content?: string             // For text type
}
```

**Rationale:** Flexibility for mixed content types while maintaining version control for the mappings. External files can be updated without code changes.

**Consequences:**
- New data directory: `src/data/resources/`
- Mappings version controlled
- External files can break if URLs change
- Easy to audit which resources exist

---

### DEC-023: Email Service Promotion to V1

**Date:** January 2026

**Context:** Originally, email service (Resend) was planned for V2 (PDF delivery). Magic link feature now requires email in V1.

**Options Considered:**
| Option | Pros | Cons |
|--------|------|------|
| Keep email in V2, no magic links | Simpler V1 | Poor UX for results retrieval |
| Add Resend to V1 | Magic links work | Earlier infrastructure cost |
| Use different email for V1 vs V2 | Possible optimization | Unnecessary complexity |

**Decision:** Promote Resend to V1 scope for magic link emails.

**Implementation:**
- Add `RESEND_API_KEY` to V1 environment variables
- Create email templates for magic link and survey invitation
- Rate limit magic link requests to prevent abuse

**Rationale:** Magic link is a high-value feature that significantly improves UX. The infrastructure cost is minimal and will be reused in V2.

**Consequences:**
- Earlier Resend setup
- Additional environment variable
- Email templates needed in V1
- Foundation ready for V2 PDF emails

---

### DEC-024: Agency Size Ranking Threshold

**Date:** January 2026

**Context:** Users want to see how they rank compared to similar-sized agencies. Need to determine when to show this ranking.

**Options Considered:**
| Option | Threshold | Rationale |
|--------|-----------|-----------|
| Always show | 0 | Maximum feature availability |
| Low threshold | 5 | Quick activation |
| Consistent threshold | 10 | Same as population comparison |
| Higher threshold | 20 | More statistical confidence |

**Decision:** Use same threshold as population comparison: 10 responses per agency size category.

**Implementation:**
- Agency size categories: small (1-10 BCBAs), medium (11-50), large (51-200), enterprise (200+)
- Show ranking only when 10+ responses exist in that category
- Display "Not enough data for [size] agencies yet" when below threshold

**Rationale:** Consistency with existing threshold (DEC-011). 10 provides directional value without being misleading. Different thresholds for different features would confuse users.

**Consequences:**
- Ranking may not be available for all size categories initially
- Need clear messaging for insufficient data
- Consistent user expectations across features
