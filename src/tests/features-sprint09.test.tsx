import { act, fireEvent, render, waitFor } from '@testing-library/react-native';

import { createReportQueries, type MonthlyReport } from '@/db/queries/reportQueries';
import { createAccountsRepository } from '@/db/repositories/accountsRepository';
import { createCategoriesRepository } from '@/db/repositories/categoriesRepository';
import { createTransactionsRepository } from '@/db/repositories/transactionsRepository';
import { ReportScreen } from '@/features/reports/ReportScreen';
import { buildLocalReportSummary } from '@/lib/reportSummary';
import { createFakeRepositoryDatabase } from '@/tests/repositories/fakeRepositoryDatabase';

function pad(value: number) { return String(value).padStart(2, '0'); }
function dateFor(offset: number, day = 15) {
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth() + offset, day);
  return { year: date.getFullYear(), month: date.getMonth() + 1, iso: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(day)}` };
}


function emptyReport(overrides: Partial<MonthlyReport> = {}): MonthlyReport {
  return {
    incomeCents: 0,
    expenseCents: 0,
    balanceCents: 0,
    previous: { previousIncomeCents: 0, previousExpenseCents: 0, incomeDiffCents: 0, expenseDiffCents: 0, incomeDiffPercent: null, expenseDiffPercent: null },
    transactions: [],
    expenseCategories: [],
    hasData: false,
    ...overrides,
  };
}

async function seed() {
  const database = createFakeRepositoryDatabase();
  const accountsRepository = createAccountsRepository(database);
  const categoriesRepository = createCategoriesRepository(database);
  const transactionsRepository = createTransactionsRepository(database);
  const reportQueries = createReportQueries(database);
  const bank = await accountsRepository.createAccount({ name: 'Banco', type: 'checking', initialBalanceCents: 0 });
  const wallet = await accountsRepository.createAccount({ name: 'Carteira', type: 'cash', initialBalanceCents: 0 });
  const salary = await categoriesRepository.createCategory({ name: 'Salário', type: 'income' });
  const market = await categoriesRepository.createCategory({ name: 'Mercado', type: 'expense' });
  const rent = await categoriesRepository.createCategory({ name: 'Aluguel', type: 'expense' });
  if (!bank.ok || !wallet.ok || !salary.ok || !market.ok || !rent.ok) throw new Error('setup failed');

  await transactionsRepository.createTransaction({ accountId: bank.value.id, categoryId: salary.value.id, type: 'income', amountCents: 300000, transactionDate: dateFor(0, 10).iso, description: 'Salário mensal' });
  await transactionsRepository.createTransaction({ accountId: wallet.value.id, categoryId: market.value.id, type: 'expense', amountCents: 50000, transactionDate: dateFor(0, 16).iso, description: 'Compras' });
  await transactionsRepository.createTransaction({ accountId: bank.value.id, categoryId: rent.value.id, type: 'expense', amountCents: 100000, transactionDate: dateFor(0, 5).iso, description: 'Aluguel' });
  await transactionsRepository.createTransaction({ accountId: bank.value.id, categoryId: salary.value.id, type: 'income', amountCents: 250000, transactionDate: dateFor(-1, 10).iso, description: 'Salário passado' });
  await transactionsRepository.createTransaction({ accountId: wallet.value.id, categoryId: market.value.id, type: 'expense', amountCents: 75000, transactionDate: dateFor(-1, 12).iso, description: 'Mercado passado' });

  return { reportQueries };
}

describe('Sprint 09 relatórios locais', () => {
  it('covers T0901-T0904: builds monthly report, transaction table, categories and comparison', async () => {
    const { reportQueries } = await seed();
    const current = dateFor(0);
    const result = await reportQueries.getMonthlyReport(current.year, current.month);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.incomeCents).toBe(300000);
    expect(result.value.expenseCents).toBe(150000);
    expect(result.value.balanceCents).toBe(150000);
    expect(result.value.transactions.map((transaction) => transaction.description)).toEqual(['Compras', 'Salário mensal', 'Aluguel']);
    expect(result.value.transactions[0]).toMatchObject({ date: dateFor(0, 16).iso, categoryName: 'Mercado', accountName: 'Carteira' });
    expect(result.value.expenseCategories.map((category) => category.categoryName)).toEqual(['Aluguel', 'Mercado']);
    expect(result.value.expenseCategories[0]).toMatchObject({ amountCents: 100000, percent: 66.7 });
    expect(result.value.expenseCategories[1]).toMatchObject({ amountCents: 50000, percent: 33.3 });
    expect(result.value.previous.previousIncomeCents).toBe(250000);
    expect(result.value.previous.previousExpenseCents).toBe(75000);
    expect(result.value.previous.incomeDiffCents).toBe(50000);
    expect(result.value.previous.expenseDiffPercent).toBe(100);
  });

  it('covers T0905: creates local text summary without external calls', () => {
    expect(buildLocalReportSummary({ incomeCents: 0, expenseCents: 0, balanceCents: 0, previous: { previousIncomeCents: 0, previousExpenseCents: 0, incomeDiffCents: 0, expenseDiffCents: 0 } })).toContain('Sem movimentações');
    expect(buildLocalReportSummary({ incomeCents: 0, expenseCents: 0, balanceCents: 0, previous: { previousIncomeCents: 20000, previousExpenseCents: 7000, incomeDiffCents: -20000, expenseDiffCents: -7000 } })).toContain('Receitas caíram R$ 200,00');
    expect(buildLocalReportSummary({ incomeCents: 10000, expenseCents: 5000, balanceCents: 5000, previous: { previousIncomeCents: 0, previousExpenseCents: 0, incomeDiffCents: 10000, expenseDiffCents: 5000 } })).toContain('Mês anterior sem dados');
    expect(buildLocalReportSummary({ incomeCents: 10000, expenseCents: 5000, balanceCents: 5000, previous: { previousIncomeCents: 20000, previousExpenseCents: 7000, incomeDiffCents: -10000, expenseDiffCents: -2000 } })).toContain('despesas caíram R$ 20,00');
  });

  it('renders report screen and changes month to empty state', async () => {
    const { reportQueries } = await seed();
    const screen = await render(<ReportScreen reportQueries={reportQueries} />);

    await waitFor(() => expect(screen.getByText('Saldo do período')).toBeTruthy());
    expect(screen.getByText('Transações do período')).toBeTruthy();
    expect(screen.getByText(`${dateFor(0, 16).iso} · Compras`)).toBeTruthy();
    expect(screen.getByText('Mercado · Carteira')).toBeTruthy();
    expect(screen.getByText('Gastos por categoria')).toBeTruthy();
    expect(screen.getByText('R$ 1.000,00 • 66.7%')).toBeTruthy();
    expect(screen.getByText('Comparação com mês anterior')).toBeTruthy();
    expect(screen.getByText(/Receitas anteriores:/)).toBeTruthy();
    expect(screen.getByText(/Receitas subiram/)).toBeTruthy();

    await act(async () => { fireEvent.press(screen.getByTestId('report-next-month-button')); });

    await waitFor(() => expect(screen.getByTestId('report-empty-state')).toBeTruthy());
    expect(screen.getByText('Nenhuma transação no período.')).toBeTruthy();
  });

  it('clears stale report while loading another month', async () => {
    let resolveFirst: (() => void) | undefined;
    let resolveSecond: (() => void) | undefined;
    const reportQueries = {
      getMonthlyReport: jest.fn((year: number, month: number) => new Promise<{ ok: true; value: MonthlyReport }>((resolve) => {
        const value = reportQueries.getMonthlyReport.mock.calls.length === 1
          ? emptyReport({ incomeCents: 10000, balanceCents: 10000, hasData: true, transactions: [{ id: 1, date: `${year}-${pad(month)}-10`, description: 'Relatório antigo', categoryName: 'Salário', accountName: 'Banco', type: 'income', amountCents: 10000 }] })
          : emptyReport();
        const done = () => resolve({ ok: true, value });
        if (reportQueries.getMonthlyReport.mock.calls.length === 1) resolveFirst = done;
        else resolveSecond = done;
      })),
    };
    const screen = await render(<ReportScreen reportQueries={reportQueries} />);

    await waitFor(() => expect(reportQueries.getMonthlyReport).toHaveBeenCalledTimes(1));
    await act(async () => { resolveFirst?.(); });
    await waitFor(() => expect(screen.getByText(/Relatório antigo/)).toBeTruthy());

    await act(async () => { fireEvent.press(screen.getByTestId('report-next-month-button')); });

    expect(screen.queryByText(/Relatório antigo/)).toBeNull();
    expect(screen.getByText('Carregando relatório...')).toBeTruthy();
    await waitFor(() => expect(reportQueries.getMonthlyReport).toHaveBeenCalledTimes(2));
    await act(async () => { resolveSecond?.(); });
    await waitFor(() => expect(screen.getByTestId('report-empty-state')).toBeTruthy());
  });

});
