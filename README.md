# Web App Template

A starter template for building web applications with Next.js, Supabase, and Vercel.

## Tech Stack

- **Frontend:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Hosting:** Vercel
- **State Management:** Zustand
- **Validation:** Zod
- **Icons:** Lucide React

## Getting Started

### 1. Use This Template

Click "Use this template" on GitHub or clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/WebAppTemplate.git my-project
cd my-project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Copy your project URL and keys from Settings > API
3. Create `.env.local` from the template:

```bash
cp .env.example .env.local
```

4. Fill in your Supabase credentials

### 4. Start Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view your app.

## Project Structure

```
├── .claude/            # Claude Code configuration
├── .github/workflows/  # CI/CD pipelines
├── context/            # Project documentation
│   ├── requirements.md
│   ├── architecture.md
│   ├── style-guide.md
│   └── api-design.md
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js App Router
│   ├── components/     # React components
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Utilities
│   ├── data/           # Static data
│   └── types/          # TypeScript types
└── supabase/           # Database migrations
```

## Development Workflow

1. **Plan:** Document requirements in `context/requirements.md`
2. **Design:** Define architecture in `context/architecture.md`
3. **Build:** Follow the style guide in `context/style-guide.md`
4. **Deploy:** Push to `main` for automatic Vercel deployment

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Deployment

This template is optimized for Vercel:

1. Connect your GitHub repo to Vercel
2. Add environment variables in Vercel Dashboard
3. Deploy automatically on push to `main`

## Documentation

See `PROJECT_WORKFLOW_TEMPLATE.md` for the complete workflow guide including:

- MCP server setup
- Claude Code configuration
- Security checklist
- Supabase commands

## License

MIT
