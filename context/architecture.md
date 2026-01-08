# Quick Quality Assessment Survey - Architecture

**Version:** 1.0
**Last Updated:** January 2026

---

## Release Phases

| Phase | Scope | Agency Handling |
|-------|-------|-----------------|
| **V1** | Public survey, online results, population comparison | Email domain grouping (automatic) |
| **V2** | Auth, PDF email, Stripe payments | Same as V1 + lead-to-user migration |
| **V3** | Full agency model, agency dashboards | Pre-seeded list (NPI, directories) + fuzzy search |

---

## Tech Stack

| Layer | Technology | Phase |
|-------|------------|-------|
| Frontend | Next.js 14 (App Router) | V1 |
| UI Components | shadcn/ui + Radix UI | V1 |
| Styling | Tailwind CSS | V1 |
| State | Zustand + localStorage backup | V1 |
| Database | Supabase (PostgreSQL) | V1 |
| Validation | Zod | V1 |
| Charts | Recharts | V1 |
| Rate Limiting | Upstash Redis | V1 |
| Hosting | Vercel | V1 |
| Authentication | Supabase Auth | V2 |
| PDF Generation | Browserless.io | V2 |
| Email | Resend | V2 |
| Background Jobs | Inngest | V2 |
| Payments | Stripe | V2 |

---

## V1: Public Survey

### Features
- 27-question survey (public, no auth)
- Email capture (required) with name/role (optional)
- Online results dashboard with scores
- Population comparison (individual vs average)
- Question-level benchmarking ("72% answered Yes")

### Agency Handling (V1)
- Auto-extract email domain
- Personal emails (gmail, yahoo, etc.) → Not grouped
- Work emails → Grouped by domain for reporting

### User Flow
```
Landing → Survey (27 questions) → Email Capture → Results Dashboard
                                                        ↓
                                              /results/{token}
```

---

## V2: Auth + Premium

### New Features
- Supabase Auth (optional accounts)
- PDF results emailed (Browserless.io + Resend)
- Background job processing (Inngest)
- Stripe payments for premium resources
- Saved history for logged-in users

### Lead → User Migration
- Email is the linking key
- On signup, check for existing lead with same email
- Link `user_id` to lead, preserve all historical responses

---

## V3: Full Agency Model

### New Features
- Pre-seeded agency database (Option C)
- Agency search + selection UI
- Agency-level dashboards (team scores)
- Comparison within agency
- Admin tools for duplicate cleanup

### Data Sources to Research
- NPI database (NPPES)
- State licensing boards
- ABA provider directories
- Insurance panel lists

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Landing page
│   ├── survey/
│   │   └── page.tsx                # Survey interface
│   ├── results/
│   │   └── [token]/page.tsx        # Results dashboard
│   └── api/
│       ├── survey/
│       │   └── submit/route.ts     # Submit survey
│       └── stats/
│           └── route.ts            # Population stats
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── survey/                     # Survey-specific
│   ├── results/                    # Results page
│   └── forms/                      # Form components
├── data/
│   └── questions/
│       ├── index.ts                # Current version export
│       ├── v1.0.ts                 # Question definitions
│       └── schema.ts               # TypeScript types
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser client
│   │   └── service.ts              # Server client (service role)
│   ├── validation/
│   │   └── survey.ts               # Zod schemas
│   ├── scoring.ts                  # Score calculation
│   └── utils.ts                    # Helpers
├── hooks/
│   └── useSurvey.ts                # Survey state management
└── types/
    └── database.ts                 # Generated Supabase types
```

---

## Database Schema (V1)

### `leads`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| email | text | Unique, required |
| name | text | Optional |
| role | text | Optional (enum) |
| email_domain | text | Extracted from email (null for personal emails) |
| marketing_consent | boolean | GDPR compliance |
| is_test | boolean | Default false, true for E2E test data |
| user_id | uuid | Nullable, for V2 migration |
| claimed_at | timestamptz | When linked to user (V2) |
| created_at | timestamptz | Auto |

### `survey_responses`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| lead_id | uuid | FK → leads |
| survey_version | text | "1.0" |
| total_score | integer | Calculated score |
| max_possible_score | integer | 27 for v1.0 |
| results_token | text | Unique, for results URL |
| is_test | boolean | Default false, true for E2E test data |
| completed_at | timestamptz | Auto |

### `survey_answers`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| response_id | uuid | FK → survey_responses |
| question_id | text | e.g., "ds_001" |
| answer | boolean | Yes = true, No = false |

### Materialized Views (Population Stats)
```sql
-- Overall stats
CREATE MATERIALIZED VIEW survey_stats AS
SELECT survey_version, COUNT(*), AVG(total_score),
       PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY total_score)
FROM survey_responses GROUP BY survey_version;

-- Per-question stats
CREATE MATERIALIZED VIEW question_stats AS
SELECT question_id, survey_version,
       AVG(CASE WHEN answer THEN 1.0 ELSE 0.0 END) * 100 as yes_percentage
FROM survey_answers sa JOIN survey_responses sr ON sa.response_id = sr.id
GROUP BY question_id, survey_version;

