import { drizzle } from 'drizzle-orm/expo-sqlite';
import type { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as SQLite from 'expo-sqlite';

import { schema } from '@/db/schema';

export const DATABASE_NAME = 'finance-app.db';

export type LocalDatabase = SQLite.SQLiteDatabase;
export type LocalDrizzleDatabase = ExpoSQLiteDatabase<typeof schema>;

let sqliteInstance: LocalDatabase | null = null;
let drizzleInstance: LocalDrizzleDatabase | null = null;

export function getSqliteDatabase(): LocalDatabase {
  sqliteInstance ??= SQLite.openDatabaseSync(DATABASE_NAME);
  return sqliteInstance;
}

export function getDatabase(): LocalDrizzleDatabase {
  drizzleInstance ??= drizzle(getSqliteDatabase(), { schema });
  return drizzleInstance;
}
