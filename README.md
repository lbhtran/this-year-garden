# This Year Garden

A personal garden planning app to track plants, containers, shopping, and grow progress throughout the season.

## Features

- **Plant tracker** — manage growth stages (seed → seedling → sprouted → planted → growing → flowering → fruiting → harvesting → dormant), add notes, placement, and frost-sensitivity per plant
- **Container planner** — organise pots, planters, raised beds, grow bags, and trellis planters; link each to a garden diagram
- **Shopping list** — track supplies and pest-protection items; mark them bought and sync state across devices when signed in
- **Allocations** — assign plants to containers with zone, status, and sort order; visualised in the diagram section
- **MCP integration** — manage your garden via Claude AI using the Model Context Protocol (Claude Desktop + Claude mobile)
- **Authentication** — optional Clerk sign-in; works in read-only mode without an account

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Auth | Clerk (`@clerk/nextjs` v6) |
| Database | Neon (serverless Postgres) |
| Icons | Lucide React |
| Deployment | Vercel |
| AI integration | Model Context Protocol (`@modelcontextprotocol/sdk`) |

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `POSTGRES_URL` | Postgres connection string (Neon or any Postgres instance) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `MCP_API_KEY` | Secret key for MCP REST API access |
| `MCP_OWNER_USER_ID` | Your Clerk user ID — so MCP writes land on the same rows as the web app |

### 3. Run database migrations

```bash
npm run migrate
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Key scripts

```bash
npm run dev              # Start development server
npm run build            # Production build
npm run lint             # Lint the codebase
npm run migrate          # Apply database migrations
npm run seed:plants      # Seed initial plant data for a user
npm run seed:containers  # Seed initial container data
npm run seed:allocations # Seed initial allocation data
npm run test:db          # Run database integration tests
```

## Database setup

### Running migrations locally

Migrations are stored in `migrations/` and tracked in a `schema_migrations` table.
Re-running `npm run migrate` is safe — already-applied migrations are skipped.

```bash
npm run migrate
```

Or pass the URL inline:

```bash
POSTGRES_URL="postgresql://user:pass@host/db" npm run migrate
```

### Running DB integration tests locally

```bash
POSTGRES_URL=postgresql://user:pass@host/db npm run test:db
```

The test inserts rows for two synthetic users and asserts that each user can only see their own data, then cleans up.

## MCP integration

See [README-mcp.md](README-mcp.md) for full instructions on connecting Claude AI to your garden via the Model Context Protocol.

## CI

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push and pull request with two jobs:

### `test-db` — integration tests
Starts a local Postgres 16 service, applies migrations, and runs ownership isolation tests. No real database credentials required.

### `migrate-target` — target database migration
Runs `npm run migrate` against your real Neon database. This job is skipped if the `POSTGRES_URL` secret is not set.

**To enable target database migrations in CI**, add `POSTGRES_URL` as a GitHub Actions repository secret (Settings → Secrets and variables → Actions):
- Point it at your Neon connection string for production.
- For separate preview/production environments, use GitHub Environments and set `POSTGRES_URL` per environment.

No Clerk secrets are required for either CI job.

