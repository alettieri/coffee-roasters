import { existsSync } from 'node:fs';

import { runMigrations } from './run-migrations';

const localDatabaseUrl =
  'postgres://coffee_roasters:coffee_roasters_local@localhost:54329/coffee_roasters_dev';

if (existsSync('.env')) {
  process.loadEnvFile('.env');
}

await runMigrations(process.env.MIGRATION_DATABASE_URL ?? localDatabaseUrl);
