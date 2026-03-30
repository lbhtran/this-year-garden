import { neon } from '@neondatabase/serverless';

// Module-level singleton so tables are only created once per serverless instance.
let ensureTablesPromise: Promise<void> | null = null;

export async function ensureMcpTables(): Promise<void> {
  if (ensureTablesPromise) return ensureTablesPromise;

  ensureTablesPromise = (async () => {
    const sql = neon(process.env.POSTGRES_URL!);

    // 0002 – containers
    await sql`
      CREATE TABLE IF NOT EXISTS containers (
        user_id    TEXT        NOT NULL,
        id         TEXT        NOT NULL,
        emoji      TEXT,
        name       TEXT        NOT NULL,
        type       TEXT        NOT NULL,
        size       TEXT,
        notes      TEXT,
        on_hold    BOOLEAN     NOT NULL DEFAULT FALSE,
        diagram_id TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY (user_id, id)
      )
    `;

    // 0003 – plant_allocations (no FK constraints; MCP uses user_id='mcp')
    await sql`
      CREATE TABLE IF NOT EXISTS plant_allocations (
        user_id      TEXT        NOT NULL,
        id           TEXT        NOT NULL,
        plant_id     TEXT        NOT NULL,
        container_id TEXT        NOT NULL,
        zone         TEXT,
        status       TEXT        NOT NULL DEFAULT 'current',
        sort_order   INTEGER     NOT NULL DEFAULT 0,
        created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY (user_id, id)
      )
    `;

    // 0004 – drop FK constraints if they exist from an earlier migration run
    await sql`ALTER TABLE plant_allocations DROP CONSTRAINT IF EXISTS plant_allocations_user_id_plant_id_fkey`;
    await sql`ALTER TABLE plant_allocations DROP CONSTRAINT IF EXISTS plant_allocations_user_id_container_id_fkey`;
  })();

  return ensureTablesPromise;
}
