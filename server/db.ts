import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '../shared/schema';

export const sqliteClient = createClient({
  url: 'file:sqlite.db',
});

export const db = drizzle(sqliteClient, { schema });
