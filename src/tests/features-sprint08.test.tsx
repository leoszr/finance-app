import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { BarRow } from '@/components/charts/BarRow';

import { createDashboardQueries } from '@/db/queries/dashboardQueries';
import { createAccountsRepository } from '@/db/repositories/accountsRepository';
import { createCategoriesRepository } from '@/db/repositories/categoriesRepository';
import { createTransactionsRepository } from '@/db/repositories/transactionsRepository';
import { DashboardManager } from '@/features/dashboard/DashboardManager';
import { createFakeRepositoryDatabase } from '@/tests/repositories/fakeRepositoryDatabase';

function pad(value: number) { return String(value).padStart(2, '0'); }
function dateFor(offset: number, day = 15) {
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth() + offset, day);
  return { year: date.getFullYear(), month: date.getMonth() + 1, iso: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(day)}` };
}

async function seed() {
  const database = createFakeRepositoryDatabase();
  const accountsRepository = createAccountsRepository(database);
  const categoriesRepository = createCategoriesRepository(database);
  const transactionsRepository = createTransactionsRepository(database);
  const dashboardQueries = createDashboardQueries(database);
  const wallet = await accountsRepository.createAccount({ name: 'Carteira', type: 'cash', initialBalanceCents: 10000 });
  const bank = await accountsRepository.createAccount({ name: 'Banco', type: 'checking', initialBalanceCents: 0 });
  const salary = await categoriesRepository.createCategory({ name: 'Salário', type: 'income' });
  const market = await categoriesRepository.createCategory({ name: 'Mercado', type: 'expense' });
  const rent = await categoriesRepository.createCategory({ name: 'Aluguel', type: 'expense' });
  if (!wallet.ok || !bank.ok || !salary.ok || !market.ok || !rent.ok) throw new Error('setup failed');

  await transactionsRepository.createTransaction({ accountId: bank.value.id, categoryId: salary.value.id, type: 'income', amountCents: 300000, transactionDate: dateFor(0).iso, description: 'Salário mensal' });
  await transactionsRepository.createTransaction({ accountId: wallet.value.id, categoryId: market.value.id, type: 'expense', amountCents: 50000, transactionDate: dateFor(0).iso, description: 'Compras' });
  await transactionsRepository.createTransaction({ accountId: bank.value.id, categoryId: rent.value.id, type: 'expense', amountCents: 120000, transactionDate: dateFor(0).iso, description: 'Aluguel' });
  await transactionsRepository.createTransaction({ accountId: wallet.value.id, categoryId: market.value.id, type: 'expense', amountCents: 2500, transactionDate: dateFor(-1).iso, description: 'Mês passado' });

  return { dashboardQueries };
}

describe('Sprint 08 dashboard financeiro', () => {
  it('covers T0801 and T0803: calculates monthly totals, balances and category ranking', async () => {
    const { dashboardQueries } = await seed();
    const current = dateFor(0);
    const result = await dashboardQueries.getMonthlySummary(current.year, current.month);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.incomeCents).toBe(300000);
    expect(result.value.expenseCents).toBe(170000);
    expect(result.value.balanceCents).toBe(130000);
    expect(result.value.totalBalanceCents).toBe(137500);
    expect(result.value.topExpenseCategory?.categoryName).toBe('Aluguel');
    expect(result.value.expenseCategories.map((category) => category.categoryName)).toEqual(['Aluguel', 'Mercado']);
  });

  it('covers T0802, T0804 and T0805: renders cards, local charts and account balances', async () => {
    const { dashboardQueries } = await seed();
    const screen = await render(<DashboardManager dashboardQueries={dashboardQueries} />);

    await waitFor(() => expect(screen.getByText('Saldo mensal')).toBeTruthy());
    expect(screen.getAllByText('R$ 3.000,00').length).toBeGreaterThan(0);
    expect(screen.getAllByText('R$ 1.700,00').length).toBeGreaterThan(0);
    expect(screen.getByText('R$ 1.300,00')).toBeTruthy();
    expect(screen.getByText('R$ 1.375,00')).toBeTruthy();
    expect(screen.getByText('Receita x despesa')).toBeTruthy();
    expect(screen.getByText('Maiores gastos por categoria')).toBeTruthy();
    expect(screen.getByText('Aluguel')).toBeTruthy();
    expect(screen.getByText('Mercado')).toBeTruthy();
    expect(screen.getByText('Carteira')).toBeTruthy();
  });

  it('covers month changes and empty dashboard states', async () => {
    const { dashboardQueries } = await seed();
    const screen = await render(<DashboardManager dashboardQueries={dashboardQueries} />);

    await waitFor(() => expect(screen.getByText('R$ 1.300,00')).toBeTruthy());
    await act(async () => { fireEvent.press(screen.getByTestId('dashboard-previous-month-button')); });

    await waitFor(() => expect(screen.getByText('-R$ 25,00')).toBeTruthy());
    expect(screen.getByText('Mercado')).toBeTruthy();

    await act(async () => { fireEvent.press(screen.getByTestId('dashboard-next-month-button')); });
    await act(async () => { fireEvent.press(screen.getByTestId('dashboard-next-month-button')); });

    await waitFor(() => expect(screen.getByText('Registre uma receita ou despesa para comparar entradas e saídas deste mês.')).toBeTruthy());
  });

  it('shows empty state without accounts or transactions', async () => {
    const dashboardQueries = createDashboardQueries(createFakeRepositoryDatabase());
    const screen = await render(<DashboardManager dashboardQueries={dashboardQueries} />);

    await waitFor(() => expect(screen.getByTestId('dashboard-empty-state')).toBeTruthy());
    expect(screen.getByText('Monte seu painel financeiro')).toBeTruthy();
  });

  it('refreshes when finance data changes after dashboard mount', async () => {
    const database = createFakeRepositoryDatabase();
    const accountsRepository = createAccountsRepository(database);
    const categoriesRepository = createCategoriesRepository(database);
    const transactionsRepository = createTransactionsRepository(database);
    const dashboardQueries = createDashboardQueries(database);
    const account = await accountsRepository.createAccount({ name: 'Banco', type: 'checking', initialBalanceCents: 0 });
    const category = await categoriesRepository.createCategory({ name: 'Salário', type: 'income' });
    if (!account.ok || !category.ok) throw new Error('setup failed');
    const screen = await render(<DashboardManager dashboardQueries={dashboardQueries} />);

    await waitFor(() => expect(screen.getAllByText('R$ 0,00').length).toBeGreaterThan(0));
    await act(async () => {
      await transactionsRepository.createTransaction({ accountId: account.value.id, categoryId: category.value.id, type: 'income', amountCents: 123400, transactionDate: dateFor(0).iso, description: 'Bônus' });
    });

    await waitFor(() => expect(screen.getAllByText('R$ 1.234,00').length).toBeGreaterThan(0));
  });

  it('renders zero-value chart bars with zero width', async () => {
    const screen = await render(<BarRow label="Receitas" value="R$ 0,00" ratio={0} testID="zero-bar" />);
    const style = StyleSheet.flatten(screen.getByTestId('zero-bar').props.style);

    expect(style.width).toBe('0%');
  });

});
