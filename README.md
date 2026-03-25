# This Year Garden

A garden planning app built with Next.js, Clerk authentication, and Neon Postgres.

## Database setup

### Required environment variables

| Variable | Description |
|---|---|
| `POSTGRES_URL` | Postgres connection string (Neon or any Postgres instance) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |

Copy `.env.example` to `.env.local` and fill in your values.

### Running migrations locally

To create the tables on your **Neon instance** (or any Postgres), set `POSTGRES_URL` in `.env.local` and run:

```bash
npm run migrate
```

Or pass the URL inline:

```bash
POSTGRES_URL="postgresql://user:pass@host/db" npm run migrate
```

Migrations are stored in `migrations/` and tracked in a `schema_migrations` table.
Re-running `npm run migrate` is safe — already-applied migrations are skipped.

### Running DB integration tests locally

```bash
POSTGRES_URL=postgresql://user:pass@host/db npm run test:db
```

The test inserts rows for two synthetic users and asserts that each user can only see their own data, then cleans up.

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


