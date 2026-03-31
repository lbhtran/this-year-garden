import { Client } from 'pg';
import { runMigrations } from './migrate';

const connectionString = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Error: POSTGRES_URL (or DATABASE_URL) environment variable must be set.');
  process.exit(1);
}

const SEED_USER_ID = process.env.MCP_OWNER_USER_ID ?? 'mcp';

const containers = [
  { id: 'c1',  emoji: '🌿', name: 'Corner Trellis Planter', type: 'trellis_planter', size: 'Right-angle triangle — 70 × 70 cm trellis sides', notes: 'Cherry tomatoes (Side A, vertical) + Beef tomatoes (Side B, horizontal). Marigolds & nasturtiums along the long (diagonal) side.', on_hold: false, diagram_id: 'diagram-c1' },
  { id: 'c2',  emoji: '🌿', name: 'Planter 1',              type: 'planter',         size: '20 × 90 × 25 cm',                                  notes: 'Herbs & spring onions: basil (in grow house until warm), parsley, chives, spring onions. Mint on hold for next season.',                                                   on_hold: false, diagram_id: 'diagram-c2' },
  { id: 'c3',  emoji: '🥗', name: 'Planter 2',              type: 'planter',         size: '20 × 90 × 25 cm',                                  notes: 'Fully salad & lettuce: mixed salad leaves (cut & come again), Little Gem lettuce, rocket. Sow successionally.',                                                    on_hold: false, diagram_id: 'diagram-c3' },
  { id: 'c4',  emoji: '🥬', name: 'Raised Bed 1',           type: 'raised_bed',      size: '60 × 120 cm — curved edges',                       notes: 'Perennial kale centre · lettuce & spinach inner ring · purple curly kale outer ring · nasturtium border.',                                                          on_hold: false, diagram_id: 'diagram-c4' },
  { id: 'c5',  emoji: '🌱', name: 'Raised Bed 2',           type: 'raised_bed',      size: '60 × 120 cm — curved edges',                       notes: 'Asparagus centre (permanent) · pak choi & tenderstem broccoli inner ring · spring onions outer ring · nasturtium border.',                                         on_hold: false, diagram_id: 'diagram-c5' },
  { id: 'c6',  emoji: '🥔', name: 'Grow Bag 1',             type: 'grow_bag',        size: '40–50 L',                                          notes: 'Potatoes #1 — currently chitting. Maris Piper or Charlotte.',                                                                                                         on_hold: false, diagram_id: 'diagram-growbags' },
  { id: 'c6b', emoji: '🥔', name: 'Grow Bag 2',             type: 'grow_bag',        size: '40–50 L',                                          notes: 'Potatoes #2 — second bag for larger yield. Maris Piper or Charlotte.',                                                                                                  on_hold: false, diagram_id: 'diagram-growbags' },
  { id: 'c7',  emoji: '🥕', name: 'Grow Bag 3',             type: 'grow_bag',        size: '40–50 L',                                          notes: 'Carrots — sow directly in rows. Nantes 2 or Chantenay Red Cored.',                                                                                                     on_hold: false, diagram_id: 'diagram-growbags' },
  { id: 'c7b', emoji: '🌿', name: 'Grow Bag 4',             type: 'grow_bag',        size: 'Large (40–50 L+)',                                  notes: 'Fig — transfer from patio pot as season progresses to allow a bigger tree. Move to shed in hard frosts.',                                                               on_hold: false, diagram_id: 'diagram-growbags' },
  { id: 'c8',  emoji: '🪴', name: 'Individual Pots',        type: 'pot',             size: '7–20 L each',                                      notes: 'Aubergine, chillies (7–10 L, overwinter indoors), courgette (20 L, annual).',                                                                                          on_hold: false, diagram_id: 'diagram-pots' },
  { id: 'c9',  emoji: '🍁', name: 'Japanese Maple',         type: 'pot',             size: '≥ 40 L pot',                                       notes: "Fully hardy — leave outside year-round. 'Bloodgood' or 'Sango-kaku'.",                                                                                                  on_hold: false, diagram_id: 'diagram-pots' },
  { id: 'c10', emoji: '🍓', name: 'Strawberries',           type: 'pot',             size: 'Individual pots',                                  notes: 'Strawberries in individual pots — growhouse in hard frosts.',                                                                                                         on_hold: false, diagram_id: 'diagram-pots' },
  { id: 'c11', emoji: '⏸️', name: 'On Hold',               type: 'pot',             size: 'Future seasons',                                   notes: 'Blueberries, olive, bay, mulberry, mint. Fruit trees pending garden layout (swing, seating etc.)',                                                                      on_hold: true,  diagram_id: null },
];

async function main(): Promise<void> {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    console.log('Ensuring migrations are applied...');
    await runMigrations(client);

    console.log('\nSeeding containers...');
    for (const c of containers) {
      await client.query(
        `INSERT INTO containers (user_id, id, emoji, name, type, size, notes, on_hold, diagram_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (user_id, id) DO UPDATE SET
           emoji      = EXCLUDED.emoji,
           name       = EXCLUDED.name,
           type       = EXCLUDED.type,
           size       = EXCLUDED.size,
           notes      = EXCLUDED.notes,
           on_hold    = EXCLUDED.on_hold,
           diagram_id = EXCLUDED.diagram_id,
           updated_at = NOW()`,
        [SEED_USER_ID, c.id, c.emoji, c.name, c.type, c.size, c.notes, c.on_hold, c.diagram_id],
      );
      console.log(`  ✓  Upserted: ${c.name}`);
    }

    console.log(`\nSeeded ${containers.length} containers successfully!`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('\nSeed failed:', err.message);
  process.exit(1);
});
