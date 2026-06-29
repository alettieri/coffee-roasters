import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, beforeEach } from 'vitest';

import {
  createDatabaseClient,
  type DatabaseClient,
} from '../../server/platform/database/client';
import {
  account,
  session,
  user,
  verification,
} from '../../server/platform/database/schema';
import {
  loadEnvironmentFile,
  requireEnvironmentVariable,
} from '../../scripts/environment/load-env-file';

loadEnvironmentFile();

const testDatabaseUrl = requireEnvironmentVariable('DATABASE_URL');

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

beforeEach(async () => {
  await client?.db.execute(
    sql`truncate table ${account}, ${session}, ${verification}, ${user} restart identity cascade`,
  );
  await client?.db.execute(
    sql`truncate table "integration_test_records" restart identity cascade`,
  );
});

afterAll(async () => {
  await client?.close();
});
