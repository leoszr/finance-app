import { applyMigrations, initDatabase, type DatabaseExecutor } from '@/db/initDatabase';
import { initialMigrationStatements } from '@/db/migrations/0001_initial';

jest.mock('expo-sqlite', () => ({
  openDatabaseSync: jest.fn(() => ({ execAsync: jest.fn() })),
}));

describe('Sprint 01 database initialization', () => {
  it('covers T0106: applies migrations to an empty local database', async () => {
    const database: DatabaseExecutor = { execAsync: jest.fn().mockResolvedValue(undefined) };

    await applyMigrations(database);

    expect(database.execAsync).toHaveBeenCalledTimes(initialMigrationStatements.length + 2);
    expect(database.execAsync).toHaveBeenNthCalledWith(1, 'BEGIN IMMEDIATE;');
    expect(database.execAsync).toHaveBeenNthCalledWith(2, 'PRAGMA foreign_keys = ON;');
    expect(database.execAsync).toHaveBeenLastCalledWith('COMMIT;');
  });

  it('covers T0106: returns controlled error when initialization fails', async () => {
    const database: DatabaseExecutor = {
      execAsync: jest
        .fn()
        .mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce(new Error('disk unavailable'))
        .mockResolvedValueOnce(undefined),
    };

    await expect(initDatabase(database)).resolves.toEqual({
      ok: false,
      error: expect.objectContaining({ message: 'disk unavailable' }),
    });
    expect(database.execAsync).toHaveBeenLastCalledWith('ROLLBACK;');
  });
});
