import {
  loadEnvironmentFile,
  requireEnvironmentVariable,
} from '../environment/load-env-file';
import { runMigrations } from './run-migrations';

loadEnvironmentFile();

await runMigrations(requireEnvironmentVariable('MIGRATION_DATABASE_URL'));
