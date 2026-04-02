import { Client } from 'pg';
import { runMigrations } from './migrate';

const connectionString = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Error: POSTGRES_URL (or DATABASE_URL) environment variable must be set.');
  process.exit(1);
}

const SEED_USER_ID = process.env.MCP_OWNER_USER_ID ?? 'mcp';

const plants = [
  // ── Growing now ──
  { id: '1',   emoji: '🍅', name: 'Cherry Tomatoes',             stage: 'sprouted',  next_step: 'Thin/prick out at 2 true leaves',                                                                            placement: 'Corner trellis — Side A',          min_temp: 10,  frost_sensitive: true  },
  { id: '2',   emoji: '🍅', name: 'Beef Tomatoes (heirloom)',     stage: 'sprouted',  next_step: 'Thin/prick out at 2 true leaves',                                                                            placement: 'Corner trellis — Side B',          min_temp: 10,  frost_sensitive: true  },
  { id: '3',   emoji: '🍆', name: 'Aubergine',                    stage: 'sprouted',  next_step: 'Thin/prick out at 2 true leaves',                                                                            placement: 'Pot (~7–10 L) moveable',           min_temp: 10,  frost_sensitive: true  },
  { id: '4',   emoji: '🌶️', name: 'Habanero Chillies',           stage: 'sprouted',  next_step: 'Thin/prick out at 2–3 true leaves',                                                                          placement: 'Pot (~7–10 L) moveable',           min_temp: 10,  frost_sensitive: true  },
  { id: '5',   emoji: '🌿', name: 'Basil',                        stage: 'sprouted',  next_step: 'Thin lightly; separate if crowded',                                                                           placement: 'Planter 1',                        min_temp: 15,  frost_sensitive: true  },
  { id: '6',   emoji: '🌱', name: 'Parsley',                      stage: 'sprouted',  next_step: 'Thin lightly',                                                                                               placement: 'Planter 1',                        min_temp: 0,   frost_sensitive: false },
  { id: '7',   emoji: '🌼', name: 'Marigolds',                    stage: 'sprouted',  next_step: 'Thin or separate',                                                                                           placement: 'Corner trellis border',            min_temp: 5,   frost_sensitive: false },
  { id: '8',   emoji: '🥗', name: 'Mixed Lettuce',                stage: 'sprouted',  next_step: 'Keep indoors until mid–late April; harden off',                                                              placement: 'Planter 2',                        min_temp: 0,   frost_sensitive: false },
  { id: '9',   emoji: '🥬', name: 'Purple Curly Kale',            stage: 'sown',      next_step: 'Watch for slugs; fleece if cold',                                                                            placement: 'Raised Bed 1 outer ring',          min_temp: -15, frost_sensitive: false },
  { id: '10',  emoji: '🥦', name: 'Tenderstem Broccoli',          stage: 'sown',      next_step: 'Watch for slugs carefully!',                                                                                  placement: 'Raised Bed 2 inner ring',          min_temp: -5,  frost_sensitive: false },
  { id: '11',  emoji: '🌸', name: 'Nasturtiums',                  stage: 'sown',      next_step: 'Frost sensitive — cover if needed',                                                                           placement: 'Raised Bed 1 & 2 borders',         min_temp: 5,   frost_sensitive: true  },
  { id: '12',  emoji: '🍓', name: 'Strawberries',                 stage: 'sprouted',  next_step: 'Protect from frost',                                                                                         placement: 'Separate pots; growhouse',         min_temp: -15, frost_sensitive: false },
  { id: '13',  emoji: '🌿', name: 'Fig',                          stage: 'dormant',   next_step: 'Keep south-facing; shed in hard frost',                                                                       placement: 'Patio pot — moveable',             min_temp: -10, frost_sensitive: false },
  { id: '14',  emoji: '🥔', name: 'Seed Potatoes',                stage: 'chitting',  next_step: 'Plant when shoots reach 1–2cm',                                                                              placement: 'Grow Bag 1',                       min_temp: 0,   frost_sensitive: false },
  // ── Wishlist — seeds to sow ──
  { id: 'w1',  emoji: '🥬', name: 'Pak Choi',                     stage: 'wishlist',  next_step: 'Joi Choi F1 (bolt-resistant). Sow Apr–Aug directly into Raised Bed 2.',                                     placement: 'Raised Bed 2',                     min_temp: -2,  frost_sensitive: false },
  { id: 'w2',  emoji: '🧅', name: 'Spring Onions',                stage: 'wishlist',  next_step: 'White Lisbon. Sow successionally every 3 weeks Mar–Jun.',                                                    placement: 'Raised Bed 2 outer ring',          min_temp: -5,  frost_sensitive: false },
  { id: 'w3',  emoji: '🌿', name: 'Spinach',                      stage: 'wishlist',  next_step: 'Perpetual Spinach — less prone to bolting. Sow Mar–Jul.',                                                    placement: 'Raised Bed 2',                     min_temp: -10, frost_sensitive: false },
  { id: 'w4',  emoji: '🥒', name: 'Courgette',                    stage: 'wishlist',  next_step: 'Patio Star F1 or Black Beauty. Sow one seed per pot on its side, indoors Mar–Apr.',                         placement: 'Individual pot (20 L)',            min_temp: 10,  frost_sensitive: true  },
  { id: 'w5',  emoji: '🌿', name: 'Asparagus',                    stage: 'wishlist',  next_step: "Connover's Colossal or Guelph Millennium. Buy 2yr crowns — plant now!",                                     placement: 'Raised Bed 2 centre',              min_temp: -20, frost_sensitive: false },
  // ── Wishlist — plants to buy ──
  { id: 'w6',  emoji: '🍁', name: 'Japanese Maple',               stage: 'wishlist',  next_step: "Buy from specialist nursery. 'Bloodgood' or 'Sango-kaku'. Fully hardy — leave outside year-round.",        placement: '≥ 40 L pot',                       min_temp: -20, frost_sensitive: false },
  { id: 'w7',  emoji: '🥬', name: 'Perennial Kale (Daubenton)',    stage: 'wishlist',  next_step: 'Very hardy, reliable UK perennial. Buy ×2 and plant in Raised Bed 1 centre.',                               placement: 'Raised Bed 1 centre',              min_temp: -15, frost_sensitive: false },
  // ── Wishlist — on hold for future seasons ──
  { id: 'w8',  emoji: '🌿', name: 'Mint',                         stage: 'wishlist',  next_step: 'Spearmint or Applemint. Pot-in-pot to contain roots.',                                                       placement: 'Planter 1 (pot-in-pot)',           min_temp: -15, frost_sensitive: false },
  { id: 'w9',  emoji: '🫐', name: 'Blueberries',                  stage: 'wishlist',  next_step: 'Bluecrop + Duke. Buy two for cross-pollination. Ericaceous compost essential.',                             placement: '≥ 40 L pots (× 2)',               min_temp: -25, frost_sensitive: false },
  { id: 'w10', emoji: '🫒', name: 'Olive',                        stage: 'wishlist',  next_step: "Arbequina. Move under cover below -5°C.",                                                                    placement: '≥ 40–50 L pot',                    min_temp: -5,  frost_sensitive: false },
  { id: 'w11', emoji: '🌿', name: 'Bay Tree',                     stage: 'wishlist',  next_step: 'Laurus nobilis. Very low maintenance once established.',                                                      placement: '≥ 30 L pot',                       min_temp: -10, frost_sensitive: false },
  { id: 'w12', emoji: '🌳', name: 'Mulberry',                     stage: 'wishlist',  next_step: "Charlotte Russe. Buy from specialist fruit nursery. Mind fruit drop near seating!",                         placement: '≥ 50 L pot — TBD',                min_temp: -15, frost_sensitive: false },
  // ── Wishlist — future fruit trees ──
  { id: 'w13', emoji: '🍎', name: 'Apple',                        stage: 'wishlist',  next_step: "Falstaff on M27 rootstock. Self-fertile; beautiful spring blossom.",                                        placement: 'TBD — garden layout pending',      min_temp: -25, frost_sensitive: false },
  { id: 'w14', emoji: '🍒', name: 'Cherry',                       stage: 'wishlist',  next_step: "Stella (self-fertile). Great in a large pot; net when fruiting.",                                            placement: 'TBD — garden layout pending',      min_temp: -25, frost_sensitive: false },
  { id: 'w15', emoji: '🍑', name: 'Plum',                         stage: 'wishlist',  next_step: "Victoria on Pixy rootstock. Very productive; self-fertile.",                                                 placement: 'TBD — garden layout pending',      min_temp: -25, frost_sensitive: false },
];

async function main(): Promise<void> {
  const client = new Client({ connectionString });
  await client.connect();
  try {
    console.log('Ensuring migrations are applied...');
    await runMigrations(client);
    console.log('\nSeeding plants...');
    for (const p of plants) {
      await client.query(
        `INSERT INTO plants (user_id, id, emoji, name, stage, next_step, placement, min_temp, frost_sensitive)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (user_id, id) DO UPDATE SET
           emoji           = EXCLUDED.emoji,
           name            = EXCLUDED.name,
           stage           = EXCLUDED.stage,
           next_step       = EXCLUDED.next_step,
           placement       = EXCLUDED.placement,
           min_temp        = EXCLUDED.min_temp,
           frost_sensitive = EXCLUDED.frost_sensitive,
           updated_at      = NOW()`,
        [SEED_USER_ID, p.id, p.emoji, p.name, p.stage, p.next_step ?? null, p.placement ?? null, p.min_temp ?? null, p.frost_sensitive ?? false],
      );
      console.log(`  ✓  Upserted: ${p.name}`);
    }
    console.log(`\nSeeded ${plants.length} plants successfully!`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('\nSeed failed:', err.message);
  process.exit(1);
});
