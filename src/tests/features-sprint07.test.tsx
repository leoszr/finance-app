import { render, waitFor, fireEvent, act } from '@testing-library/react-native';

import { createAccountsRepository } from '@/db/repositories/accountsRepository';
import { createCategoriesRepository } from '@/db/repositories/categoriesRepository';
import { createTransactionsRepository } from '@/db/repositories/transactionsRepository';
import { TransactionsManager } from '@/features/transactions/TransactionsManager';
import { createFakeRepositoryDatabase } from '@/tests/repositories/fakeRepositoryDatabase';

function pad(value: number) { return String(value).padStart(2, '0'); }
function currentMonthDate(day = 15) {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(day)}`;
}
function previousMonthDate(day = 15) {
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth() - 1, day);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(day)}`;
}

async function seed() {
  const database = createFakeRepositoryDatabase();
  const accountsRepository = createAccountsRepository(database);
  const categoriesRepository = createCategoriesRepository(database);
  const transactionsRepository = createTransactionsRepository(database);
  const wallet = await accountsRepository.createAccount({ name: 'Carteira', type: 'cash', initialBalanceCents: 0 });
  const bank = await accountsRepository.createAccount({ name: 'Banco', type: 'checking', initialBalanceCents: 0 });
  const salary = await categoriesRepository.createCategory({ name: 'Salário', type: 'income' });
  const market = await categoriesRepository.createCategory({ name: 'Mercado', type: 'expense' });
  if (!wallet.ok || !bank.ok || !salary.ok || !market.ok) throw new Error('setup failed');
  await transactionsRepository.createTransaction({ accountId: wallet.value.id, categoryId: market.value.id, type: 'expense', amountCents: 5000, transactionDate: currentMonthDate(), description: 'Mercado atual' });
  await transactionsRepository.createTransaction({ accountId: bank.value.id, categoryId: salary.value.id, type: 'income', amountCents: 100000, transactionDate: currentMonthDate(), description: 'Salário mensal' });
  await transactionsRepository.createTransaction({ accountId: wallet.value.id, categoryId: market.value.id, type: 'expense', amountCents: 2500, transactionDate: previousMonthDate(), description: 'Mercado passado' });
  return { accountsRepository, categoriesRepository, transactionsRepository };
}

describe('Sprint 07 transaction filters', () => {
  it('covers T0701: shows current month by default and changes month', async () => {
    const repositories = await seed();
    const screen = await render(<TransactionsManager {...repositories} />);

    await waitFor(() => expect(screen.getByText('Mercado atual')).toBeTruthy());
    expect(screen.getByText('Salário mensal')).toBeTruthy();
    expect(screen.queryByText('Mercado passado')).toBeNull();

    await act(async () => { fireEvent.press(screen.getByTestId('previous-month-button')); });

    await waitFor(() => expect(screen.getByText('Mercado passado')).toBeTruthy());
    expect(screen.queryByText('Mercado atual')).toBeNull();
  });

  it('covers T0702: filters by type and keeps month filter', async () => {
    const repositories = await seed();
    const screen = await render(<TransactionsManager {...repositories} />);

    await waitFor(() => expect(screen.getByText('Mercado atual')).toBeTruthy());
    await act(async () => { fireEvent.press(screen.getByText('Receitas')); });

    expect(screen.getByText('Salário mensal')).toBeTruthy();
    expect(screen.queryByText('Mercado atual')).toBeNull();
  });

  it('covers T0703: filters by account and restores all accounts', async () => {
    const repositories = await seed();
    const screen = await render(<TransactionsManager {...repositories} />);

    await waitFor(() => expect(screen.getByText('Mercado atual')).toBeTruthy());
    await act(async () => { fireEvent.press(screen.getAllByText('Banco')[1]); });

    expect(screen.getByText('Salário mensal')).toBeTruthy();
    expect(screen.queryByText('Mercado atual')).toBeNull();

    await act(async () => { fireEvent.press(screen.getByText('Todas as contas')); });
    expect(screen.getByText('Mercado atual')).toBeTruthy();
  });

  it('covers T0704 and T0705: searches description and updates summary', async () => {
    const repositories = await seed();
    const screen = await render(<TransactionsManager {...repositories} />);

    await waitFor(() => expect(screen.getByText('Mercado atual')).toBeTruthy());
    await act(async () => { fireEvent.changeText(screen.getByTestId('transaction-search-input'), 'salário'); });

    expect(screen.getByText('Salário mensal')).toBeTruthy();
    expect(screen.queryByText('Mercado atual')).toBeNull();
    expect(screen.getByText('Receitas: R$ 1.000,00')).toBeTruthy();
    expect(screen.getByText('Despesas: R$ 0,00')).toBeTruthy();
    expect(screen.getByText('Saldo: R$ 1.000,00')).toBeTruthy();
  });

  it('shows negative saldo for expense-only results', async () => {
    const repositories = await seed();
    const screen = await render(<TransactionsManager {...repositories} />);

    await waitFor(() => expect(screen.getByText('Mercado atual')).toBeTruthy());
    await act(async () => { fireEvent.press(screen.getByText('Despesas')); });
    await act(async () => { fireEvent.changeText(screen.getByTestId('transaction-search-input'), 'Mercado atual'); });

    expect(screen.getByText('Receitas: R$ 0,00')).toBeTruthy();
    expect(screen.getByText('Despesas: R$ 50,00')).toBeTruthy();
    expect(screen.getByText('Saldo: -R$ 50,00')).toBeTruthy();
  });
});
