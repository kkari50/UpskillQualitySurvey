# [Project Name] Architecture

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| State Management | Zustand |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| Hosting | Vercel |
| File Storage | Supabase Storage |

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── api/              # API routes
├── components/
│   ├── ui/               # Reusable UI primitives
│   └── layout/           # Layout components
├── hooks/                # Custom React hooks
├── lib/
│   ├── supabase/         # Supabase client configuration
│   ├── validation.ts     # Zod schemas
│   └── constants.ts      # App constants
├── data/                 # Static data files
└── types/                # TypeScript types
```

## Key Technical Decisions

### Decision 1: [Title]

**Context:** [Why this decision was needed]
**Decision:** [What was decided]
**Consequences:** [Trade-offs and implications]

### Decision 2: [Title]

**Context:** [Why this decision was needed]
**Decision:** [What was decided]
**Consequences:** [Trade-offs and implications]

## Database Schema

### Tables

#### `users` (managed by Supabase Auth)

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| email | text | User email |
| created_at | timestamp | Creation timestamp |

#### `[table_name]`

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| ... | ... | ... |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/example` | Description |
| POST | `/api/example` | Description |

## Authentication Flow

1. User signs up/logs in via Supabase Auth
2. Session stored in cookies (via `@supabase/ssr`)
3. Server components check session for protected routes
4. Client components use `useUser` hook for auth state

## Deployment

- **Preview:** Automatic on every PR via Vercel
- **Production:** Auto-deploy on merge to `main`
- **Environment Variables:** Set in Vercel Dashboard
