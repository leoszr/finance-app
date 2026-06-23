import { getSqliteDatabase } from '@/db/client';
import { notifyFinanceDataChanged } from '@/lib/dataEvents';
import { BACKUP_SCHEMA_VERSION, type BackupData } from './backupSchema';

function has(value: Record<string, unknown>, key: string) {
  return value[key] !== undefined && value[key] !== null;
}

function text(value: unknown) {
  return typeof value === 'string';
}

function int(value: unknown) {
  return Number.isInteger(value);
}

function hasIntAny(row: Record<string, unknown>, keys: string[]) {
  return keys.some((key) => has(row, key) && int(row[key]));
}

function validateRows(rows: Record<string, unknown>[], required: Record<string, (value: unknown) => boolean>) {
  return rows.every((row) => Object.entries(required).every(([key, check]) => has(row, key) && check(row[key])));
}

export function validateBackup(data: unknown) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return { ok: false as const, error: 'backup_shape_invalid' };

  const backup = data as Partial<BackupData>;
  if (backup.schemaVersion !== BACKUP_SCHEMA_VERSION && backup.schemaVersion !== 1) return { ok: false as const, error: 'backup_schema_invalid' };
  if (!Array.isArray(backup.accounts) || !Array.isArray(backup.categories) || !Array.isArray(backup.transactions) || !Array.isArray(backup.settings)) {
    return { ok: false as const, error: 'backup_shape_invalid' };
  }

  if (!validateRows(backup.accounts, { id: int, name: text, type: text, currency: text, initialBalanceCents: int, createdAt: text, updatedAt: text })) return { ok: false as const, error: 'backup_accounts_invalid' };
  if (!validateRows(backup.categories, { id: int, name: text, type: text, createdAt: text, updatedAt: text })) return { ok: false as const, error: 'backup_categories_invalid' };
  if (!validateRows(backup.transactions, { id: int, accountId: int, categoryId: int, type: text, amountCents: int, transactionDate: text, createdAt: text, updatedAt: text })) return { ok: false as const, error: 'backup_transactions_invalid' };
  if (!validateRows(backup.settings, { key: text, value: text })) return { ok: false as const, error: 'backup_settings_invalid' };
  if (backup.budgets !== undefined && !Array.isArray(backup.budgets)) return { ok: false as const, error: 'backup_budgets_invalid' };
  if (backup.budgetCategories !== undefined && !Array.isArray(backup.budgetCategories)) return { ok: false as const, error: 'backup_budget_categories_invalid' };
  if (backup.budgets && !validateRows(backup.budgets, { id: int, year: int, month: int, createdAt: text, updatedAt: text })) return { ok: false as const, error: 'backup_budgets_invalid' };
  if (backup.budgets && !backup.budgets.every((row) => hasIntAny(row, ['totalCents', 'total_cents']))) return { ok: false as const, error: 'backup_budgets_invalid' };
  if (backup.budgetCategories && !validateRows(backup.budgetCategories, { id: int, budgetId: int, categoryId: int, amountCents: int, createdAt: text, updatedAt: text })) return { ok: false as const, error: 'backup_budget_categories_invalid' };

  return { ok: true as const, value: backup as BackupData };
}

export async function importBackup(data: unknown) {
  const valid = validateBackup(data);
  if (!valid.ok) return valid;
  const db = getSqliteDatabase();
  const backup = valid.value;
  db.execSync('BEGIN IMMEDIATE;');
  try {
    db.execSync('DELETE FROM budget_categories; DELETE FROM budgets; DELETE FROM transactions; DELETE FROM accounts; DELETE FROM categories; DELETE FROM settings;');
    for (const row of backup.accounts) db.runSync('INSERT INTO accounts (id, name, type, currency, initial_balance_cents, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)', [row.id, row.name, row.type, row.currency, row.initialBalanceCents ?? row.initial_balance_cents, row.createdAt ?? row.created_at, row.updatedAt ?? row.updated_at].map((value) => value as never));
    for (const row of backup.categories) db.runSync('INSERT INTO categories (id, name, type, color, icon, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)', [row.id, row.name, row.type, row.color ?? null, row.icon ?? null, row.createdAt ?? row.created_at, row.updatedAt ?? row.updated_at].map((value) => value as never));
    for (const row of backup.budgets ?? []) db.runSync('INSERT INTO budgets (id, year, month, total_cents, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)', [row.id, row.year, row.month, row.totalCents ?? row.total_cents, row.createdAt ?? row.created_at, row.updatedAt ?? row.updated_at].map((value) => value as never));
    for (const row of backup.budgetCategories ?? []) db.runSync('INSERT INTO budget_categories (id, budget_id, category_id, amount_cents, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)', [row.id, row.budgetId ?? row.budget_id, row.categoryId ?? row.category_id, row.amountCents ?? row.amount_cents, row.createdAt ?? row.created_at, row.updatedAt ?? row.updated_at].map((value) => value as never));
    for (const row of backup.transactions) db.runSync('INSERT INTO transactions (id, account_id, category_id, type, amount_cents, description, transaction_date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [row.id, row.accountId ?? row.account_id, row.categoryId ?? row.category_id, row.type, row.amountCents ?? row.amount_cents, row.description ?? null, row.transactionDate ?? row.transaction_date, row.createdAt ?? row.created_at, row.updatedAt ?? row.updated_at].map((value) => value as never));
    for (const row of backup.settings) db.runSync('INSERT INTO settings (key, value, created_at, updated_at) VALUES (?, ?, ?, ?)', [row.key, row.value, row.createdAt ?? row.created_at ?? '2026-06-21 00:00:00', row.updatedAt ?? row.updated_at ?? '2026-06-21 00:00:00'].map((value) => value as never));
    db.execSync('COMMIT;');
    notifyFinanceDataChanged();
    return { ok: true as const };
  } catch (error) {
    db.execSync('ROLLBACK;');
    return { ok: false as const, error: error instanceof Error ? error : new Error('Falha ao importar backup.') };
  }
}
