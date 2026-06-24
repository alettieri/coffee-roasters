import { migrate } from 'drizzle-orm/postgres-js/migrator';

import { createDatabaseClient } from '../../server/platform/database/client';

export async function runMigrations(databaseUrl: string): Promise<void> {
  const client = createDatabaseClient(databaseUrl, {
    maxConnections: 1,
  });

  try {
    await migrate(client.db, { migrationsFolder: 'drizzle' });
  } finally {
    await client.close();
  }
}
