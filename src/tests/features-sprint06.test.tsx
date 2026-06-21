import { Alert } from 'react-native';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';

import { createAccountsRepository } from '@/db/repositories/accountsRepository';
import { createCategoriesRepository } from '@/db/repositories/categoriesRepository';
import { createTransactionsRepository } from '@/db/repositories/transactionsRepository';
import { TransactionsManager } from '@/features/transactions/TransactionsManager';
import { createFakeRepositoryDatabase } from '@/tests/repositories/fakeRepositoryDatabase';

type AlertButton = { text?: string; style?: string; onPress?: () => void };

async function seedRepositories() {
  const database = createFakeRepositoryDatabase();
  const accountsRepository = createAccountsRepository(database);
  const categoriesRepository = createCategoriesRepository(database);
  const transactionsRepository = createTransactionsRepository(database);
  const account = await accountsRepository.createAccount({ name: 'Carteira', type: 'cash', initialBalanceCents: 0 });
  const income = await categoriesRepository.createCategory({ name: 'Salário', type: 'income' });
  const expense = await categoriesRepository.createCategory({ name: 'Mercado', type: 'expense' });
  if (!account.ok || !income.ok || !expense.ok) throw new Error('setup failed');
  return { accountsRepository, categoriesRepository, transactionsRepository, account: account.value, income: income.value, expense: expense.value };
}

