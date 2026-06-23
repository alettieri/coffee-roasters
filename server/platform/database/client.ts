import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { parseServerEnvironment } from '../env';
import { schema } from './schema';

export type Database = PostgresJsDatabase<typeof schema>;

export interface DatabaseClient {
  db: Database;
  close: () => Promise<void>;
}

interface CreateDatabaseClientOptions {
  maxConnections?: number;
}

export function createDatabaseClient(
  databaseUrl = parseServerEnvironment().DATABASE_URL,
  options: CreateDatabaseClientOptions = {},
): DatabaseClient {
  const sql = postgres(databaseUrl, {
    max: options.maxConnections ?? 5,
  });

  return {
    db: drizzle(sql, { schema }),
    close: () => sql.end(),
  };
}
