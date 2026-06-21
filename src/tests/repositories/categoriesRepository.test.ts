import { createAccountsRepository } from '@/db/repositories/accountsRepository';
import { createCategoriesRepository } from '@/db/repositories/categoriesRepository';
import { createTransactionsRepository } from '@/db/repositories/transactionsRepository';
import { createFakeRepositoryDatabase } from '@/tests/repositories/fakeRepositoryDatabase';

describe('Sprint 03 categoriesRepository', () => {
  it('covers T0302: creates lists by type updates and deletes categories', async () => {
    const db = createFakeRepositoryDatabase();
    const repository = createCategoriesRepository(db);

    const created = await repository.createCategory({ name: 'Mercado', type: 'expense' });
    expect(created.ok).toBe(true);
    if (!created.ok) return;

    expect(await repository.getCategories()).toHaveLength(1);
    expect(await repository.getCategoriesByType('expense')).toHaveLength(1);
    expect(await repository.getCategoriesByType('income')).toHaveLength(0);

    const updated = await repository.updateCategory(created.value.id, { name: 'Salário', type: 'income', color: '#22c55e', icon: 'wallet' });
    expect(updated).toMatchObject({ ok: true, value: { name: 'Salário', type: 'income', color: '#22c55e', icon: 'wallet' } });

    await expect(repository.deleteCategory(created.value.id)).resolves.toEqual({ ok: true, value: null });
  });

  it('blocks delete when category has associated transactions', async () => {
    const db = createFakeRepositoryDatabase();
    const accounts = createAccountsRepository(db);
    const categories = createCategoriesRepository(db);
    const transactions = createTransactionsRepository(db);
    const account = await accounts.createAccount({ name: 'Banco', type: 'checking' });
    const category = await categories.createCategory({ name: 'Mercado', type: 'expense' });
    if (!category.ok || !account.ok) return;

    await transactions.createTransaction({ accountId: account.value.id, categoryId: category.value.id, type: 'expense', amountCents: 100, transactionDate: '2026-06-21' });

    await expect(categories.deleteCategory(category.value.id)).resolves.toEqual({
      ok: false,
      error: { code: 'category_in_use', message: 'Categoria possui transações associadas.', field: 'id' },
    });
  });

  it('returns not found when deleting missing category', async () => {
    const repository = createCategoriesRepository(createFakeRepositoryDatabase());

    await expect(repository.deleteCategory(999)).resolves.toEqual({
      ok: false,
      error: { code: 'category_not_found', message: 'Categoria não encontrada.', field: 'id' },
    });
  });

  it('supports destructured create and update methods', async () => {
    const repository = createCategoriesRepository(createFakeRepositoryDatabase());
    const { createCategory, updateCategory } = repository;

    const created = await createCategory({ name: 'Mercado', type: 'expense' });
    expect(created.ok).toBe(true);
    if (!created.ok) return;

    await expect(updateCategory(created.value.id, { name: 'Supermercado', type: 'expense', color: '#0f766e' })).resolves.toMatchObject({
      ok: true,
      value: { name: 'Supermercado', type: 'expense', color: '#0f766e' },
    });
  });

  it('maps foreign key delete failures to category_in_use', async () => {
    const db = createFakeRepositoryDatabase();
    const repository = createCategoriesRepository({
      ...db,
      async runAsync(source, params) {
        if (source.startsWith('DELETE FROM categories')) throw new Error('FOREIGN KEY constraint failed');
        return db.runAsync(source, params);
      },
    });
    const created = await repository.createCategory({ name: 'Mercado', type: 'expense' });
    if (!created.ok) return;

    await expect(repository.deleteCategory(created.value.id)).resolves.toEqual({
      ok: false,
      error: { code: 'category_in_use', message: 'Categoria possui transações associadas.', field: 'id' },
    });
  });

});
