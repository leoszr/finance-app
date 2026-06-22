import { getSqliteDatabase } from '@/db/client';
import type { RepositoryDatabase, RepositoryResult } from '@/db/repositories/types';
import { repoOk } from '@/db/repositories/types';
import { getMonthRange } from '@/lib/month';
import type { TransactionType } from '@/types/finance';

export type ReportTransaction = {
  id: number;
  date: string;
  description: string;
  categoryName: string;
  accountName: string;
  type: TransactionType;
  amountCents: number;
};
export type ReportCategory = { categoryId: number; categoryName: string; amountCents: number; percent: number };
export type ReportComparison = {
  previousIncomeCents: number;
  previousExpenseCents: number;
  incomeDiffCents: number;
  expenseDiffCents: number;
  incomeDiffPercent: number | null;
  expenseDiffPercent: number | null;
};
export type MonthlyReport = {
  incomeCents: number;
  expenseCents: number;
  balanceCents: number;
  previous: ReportComparison;
  transactions: ReportTransaction[];
  expenseCategories: ReportCategory[];
  hasData: boolean;
};

type AccountRow = { id: number; name: string };
type CategoryRow = { id: number; name: string };
type TransactionRow = {
  id: number;
  account_id: number;
  category_id: number;
  type: TransactionType;
  amount_cents: number;
  description: string | null;
  transaction_date: string;
};

function previousMonth(year: number, month: number) {
  const date = new Date(year, month - 2, 1);
  return { year: date.getFullYear(), month: date.getMonth() + 1 };
}

function percentDiff(current: number, previous: number) {
  return previous === 0 ? null : Math.round(((current - previous) / previous) * 1000) / 10;
}

function totals(rows: TransactionRow[]) {
  const incomeCents = rows.filter((row) => row.type === 'income').reduce((sum, row) => sum + row.amount_cents, 0);
  const expenseCents = rows.filter((row) => row.type === 'expense').reduce((sum, row) => sum + row.amount_cents, 0);
  return { incomeCents, expenseCents };
}

export function createReportQueries(database: RepositoryDatabase = getRepositoryDatabase()) {
  async function getMonthlyReport(year: number, month: number): Promise<RepositoryResult<MonthlyReport>> {
    const range = getMonthRange(year, month);
    if (!range.ok) return range;
    const previous = previousMonth(year, month);
    const previousRange = getMonthRange(previous.year, previous.month);
    if (!previousRange.ok) return previousRange;

    const [accounts, categories, currentRows, previousRows] = await Promise.all([
      database.getAllAsync<AccountRow>('SELECT id, name FROM accounts ORDER BY created_at ASC, id ASC'),
      database.getAllAsync<CategoryRow>('SELECT id, name FROM categories ORDER BY created_at ASC, id ASC'),
      database.getAllAsync<TransactionRow>('SELECT * FROM transactions WHERE transaction_date >= ? AND transaction_date <= ? ORDER BY transaction_date DESC, id DESC', [range.value.start, range.value.end]),
      database.getAllAsync<TransactionRow>('SELECT * FROM transactions WHERE transaction_date >= ? AND transaction_date <= ? ORDER BY transaction_date DESC, id DESC', [previousRange.value.start, previousRange.value.end]),
    ]);

    const accountNames = new Map(accounts.map((account) => [account.id, account.name]));
    const categoryNames = new Map(categories.map((category) => [category.id, category.name]));
    const current = totals(currentRows);
    const previousTotals = totals(previousRows);
    const expenseByCategory = new Map<number, number>();

    for (const row of currentRows) {
      if (row.type === 'expense') expenseByCategory.set(row.category_id, (expenseByCategory.get(row.category_id) ?? 0) + row.amount_cents);
    }

    return repoOk({
      incomeCents: current.incomeCents,
      expenseCents: current.expenseCents,
      balanceCents: current.incomeCents - current.expenseCents,
      previous: {
        previousIncomeCents: previousTotals.incomeCents,
        previousExpenseCents: previousTotals.expenseCents,
        incomeDiffCents: current.incomeCents - previousTotals.incomeCents,
        expenseDiffCents: current.expenseCents - previousTotals.expenseCents,
        incomeDiffPercent: percentDiff(current.incomeCents, previousTotals.incomeCents),
        expenseDiffPercent: percentDiff(current.expenseCents, previousTotals.expenseCents),
      },
      transactions: currentRows.map((row) => ({
        id: row.id,
        date: row.transaction_date,
        description: row.description ?? 'Sem descrição',
        categoryName: categoryNames.get(row.category_id) ?? `Categoria #${row.category_id}`,
        accountName: accountNames.get(row.account_id) ?? `Conta #${row.account_id}`,
        type: row.type,
        amountCents: row.amount_cents,
      })),
      expenseCategories: [...expenseByCategory.entries()]
        .map(([categoryId, amountCents]) => ({
          categoryId,
          categoryName: categoryNames.get(categoryId) ?? `Categoria #${categoryId}`,
          amountCents,
          percent: current.expenseCents === 0 ? 0 : Math.round((amountCents / current.expenseCents) * 1000) / 10,
        }))
        .sort((left, right) => right.amountCents - left.amountCents),
      hasData: currentRows.length > 0,
    });
  }

  return { getMonthlyReport };
}

function getRepositoryDatabase(): RepositoryDatabase {
  return getSqliteDatabase() as unknown as RepositoryDatabase;
}
