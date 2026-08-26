import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

export type Database = PostgresJsDatabase<typeof schema>;

/**
 * Open a connection for a single request. Workers forbid reusing I/O objects
 * (sockets, streams) created in a previous request handler, so we never cache
 * the postgres.js client across requests.
 */
export async function withDb<T>(databaseUrl: string, fn: (db: Database) => Promise<T>): Promise<T> {
  const client = postgres(databaseUrl, {
    max: 1,
    prepare: false,
    fetch_types: false,
  });
  try {
    return await fn(drizzle(client, { schema }));
  } finally {
    await client.end({ timeout: 5 });
  }
}
