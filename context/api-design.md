# Quick Quality Assessment Survey - API Design

**Version:** 1.0
**Last Updated:** January 2026

---

## Overview

REST API for the Quick Quality Assessment Survey tool. All endpoints are Next.js API routes.

## Base URL

| Environment | URL |
|-------------|-----|
| Development | `http://localhost:3000/api` |
| Production | `https://quality.upskillaba.com/api` |

---

## Endpoints by Phase

| Phase | Endpoint | Description |
|-------|----------|-------------|
| V1 | `POST /api/survey/submit` | Submit survey and create lead |
| V1 | `GET /api/stats` | Population statistics |
| V1 | `GET /api/health` | Health check |
| V2 | `POST /api/auth/claim-lead` | Link existing lead to new user |
| V2 | `GET /api/user/responses` | User's survey history |
| V2 | `POST /api/pdf/generate` | Generate and email PDF |
| V2 | `POST /api/checkout` | Create Stripe checkout session |
| V2 | `POST /api/webhooks/stripe` | Stripe webhook handler |

---

## V1 Endpoints

### `POST /api/survey/submit`

Submit completed survey and create/update lead record.

**Authentication:** None (public)

**Rate Limit:** 10 requests/minute per IP

**Request Body:**
```json
{
  "lead": {
    "email": "sarah@abctherapy.com",
    "name": "Sarah Johnson",
    "role": "bcba",
    "marketingConsent": true
  },
  "survey": {
    "answers": {
      "ds_001": true,
      "ds_002": false,
      "ds_003": true,
      "tf_001": true,
      "tf_002": false
    },
    "surveyVersion": "1.0"
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "resultsToken": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "resultsUrl": "/results/a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "score": {
      "total": 19,
      "maxPossible": 27,
      "percentage": 70
    }
  }
}
```

**Errors:**

| Status | Code | Description |
|--------|------|-------------|
| 400 | `VALIDATION_ERROR` | Invalid input data |
| 429 | `RATE_LIMITED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Server error |

**Validation Schema:**
```typescript
const submitSurveySchema = z.object({
  lead: z.object({
    email: z.string().email().max(255).toLowerCase().trim(),
    name: z.string().max(100).trim().optional(),
    role: z.enum([
      'clinical_director',
      'bcba',
      'bcaba',
      'rbt',
      'owner',
      'qa_manager',
      'consultant',
      'other'
    ]).optional(),
    marketingConsent: z.boolean().default(false)
  }),
  survey: z.object({
    answers: z.record(
      z.string().regex(/^[a-z]{2,3}_\d{3}$/),
      z.boolean()
    ).refine(
      (obj) => Object.keys(obj).length === 27,
      { message: 'All 27 questions must be answered' }
    ),
    surveyVersion: z.string().regex(/^\d+\.\d+$/)
  })
})
```

**Processing Logic:**
1. Validate input with Zod
2. Extract email domain (exclude personal domains)
3. Upsert lead record (email is unique key)
4. Calculate scores (total + per category)
5. Generate results token (UUID)
6. Insert survey_response record
7. Insert 27 survey_answers records
8. Return results token

---

### `GET /api/stats`

Get population statistics for comparison display.

**Authentication:** None (public)

**Rate Limit:** 60 requests/minute per IP

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `version` | string | No | Survey version (default: "1.0") |

**Request:**
```
GET /api/stats?version=1.0
```

**Response (200 OK):**
```json
{
  "available": true,
  "data": {
    "overall": {
      "totalResponses": 1247,
      "avgScore": 17.4,
      "avgPercentage": 64,
      "medianScore": 18,
      "p25Score": 14,
      "p75Score": 21
    },
    "questions": {
      "ds_001": { "yesPercentage": 85, "totalResponses": 1247 },
      "ds_002": { "yesPercentage": 72, "totalResponses": 1247 },
      "ds_003": { "yesPercentage": 68, "totalResponses": 1247 }
    },
    "categories": {
      "daily_sessions": { "avgPercentage": 71 },
      "treatment_fidelity": { "avgPercentage": 58 },
      "data_analysis": { "avgPercentage": 62 },
      "caregiver_guidance": { "avgPercentage": 67 },
      "supervision": { "avgPercentage": 75 }
    }
  },
  "meta": {
    "surveyVersion": "1.0",
    "lastUpdated": "2026-01-06T14:00:00.000Z"
  }
}
```

**Response (Insufficient Data):**
```json
{
  "available": false,
  "message": "Not enough responses for comparison data",
  "data": null,
  "meta": {
    "surveyVersion": "1.0",
    "minRequired": 10,
    "currentCount": 7
  }
}
```

**Privacy Rules:**
- Minimum 10 responses before returning stats
- Only aggregates, never individual data
- Percentages rounded to whole numbers

---

### `GET /api/stats/percentile`

Get percentile rank for a specific score.

**Authentication:** None (public)

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `score` | integer | Yes | Score to check (0-27) |
| `version` | string | No | Survey version (default: "1.0") |

**Request:**
```
GET /api/stats/percentile?score=19&version=1.0
```

**Response (200 OK):**
```json
{
  "score": 19,
  "percentile": 68,
  "message": "Higher than 68% of respondents"
}
```

---

### `GET /api/health`

Health check endpoint.

**Authentication:** None

**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2026-01-06T12:00:00.000Z",
  "version": "1.0.0"
}
```

