import { loadEnvironmentFile } from '../environment/load-env-file';
import { runMigrations } from './run-migrations';

const localDatabaseUrl =
  'postgres://coffee_roasters:coffee_roasters_local@localhost:54329/coffee_roasters_dev';
const localIntegrationDatabaseUrl =
  'postgres://coffee_roasters_integration:coffee_roasters_integration@localhost:54330/coffee_roasters_test';

loadEnvironmentFile();

const defaultMigrationDatabaseUrl =
  process.env.ENV_FILE === '.env.test'
    ? localIntegrationDatabaseUrl
    : localDatabaseUrl;

await runMigrations(
  process.env.MIGRATION_DATABASE_URL ?? defaultMigrationDatabaseUrl,
);
