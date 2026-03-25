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

```bash
POSTGRES_URL=postgresql://user:pass@host/db npm run migrate
```

Migrations are stored in `migrations/` and tracked in a `schema_migrations` table.
Re-running `npm run migrate` is safe — already-applied migrations are skipped.

### Running DB integration tests locally

```bash
POSTGRES_URL=postgresql://user:pass@host/db npm run test:db
```

The test inserts rows for two synthetic users and asserts that each user can only see their own data, then cleans up.

## CI

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push and pull request:

1. Starts a local Postgres service container.
2. Installs dependencies with `npm ci`.
3. Applies migrations with `npm run migrate`.
4. Runs ownership isolation tests with `npm run test:db`.

No Clerk secrets are required for CI — the DB tests are independent of authentication.