---

## V2 Endpoints

### `POST /api/auth/claim-lead`

Link existing lead record to newly registered user.

**Authentication:** Required (Supabase Auth)

**Request Body:**
```json
{}
```
(Uses authenticated user's email automatically)

**Response (200 OK):**
```json
{
  "success": true,
  "claimed": true,
  "data": {
    "leadId": "uuid",
    "historicalResponses": 3,
    "message": "Found 3 previous survey responses"
  }
}
```

**Response (No Existing Lead):**
```json
{
  "success": true,
  "claimed": false,
  "created": true,
  "data": {
    "leadId": "uuid",
    "message": "New lead created for your account"
  }
}
```

**Processing Logic:**
1. Get authenticated user's email
2. Search for lead with matching email
3. If found: update `user_id` and `claimed_at`
4. If not found: create new lead with `user_id`
5. Return lead info and historical response count

---

### `GET /api/user/responses`

Get authenticated user's survey history.

**Authentication:** Required (Supabase Auth)

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | Max results (default: 10, max: 50) |
| `offset` | integer | No | Pagination offset |

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "uuid",
      "resultsToken": "a1b2c3d4...",
      "totalScore": 19,
      "maxPossibleScore": 27,
      "percentage": 70,
      "surveyVersion": "1.0",
      "completedAt": "2026-01-06T10:30:00.000Z"
    },
    {
      "id": "uuid",
      "resultsToken": "e5f6g7h8...",
      "totalScore": 22,
      "maxPossibleScore": 27,
      "percentage": 81,
      "surveyVersion": "1.0",
      "completedAt": "2025-10-15T14:20:00.000Z"
    }
  ],
  "meta": {
    "total": 3,
    "limit": 10,
    "offset": 0
  }
}
```

---

### `POST /api/pdf/generate`

Generate PDF report and send via email.

**Authentication:** Required (Supabase Auth) OR valid results token

**Request Body:**
```json
{
  "resultsToken": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "email": "sarah@abctherapy.com"
}
```

**Response (202 Accepted):**
```json
{
  "success": true,
  "message": "PDF generation queued. Check your email shortly.",
  "jobId": "inngest-job-uuid"
}
```

**Processing (Background via Inngest):**
1. Fetch survey response data
2. Fetch population stats for comparison
3. Render HTML dashboard template
4. Send to Browserless.io for PDF generation
5. Send email via Resend with PDF attachment

---

### `POST /api/checkout`

Create Stripe checkout session for premium resources.

**Authentication:** Optional (enhances experience if logged in)

**Request Body:**
```json
{
  "priceId": "price_xxx",
  "email": "sarah@abctherapy.com",
  "resultsToken": "a1b2c3d4..."
}
```

**Response (200 OK):**
```json
{
  "checkoutUrl": "https://checkout.stripe.com/c/pay/xxx"
}
```

---

### `POST /api/webhooks/stripe`

Handle Stripe webhook events.

**Authentication:** Stripe webhook signature verification

**Headers:**
```
Stripe-Signature: t=xxx,v1=xxx
```

**Handled Events:**
| Event | Action |
|-------|--------|
| `checkout.session.completed` | Grant premium access |
| `customer.subscription.updated` | Update access level |
| `customer.subscription.deleted` | Revoke access |

**Response (200 OK):**
```json
{
  "received": true
}
```

---

## Data Types

### Lead
```typescript
interface Lead {
  id: string           // UUID
  email: string
  name?: string
  role?: Role
  emailDomain?: string // Extracted, null for personal emails
  marketingConsent: boolean
  userId?: string      // Linked in V2
  claimedAt?: string   // ISO timestamp
  createdAt: string    // ISO timestamp
}

