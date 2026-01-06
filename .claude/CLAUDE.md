# Project: [PROJECT_NAME]

## Quick Context

- **Purpose:** [One-line description of what this app does]
- **Tech Stack:** Next.js 14, Supabase, Tailwind CSS, Vercel
- **Status:** Planning / Development / Production

## Key Files

- Requirements: `context/requirements.md`
- Architecture: `context/architecture.md`
- Style Guide: `context/style-guide.md`
- API Design: `context/api-design.md`

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
npm run start    # Start production server
```

## Database

- Supabase project: [YOUR_PROJECT_URL]
- Run migrations: `npx supabase db push`
- Generate types: `npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts`

## Deployment

- Vercel project: [YOUR_VERCEL_URL]
- Preview deploys on every PR
- Production deploys on merge to `main`

## Important Notes

- All context documents live in the `context/` folder
- Use Zod for input validation on all API endpoints
- Supabase client configuration is in `src/lib/supabase/`
- UI primitives go in `src/components/ui/`
- Layout components go in `src/components/layout/`

## Development Workflow

1. Read `context/requirements.md` before implementing features
2. Check `context/architecture.md` for technical decisions
3. Follow `context/style-guide.md` for UI consistency
4. Use `/plan` skill before major features
5. Use `/commit` skill for clean commit messages
