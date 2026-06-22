import { drizzle } from 'drizzle-orm/expo-sqlite';
import type { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

import { schema } from '@/db/schema';

export const DATABASE_NAME = 'finance-app.db';

export type LocalDatabase = SQLite.SQLiteDatabase;
export type LocalDrizzleDatabase = ExpoSQLiteDatabase<typeof schema>;

let sqliteInstance: LocalDatabase | null = null;
let drizzleInstance: LocalDrizzleDatabase | null = null;

export async function openSqliteDatabase(): Promise<LocalDatabase> {
  sqliteInstance ??= Platform.OS === 'web'
    ? await SQLite.openDatabaseAsync(DATABASE_NAME)
    : SQLite.openDatabaseSync(DATABASE_NAME);
  return sqliteInstance;
}

export function getSqliteDatabase(): LocalDatabase {
  if (Platform.OS === 'web' && !sqliteInstance) {
    throw new Error('Banco local ainda não foi inicializado.');
  }

  sqliteInstance ??= SQLite.openDatabaseSync(DATABASE_NAME);
  return sqliteInstance;
}

export function getDatabase(): LocalDrizzleDatabase {
  drizzleInstance ??= drizzle(getSqliteDatabase(), { schema });
  return drizzleInstance;
}
