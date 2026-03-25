import * as fs from 'fs';
import * as path from 'path';
import { Client } from 'pg';

const connectionString = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Error: POSTGRES_URL (or DATABASE_URL) environment variable must be set.');
  process.exit(1);
}

export async function runMigrations(client: Client): Promise<void> {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename   TEXT        PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const { rows: applied } = await client.query<{ filename: string }>(
    'SELECT filename FROM schema_migrations',
  );
  const appliedSet = new Set(applied.map((r) => r.filename));

  const migrationsDir = path.resolve(process.cwd(), 'migrations');
  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    if (appliedSet.has(file)) {
      console.log(`  skip  ${file} (already applied)`);
      continue;
    }
    console.log(`  apply ${file} ...`);
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    await client.query(sql);
    await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file]);
    console.log(`  done  ${file}`);
  }
}

async function main(): Promise<void> {
  console.log('Running migrations...');
  const client = new Client({ connectionString });
  await client.connect();
  try {
    await runMigrations(client);
    console.log('Migrations complete.');
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
