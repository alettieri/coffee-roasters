import { existsSync } from 'node:fs';

import { migrate } from 'drizzle-orm/postgres-js/migrator';

import { createDatabaseClient } from '../../server/platform/database/client';

const localDatabaseUrl =
  'postgres://coffee_roasters:coffee_roasters_local@localhost:54329/coffee_roasters_dev';

if (existsSync('.env')) {
  process.loadEnvFile('.env');
}

const client = createDatabaseClient(
  process.env.MIGRATION_DATABASE_URL ?? localDatabaseUrl,
  {
    maxConnections: 1,
  },
);

try {
  await migrate(client.db, { migrationsFolder: 'drizzle' });
} finally {
  await client.close();
}
