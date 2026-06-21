export const initialMigrationStatements = [
  'PRAGMA foreign_keys = ON;',
  `CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('checking', 'savings', 'cash', 'credit', 'investment', 'other')),
    currency TEXT NOT NULL DEFAULT 'BRL',
    initial_balance_cents INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,
  `CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    color TEXT,
    icon TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,
  `CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    amount_cents INTEGER NOT NULL,
    description TEXT,
    transaction_date TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON UPDATE CASCADE ON DELETE RESTRICT
  );`,
  `CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,
  `CREATE INDEX IF NOT EXISTS transactions_account_id_idx ON transactions(account_id);`,
  `CREATE INDEX IF NOT EXISTS transactions_category_id_idx ON transactions(category_id);`,
  `CREATE INDEX IF NOT EXISTS transactions_transaction_date_idx ON transactions(transaction_date);`,
] as const;