type Role =
  | 'clinical_director'
  | 'bcba'
  | 'bcaba'
  | 'rbt'
  | 'owner'
  | 'qa_manager'
  | 'consultant'
  | 'other'
```

### SurveyResponse
```typescript
interface SurveyResponse {
  id: string
  leadId: string
  surveyVersion: string
  totalScore: number
  maxPossibleScore: number
  resultsToken: string
  completedAt: string
}
```

### SurveyAnswer
```typescript
interface SurveyAnswer {
  id: string
  responseId: string
  questionId: string   // e.g., "ds_001"
  answer: boolean
}
```

### CategoryScore
```typescript
interface CategoryScore {
  category: CategoryId
  score: number
  maxScore: number
  percentage: number
}

type CategoryId =
  | 'daily_sessions'
  | 'treatment_fidelity'
  | 'data_analysis'
  | 'caregiver_guidance'
  | 'supervision'
```

---

## Error Response Format

All errors follow this structure:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {}
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `UNAUTHORIZED` | 401 | Not authenticated |
| `FORBIDDEN` | 403 | Not authorized for this resource |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

### Validation Error Details
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": {
      "fieldErrors": {
        "lead.email": ["Invalid email format"],
        "survey.answers": ["All 27 questions must be answered"]
      }
    }
  }
}
```

---

## Rate Limiting

Implemented via Upstash Redis.

| Endpoint | Limit | Window |
|----------|-------|--------|
| `POST /api/survey/submit` | 10 | 1 minute |
| `GET /api/stats` | 60 | 1 minute |
| `POST /api/pdf/generate` | 5 | 1 minute |
| `POST /api/checkout` | 10 | 1 minute |

**Rate Limit Response (429):**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests. Please try again later.",
    "details": {
      "retryAfter": 45
    }
  }
}
```

**Response Headers:**
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1704542400
```

---

## Security

### Input Validation
- All endpoints validate input with Zod schemas
- Email addresses normalized (lowercase, trimmed)
- String lengths enforced
- Enum values validated

### Authentication (V2)
- Supabase Auth manages sessions
- Session stored in HTTP-only cookies
- Server components verify session via `@supabase/ssr`

### Database Access
- API routes use service role client (server-side only)
- Row Level Security prevents direct client access
- All queries parameterized (no SQL injection)

### CORS
- Next.js API routes same-origin by default
- No CORS headers needed for same-domain

### Webhook Security
- Stripe webhooks verified with `Stripe-Signature` header
- Inngest webhooks verified with signing key

---

## Example Implementations

### Submit Survey Handler
```typescript
// src/app/api/survey/submit/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { submitSurveySchema } from '@/lib/validation/survey'
import { createServiceClient } from '@/lib/supabase/service'
import { calculateScores } from '@/lib/scoring'
import { extractEmailDomain } from '@/lib/utils'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1m'),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
    const { success, limit, remaining, reset } = await ratelimit.limit(ip)

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMITED',
            message: 'Too many requests',
            details: { retryAfter: Math.ceil((reset - Date.now()) / 1000) }
          }
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          }
        }
      )
    }

    // Validate input
    const body = await request.json()
    const parsed = submitSurveySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: { fieldErrors: parsed.error.flatten().fieldErrors }
          }
        },
        { status: 400 }
      )
    }

    const { lead, survey } = parsed.data
    const supabase = createServiceClient()

    // Extract email domain
    const emailDomain = extractEmailDomain(lead.email)

    // Upsert lead
    const { data: leadRecord, error: leadError } = await supabase
      .from('leads')
      .upsert({
        email: lead.email,
        name: lead.name,
        role: lead.role,
        email_domain: emailDomain,
        marketing_consent: lead.marketingConsent,
      }, { onConflict: 'email' })
      .select()
      .single()

    if (leadError) throw leadError

    // Calculate scores
    const scores = calculateScores(survey.answers)
    const resultsToken = crypto.randomUUID()

    // Insert response
    const { data: response, error: responseError } = await supabase
      .from('survey_responses')
      .insert({
        lead_id: leadRecord.id,
        survey_version: survey.surveyVersion,
        total_score: scores.total,
        max_possible_score: scores.maxPossible,
        results_token: resultsToken,
      })
      .select()
      .single()

    if (responseError) throw responseError

    // Insert answers
    const answers = Object.entries(survey.answers).map(([questionId, answer]) => ({
      response_id: response.id,
      question_id: questionId,
      answer,
    }))

    const { error: answersError } = await supabase
      .from('survey_answers')
      .insert(answers)

    if (answersError) throw answersError

    return NextResponse.json(
      {
        success: true,
        data: {
          resultsToken,
          resultsUrl: `/results/${resultsToken}`,
          score: {
            total: scores.total,
            maxPossible: scores.maxPossible,
            percentage: scores.percentage,
          }
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Survey submission error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred. Please try again.'
        }
      },
      { status: 500 }
    )
  }
}
```

