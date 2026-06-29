import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, beforeEach } from 'vitest';

import {
  createDatabaseClient,
  type DatabaseClient,
} from '../../server/platform/database/client';
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
  await client?.db.execute(sql`
    do $$
    declare
      table_name text;
    begin
      foreach table_name in array array[
        'integration_test_records',
        'session',
        'account',
        'verification',
        'user'
      ] loop
        if to_regclass('public.' || table_name) is not null then
          execute format('truncate table %I restart identity cascade', table_name);
        end if;
      end loop;
    end $$;
  `);
});

afterAll(async () => {
  await client?.close();
});
