import { getRepositoryDatabase } from '@/db/repositories/database';
import type { RepositoryDatabase, RepositoryResult } from '@/db/repositories/types';
import { repoOk } from '@/db/repositories/types';
import { getMonthRange } from '@/lib/month';
import type { TransactionType } from '@/types/finance';

export type MonthlyCategoryExpense = { categoryId: number; categoryName: string; amountCents: number };
export type AccountBalance = { accountId: number; accountName: string; balanceCents: number };
export type MonthlyDashboardSummary = {
  incomeCents: number;
  expenseCents: number;
  balanceCents: number;
  totalBalanceCents: number;
  accountBalances: AccountBalance[];
  topExpenseCategory: MonthlyCategoryExpense | null;
  expenseCategories: MonthlyCategoryExpense[];
  hasData: boolean;
};

type AccountRow = { id: number; name: string; initial_balance_cents: number };
type CategoryRow = { id: number; name: string; type: TransactionType };
type TransactionRow = { account_id: number; category_id: number; type: TransactionType; amount_cents: number; transaction_date: string };

export function createDashboardQueries(database: RepositoryDatabase = getRepositoryDatabase()) {
  async function getMonthlySummary(year: number, month: number): Promise<RepositoryResult<MonthlyDashboardSummary>> {
    const range = getMonthRange(year, month);
    if (!range.ok) return range;

    const [accounts, categories, transactions] = await Promise.all([
      database.getAllAsync<AccountRow>('SELECT id, name, initial_balance_cents FROM accounts ORDER BY created_at ASC, id ASC'),
      database.getAllAsync<CategoryRow>('SELECT id, name, type FROM categories ORDER BY created_at ASC, id ASC'),
      database.getAllAsync<TransactionRow>('SELECT account_id, category_id, type, amount_cents, transaction_date FROM transactions ORDER BY transaction_date DESC, id DESC'),
    ]);

    const monthly = transactions.filter((transaction) => transaction.transaction_date >= range.value.start && transaction.transaction_date <= range.value.end);
    const incomeCents = monthly.filter((transaction) => transaction.type === 'income').reduce((sum, transaction) => sum + transaction.amount_cents, 0);
    const expenseCents = monthly.filter((transaction) => transaction.type === 'expense').reduce((sum, transaction) => sum + transaction.amount_cents, 0);
    const categoryNames = new Map(categories.map((category) => [category.id, category.name]));
    const expenseByCategory = new Map<number, number>();

    for (const transaction of monthly) {
      if (transaction.type === 'expense') {
        expenseByCategory.set(transaction.category_id, (expenseByCategory.get(transaction.category_id) ?? 0) + transaction.amount_cents);
      }
    }

    const expenseCategories = [...expenseByCategory.entries()]
      .map(([categoryId, amountCents]) => ({ categoryId, categoryName: categoryNames.get(categoryId) ?? `Categoria #${categoryId}`, amountCents }))
      .sort((left, right) => right.amountCents - left.amountCents)
      .slice(0, 5);

    const accountBalances = accounts.map((account) => {
      const movements = transactions
        .filter((transaction) => transaction.account_id === account.id)
        .reduce((sum, transaction) => sum + (transaction.type === 'income' ? transaction.amount_cents : -transaction.amount_cents), 0);
      return { accountId: account.id, accountName: account.name, balanceCents: account.initial_balance_cents + movements };
    });

    return repoOk({
      incomeCents,
      expenseCents,
      balanceCents: incomeCents - expenseCents,
      totalBalanceCents: accountBalances.reduce((sum, account) => sum + account.balanceCents, 0),
      accountBalances,
      topExpenseCategory: expenseCategories[0] ?? null,
      expenseCategories,
      hasData: accounts.length > 0 || transactions.length > 0,
    });
  }

  return { getMonthlySummary };
}
