# Upskill Quality Survey

A 27-question quality assessment tool for ABA agencies with population benchmarking.

## Features

- 27 research-backed Yes/No questions across 5 categories
- Instant results with circular progress visualizations
- Population comparison with percentile ranking
- Category-by-category breakdown with gap analysis
- Mobile-responsive design

## Tech Stack

- **Frontend:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS, shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Hosting:** Vercel
- **State Management:** Zustand
- **Validation:** Zod

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/kkari50/UpskillQualitySurvey.git
cd UpskillQualitySurvey
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment

Create `.env.local` with your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Start Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Survey Categories

| Category | Questions | Focus Area |
|----------|-----------|------------|
| Daily Sessions | 7 | Session preparation and delivery |
| Treatment Fidelity | 5 | Protocol adherence |
| Data Analysis | 5 | Data collection and analysis practices |
| Caregiver Guidance | 6 | Family involvement and training |
| Supervision | 4 | Staff oversight and development |

## Scoring

- **Strong (85%+):** Emerald/green indicators
- **Moderate (60-84%):** Amber/yellow indicators
- **Needs Improvement (<60%):** Rose/red indicators

## Project Structure

```
├── context/            # Project documentation
├── src/
│   ├── app/            # Next.js App Router pages
│   ├── components/     # React components
│   │   ├── results/    # Results page components
│   │   ├── survey/     # Survey flow components
│   │   └── ui/         # shadcn/ui primitives
│   ├── data/           # Questions and categories
│   ├── lib/            # Utilities and validation
│   └── stores/         # Zustand stores
└── supabase/           # Database migrations
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run test` | Run tests |
| `npm run lint` | Run ESLint |

## License

MIT
