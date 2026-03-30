# GitHub Copilot Instructions

## Project Overview

This is a garden tracking app built with **Next.js 15 App Router** and **TypeScript**. Users can track their plants, containers, and garden progress throughout the year.

## Tech Stack

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Clerk** (`@clerk/nextjs` v6) — authentication
- **Neon** (`@neondatabase/serverless`) — serverless Postgres database
- **Lucide React** — icons
- **Vercel** — deployment

## Code Style Guidelines

- Use **TypeScript** for all files; avoid `any` types
- Use **functional components** with React hooks
- Follow **Next.js App Router** conventions:
  - Routes live in the `app/` directory
  - Components are **Server Components by default**
  - Add `'use client'` only when browser APIs or interactivity are needed
- Use **Clerk helpers** for authentication (`auth()`, `currentUser()`, `<SignIn>`, etc.)
- Use **`@neondatabase/serverless`** for all database queries
- Use **Lucide React** for icons

## Folder Structure

```
app/          # Next.js routes and layouts (App Router)
src/          # Shared components, utilities, and types
migrations/   # SQL database migration files
scripts/      # Utility scripts (e.g., migrate.ts, test-db.ts)
```

## Environment Variables

- Secrets live in `.env.local` — see `.env.example` for required variables
- **Never hard-code secrets** in source files

## Database

- Use **parameterized queries** to avoid SQL injection
- Migration scripts live in `migrations/` and are run with `npm run migrate`

## Deployment

- The app deploys to **Vercel**
- Keep bundle size in mind; avoid heavy client-side dependencies
- Prefer Server Components and server-side data fetching where possible

## Testing

- **Every code change must be accompanied by tests** — no exceptions.
- Tests for database logic live in `scripts/test-db.ts` and are run with `npm run test:db`.
- **When adding or modifying a DB table or API route**, you must:
  1. Add or update the relevant tests in `scripts/test-db.ts`
  2. Run `npm run test:db` to verify all tests pass before committing
  3. Ensure the CI workflow also passes (`npm run test:db` runs automatically on every PR)
- Follow the existing test style in `scripts/test-db.ts`:
  - Use `client.query(...)` for direct DB assertions
  - Use the `assert(condition, message)` helper for all assertions
  - Clean up test data at the start and end of each test block
  - Log each passing check with `console.log('  PASS  <description>')`
- **When adding a new DB table**, cover at minimum:
  - Ownership isolation (userA cannot see userB's rows)
  - Scoped delete (deleting userA's row does not affect userB)
  - Cascade delete behaviour (if applicable)
- **When adding a new API route**, manually verify with `curl` or equivalent before committing (see `README-mcp.md` for examples).

## Git Management

- Use **[gitmoji](https://gitmoji.dev/)** for commit messages — prefix every commit with the relevant emoji, e.g.:
  - `✨ Add new plant tracking feature`
  - `🐛 Fix container journey display bug`
  - `♻️ Refactor database query helpers`
  - `📝 Update README`
  - `🔧 Update configuration`
- Maintain a **`CHANGELOG.md`** at the root of the project and update it with every release
- Follow **[Semantic Versioning](https://semver.org/)** (semver) for releases:
  - `MAJOR` — breaking changes
  - `MINOR` — new backwards-compatible features
  - `PATCH` — backwards-compatible bug fixes

## Key Scripts

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Lint the codebase
npm run migrate   # Run database migrations
npm run test:db   # Run database integration tests (must pass before committing)
```