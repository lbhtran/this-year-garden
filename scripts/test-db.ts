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

    console.log('\nAll tests passed!');
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('\nTest failed:', err.message);
  process.exit(1);
});
