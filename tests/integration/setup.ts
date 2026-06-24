import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, beforeEach } from 'vitest';

import {
  createDatabaseClient,
  type DatabaseClient,
} from '../../server/platform/database/client';
import { loadEnvironmentFile } from '../../scripts/environment/load-env-file';

loadEnvironmentFile();

const testDatabaseUrl =
  process.env.DATABASE_URL ??
  'postgres://coffee_roasters_integration:coffee_roasters_integration@localhost:54330/coffee_roasters_test';

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
  await client?.db.execute(sql`
    do $$
    begin
      if to_regclass('public.integration_test_records') is not null then
        truncate table integration_test_records;
      end if;
    end $$;
  `);
});

afterAll(async () => {
  await client?.close();
});
