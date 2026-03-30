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
    await client.query('DELETE FROM plant_allocations WHERE user_id = ANY($1)', [[userA, userB]]);
    await client.query('DELETE FROM containers WHERE user_id = ANY($1)', [[userA, userB]]);
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
    await client.query(
      'INSERT INTO containers (user_id, id, name, type) VALUES ($1, $2, $3, $4)',
      [userA, 'container-a-1', 'Big Pot', 'pot'],
    );
    await client.query(
      'INSERT INTO containers (user_id, id, name, type) VALUES ($1, $2, $3, $4)',
      [userB, 'container-b-1', 'Planter Box', 'planter'],
    );
    await client.query(
      'INSERT INTO plant_allocations (user_id, id, plant_id, container_id, status) VALUES ($1, $2, $3, $4, $5)',
      [userA, 'alloc-a-1', 'plant-a-1', 'container-a-1', 'current'],
    );
    await client.query(
      'INSERT INTO plant_allocations (user_id, id, plant_id, container_id, status) VALUES ($1, $2, $3, $4, $5)',
      [userB, 'alloc-b-1', 'plant-b-1', 'container-b-1', 'current'],
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

    // Containers: userA sees only their rows.
    const { rows: containersA } = await client.query(
      'SELECT * FROM containers WHERE user_id = $1',
      [userA],
    );
    assert(containersA.length === 1, `userA should have 1 container, got ${containersA.length}`);
    assert(containersA[0].name === 'Big Pot', `userA container name mismatch`);
    console.log('  PASS  userA containers are isolated');

    // Containers: userB sees only their rows.
    const { rows: containersB } = await client.query(
      'SELECT * FROM containers WHERE user_id = $1',
      [userB],
    );
    assert(containersB.length === 1, `userB should have 1 container, got ${containersB.length}`);
    assert(containersB[0].name === 'Planter Box', `userB container name mismatch`);
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

    // Plant allocations: userA sees only their rows.
    const { rows: allocsA } = await client.query(
      'SELECT * FROM plant_allocations WHERE user_id = $1',
      [userA],
    );
    assert(allocsA.length === 1, `userA should have 1 allocation, got ${allocsA.length}`);
    assert(allocsA[0].plant_id === 'plant-a-1', `userA allocation plant_id mismatch`);
    console.log('  PASS  userA plant allocations are isolated');

    // Plant allocations: userB sees only their rows.
    const { rows: allocsB } = await client.query(
      'SELECT * FROM plant_allocations WHERE user_id = $1',
      [userB],
    );
    assert(allocsB.length === 1, `userB should have 1 allocation, got ${allocsB.length}`);
    assert(allocsB[0].plant_id === 'plant-b-1', `userB allocation plant_id mismatch`);
    console.log('  PASS  userB plant allocations are isolated');

    // Cascade behavior: plant_allocations has no FK constraints (dropped in migration 0004),
    // so deleting a container does NOT automatically delete its allocations.
    // The application layer is responsible for cleaning up orphaned allocations.
    await client.query(
      'DELETE FROM containers WHERE user_id = $1 AND id = $2',
      [userB, 'container-b-1'],
    );
    const { rows: allocsBAfterContainerDelete } = await client.query(
      'SELECT * FROM plant_allocations WHERE user_id = $1',
      [userB],
    );
    assert(
      allocsBAfterContainerDelete.length === 1,
      'userB allocation should persist after container delete (no FK cascade)',
    );
    console.log('  PASS  allocations persist after container delete (no FK cascade; app-layer cleanup required)');

    // Clean up.
    await client.query('DELETE FROM plant_allocations WHERE user_id = ANY($1)', [[userA, userB]]);
    await client.query('DELETE FROM containers WHERE user_id = ANY($1)', [[userA, userB]]);
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
