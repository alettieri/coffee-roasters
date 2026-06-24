import { defineConfig } from 'drizzle-kit';

import {
  loadEnvironmentFile,
  requireEnvironmentVariable,
} from './scripts/environment/load-env-file';

loadEnvironmentFile();

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    url: requireEnvironmentVariable('MIGRATION_DATABASE_URL'),
  },
  out: './drizzle',
  schema: './server/platform/database/schema.ts',
  strict: true,
  verbose: true,
});
