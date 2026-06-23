import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  createDatabaseClient,
  type DatabaseClient,
} from '../../server/platform/database/client';
import { verifyDatabaseConnection } from '../../server/platform/database/health';

const testDatabaseUrl =
  process.env.TEST_DATABASE_URL ??
  'postgres://coffee_roasters:coffee_roasters_local@localhost:54329/coffee_roasters_test';

const deterministicClock = new Date('2026-06-23T12:00:00.000Z');
const deterministicId = '00000000-0000-7000-8000-000000000003';

function requireDatabaseClient(
  client: DatabaseClient | undefined,
): DatabaseClient {
  if (!client) {
    throw new Error('Database integration test client was not initialized');
  }

  return client;
}

describe('PostgreSQL Drizzle integration', () => {
  let client: DatabaseClient | undefined;

  beforeAll(async () => {
    client = createDatabaseClient(testDatabaseUrl, { maxConnections: 1 });
    await client.db.execute(sql`
      create table if not exists integration_test_records (
        id uuid primary key,
        label text not null,
        observed_at timestamptz not null
      )
    `);
  });

  afterAll(async () => {
    if (!client) {
      return;
    }

    await client.db.execute(sql`drop table if exists integration_test_records`);
    await client.close();
  });

  it('verifies database health without a diagnostic table', async () => {
    const databaseClient = requireDatabaseClient(client);

    await expect(
      verifyDatabaseConnection(databaseClient.db),
    ).resolves.toBeUndefined();
  });

  it('writes, reads, rolls back transactions, and cleans up test-owned data', async () => {
    const databaseClient = requireDatabaseClient(client);

    await databaseClient.db
      .transaction(async (tx) => {
        await tx.execute(sql`
        insert into integration_test_records (id, label, observed_at)
        values (${deterministicId}, 'deterministic write', ${deterministicClock})
      `);

        const inserted = await tx.execute<{
          id: string;
          label: string;
          observed_at: Date;
        }>(sql`
        select id, label, observed_at
        from integration_test_records
        where id = ${deterministicId}
      `);

        expect(inserted).toHaveLength(1);
        expect(inserted[0]).toMatchObject({
          id: deterministicId,
          label: 'deterministic write',
        });

        throw new Error('rollback integration test transaction');
      })
      .catch((error: unknown) => {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe(
          'rollback integration test transaction',
        );
      });

    const afterRollback = await databaseClient.db.execute(sql`
      select id
      from integration_test_records
      where id = ${deterministicId}
    `);

    expect(afterRollback).toHaveLength(0);
  });
});