-- Refresh hourly via pg_cron
SELECT cron.schedule('refresh-stats', '0 * * * *', 'REFRESH MATERIALIZED VIEW CONCURRENTLY survey_stats; REFRESH MATERIALIZED VIEW CONCURRENTLY question_stats;');
```

### Indexes
```sql
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_domain ON leads(email_domain);
CREATE INDEX idx_responses_token ON survey_responses(results_token);
CREATE INDEX idx_responses_lead ON survey_responses(lead_id);
CREATE INDEX idx_answers_response ON survey_answers(response_id);
CREATE INDEX idx_answers_question ON survey_answers(question_id);
```

---

## Question Versioning

### File Structure
```
src/data/questions/
├── index.ts        # Exports current version
├── v1.0.ts         # Original 27 questions
└── schema.ts       # Types
```

### Question Schema
```typescript
interface Question {
  id: string              // Stable: "ds_001"
  category: CategoryId
  text: string
  version_added: string   // "1.0"
  version_deprecated?: string
}
```

### Evolution Rules
| Scenario | Action |
|----------|--------|
| Add question | New ID, bump version |
| Edit text (minor) | Same ID, update text |
| Remove question | Mark deprecated, exclude from new surveys |
| Reorder | Change array order, IDs unchanged |

---

## API Endpoints (V1)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/survey/submit` | Submit survey + create lead |
| GET | `/api/stats` | Population statistics |

### POST `/api/survey/submit`

**Request:**
```typescript
{
  lead: { email, name?, role?, marketingConsent },
  survey: { answers: Record<string, boolean>, surveyVersion }
}
```

**Response:**
```typescript
{ success: true, resultsToken: string }
```

**Security:**
- Rate limited (10 req/min per IP)
- Input validation (Zod)
- Service role only for DB access

---

## Security Architecture

### Data Protection
| Layer | Protection |
|-------|------------|
| At Rest | Supabase AES-256 encryption |
| In Transit | TLS 1.2+ (all connections) |
| Database | Row Level Security (service role only) |
| API | Rate limiting, input validation |
| Secrets | Vercel env vars (never in code) |

### Row Level Security
```sql
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_answers ENABLE ROW LEVEL SECURITY;

-- Only service role can access
CREATE POLICY "Service role only" ON leads
  FOR ALL USING (auth.role() = 'service_role');
```

### Input Validation
```typescript
const emailCaptureSchema = z.object({
  email: z.string().email().max(255).toLowerCase().trim(),
  name: z.string().max(100).trim().optional(),
  role: z.enum(['clinical_director', 'bcba', 'owner', 'qa_manager', 'consultant', 'other']).optional(),
  marketingConsent: z.boolean()
})

const surveyAnswersSchema = z.object({
  answers: z.record(z.string().regex(/^[a-z]{2,3}_\d{3}$/), z.boolean())
    .refine(obj => Object.keys(obj).length === 27),
  surveyVersion: z.string().regex(/^\d+\.\d+$/)
})
```

### Security Headers
```typescript
// next.config.ts
headers: [
  { key: 'Content-Security-Policy', value: "default-src 'self'..." },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000' }
]
```

---

## Results Page Features

### Individual Score Display
- Overall score: X/27 with percentage
- Performance label (Strong/Moderate/Needs Improvement)
- Color-coded visual indicator

### Population Comparison
- Percentile rank ("Higher than 68% of agencies")
- Your score vs average (visual bar)
- Category-level comparison (bar chart)
- Per-question: "72% answered Yes"

### Privacy Safeguards
- Minimum 10 responses before showing comparisons
- Only aggregates, never individual data
- Rounded percentages

---

## Deployment

| Environment | Trigger | URL |
|-------------|---------|-----|
| Preview | Every PR | `*.vercel.app` |
| Production | Merge to `main` | Custom domain |

### Environment Variables
```
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY  # Secret
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN   # Secret
NEXT_PUBLIC_URL
```

### V2 Additional Variables
```
BROWSERLESS_API_KEY        # Secret
RESEND_API_KEY             # Secret
INNGEST_SIGNING_KEY        # Secret
STRIPE_SECRET_KEY          # Secret
STRIPE_WEBHOOK_SECRET      # Secret
```

---

## Key Technical Decisions

### Decision 1: Normalized Answers (Not JSONB)

**Context:** Need reporting on individual questions across all responses.
**Decision:** Store each answer as a row in `survey_answers` table.
**Consequences:** More rows (27 per response), but cleaner SQL for aggregations.

### Decision 2: Static Questions with Versioning

**Context:** Questions rarely change, need fast loading.
**Decision:** Store questions as static TypeScript files with version tracking.
**Consequences:** Redeploy to update questions, but simple and fast. Version stored with response for backward compatibility.

### Decision 3: Email Domain Grouping (V1/V2)

**Context:** Need agency-level data without complex agency management.
**Decision:** Auto-extract and group by email domain. Personal emails not grouped.
**Consequences:** Simple, automatic, but less accurate than verified agencies. Full agency model deferred to V3.

### Decision 4: Results Token (Not Email in URL)

**Context:** Need shareable results URL without exposing email.
**Decision:** Generate UUID token for each response, use in URL (`/results/{token}`).
**Consequences:** Secure, shareable, but token must be saved by user to revisit.

### Decision 5: Materialized Views for Stats

**Context:** Population stats queries could be slow at scale.
**Decision:** Pre-compute aggregates in materialized views, refresh hourly.
**Consequences:** Slightly stale data (up to 1 hour), but fast queries.
