import { render } from '@testing-library/react-native';

import DashboardScreen from '../../../app/(tabs)/dashboard';
import { TAB_ROUTES } from '../../../app/(tabs)/routes';
import TransactionsScreen from '../../../app/(tabs)/transactions';

describe('Sprint 04 navigation', () => {
  it('covers T0401: defines six clear main tabs', () => {
    expect(TAB_ROUTES.map((route) => route.title)).toEqual([
      'Dashboard',
      'Transações',
      'Categorias',
      'Contas',
      'Relatórios',
      'Configurações',
    ]);
  });

  it('covers T0401: renders main tab screen content', async () => {
    const { getByText, unmount } = await render(<DashboardScreen />);
    expect(getByText('Dashboard')).toBeTruthy();
    unmount();

    const transactions = await render(<TransactionsScreen />);
    expect(transactions.getByText('Transações')).toBeTruthy();
  });


  it('covers T0401: route model supports alternating between two tabs', () => {
    const current = TAB_ROUTES.find((route) => route.name === 'dashboard');
    const next = TAB_ROUTES.find((route) => route.name === 'transactions');

    expect(current?.title).toBe('Dashboard');
    expect(next?.title).toBe('Transações');
  });

});
