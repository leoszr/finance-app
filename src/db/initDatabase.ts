import { getSqliteDatabase } from '@/db/client';
import { initialMigrationStatements } from '@/db/migrations/0001_initial';

export type DatabaseExecutor = {
  execAsync: (source: string) => Promise<unknown>;
};

export type DatabaseInitResult =
  | { ok: true }
  | { ok: false; error: Error };

export async function applyMigrations(database: DatabaseExecutor): Promise<void> {
  await database.execAsync('PRAGMA foreign_keys = ON;');
  await database.execAsync('BEGIN IMMEDIATE;');

  try {
    for (const statement of initialMigrationStatements) {
      if (statement === 'PRAGMA foreign_keys = ON;') {
        continue;
      }

      await database.execAsync(statement);
    }

    await database.execAsync('COMMIT;');
  } catch (error) {
    await database.execAsync('ROLLBACK;');
    throw error;
  }
}

export async function initDatabase(database?: DatabaseExecutor): Promise<DatabaseInitResult> {
  try {
    await applyMigrations(database ?? getSqliteDatabase());
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error : new Error('Falha ao inicializar banco local.'),
    };
  }
}