### Get Stats Handler
```typescript
// src/app/api/stats/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

const MIN_RESPONSES = 10

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const version = searchParams.get('version') ?? '1.0'

  const supabase = createServiceClient()

  // Get overall stats from materialized view
  const { data: surveyStats } = await supabase
    .from('survey_stats')
    .select('*')
    .eq('survey_version', version)
    .single()

  // Check minimum responses
  if (!surveyStats || surveyStats.total_responses < MIN_RESPONSES) {
    return NextResponse.json({
      available: false,
      message: 'Not enough responses for comparison data',
      data: null,
      meta: {
        surveyVersion: version,
        minRequired: MIN_RESPONSES,
        currentCount: surveyStats?.total_responses ?? 0,
      }
    })
  }

  // Get question stats
  const { data: questionStats } = await supabase
    .from('question_stats')
    .select('*')
    .eq('survey_version', version)

  // Get category stats
  const { data: categoryStats } = await supabase
    .from('category_stats')
    .select('*')
    .eq('survey_version', version)

  return NextResponse.json({
    available: true,
    data: {
      overall: {
        totalResponses: surveyStats.total_responses,
        avgScore: Math.round(surveyStats.avg_score * 10) / 10,
        avgPercentage: Math.round(surveyStats.avg_percentage),
        medianScore: surveyStats.median_score,
        p25Score: surveyStats.p25_score,
        p75Score: surveyStats.p75_score,
      },
      questions: questionStats?.reduce((acc, q) => ({
        ...acc,
        [q.question_id]: {
          yesPercentage: Math.round(q.yes_percentage),
          totalResponses: q.total_responses,
        }
      }), {}),
      categories: categoryStats?.reduce((acc, c) => ({
        ...acc,
        [c.category]: {
          avgPercentage: Math.round(c.avg_percentage),
        }
      }), {}),
    },
    meta: {
      surveyVersion: version,
      lastUpdated: new Date().toISOString(),
    }
  })
}
```

---

## Testing

### Manual Testing with cURL

**Submit Survey:**
```bash
curl -X POST http://localhost:3000/api/survey/submit \
  -H "Content-Type: application/json" \
  -d '{
    "lead": {
      "email": "test@example.com",
      "name": "Test User",
      "marketingConsent": true
    },
    "survey": {
      "answers": {
        "ds_001": true, "ds_002": false, "ds_003": true,
        "ds_004": true, "ds_005": false, "ds_006": true, "ds_007": true,
        "tf_001": true, "tf_002": false, "tf_003": true, "tf_004": false, "tf_005": true,
        "da_001": true, "da_002": true, "da_003": false, "da_004": true, "da_005": false,
        "cg_001": true, "cg_002": true, "cg_003": false, "cg_004": true, "cg_005": true, "cg_006": false,
        "sup_001": true, "sup_002": false, "sup_003": true, "sup_004": true
      },
      "surveyVersion": "1.0"
    }
  }'
```

**Get Stats:**
```bash
curl http://localhost:3000/api/stats?version=1.0
```

**Health Check:**
```bash
curl http://localhost:3000/api/health
```
