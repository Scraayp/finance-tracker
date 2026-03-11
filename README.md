# Finance Tracker

Personal and organization-aware finance dashboard for tracking subscription spend, recurring income, and projected net balance.

[![React](https://img.shields.io/badge/React-18-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-2F74C0?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-F7B500?logo=vite&logoColor=black)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20Postgres-0F172A?logo=supabase&logoColor=3ECF8E)](https://supabase.com/)
[![Tailwind](https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

---

## Why This Project Stands Out

This project is built as a production-style frontend + backend application, not just a UI demo.

- Multi-tenant data model: supports both personal and organization contexts.
- Secure-by-default backend: Supabase + Row Level Security policies.
- Strong user flow: authentication, protected routes, onboarding/setup checks.
- Business-ready metrics: monthly/annual expense, income, and net projections.
- Modern DX: strict typing, linting, tests, and clean component architecture.

## Core Product Features

### Financial Tracking

- Create, edit, and remove subscriptions with billing cycles.
- Create, edit, and remove incomes with configurable frequencies.
- Toggle active/inactive entries without losing historical records.

### Insights and Visualization

- Monthly and annual projections from recurring data.
- Net monthly and annual balance cards.
- Spend-by-category chart for subscription cost analysis.

### Multi-Context Workspace

- Personal dashboard mode.
- Organization dashboard mode.
- Context-aware filtering for subscriptions and incomes.

### Authentication and Access

- Email/password authentication.
- OAuth sign-in with Google and Discord.
- Password reset flow.
- Protected routes and session persistence.
- 2FA verification support via TOTP utility flow.

## Architecture Snapshot

```text
React (Vite + TypeScript)
	-> UI: Tailwind + shadcn/ui + Radix primitives
	-> State/Server Sync: React Context + TanStack Query
	-> Auth + Data: Supabase (Postgres + Auth + RLS)
```

### Key Technical Decisions

- Context separation: `AuthContext`, `AppContext`, and `AppearanceContext` isolate concerns.
- Type-driven modeling: shared domain types in `src/lib/types.ts`.
- Database-first app logic: app state is loaded and synced via Supabase tables.
- Safety gate: app displays setup requirements when Supabase env vars are missing.

## Tech Stack

- Frontend: React 18, TypeScript, Vite
- UI: Tailwind CSS, shadcn/ui, Radix UI, Lucide icons
- Data & Auth: Supabase (`@supabase/supabase-js`)
- Charts: Recharts
- Validation & Forms: Zod, React Hook Form
- Testing: Vitest, Testing Library, jsdom
- Linting: ESLint 9

## Local Setup

### Prerequisites

- Node.js 18+
- npm
- Supabase project

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_AUTH_REDIRECT_URL=http://localhost:5173
```

### 3. Initialize database

Run `supabase-schema-fixed.sql` in your Supabase SQL Editor.

If you encounter RLS recursion issues, review `DATABASE_README.md` for the migration/fix details.

### 4. Run the app

```bash
npm run dev
```

Open the app in your browser at the Vite URL shown in terminal.

## Available Scripts

```bash
npm run dev          # start local dev server
npm run build        # production build
npm run preview      # preview production build
npm run lint         # run ESLint
npm run lint:fix     # auto-fix lint issues
npm run type-check   # TypeScript checks (no emit)
npm run test         # run Vitest suite once
npm run test:watch   # run tests in watch mode
```

## Security Notes

- Uses Supabase Auth for identity and session management.
- Uses Postgres Row Level Security to enforce data isolation.
- Distinguishes personal and organization data paths at both UI and DB layers.

## What Recruiters Can Evaluate Quickly

- Product thinking: clear user roles, contexts, and financial workflows.
- Engineering quality: modular architecture and typed domain modeling.
- Full-stack integration: frontend behavior driven by real backend policies.
- UX execution: responsive dashboard patterns and actionable visual analytics.

## Potential Next Iterations

- Member invitation and organization collaboration workflow.
- Budget goals and overspend alerting.
- CSV import/export and data portability.
- Notification/reminder engine for billing and income events.

## License

This repository currently has no explicit open-source license file.