describe('Sprint 06 transactions CRUD', () => {
  beforeEach(() => {
    jest.spyOn(Alert, 'alert').mockImplementation((_title, _message, buttons?: AlertButton[]) => {
      buttons?.find((button) => button.style === 'destructive')?.onPress?.();
    });
  });

  afterEach(() => jest.restoreAllMocks());

  it('covers T0601 and T0602: creates and lists transactions ordered by date', async () => {
    const { accountsRepository, categoriesRepository, transactionsRepository, account, expense } = await seedRepositories();
    await transactionsRepository.createTransaction({ accountId: account.id, categoryId: expense.id, type: 'expense', amountCents: 1000, transactionDate: '2026-06-21', description: 'Mais recente' });
    await transactionsRepository.createTransaction({ accountId: account.id, categoryId: expense.id, type: 'expense', amountCents: 1000, transactionDate: '2026-06-19', description: 'Antiga' });
    const screen = await render(<TransactionsManager accountsRepository={accountsRepository} categoriesRepository={categoriesRepository} transactionsRepository={transactionsRepository} />);

    await waitFor(() => expect(screen.getByText('Antiga')).toBeTruthy());
    await act(async () => { fireEvent.changeText(screen.getByTestId('transaction-amount-input'), '25,90'); });
    await act(async () => { fireEvent.changeText(screen.getByTestId('transaction-date-input'), '2026-06-20'); });
    await act(async () => { fireEvent.changeText(screen.getByTestId('transaction-description-input'), 'Mercado novo'); });
    await act(async () => { fireEvent.press(screen.getByText('Carteira')); });
    await act(async () => { fireEvent.press(screen.getByText('Mercado')); });
    await act(async () => { fireEvent.press(screen.getByTestId('save-transaction-button')); });

    await waitFor(() => expect(screen.getByText('Mercado novo')).toBeTruthy());
    const transactions = await transactionsRepository.getTransactions();
    expect(transactions.map((transaction) => transaction.description)).toEqual(['Mais recente', 'Mercado novo', 'Antiga']);
  });

  it('rejects malformed BRL amount without silently rounding', async () => {
    const { accountsRepository, categoriesRepository, transactionsRepository } = await seedRepositories();
    const screen = await render(<TransactionsManager accountsRepository={accountsRepository} categoriesRepository={categoriesRepository} transactionsRepository={transactionsRepository} />);

    await waitFor(() => expect(screen.getByText('Carteira')).toBeTruthy());
    await act(async () => { fireEvent.changeText(screen.getByTestId('transaction-amount-input'), '12,345'); });
    await act(async () => { fireEvent.changeText(screen.getByTestId('transaction-date-input'), '2026-06-21'); });
    await act(async () => { fireEvent.press(screen.getByText('Carteira')); });
    await act(async () => { fireEvent.press(screen.getByText('Mercado')); });
    await act(async () => { fireEvent.press(screen.getByTestId('save-transaction-button')); });

    await waitFor(() => expect(screen.getAllByText('Valor monetário inválido.').length).toBeGreaterThan(0));
    expect(await transactionsRepository.getTransactions()).toHaveLength(0);
  });

  it('covers T0603 and T0604: edits and deletes transactions', async () => {
    const { accountsRepository, categoriesRepository, transactionsRepository, account, expense } = await seedRepositories();
    const created = await transactionsRepository.createTransaction({ accountId: account.id, categoryId: expense.id, type: 'expense', amountCents: 1000, transactionDate: '2026-06-21', description: 'Original' });
    if (!created.ok) throw new Error('transaction setup failed');
    const screen = await render(<TransactionsManager accountsRepository={accountsRepository} categoriesRepository={categoriesRepository} transactionsRepository={transactionsRepository} />);

    await waitFor(() => expect(screen.getByText('Original')).toBeTruthy());
    await act(async () => { fireEvent.press(screen.getByText('Editar')); });
    await act(async () => { fireEvent.changeText(screen.getByTestId('transaction-description-input'), 'Editada'); });
    await act(async () => { fireEvent.press(screen.getByTestId('save-transaction-button')); });

    await waitFor(() => expect(screen.getByText('Editada')).toBeTruthy());
    await act(async () => { fireEvent.press(screen.getByTestId(`delete-transaction-${created.value.id}`)); });

    await waitFor(async () => expect(await transactionsRepository.getTransactions()).toHaveLength(0));
  });

  it('covers T0605: filters categories by type and clears incompatible category in UI', async () => {
    const { accountsRepository, categoriesRepository, transactionsRepository } = await seedRepositories();
    const screen = await render(<TransactionsManager accountsRepository={accountsRepository} categoriesRepository={categoriesRepository} transactionsRepository={transactionsRepository} />);

    await waitFor(() => expect(screen.getByText('Mercado')).toBeTruthy());
    await act(async () => { fireEvent.press(screen.getByText('Mercado')); });
    await act(async () => { fireEvent.press(screen.getByText('Receita')); });

    expect(screen.queryByText('Mercado')).toBeNull();
    expect(screen.getByText('Salário')).toBeTruthy();
    await act(async () => { fireEvent.changeText(screen.getByTestId('transaction-amount-input'), '10,00'); });
    await act(async () => { fireEvent.changeText(screen.getByTestId('transaction-date-input'), '2026-06-21'); });
    await act(async () => { fireEvent.press(screen.getByText('Carteira')); });
    await act(async () => { fireEvent.press(screen.getByTestId('save-transaction-button')); });

    await waitFor(() => expect(screen.getAllByText('Categoria válida é obrigatória.').length).toBeGreaterThan(0));
  });

  it('covers T0605: blocks incompatible category type at repository level', async () => {
    const { transactionsRepository, account, income, expense } = await seedRepositories();

    const validIncome = await transactionsRepository.createTransaction({ accountId: account.id, categoryId: income.id, type: 'income', amountCents: 500000, transactionDate: '2026-06-21' });
    const invalidIncome = await transactionsRepository.createTransaction({ accountId: account.id, categoryId: expense.id, type: 'income', amountCents: 1000, transactionDate: '2026-06-21' });

    expect(validIncome.ok).toBe(true);
    expect(invalidIncome.ok).toBe(false);
    if (!invalidIncome.ok) expect(invalidIncome.error.message).toBe('Tipo da categoria não corresponde ao tipo da transação.');
  });
});
