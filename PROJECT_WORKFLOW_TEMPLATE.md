# Vercel + Supabase Project Workflow Template

A standardized workflow for building web applications with Claude Code, Next.js, Supabase, and Vercel.

---

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [MCP Server Setup](#2-mcp-server-setup)
3. [Claude Code Configuration](#3-claude-code-configuration)
4. [Workflow Phases](#4-workflow-phases)
5. [Skills Reference](#5-skills-reference)
6. [Security Checklist](#6-security-checklist)
7. [Quick Start Commands](#7-quick-start-commands)

---

## 1. Project Structure

Every project should follow this standard folder structure:

```
project-name/
├── .github/
│   └── workflows/
│       └── ci.yml                 # CI for linting/type-check
│
├── .claude/
│   └── CLAUDE.md                  # Project instructions for Claude
│
├── context/                       # ALL project context lives here
│   ├── requirements.md            # Functional requirements
│   ├── architecture.md            # Technical decisions & stack
│   ├── style-guide.md             # Brand colors, fonts, design system
│   ├── api-design.md              # API endpoints & schemas (optional)
│   └── source-docs/               # Original docs (docx, pdf, etc.)
│
├── src/
│   ├── app/                       # Next.js App Router pages
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── api/                   # API routes
│   │
│   ├── components/
│   │   ├── ui/                    # Reusable UI primitives
│   │   └── layout/                # Header, Footer, Container
│   │
│   ├── hooks/                     # Custom React hooks
│   ├── lib/                       # Utilities and configurations
│   │   ├── supabase/
│   │   │   ├── client.ts          # Browser Supabase client
│   │   │   └── server.ts          # Server Supabase client
│   │   ├── validation.ts          # Zod schemas
│   │   └── constants.ts           # App constants
│   │
│   ├── data/                      # Static data files
│   └── types/                     # TypeScript types
│
├── supabase/
│   └── migrations/                # SQL migration files
│
├── public/                        # Static assets
├── .env.local                     # Environment variables (gitignored)
├── .env.example                   # Template for env vars
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 2. MCP Server Setup

MCP (Model Context Protocol) servers extend Claude Code's capabilities. Add these to your Claude Code settings.

### 2.1 Configuration File Location

**macOS/Linux:** `~/.claude/settings.json`
**Windows:** `%USERPROFILE%\.claude\settings.json`

### 2.2 Recommended MCP Servers

Add this configuration to your `settings.json`:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest"],
      "env": {
        "SUPABASE_URL": "https://YOUR_PROJECT_ID.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "your-service-role-key-here"
      }
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-playwright"]
    }
  }
}
```

### 2.3 MCP Server Capabilities

| Server | What It Does |
|--------|--------------|
| **Supabase** | Query tables, run migrations, test RLS policies, manage storage |
| **Playwright** | Take screenshots, click elements, fill forms, test responsive layouts |

### 2.4 Setup Steps

1. Create a Supabase project at [supabase.com](https://supabase.com) (free tier)
2. Go to **Settings → API** in Supabase Dashboard
3. Copy your **Project URL** and **service_role key**
4. Update the MCP config with your credentials
5. Restart Claude Code (or VS Code) to load MCP servers
6. Test by asking Claude: "List all tables in my Supabase database"

---

## 3. Claude Code Configuration

### 3.1 CLAUDE.md Template

Create `.claude/CLAUDE.md` in every project with project-specific instructions:

```markdown
# Project: [PROJECT_NAME]

## Quick Context
- **Purpose:** [One-line description of what this app does]
- **Tech Stack:** Next.js 14, Supabase, Tailwind CSS, Vercel
- **Status:** [Planning / Development / Production]

## Key Files
- Requirements: `context/requirements.md`
- Architecture: `context/architecture.md`
- Style Guide: `context/style-guide.md`

## Commands
- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Production build
- `npm run lint` - Run ESLint

## Database
- Supabase project: [YOUR_PROJECT_URL]
- Run migrations: `npx supabase db push`
- Generate types: `npx supabase gen types typescript --local > src/types/database.ts`

## Deployment
- Vercel project: [YOUR_VERCEL_URL]
- Preview deploys on every PR
- Production deploys on merge to `main`

## Important Notes
- [Add project-specific notes here]
- [Things Claude should know about this codebase]
```

### 3.2 Environment Variables Template

Create `.env.example` (committed to git):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Server-only (no NEXT_PUBLIC_ prefix)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional: Analytics, etc.
# NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

Create `.env.local` (gitignored) with actual values.

---

## 4. Workflow Phases

### Phase 1: Context Gathering

Before writing any code, document everything in the `context/` folder.

| File | Purpose | When to Create |
|------|---------|----------------|
| `requirements.md` | What the app should do | Before any development |
| `architecture.md` | Technical decisions | After requirements are clear |
| `style-guide.md` | Brand colors, fonts, components | When UI work begins |
| `source-docs/` | Original documents (docx, pdf) | As received from stakeholders |

**Example `requirements.md` structure:**
```markdown
# [Project Name] Requirements

## Overview
[One paragraph description]

## User Stories
- As a [user type], I want to [action] so that [benefit]

## Functional Requirements
### Feature 1
- Requirement 1.1
- Requirement 1.2

## Non-Functional Requirements
- Performance: [targets]
- Security: [requirements]
- Accessibility: [WCAG level]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
```

### Phase 2: Project Setup

```bash
# 1. Create Next.js project
npx create-next-app@latest project-name --typescript --tailwind --app --src-dir

# 2. Navigate to project
cd project-name

# 3. Install common dependencies
npm install @supabase/supabase-js @supabase/ssr zustand zod lucide-react

# 4. Create folder structure
mkdir -p context src/components/ui src/components/layout src/hooks src/lib/supabase src/data src/types supabase/migrations .claude

# 5. Initialize git (if not already)
git init

# 6. Create GitHub repo and push
gh repo create project-name --public --source=. --push
```

### Phase 3: Development (Iterative)

Follow this order for each feature:

1. **Define** - What are you building? Update requirements if needed.
2. **Design** - Use `/plan` skill to create implementation plan
3. **Build** - Implement the feature
4. **Test** - Manual testing, check mobile responsiveness
5. **Commit** - Use `/commit` skill for clean commit messages
6. **Repeat** - Move to next feature

**Recommended build order for new projects:**
1. UI primitives (Button, Card, Input)
2. Layout components (Header, Footer)
3. Data/types definitions
4. State management (Zustand store)
5. Core pages and flows
6. API routes
7. Database integration
8. Polish and error handling

### Phase 4: Deployment

```bash
# 1. Ensure build works locally
npm run build

# 2. Connect to Vercel (first time)
npx vercel link

# 3. Add environment variables in Vercel Dashboard
# Settings → Environment Variables

# 4. Deploy
npx vercel --prod

# Or just push to main branch (auto-deploys if connected)
git push origin main
```

---

## 5. Skills Reference

Use these Claude Code skills at appropriate phases:

| Skill | Command | When to Use |
|-------|---------|-------------|
| **Plan** | `/plan` | Before implementing features |
| **Codebase Analysis** | `/codebase-analysis` | Finding existing patterns |
| **Commit** | `/commit` | Creating git commits |
| **Create PR** | `/create-pr` | Opening pull requests |
| **Brainstorming** | `/brainstorming` | Refining rough ideas |

### Using Skills

```
# Create an implementation plan
/plan Add user authentication with email/password

# Analyze codebase before adding feature
/codebase-analysis How are forms handled in this project?

# Commit staged changes
/commit

# Create a pull request
/create-pr
```

---

## 6. Security Checklist

Use this checklist for every project:

### Environment & Secrets
- [ ] `.env.local` is in `.gitignore`
- [ ] `.env.example` exists with placeholder values
- [ ] No secrets in client-side code (no `NEXT_PUBLIC_` for secrets)
- [ ] Service role key only used in server-side code

### Database (Supabase)
- [ ] Row Level Security (RLS) enabled on all tables
- [ ] RLS policies tested and working
- [ ] No sensitive data exposed via anon key
- [ ] Indexes added for frequently queried columns

### API Routes
- [ ] Input validation with Zod on all endpoints
- [ ] Error messages don't leak sensitive info
- [ ] Rate limiting considered (use Upstash for production)

### Frontend
- [ ] User input sanitized before display
- [ ] No `dangerouslySetInnerHTML` with user content
- [ ] Forms have proper validation

### Deployment (Vercel)
- [ ] Environment variables set in Vercel Dashboard
- [ ] Preview deployments use separate database (optional)
- [ ] HTTPS enforced (automatic on Vercel)

### Headers (next.config.js)
```javascript
const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

---

## 7. Quick Start Commands

### New Project Setup
```bash
# Create project
npx create-next-app@latest my-app --typescript --tailwind --app --src-dir
cd my-app

# Install dependencies
npm install @supabase/supabase-js @supabase/ssr zustand zod lucide-react

# Create structure
mkdir -p context .claude src/components/ui src/lib/supabase src/hooks src/types supabase/migrations

# Initialize GitHub
gh repo create my-app --public --source=. --push
```

### Daily Development
```bash
# Start dev server
npm run dev

# Check types
npm run build

# Lint code
npm run lint

# Deploy preview
npx vercel

# Deploy production
npx vercel --prod
```

### Supabase Commands
```bash
# Generate TypeScript types from database
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts

# Push local migrations to remote
npx supabase db push

# Pull remote schema to local
npx supabase db pull
```

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/my-feature

# Stage and commit (use /commit skill)
git add .
# Then use /commit in Claude Code

# Push and create PR
git push -u origin feature/my-feature
# Then use /create-pr in Claude Code
```

---

## License

MIT - Use this template freely for your projects.
