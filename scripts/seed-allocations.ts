import { Client } from 'pg';
import { runMigrations } from './migrate';

const connectionString = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Error: POSTGRES_URL (or DATABASE_URL) environment variable must be set.');
  process.exit(1);
}

const SEED_USER_ID = process.env.MCP_OWNER_USER_ID ?? 'mcp';

/**
 * Plant-to-container allocations derived from `initialPlants` in src/data/plants.ts.
 *
 * Zone values match the zone names read by DiagramsSection:
 *   c1  — 'Side A' | 'Side B' | 'border'
 *   c2  — (no zones)
 *   c3  — (no zones)
 *   c4  — 'centre' | 'inner ring' | 'mid ring' | 'outer ring' | 'border'
 *   c5  — 'centre' | 'inner ring' | 'mid ring' | 'outer ring' | 'border'
 *   c6/c6b/c7/c7b — (no zones)
 *   c8–c10         — (no zones)
 */
const allocations = [
  // ── c1 — Corner Trellis Planter ──────────────────────────────────────────
  { id: 'alloc-1-c1',   plant_id: '1',  container_id: 'c1',  zone: 'Side A',     status: 'current', sort_order: 0 }, // Cherry Tomatoes
  { id: 'alloc-2-c1',   plant_id: '2',  container_id: 'c1',  zone: 'Side B',     status: 'current', sort_order: 0 }, // Beef Tomatoes (heirloom)
  { id: 'alloc-7-c1',   plant_id: '7',  container_id: 'c1',  zone: 'border',     status: 'current', sort_order: 0 }, // Marigolds — trellis border

  // ── c2 — Planter 1 ───────────────────────────────────────────────────────
  { id: 'alloc-5-c2',   plant_id: '5',  container_id: 'c2',  zone: null,         status: 'current', sort_order: 0 }, // Basil
  { id: 'alloc-6-c2',   plant_id: '6',  container_id: 'c2',  zone: null,         status: 'current', sort_order: 1 }, // Parsley
  { id: 'alloc-w8-c2',  plant_id: 'w8', container_id: 'c2',  zone: null,         status: 'future',  sort_order: 2 }, // Mint (wishlist)

  // ── c3 — Planter 2 ───────────────────────────────────────────────────────
  { id: 'alloc-8-c3',   plant_id: '8',  container_id: 'c3',  zone: null,         status: 'current', sort_order: 0 }, // Mixed Lettuce

  // ── c4 — Raised Bed 1 ────────────────────────────────────────────────────
  { id: 'alloc-w7-c4',  plant_id: 'w7', container_id: 'c4',  zone: 'centre',     status: 'future',  sort_order: 0 }, // Perennial Kale (wishlist — permanent centre)
  { id: 'alloc-9-c4',   plant_id: '9',  container_id: 'c4',  zone: 'outer ring', status: 'current', sort_order: 0 }, // Purple Curly Kale
  { id: 'alloc-7-c4',   plant_id: '7',  container_id: 'c4',  zone: 'outer ring', status: 'current', sort_order: 1 }, // Marigolds — raised bed outer edge
  { id: 'alloc-11-c4',  plant_id: '11', container_id: 'c4',  zone: 'border',     status: 'current', sort_order: 0 }, // Nasturtiums

  // ── c5 — Raised Bed 2 ────────────────────────────────────────────────────
  { id: 'alloc-w5-c5',  plant_id: 'w5', container_id: 'c5',  zone: 'centre',     status: 'future',  sort_order: 0 }, // Asparagus (wishlist — permanent centre)
  { id: 'alloc-10-c5',  plant_id: '10', container_id: 'c5',  zone: 'inner ring', status: 'current', sort_order: 0 }, // Tenderstem Broccoli
  { id: 'alloc-w1-c5',  plant_id: 'w1', container_id: 'c5',  zone: 'inner ring', status: 'future',  sort_order: 1 }, // Pak Choi (wishlist — inner ring per container notes)
  { id: 'alloc-w2-c5',  plant_id: 'w2', container_id: 'c5',  zone: 'outer ring', status: 'future',  sort_order: 0 }, // Spring Onions (wishlist)
  { id: 'alloc-w3-c5',  plant_id: 'w3', container_id: 'c5',  zone: null,         status: 'future',  sort_order: 0 }, // Spinach (wishlist)
  { id: 'alloc-11-c5',  plant_id: '11', container_id: 'c5',  zone: 'border',     status: 'current', sort_order: 0 }, // Nasturtiums

  // ── c6 — Grow Bag 1 ──────────────────────────────────────────────────────
  { id: 'alloc-14-c6',  plant_id: '14', container_id: 'c6',  zone: null,         status: 'current', sort_order: 0 }, // Seed Potatoes

  // ── c7b — Grow Bag 4 (fig) ───────────────────────────────────────────────
  { id: 'alloc-13-c7b', plant_id: '13', container_id: 'c7b', zone: null,         status: 'future',  sort_order: 0 }, // Fig (moves from patio pot as season progresses)

  // ── c8 — Individual Pots ─────────────────────────────────────────────────
  { id: 'alloc-3-c8',   plant_id: '3',  container_id: 'c8',  zone: null,         status: 'current', sort_order: 0 }, // Aubergine
  { id: 'alloc-4-c8',   plant_id: '4',  container_id: 'c8',  zone: null,         status: 'current', sort_order: 1 }, // Habanero Chillies
  { id: 'alloc-w4-c8',  plant_id: 'w4', container_id: 'c8',  zone: null,         status: 'future',  sort_order: 2 }, // Courgette (wishlist)

  // ── c9 — Japanese Maple ───────────────────────────────────────────────────
  { id: 'alloc-w6-c9',  plant_id: 'w6', container_id: 'c9',  zone: null,         status: 'future',  sort_order: 0 }, // Japanese Maple (wishlist)

  // ── c10 — Strawberries ────────────────────────────────────────────────────
  { id: 'alloc-12-c10', plant_id: '12', container_id: 'c10', zone: null,         status: 'current', sort_order: 0 }, // Strawberries
];

async function main(): Promise<void> {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    console.log('Ensuring migrations are applied...');
    await runMigrations(client);

    console.log('\nSeeding plant allocations...');
    for (const a of allocations) {
      await client.query(
        `INSERT INTO plant_allocations (user_id, id, plant_id, container_id, zone, status, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (user_id, id) DO UPDATE SET
           plant_id     = EXCLUDED.plant_id,
           container_id = EXCLUDED.container_id,
           zone         = EXCLUDED.zone,
           status       = EXCLUDED.status,
           sort_order   = EXCLUDED.sort_order,
           updated_at   = NOW()`,
        [SEED_USER_ID, a.id, a.plant_id, a.container_id, a.zone, a.status, a.sort_order],
      );
      console.log(`  ✓  Upserted: ${a.id} (plant ${a.plant_id} → ${a.container_id}${a.zone ? ` [${a.zone}]` : ''})`);
    }

    console.log(`\nSeeded ${allocations.length} allocations successfully!`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('\nSeed failed:', err.message);
  process.exit(1);
});
