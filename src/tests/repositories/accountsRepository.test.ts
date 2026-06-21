import { createAccountsRepository } from '@/db/repositories/accountsRepository';
import { createCategoriesRepository } from '@/db/repositories/categoriesRepository';
import { createTransactionsRepository } from '@/db/repositories/transactionsRepository';
import { createFakeRepositoryDatabase } from '@/tests/repositories/fakeRepositoryDatabase';

describe('Sprint 03 accountsRepository', () => {
  it('covers T0301: creates lists reads updates and deletes accounts', async () => {
    const db = createFakeRepositoryDatabase();
    const repository = createAccountsRepository(db);

    const created = await repository.createAccount({ name: 'Carteira', type: 'cash', initialBalanceCents: 1000 });
    expect(created.ok).toBe(true);
    if (!created.ok) return;

    expect(await repository.getAccountById(created.value.id)).toMatchObject({ name: 'Carteira', type: 'cash' });
    expect(await repository.getAccounts()).toHaveLength(1);

    const updated = await repository.updateAccount(created.value.id, { name: 'Conta', type: 'checking', initialBalanceCents: 0 });
    expect(updated).toMatchObject({ ok: true, value: { name: 'Conta', type: 'checking', initialBalanceCents: 0 } });

    await expect(repository.deleteAccount(created.value.id)).resolves.toEqual({ ok: true, value: null });
    await expect(repository.getAccounts()).resolves.toHaveLength(0);
  });

  it('blocks delete when account has associated transactions', async () => {
    const db = createFakeRepositoryDatabase();
    const accounts = createAccountsRepository(db);
    const categories = createCategoriesRepository(db);
    const transactions = createTransactionsRepository(db);
    const category = await categories.createCategory({ name: 'Mercado', type: 'expense' });
    const account = await accounts.createAccount({ name: 'Banco', type: 'checking' });
    if (!account.ok || !category.ok) return;

    await transactions.createTransaction({ accountId: account.value.id, categoryId: category.value.id, type: 'expense', amountCents: 100, transactionDate: '2026-06-21' });

    await expect(accounts.deleteAccount(account.value.id)).resolves.toEqual({
      ok: false,
      error: { code: 'account_in_use', message: 'Conta possui transações associadas.', field: 'id' },
    });
  });

  it('returns not found when deleting missing account', async () => {
    const repository = createAccountsRepository(createFakeRepositoryDatabase());

    await expect(repository.deleteAccount(999)).resolves.toEqual({
      ok: false,
      error: { code: 'account_not_found', message: 'Conta não encontrada.', field: 'id' },
    });
  });

  it('supports destructured create and update methods', async () => {
    const repository = createAccountsRepository(createFakeRepositoryDatabase());
    const { createAccount, updateAccount } = repository;

    const created = await createAccount({ name: 'Carteira', type: 'cash', initialBalanceCents: 0 });
    expect(created.ok).toBe(true);
    if (!created.ok) return;

    await expect(updateAccount(created.value.id, { name: 'Carteira física', type: 'cash', initialBalanceCents: 500 })).resolves.toMatchObject({
      ok: true,
      value: { name: 'Carteira física', initialBalanceCents: 500 },
    });
  });

  it('maps foreign key delete failures to account_in_use', async () => {
    const db = createFakeRepositoryDatabase();
    const repository = createAccountsRepository({
      ...db,
      async runAsync(source, params) {
        if (source.startsWith('DELETE FROM accounts')) throw new Error('FOREIGN KEY constraint failed');
        return db.runAsync(source, params);
      },
    });
    const created = await repository.createAccount({ name: 'Banco', type: 'checking' });
    if (!created.ok) return;

    await expect(repository.deleteAccount(created.value.id)).resolves.toEqual({
      ok: false,
      error: { code: 'account_in_use', message: 'Conta possui transações associadas.', field: 'id' },
    });
  });

});
