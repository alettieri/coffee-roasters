import { defineConfig } from 'drizzle-kit';

const localDatabaseUrl =
  'postgres://coffee_roasters:coffee_roasters_local@localhost:54329/coffee_roasters_dev';

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.MIGRATION_DATABASE_URL ?? localDatabaseUrl,
  },
  out: './drizzle',
  schema: './server/platform/database/schema.ts',
  strict: true,
  verbose: true,
});
