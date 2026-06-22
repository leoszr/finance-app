import { act, fireEvent, render, waitFor } from '@testing-library/react-native';

import { createSettingsRepository } from '@/db/repositories/settingsRepository';
import { createDashboardQueries } from '@/db/queries/dashboardQueries';
import { createAccountsRepository } from '@/db/repositories/accountsRepository';
import { createCategoriesRepository } from '@/db/repositories/categoriesRepository';
import { createTransactionsRepository } from '@/db/repositories/transactionsRepository';
import { DashboardManager } from '@/features/dashboard/DashboardManager';
import { SettingsScreen } from '@/features/settings/SettingsScreen';
import { formatCentsToCurrency } from '@/lib/money';
import { formatMonthLabel } from '@/lib/month';
import { normalizeCurrency, normalizeInitialMonth } from '@/lib/settings/preferences';
import { createFakeRepositoryDatabase } from '@/tests/repositories/fakeRepositoryDatabase';

jest.mock('expo-router', () => ({ router: { push: jest.fn() } }));

function month(offset: number) {
  const date = new Date();
  date.setMonth(date.getMonth() + offset);
  return { year: date.getFullYear(), month: date.getMonth() + 1, iso: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-10` };
}

describe('Sprint 12 settings', () => {
  it('renders app info, preferences and local data explanation', async () => {
    const repository = createSettingsRepository(createFakeRepositoryDatabase());
    const screen = await render(<SettingsScreen settingsRepository={repository} />);

    await waitFor(() => expect(screen.getByText('Finance App')).toBeTruthy());
    expect(screen.getByText('Dados locais')).toBeTruthy();
    expect(screen.getByText('Preferências')).toBeTruthy();
    expect(screen.getByText('Seus dados ficam neste dispositivo.')).toBeTruthy();
    expect(screen.getByText('Não há sincronização automática.')).toBeTruthy();
    expect(screen.getByText('Faça backup manual com frequência.')).toBeTruthy();
  });

  it('saves currency preference and uses it in money formatting', async () => {
    const repository = createSettingsRepository(createFakeRepositoryDatabase());
    const screen = await render(<SettingsScreen settingsRepository={repository} />);

    await act(async () => { fireEvent.press(screen.getByText('USD')); });

    await waitFor(() => expect(screen.getByText('Moeda salva.')).toBeTruthy());
    await expect(repository.getSetting('currency')).resolves.toEqual({ key: 'currency', value: 'USD' });
    expect(formatCentsToCurrency(123456, 'USD')).toEqual({ ok: true, value: 'US$ 1.234,56' });
  });

  it('saves initial month preference and normalizes defaults', async () => {
    const repository = createSettingsRepository(createFakeRepositoryDatabase());
    const screen = await render(<SettingsScreen settingsRepository={repository} />);

    expect(normalizeCurrency(undefined)).toBe('BRL');
    expect(normalizeInitialMonth(undefined)).toBe('current');

    await act(async () => { fireEvent.press(screen.getByText('Último mês com dados')); });

    await waitFor(() => expect(screen.getByText('Mês inicial salvo.')).toBeTruthy());
    await expect(repository.getSetting('initialMonth')).resolves.toEqual({ key: 'initialMonth', value: 'lastWithData' });
  });

  it('applies saved currency and initial month on dashboard', async () => {
    const database = createFakeRepositoryDatabase();
    const settingsRepository = createSettingsRepository(database);
    const account = await createAccountsRepository(database).createAccount({ name: 'Banco', type: 'checking', initialBalanceCents: 0 });
    const category = await createCategoriesRepository(database).createCategory({ name: 'Salário', type: 'income' });
    if (!account.ok || !category.ok) throw new Error('setup failed');
    const lastMonth = month(-1);
    await createTransactionsRepository(database).createTransaction({ accountId: account.value.id, categoryId: category.value.id, type: 'income', amountCents: 123456, transactionDate: lastMonth.iso, description: 'Salário' });
    await settingsRepository.setSetting('currency', 'USD');
    await settingsRepository.setSetting('initialMonth', 'lastWithData');

    const screen = await render(<DashboardManager dashboardQueries={createDashboardQueries(database)} settingsRepository={settingsRepository} />);

    await waitFor(() => expect(screen.getAllByText('US$ 1.234,56').length).toBeGreaterThan(0));
    const label = formatMonthLabel(lastMonth.year, lastMonth.month);
    if (label.ok) expect(screen.getByText(label.value)).toBeTruthy();
  });
});
