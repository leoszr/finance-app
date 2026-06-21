import { createAccountsRepository } from '@/db/repositories/accountsRepository';
import { createCategoriesRepository } from '@/db/repositories/categoriesRepository';
import { createTransactionsRepository } from '@/db/repositories/transactionsRepository';
import { validateAccount } from '@/lib/validation/accountValidation';
import { validateCategory } from '@/lib/validation/categoryValidation';
import { createFakeRepositoryDatabase } from '@/tests/repositories/fakeRepositoryDatabase';

describe('Sprint 05 accounts management', () => {
  it('covers T0501 and T0502: creates and lists accounts with name, type and initial balance', async () => {
    const repository = createAccountsRepository(createFakeRepositoryDatabase());

    const created = await repository.createAccount({ name: 'Nubank', type: 'checking', initialBalanceCents: 12550 });
    const accounts = await repository.getAccounts();

    expect(created.ok).toBe(true);
    expect(accounts).toHaveLength(1);
    expect(accounts[0]).toMatchObject({ name: 'Nubank', type: 'checking', initialBalanceCents: 12550 });
  });

  it('covers T0502: validates required account fields before saving', () => {
    const result = validateAccount({ name: '', type: 'checking', initialBalanceCents: 0 });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.message).toBe('Nome da conta é obrigatório.');
  });

  it('covers T0503: deletes account without transactions and blocks account with transactions', async () => {
    const database = createFakeRepositoryDatabase();
    const accountsRepository = createAccountsRepository(database);
    const categoriesRepository = createCategoriesRepository(database);
    const transactionsRepository = createTransactionsRepository(database);

    const removable = await accountsRepository.createAccount({ name: 'Carteira', type: 'cash', initialBalanceCents: 0 });
    const blocked = await accountsRepository.createAccount({ name: 'Banco', type: 'checking', initialBalanceCents: 0 });
    const category = await categoriesRepository.createCategory({ name: 'Mercado', type: 'expense' });

    if (!removable.ok || !blocked.ok || !category.ok) throw new Error('setup failed');
    await transactionsRepository.createTransaction({ accountId: blocked.value.id, categoryId: category.value.id, type: 'expense', amountCents: 1000, transactionDate: '2026-06-21' });

    await expect(accountsRepository.deleteAccount(removable.value.id)).resolves.toMatchObject({ ok: true });
    const blockedDelete = await accountsRepository.deleteAccount(blocked.value.id);

    expect(blockedDelete.ok).toBe(false);
    if (!blockedDelete.ok) expect(blockedDelete.error.message).toBe('Conta possui transações associadas.');
  });
});

describe('Sprint 05 categories management', () => {
  it('covers T0504 and T0505: creates and lists income and expense categories with color', async () => {
    const repository = createCategoriesRepository(createFakeRepositoryDatabase());

    await repository.createCategory({ name: 'Salário', type: 'income', color: '#2563eb' });
    await repository.createCategory({ name: 'Mercado', type: 'expense', color: '#c2410c' });

    const income = await repository.getCategoriesByType('income');
    const expense = await repository.getCategoriesByType('expense');

    expect(income).toEqual([expect.objectContaining({ name: 'Salário', type: 'income', color: '#2563eb' })]);
    expect(expense).toEqual([expect.objectContaining({ name: 'Mercado', type: 'expense', color: '#c2410c' })]);
  });

  it('covers T0505: validates required category fields before saving', () => {
    const result = validateCategory({ name: '', type: 'expense' });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.message).toBe('Nome da categoria é obrigatório.');
  });


  it('covers T0505: blocks changing type of category used by transactions', async () => {
    const database = createFakeRepositoryDatabase();
    const accountsRepository = createAccountsRepository(database);
    const categoriesRepository = createCategoriesRepository(database);
    const transactionsRepository = createTransactionsRepository(database);

    const account = await accountsRepository.createAccount({ name: 'Carteira', type: 'cash', initialBalanceCents: 0 });
    const category = await categoriesRepository.createCategory({ name: 'Mercado', type: 'expense' });

    if (!account.ok || !category.ok) throw new Error('setup failed');
    await transactionsRepository.createTransaction({ accountId: account.value.id, categoryId: category.value.id, type: 'expense', amountCents: 1000, transactionDate: '2026-06-21' });

    const result = await categoriesRepository.updateCategory(category.value.id, { name: 'Mercado', type: 'income' });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.message).toBe('Categoria usada em transações não pode mudar de tipo.');
  });

  it('covers T0506: deletes unused category and blocks used category', async () => {
    const database = createFakeRepositoryDatabase();
    const accountsRepository = createAccountsRepository(database);
    const categoriesRepository = createCategoriesRepository(database);
    const transactionsRepository = createTransactionsRepository(database);

    const removable = await categoriesRepository.createCategory({ name: 'Livre', type: 'expense' });
    const blocked = await categoriesRepository.createCategory({ name: 'Usada', type: 'expense' });
    const account = await accountsRepository.createAccount({ name: 'Carteira', type: 'cash', initialBalanceCents: 0 });

    if (!removable.ok || !blocked.ok || !account.ok) throw new Error('setup failed');
    await transactionsRepository.createTransaction({ accountId: account.value.id, categoryId: blocked.value.id, type: 'expense', amountCents: 1000, transactionDate: '2026-06-21' });

    await expect(categoriesRepository.deleteCategory(removable.value.id)).resolves.toMatchObject({ ok: true });
    const blockedDelete = await categoriesRepository.deleteCategory(blocked.value.id);

    expect(blockedDelete.ok).toBe(false);
    if (!blockedDelete.ok) expect(blockedDelete.error.message).toBe('Categoria possui transações associadas.');
  });
});
