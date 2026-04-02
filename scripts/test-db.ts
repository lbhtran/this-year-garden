import { Client } from 'pg';
import { runMigrations } from './migrate';

const connectionString = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Error: POSTGRES_URL (or DATABASE_URL) environment variable must be set.');
  process.exit(1);
}

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function main(): Promise<void> {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    // Ensure schema is up-to-date before running tests.
    console.log('Ensuring migrations are applied...');
    await runMigrations(client);

    const userA = 'test-user-a';
    const userB = 'test-user-b';

    // Clean up any leftover data from previous runs.
    await client.query('DELETE FROM plants WHERE user_id = ANY($1)', [[userA, userB]]);
    await client.query('DELETE FROM shopping_items WHERE user_id = ANY($1)', [[userA, userB]]);
    await client.query('DELETE FROM containers WHERE user_id = ANY($1)', [[userA, userB]]);

    console.log('\nInserting test rows...');
    await client.query(
      'INSERT INTO plants (user_id, id, name, stage) VALUES ($1, $2, $3, $4)',
      [userA, 'plant-a-1', 'Tomato', 'seedling'],
    );
    await client.query(
      'INSERT INTO plants (user_id, id, name, stage) VALUES ($1, $2, $3, $4)',
      [userB, 'plant-b-1', 'Basil', 'growing'],
    );
    await client.query(
      'INSERT INTO shopping_items (user_id, id, name) VALUES ($1, $2, $3)',
      [userA, 'item-a-1', 'Tomato seeds'],
    );
    await client.query(
      'INSERT INTO shopping_items (user_id, id, name) VALUES ($1, $2, $3)',
      [userB, 'item-b-1', 'Basil seeds'],
    );

    console.log('\nTesting ownership isolation...');

    // Plants: userA sees only their rows.
    const { rows: plantsA } = await client.query(
      'SELECT * FROM plants WHERE user_id = $1',
      [userA],
    );
    assert(plantsA.length === 1, `userA should have 1 plant, got ${plantsA.length}`);
    assert(plantsA[0].name === 'Tomato', `userA plant name should be Tomato, got ${plantsA[0].name}`);
    console.log('  PASS  userA plants are isolated');

    // Plants: userB sees only their rows.
    const { rows: plantsB } = await client.query(
      'SELECT * FROM plants WHERE user_id = $1',
      [userB],
    );
    assert(plantsB.length === 1, `userB should have 1 plant, got ${plantsB.length}`);
    assert(plantsB[0].name === 'Basil', `userB plant name should be Basil, got ${plantsB[0].name}`);
    console.log('  PASS  userB plants are isolated');

    // Shopping items: userA sees only their rows.
    const { rows: itemsA } = await client.query(
      'SELECT * FROM shopping_items WHERE user_id = $1',
      [userA],
    );
    assert(itemsA.length === 1, `userA should have 1 shopping item, got ${itemsA.length}`);
    assert(itemsA[0].name === 'Tomato seeds', `userA item name mismatch`);
    console.log('  PASS  userA shopping items are isolated');

    // Shopping items: userB sees only their rows.
    const { rows: itemsB } = await client.query(
      'SELECT * FROM shopping_items WHERE user_id = $1',
      [userB],
    );
    assert(itemsB.length === 1, `userB should have 1 shopping item, got ${itemsB.length}`);
    assert(itemsB[0].name === 'Basil seeds', `userB item name mismatch`);
    console.log('  PASS  userB shopping items are isolated');

    // Scoped delete: deleting userA row does not affect userB.
    await client.query(
      'DELETE FROM plants WHERE user_id = $1 AND id = $2',
      [userA, 'plant-a-1'],
    );
    const { rows: plantsAAfterDelete } = await client.query(
      'SELECT * FROM plants WHERE user_id = $1',
      [userA],
    );
    assert(plantsAAfterDelete.length === 0, 'userA plant should be deleted');
    const { rows: plantsBAfterDelete } = await client.query(
      'SELECT * FROM plants WHERE user_id = $1',
      [userB],
    );
    assert(plantsBAfterDelete.length === 1, 'userB plant should be unaffected');
    console.log('  PASS  scoped delete does not affect other users');

    // Clean up.
    await client.query('DELETE FROM plants WHERE user_id = ANY($1)', [[userA, userB]]);
    await client.query('DELETE FROM shopping_items WHERE user_id = ANY($1)', [[userA, userB]]);

    // ── Containers ──────────────────────────────────────────────────────────

    console.log('\nTesting containers table...');

    await client.query(
      `INSERT INTO containers (user_id, id, name, type, size, notes, on_hold, diagram_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [userA, 'container-a-1', 'Corner Trellis', 'trellis_planter', '70×70 cm', 'Cherry tomatoes', false, 'diagram-c1'],
    );
    await client.query(
      `INSERT INTO containers (user_id, id, name, type, size, notes, on_hold)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userB, 'container-b-1', 'Herb Planter', 'planter', '20×90 cm', 'Herbs', false],
    );

    // Ownership isolation: userA sees only their containers.
    const { rows: containersA } = await client.query(
      'SELECT * FROM containers WHERE user_id = $1',
      [userA],
    );
    assert(containersA.length === 1, `userA should have 1 container, got ${containersA.length}`);
    assert(containersA[0].name === 'Corner Trellis', `userA container name mismatch`);
    assert(containersA[0].diagram_id === 'diagram-c1', `userA container diagram_id mismatch`);
    console.log('  PASS  userA containers are isolated');

    // Ownership isolation: userB sees only their containers.
    const { rows: containersB } = await client.query(
      'SELECT * FROM containers WHERE user_id = $1',
      [userB],
    );
    assert(containersB.length === 1, `userB should have 1 container, got ${containersB.length}`);
    assert(containersB[0].name === 'Herb Planter', `userB container name mismatch`);
    console.log('  PASS  userB containers are isolated');

    // Scoped delete: deleting userA container does not affect userB.
    await client.query(
      'DELETE FROM containers WHERE user_id = $1 AND id = $2',
      [userA, 'container-a-1'],
    );
    const { rows: containersAAfterDelete } = await client.query(
      'SELECT * FROM containers WHERE user_id = $1',
      [userA],
    );
    assert(containersAAfterDelete.length === 0, 'userA container should be deleted');
    const { rows: containersBAfterDelete } = await client.query(
      'SELECT * FROM containers WHERE user_id = $1',
      [userB],
    );
    assert(containersBAfterDelete.length === 1, 'userB container should be unaffected');
    console.log('  PASS  scoped container delete does not affect other users');

    // Clean up.
    await client.query('DELETE FROM containers WHERE user_id = ANY($1)', [[userA, userB]]);

    // ── Container CRUD operations ────────────────────────────────────────────
    // These tests mirror the exact SQL executed by the /api/containers routes.

    console.log('\nTesting container CRUD operations (API parity)...');

    // POST equivalent: INSERT with no type supplied → JS defaults to 'planter'.
    // bodyType mimics a form submission where the user did not pick a type.
    const bodyType: string | undefined = undefined;
    await client.query(
      `INSERT INTO containers (user_id, id, name, emoji, type, size, notes, on_hold, diagram_id, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
       ON CONFLICT (user_id, id) DO UPDATE SET
         name = EXCLUDED.name, emoji = EXCLUDED.emoji, type = EXCLUDED.type,
         size = EXCLUDED.size, notes = EXCLUDED.notes, on_hold = EXCLUDED.on_hold,
         diagram_id = EXCLUDED.diagram_id, updated_at = NOW()
       RETURNING *`,
      [userA, 'crud-a-1', 'Grow Bag', null, bodyType ?? 'planter', null, null, false, null],
    );
    const { rows: defaultTypeRows } = await client.query(
      'SELECT type FROM containers WHERE user_id = $1 AND id = $2',
      [userA, 'crud-a-1'],
    );
    assert(defaultTypeRows.length === 1, 'container should be inserted');
    assert(defaultTypeRows[0].type === 'planter', `type should default to 'planter', got '${defaultTypeRows[0].type}'`);
    console.log("  PASS  POST without type defaults to 'planter'");

    // POST equivalent: INSERT with explicit type → stored as-is.
    const explicitType = 'trellis_planter';
    await client.query(
      `INSERT INTO containers (user_id, id, name, emoji, type, size, notes, on_hold, diagram_id, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
       ON CONFLICT (user_id, id) DO UPDATE SET
         name = EXCLUDED.name, emoji = EXCLUDED.emoji, type = EXCLUDED.type,
         size = EXCLUDED.size, notes = EXCLUDED.notes, on_hold = EXCLUDED.on_hold,
         diagram_id = EXCLUDED.diagram_id, updated_at = NOW()
       RETURNING *`,
      [userA, 'crud-a-2', 'Trellis Planter', '🌿', explicitType ?? 'planter', '70×70 cm', null, false, null],
    );
    const { rows: explicitTypeRows } = await client.query(
      'SELECT type FROM containers WHERE user_id = $1 AND id = $2',
      [userA, 'crud-a-2'],
    );
    assert(explicitTypeRows[0].type === 'trellis_planter', `type should be 'trellis_planter', got '${explicitTypeRows[0].type}'`);
    console.log('  PASS  POST with explicit type stores correctly');

    // PATCH equivalent: UPDATE fields including type.
    await client.query(
      `UPDATE containers SET
         name = $3, emoji = $4, type = COALESCE($5, type),
         size = $6, notes = $7, on_hold = $8, diagram_id = $9, updated_at = NOW()
       WHERE user_id = $1 AND id = $2
       RETURNING *`,
      [userA, 'crud-a-1', 'Big Grow Bag', '🌱', 'grow_bag', 'XL', 'Tomatoes', true, 'diagram-x'],
    );
    const { rows: updatedRows } = await client.query(
      'SELECT * FROM containers WHERE user_id = $1 AND id = $2',
      [userA, 'crud-a-1'],
    );
    assert(updatedRows[0].name === 'Big Grow Bag', `name should be updated`);
    assert(updatedRows[0].type === 'grow_bag', `type should be updated to 'grow_bag'`);
    assert(updatedRows[0].notes === 'Tomatoes', `notes should be updated`);
    assert(updatedRows[0].on_hold === true, `on_hold should be true`);
    console.log('  PASS  PATCH updates fields correctly');

    // PATCH equivalent: UPDATE without type → COALESCE preserves existing value.
    await client.query(
      `UPDATE containers SET
         name = $3, emoji = $4, type = COALESCE($5, type),
         size = $6, notes = $7, on_hold = $8, diagram_id = $9, updated_at = NOW()
       WHERE user_id = $1 AND id = $2
       RETURNING *`,
      [userA, 'crud-a-1', 'Grow Bag Renamed', null, null, null, null, false, null],
    );
    const { rows: coalesceRows } = await client.query(
      'SELECT type FROM containers WHERE user_id = $1 AND id = $2',
      [userA, 'crud-a-1'],
    );
    assert(coalesceRows[0].type === 'grow_bag', `COALESCE should preserve type 'grow_bag', got '${coalesceRows[0].type}'`);
    console.log('  PASS  PATCH without type preserves existing type via COALESCE');

    // PATCH scoped by user_id: userB cannot update userA's container.
    await client.query(
      `INSERT INTO containers (user_id, id, name, type, on_hold, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [userB, 'crud-b-1', 'Herb Box', 'planter', false],
    );
    await client.query(
      `UPDATE containers SET name = $3, type = COALESCE($4, type), updated_at = NOW()
       WHERE user_id = $1 AND id = $2`,
      [userB, 'crud-a-1', 'Should Not Change', null],
    );
    const { rows: crossUpdateRows } = await client.query(
      'SELECT name FROM containers WHERE user_id = $1 AND id = $2',
      [userA, 'crud-a-1'],
    );
    assert(crossUpdateRows[0].name === 'Grow Bag Renamed', `userA container should be unchanged, got '${crossUpdateRows[0].name}'`);
    console.log('  PASS  PATCH is scoped by user_id (cross-user update is blocked)');

    // DELETE scoped by user_id: userB cannot delete userA's container.
    await client.query(
      'DELETE FROM containers WHERE user_id = $1 AND id = $2',
      [userB, 'crud-a-1'],
    );
    const { rows: protectedRows } = await client.query(
      'SELECT id FROM containers WHERE user_id = $1 AND id = $2',
      [userA, 'crud-a-1'],
    );
    assert(protectedRows.length === 1, 'userA container should survive a delete attempt by userB');
    console.log('  PASS  DELETE is scoped by user_id (cross-user delete is blocked)');

    // DELETE: removes the correct container.
    await client.query(
      'DELETE FROM containers WHERE user_id = $1 AND id = $2',
      [userA, 'crud-a-1'],
    );
    const { rows: deletedRows } = await client.query(
      'SELECT id FROM containers WHERE user_id = $1 AND id = $2',
      [userA, 'crud-a-1'],
    );
    assert(deletedRows.length === 0, 'container should be deleted');
    console.log('  PASS  DELETE removes the correct container');

    // Clean up CRUD test data.
    await client.query('DELETE FROM containers WHERE user_id = ANY($1)', [[userA, userB]]);

    console.log('\nAll tests passed!');
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('\nTest failed:', err.message);
  process.exit(1);
});
