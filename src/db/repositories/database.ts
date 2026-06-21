import { getSqliteDatabase } from '@/db/client';
import type { RepositoryDatabase, SqlParams } from '@/db/repositories/types';

export function getRepositoryDatabase(): RepositoryDatabase {
  const database = getSqliteDatabase();

  return {
    getAllAsync: <T>(source: string, params: SqlParams = []) => database.getAllAsync<T>(source, [...params]),
    getFirstAsync: <T>(source: string, params: SqlParams = []) => database.getFirstAsync<T>(source, [...params]),
    runAsync: (source: string, params: SqlParams = []) => database.runAsync(source, [...params]),
  };
}
