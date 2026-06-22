import { initialMigrationStatements } from '@/db/migrations/0001_initial';
import { accountTypes, transactionTypes, type MoneyCents } from '@/types/finance';

const migrationSql = initialMigrationStatements.join('\n');

function expectTableColumns(tableName: string, columns: string[]) {
  const tableSql = migrationSql.match(new RegExp(`CREATE TABLE IF NOT EXISTS ${tableName} \\([\\s\\S]*?\\);`))?.[0];

  expect(tableSql).toBeDefined();
  for (const column of columns) {
    expect(tableSql).toContain(column);
  }
}

describe('Sprint 01 local database schema', () => {
  it('covers T0101: has SQLite installed', () => {
    const packageJson = require('../../../package.json') as { dependencies: Record<string, string> };

    expect(packageJson.dependencies['expo-sqlite']).toBeDefined();
    expect(packageJson.dependencies['drizzle-orm']).toBeUndefined();
  });

  it('covers T0102: creates accounts schema with BRL default and integer cents', () => {
    expectTableColumns('accounts', [
      'id INTEGER PRIMARY KEY AUTOINCREMENT',
      'name TEXT NOT NULL',
      "type TEXT NOT NULL CHECK (type IN ('checking', 'savings', 'cash', 'credit', 'investment', 'other'))",
      "currency TEXT NOT NULL DEFAULT 'BRL'",
      'initial_balance_cents INTEGER NOT NULL DEFAULT 0',
      'created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP',
      'updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP',
    ]);

    const cents: MoneyCents = 12345;
    expect(Number.isInteger(cents)).toBe(true);
    expect(accountTypes).toContain('checking');
  });

  it('covers T0103: creates categories schema with income and expense types', () => {
    expectTableColumns('categories', [
      'id INTEGER PRIMARY KEY AUTOINCREMENT',
      'name TEXT NOT NULL',
      "type TEXT NOT NULL CHECK (type IN ('income', 'expense'))",
      'color TEXT',
      'icon TEXT',
      'created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP',
      'updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP',
    ]);

    expect(transactionTypes).toEqual(['income', 'expense']);
  });

  it('covers T0104: creates transactions schema with required cents and foreign keys', () => {
    expectTableColumns('transactions', [
      'id INTEGER PRIMARY KEY AUTOINCREMENT',
      'account_id INTEGER NOT NULL',
      'category_id INTEGER NOT NULL',
      "type TEXT NOT NULL CHECK (type IN ('income', 'expense'))",
      'amount_cents INTEGER NOT NULL',
      'description TEXT',
      'transaction_date TEXT NOT NULL',
      'FOREIGN KEY (account_id) REFERENCES accounts(id)',
      'FOREIGN KEY (category_id) REFERENCES categories(id)',
    ]);
  });

  it('covers T0105: creates settings schema with unique string key-value entries', () => {
    expectTableColumns('settings', [
      'id INTEGER PRIMARY KEY AUTOINCREMENT',
      'key TEXT NOT NULL UNIQUE',
      'value TEXT NOT NULL',
      'created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP',
      'updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP',
    ]);
  });
});
