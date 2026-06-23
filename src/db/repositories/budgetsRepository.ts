import { getSqliteDatabase } from '@/db/client';
import { notifyFinanceDataChanged } from '@/lib/dataEvents';
import { repoErr, repoOk, type RepositoryDatabase, type RepositoryResult } from '@/db/repositories/types';

export type BudgetCategoryLimit = { categoryId: number; amountCents: number };
export type BudgetRecord = { id: number; year: number; month: number; totalCents: number; createdAt: string; updatedAt: string };

type BudgetRow = { id: number; year: number; month: number; total_cents: number; created_at: string; updated_at: string };

function mapBudget(row: BudgetRow): BudgetRecord {
  return { id: row.id, year: row.year, month: row.month, totalCents: row.total_cents, createdAt: row.created_at, updatedAt: row.updated_at };
}

function validMonth(year: number, month: number) {
  return Number.isInteger(year) && year >= 1 && year <= 9999 && Number.isInteger(month) && month >= 1 && month <= 12;
}

export function createBudgetsRepository(database: RepositoryDatabase = getRepositoryDatabase()) {
  async function getBudget(year: number, month: number): Promise<BudgetRecord | null> {
    const row = await database.getFirstAsync<BudgetRow>('SELECT * FROM budgets WHERE year = ? AND month = ?', [year, month]);
    return row ? mapBudget(row) : null;
  }

  async function upsertMonthlyBudget(input: { year: number; month: number; totalCents: number; categories: BudgetCategoryLimit[] }): Promise<RepositoryResult<BudgetRecord>> {
    if (!validMonth(input.year, input.month)) return repoErr('invalid_month', 'Mês de budget inválido.', 'month');
    if (!Number.isSafeInteger(input.totalCents) || input.totalCents < 0) return repoErr('invalid_budget', 'Budget total inválido.', 'totalCents');
    for (const category of input.categories) {
      if (!Number.isInteger(category.categoryId) || category.categoryId <= 0) return repoErr('invalid_category', 'Categoria inválida.', 'categoryId');
      if (!Number.isSafeInteger(category.amountCents) || category.amountCents < 0) return repoErr('invalid_budget', 'Budget da categoria inválido.', 'amountCents');
    }

    const existing = await getBudget(input.year, input.month);
    await database.runAsync('BEGIN IMMEDIATE;');
    if (existing) {
      try {
        await database.runAsync('UPDATE budgets SET total_cents = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [input.totalCents, existing.id]);
        await database.runAsync('DELETE FROM budget_categories WHERE budget_id = ?', [existing.id]);
        for (const category of input.categories.filter((item) => item.amountCents > 0)) {
          await database.runAsync('INSERT INTO budget_categories (budget_id, category_id, amount_cents) VALUES (?, ?, ?)', [existing.id, category.categoryId, category.amountCents]);
        }
        await database.runAsync('COMMIT;');
      } catch (error) {
        await database.runAsync('ROLLBACK;');
        throw error;
      }
      const updated = await getBudget(input.year, input.month);
      if (updated) notifyFinanceDataChanged();
      return updated ? repoOk(updated) : repoErr('budget_update_failed', 'Budget não foi atualizado.');
    }

    try {
      const result = await database.runAsync('INSERT INTO budgets (year, month, total_cents) VALUES (?, ?, ?)', [input.year, input.month, input.totalCents]);
      const budgetId = result.lastInsertRowId ?? 0;
      for (const category of input.categories.filter((item) => item.amountCents > 0)) {
        await database.runAsync('INSERT INTO budget_categories (budget_id, category_id, amount_cents) VALUES (?, ?, ?)', [budgetId, category.categoryId, category.amountCents]);
      }
      await database.runAsync('COMMIT;');
    } catch (error) {
      await database.runAsync('ROLLBACK;');
      throw error;
    }
    const budget = await getBudget(input.year, input.month);
    if (budget) notifyFinanceDataChanged();
    return budget ? repoOk(budget) : repoErr('budget_create_failed', 'Budget não foi criado.');
  }

  return { getBudget, upsertMonthlyBudget };
}

function getRepositoryDatabase(): RepositoryDatabase {
  return getSqliteDatabase() as unknown as RepositoryDatabase;
}
