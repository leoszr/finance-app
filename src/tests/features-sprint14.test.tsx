import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { View } from 'react-native';

import { Button, MoneyInput } from '@/components/ui';
import { formatMoneyInputText } from '@/components/ui/MoneyInput';
import { createAccountsRepository } from '@/db/repositories/accountsRepository';
import { createCategoriesRepository } from '@/db/repositories/categoriesRepository';
import { createTransactionsRepository } from '@/db/repositories/transactionsRepository';
import { DashboardManager } from '@/features/dashboard/DashboardManager';
import { TransactionsManager } from '@/features/transactions/TransactionsManager';
import { createDashboardQueries } from '@/db/queries/dashboardQueries';
import { createFakeRepositoryDatabase } from '@/tests/repositories/fakeRepositoryDatabase';

async function seed() {
  const database = createFakeRepositoryDatabase();
  const accountsRepository = createAccountsRepository(database);
  const categoriesRepository = createCategoriesRepository(database);
  const transactionsRepository = createTransactionsRepository(database);
  const account = await accountsRepository.createAccount({ name: 'Carteira', type: 'cash', initialBalanceCents: 0 });
  const category = await categoriesRepository.createCategory({ name: 'Mercado', type: 'expense' });
  if (!account.ok || !category.ok) throw new Error('setup failed');
  return { accountsRepository, categoriesRepository, transactionsRepository, account: account.value, category: category.value, database };
}

describe('Sprint 14 mobile polish', () => {
  it('formats money while typing and saves cents', async () => {
    const { accountsRepository, categoriesRepository, transactionsRepository } = await seed();
    const screen = await render(<TransactionsManager accountsRepository={accountsRepository} categoriesRepository={categoriesRepository} transactionsRepository={transactionsRepository} />);

    await waitFor(() => expect(screen.getAllByText('Carteira').length).toBeGreaterThan(0));
    await act(async () => { fireEvent.changeText(screen.getByTestId('transaction-amount-input'), 'abc1234'); });
    expect(screen.getByDisplayValue('R$ 12,34')).toBeTruthy();
    await act(async () => { fireEvent.changeText(screen.getByTestId('transaction-date-input'), '2026-06-21'); });
    await act(async () => { fireEvent.press(screen.getAllByText('Carteira')[0]); });
    await act(async () => { fireEvent.press(screen.getByText('Mercado')); });
    await act(async () => { fireEvent.press(screen.getByTestId('save-transaction-button')); });

    await waitFor(() => expect(screen.getByText('Transação salva.')).toBeTruthy());
    expect((await transactionsRepository.getTransactions())[0].amountCents).toBe(1234);
  });

  it('keeps action rows usable on narrow screens through wrapping buttons', async () => {
    const screen = await render(
      <View style={{ width: 375, flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        <Button accessibilityLabel="Ação principal">Ação principal</Button>
        <Button accessibilityLabel="Ação secundária">Ação secundária</Button>
      </View>,
    );

    expect(screen.getByText('Ação principal').parent?.props.accessibilityLabel).toBe('Ação principal');
    expect(screen.getByText('Ação secundária').parent?.props.accessibilityLabel).toBe('Ação secundária');
    expect(screen.getByText('Ação principal').parent?.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ flexShrink: 1 })]));
  });

  it('does not reinterpret ambiguous decimal paste as another amount', () => {
    expect(formatMoneyInputText('12,345')).toBe('12,345');
    expect(formatMoneyInputText('abc1234')).toBe('R$ 12,34');
  });

  it('teaches the empty dashboard next steps', async () => {
    const database = createFakeRepositoryDatabase();
    const screen = await render(<DashboardManager dashboardQueries={createDashboardQueries(database)} />);

    await waitFor(() => expect(screen.getByTestId('dashboard-empty-state')).toBeTruthy());
    expect(screen.getByText('Monte seu painel financeiro')).toBeTruthy();
    expect(screen.getByText('Crie uma conta, adicione categorias e registre uma transação para liberar saldos e gráficos.')).toBeTruthy();
  });

  it('gives money inputs numeric keyboard and accessible labels', async () => {
    const screen = await render(<MoneyInput label="Valor" value="R$ 0,00" onChangeText={jest.fn()} />);
    const input = screen.getByDisplayValue('R$ 0,00');
    expect(input.props.accessibilityLabel).toBe('Valor');
    expect(input.props.keyboardType).toBe('decimal-pad');
  });
});
