import { getSqliteDatabase } from '@/db/client';
import type { RepositoryDatabase, RepositoryResult } from '@/db/repositories/types';
import { repoOk } from '@/db/repositories/types';
import { getMonthRange } from '@/lib/month';

export type BudgetCategorySummary = { categoryId: number; categoryName: string; color: string | null; budgetCents: number; spentCents: number; percentOfBudget: number; sharePercent: number };
export type MonthlyBudgetSummary = { year: number; month: number; totalBudgetCents: number; totalSpentCents: number; remainingCents: number; categories: BudgetCategorySummary[]; hasBudget: boolean; hasExpenseCategories: boolean };

type CategoryRow = { id: number; name: string; color: string | null };
type BudgetRow = { id: number; total_cents: number };
type BudgetCategoryRow = { category_id: number; amount_cents: number };
type ExpenseRow = { category_id: number; amount_cents: number };

export function createBudgetQueries(database: RepositoryDatabase = getRepositoryDatabase()) {
  async function getMonthlyBudgetSummary(year: number, month: number): Promise<RepositoryResult<MonthlyBudgetSummary>> {
    const range = getMonthRange(year, month);
    if (!range.ok) return range;
    const [budget, categories, expenses] = await Promise.all([
      database.getFirstAsync<BudgetRow>('SELECT id, total_cents FROM budgets WHERE year = ? AND month = ?', [year, month]),
      database.getAllAsync<CategoryRow>("SELECT id, name, color FROM categories WHERE type = 'expense' ORDER BY created_at ASC, id ASC"),
      database.getAllAsync<ExpenseRow>("SELECT category_id, SUM(amount_cents) AS amount_cents FROM transactions WHERE type = 'expense' AND transaction_date >= ? AND transaction_date <= ? GROUP BY category_id", [range.value.start, range.value.end]),
    ]);
    const budgetCategories = budget ? await database.getAllAsync<BudgetCategoryRow>('SELECT category_id, amount_cents FROM budget_categories WHERE budget_id = ?', [budget.id]) : [];
    const expenseMap = new Map(expenses.map((row) => [row.category_id, row.amount_cents]));
    const budgetMap = new Map(budgetCategories.map((row) => [row.category_id, row.amount_cents]));
    const totalBudgetCents = budget?.total_cents ?? 0;
    const totalSpentCents = expenses.reduce((sum, row) => sum + row.amount_cents, 0);
    const totalCategoryBudget = budgetCategories.reduce((sum, row) => sum + row.amount_cents, 0);
    const categoryIds = new Set([...categories.map((c) => c.id), ...budgetMap.keys(), ...expenseMap.keys()]);
    const categoryNames = new Map(categories.map((c) => [c.id, c]));

    const rows = [...categoryIds].map((categoryId) => {
      const budgetCents = budgetMap.get(categoryId) ?? 0;
      const spentCents = expenseMap.get(categoryId) ?? 0;
      const category = categoryNames.get(categoryId);
      return {
        categoryId,
        categoryName: category?.name ?? `Categoria #${categoryId}`,
        color: category?.color ?? null,
        budgetCents,
        spentCents,
        percentOfBudget: budgetCents === 0 ? 0 : Math.round((spentCents / budgetCents) * 1000) / 10,
        sharePercent: totalCategoryBudget === 0 ? 0 : Math.round((budgetCents / totalCategoryBudget) * 1000) / 10,
      };
    }).filter((row) => row.budgetCents > 0 || row.spentCents > 0).sort((a, b) => b.budgetCents - a.budgetCents || b.spentCents - a.spentCents);

    return repoOk({ year, month, totalBudgetCents, totalSpentCents, remainingCents: totalBudgetCents - totalSpentCents, categories: rows, hasBudget: Boolean(budget), hasExpenseCategories: categories.length > 0 });
  }

  return { getMonthlyBudgetSummary };
}

function getRepositoryDatabase(): RepositoryDatabase { return getSqliteDatabase() as unknown as RepositoryDatabase; }
