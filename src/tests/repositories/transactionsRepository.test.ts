import { createAccountsRepository } from '@/db/repositories/accountsRepository';
import { createCategoriesRepository } from '@/db/repositories/categoriesRepository';
import { createTransactionsRepository } from '@/db/repositories/transactionsRepository';
import { createFakeRepositoryDatabase } from '@/tests/repositories/fakeRepositoryDatabase';

describe('Sprint 03 transactionsRepository', () => {
  async function setup() {
    const db = createFakeRepositoryDatabase();
    const accounts = createAccountsRepository(db);
    const categories = createCategoriesRepository(db);
    const repository = createTransactionsRepository(db);
    const account = await accounts.createAccount({ name: 'Banco', type: 'checking' });
    const incomeCategory = await categories.createCategory({ name: 'Salário', type: 'income' });
    const expenseCategory = await categories.createCategory({ name: 'Mercado', type: 'expense' });

    if (!account.ok || !incomeCategory.ok || !expenseCategory.ok) throw new Error('setup failed');
    return { repository, account: account.value, incomeCategory: incomeCategory.value, expenseCategory: expenseCategory.value };
  }

  it('covers T0303: creates income expense lists by month updates and deletes', async () => {
    const { repository, account, incomeCategory, expenseCategory } = await setup();

    const income = await repository.createTransaction({ accountId: account.id, categoryId: incomeCategory.id, type: 'income', amountCents: 500000, transactionDate: '2026-06-01' });
    const expense = await repository.createTransaction({ accountId: account.id, categoryId: expenseCategory.id, type: 'expense', amountCents: 2590, transactionDate: '2026-06-20' });
    await repository.createTransaction({ accountId: account.id, categoryId: expenseCategory.id, type: 'expense', amountCents: 1000, transactionDate: '2026-07-01' });

    expect(income.ok).toBe(true);
    expect(expense.ok).toBe(true);
    if (!expense.ok) return;

    expect(await repository.getTransactionById(expense.value.id)).toMatchObject({ type: 'expense', amountCents: 2590 });
    expect(await repository.getTransactions()).toHaveLength(3);

    const june = await repository.getTransactionsByMonth(2026, 6);
    expect(june).toMatchObject({ ok: true, value: expect.arrayContaining([expect.objectContaining({ transactionDate: '2026-06-20' })]) });
    if (june.ok) expect(june.value).toHaveLength(2);

    const updated = await repository.updateTransaction(expense.value.id, {
      accountId: account.id,
      categoryId: expenseCategory.id,
      type: 'expense',
      amountCents: 3000,
      transactionDate: '2026-06-21',
      description: 'Mercado',
    });
    expect(updated).toMatchObject({ ok: true, value: { amountCents: 3000, description: 'Mercado' } });

    await expect(repository.deleteTransaction(expense.value.id)).resolves.toEqual({ ok: true, value: null });
  });

  it('rejects missing links and mismatched category type', async () => {
    const { repository, account, incomeCategory } = await setup();

    await expect(repository.createTransaction({ accountId: 999, categoryId: incomeCategory.id, type: 'income', amountCents: 100, transactionDate: '2026-06-01' })).resolves.toMatchObject({ ok: false, error: { code: 'transaction_account_not_found' } });
    await expect(repository.createTransaction({ accountId: account.id, categoryId: 999, type: 'income', amountCents: 100, transactionDate: '2026-06-01' })).resolves.toMatchObject({ ok: false, error: { code: 'transaction_category_not_found' } });
    await expect(repository.createTransaction({ accountId: account.id, categoryId: incomeCategory.id, type: 'expense', amountCents: 100, transactionDate: '2026-06-01' })).resolves.toMatchObject({ ok: false, error: { code: 'transaction_category_type_mismatch' } });
  });

  it('returns not found when deleting missing transaction', async () => {
    const { repository } = await setup();

    await expect(repository.deleteTransaction(999)).resolves.toEqual({
      ok: false,
      error: { code: 'transaction_not_found', message: 'Transação não encontrada.', field: 'id' },
    });
  });
});
