import { getSqliteDatabase } from '@/db/client';
import { createAccountsRepository } from '@/db/repositories/accountsRepository';
import { createCategoriesRepository } from '@/db/repositories/categoriesRepository';
import { createSettingsRepository } from '@/db/repositories/settingsRepository';
import { createTransactionsRepository } from '@/db/repositories/transactionsRepository';
import { BACKUP_SCHEMA_VERSION, type BackupData } from './backupSchema';

type BudgetRow = { id: number; year: number; month: number; total_cents: number; created_at: string; updated_at: string };
type BudgetCategoryRow = { id: number; budget_id: number; category_id: number; amount_cents: number; created_at: string; updated_at: string };

export async function exportBackup(): Promise<BackupData> {
  const accountsRepository = createAccountsRepository();
  const categoriesRepository = createCategoriesRepository();
  const transactionsRepository = createTransactionsRepository();
  const settingsRepository = createSettingsRepository();
  const db = getSqliteDatabase();
  const budgets = await db.getAllAsync<BudgetRow>('SELECT * FROM budgets ORDER BY year ASC, month ASC, id ASC');
  const budgetCategories = await db.getAllAsync<BudgetCategoryRow>('SELECT * FROM budget_categories ORDER BY budget_id ASC, category_id ASC, id ASC');

  return {
    schemaVersion: BACKUP_SCHEMA_VERSION,
    accounts: await accountsRepository.getAccounts(),
    categories: await categoriesRepository.getCategories(),
    transactions: await transactionsRepository.getTransactions(),
    settings: await settingsRepository.getSettings(),
    budgets: budgets.map((row) => ({ id: row.id, year: row.year, month: row.month, totalCents: row.total_cents, createdAt: row.created_at, updatedAt: row.updated_at })),
    budgetCategories: budgetCategories.map((row) => ({ id: row.id, budgetId: row.budget_id, categoryId: row.category_id, amountCents: row.amount_cents, createdAt: row.created_at, updatedAt: row.updated_at })),
  };
}
