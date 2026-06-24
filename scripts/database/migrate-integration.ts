import { existsSync } from 'node:fs';

import { runMigrations } from './run-migrations';

const localIntegrationDatabaseUrl =
  'postgres://coffee_roasters_integration:coffee_roasters_integration@localhost:54330/coffee_roasters_test';

if (existsSync('.env')) {
  process.loadEnvFile('.env');
}

await runMigrations(
  process.env.TEST_MIGRATION_DATABASE_URL ??
    process.env.TEST_DATABASE_URL ??
    localIntegrationDatabaseUrl,
);
