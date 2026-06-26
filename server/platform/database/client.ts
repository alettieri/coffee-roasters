import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import type { H3Event } from 'h3';

import {
  resolveLocalDatabaseConnectionString,
  resolveRuntimeDatabaseConnectionString,
} from '../env';
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
  databaseUrl = resolveLocalDatabaseConnectionString(),
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

export function createRuntimeDatabaseClient(
  event: H3Event,
  options: CreateDatabaseClientOptions = {},
): DatabaseClient {
  return createDatabaseClient(
    resolveRuntimeDatabaseConnectionString(event),
    options,
  );
}
