import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { createAccountsRepository } from '@/db/repositories/accountsRepository';
import { createCategoriesRepository } from '@/db/repositories/categoriesRepository';
import { createSettingsRepository } from '@/db/repositories/settingsRepository';
import { createTransactionsRepository } from '@/db/repositories/transactionsRepository';
import { SettingsScreen } from '@/features/settings/SettingsScreen';
import { clearDemoData, DEMO_PREFIX, seedDemoData } from '@/lib/demoData';
import type { LocalAuth } from '@/lib/localAuth';
import { createFakeRepositoryDatabase } from '@/tests/repositories/fakeRepositoryDatabase';

const root = join(__dirname, '..', '..');

function readRoot(path: string) {
  return readFileSync(join(root, path), 'utf8');
}

function demoRepos() {
  const database = createFakeRepositoryDatabase();
  return demoReposFor(database);
}

function demoReposFor(database: ReturnType<typeof createFakeRepositoryDatabase>) {
  return {
    accountsRepository: createAccountsRepository(database),
    categoriesRepository: createCategoriesRepository(database),
    transactionsRepository: createTransactionsRepository(database),
  };
}

const localAuth: LocalAuth = {
  getBiometricAvailability: async () => ({ available: false, labels: [] }),
  authenticate: jest.fn(),
};

type AlertButton = { text?: string; style?: string; onPress?: () => void };

describe('Sprint 15 internal release hardening', () => {
  it('has no forbidden backend or AI dependencies', () => {
    const packageJson = readRoot('package.json').toLowerCase();
    expect(packageJson).not.toContain('supabase');
    expect(packageJson).not.toContain('postgres');
    expect(packageJson).not.toContain('openai');
    expect(packageJson).not.toContain('axios');
  });

  it('documents manual checks for iPhone and Android', () => {
    const checklist = readRoot('docs/manual-test-checklist.md');
    expect(checklist).toContain('iPhone');
    expect(checklist).toContain('Android');
    expect(checklist).toContain('Resultado esperado');
  });

  it('creates and clears marked local demo data', async () => {
    const repos = demoRepos();
    const seeded = await seedDemoData(repos);
    expect(seeded.ok).toBe(true);
    expect((await repos.accountsRepository.getAccounts())[0].name).toContain(DEMO_PREFIX);
    expect((await repos.transactionsRepository.getTransactions()).every((transaction) => transaction.description?.startsWith(DEMO_PREFIX))).toBe(true);

    const cleared = await clearDemoData(repos);
    expect(cleared.ok).toBe(true);
    expect(await repos.accountsRepository.getAccounts()).toEqual([]);
    expect(await repos.categoriesRepository.getCategories()).toEqual([]);
    expect(await repos.transactionsRepository.getTransactions()).toEqual([]);
  });

  it('does not clear manually prefixed non-demo records', async () => {
    const repos = demoRepos();
    const account = await repos.accountsRepository.createAccount({ name: `${DEMO_PREFIX} Manual`, type: 'cash', initialBalanceCents: 0 });
    const category = await repos.categoriesRepository.createCategory({ name: `${DEMO_PREFIX} Manual`, type: 'expense' });
    if (!account.ok || !category.ok) throw new Error('setup failed');
    const transaction = await repos.transactionsRepository.createTransaction({
      accountId: account.value.id,
      categoryId: category.value.id,
      type: 'expense',
      amountCents: 1234,
      description: `${DEMO_PREFIX} Manual`,
      transactionDate: '2026-06-21',
    });
    expect(transaction.ok).toBe(true);

    const cleared = await clearDemoData(repos);
    expect(cleared.ok).toBe(true);
    expect(await repos.transactionsRepository.getTransactions()).toEqual([expect.objectContaining({ description: `${DEMO_PREFIX} Manual` })]);
  });

  it('exposes demo actions in settings', async () => {
    const database = createFakeRepositoryDatabase();
    const screen = await render(<SettingsScreen localAuth={localAuth} settingsRepository={createSettingsRepository(database)} />);
    await waitFor(() => expect(screen.getByText('Demonstração')).toBeTruthy());
    expect(screen.getByTestId('seed-demo-data-button')).toBeTruthy();
    expect(screen.getByTestId('clear-demo-data-button')).toBeTruthy();
  });

  it('asks before clearing demo data', async () => {
    const alert = jest.spyOn(Alert, 'alert').mockImplementation((_title, _message, buttons?: AlertButton[]) => {
      expect(buttons?.some((button) => button.style === 'destructive')).toBe(true);
    });
    const database = createFakeRepositoryDatabase();
    const screen = await render(<SettingsScreen localAuth={localAuth} settingsRepository={createSettingsRepository(database)} />);

    await waitFor(() => expect(screen.getByTestId('clear-demo-data-button')).toBeTruthy());
    fireEvent.press(screen.getByTestId('clear-demo-data-button'));

    expect(alert).toHaveBeenCalledWith('Apagar demonstração', expect.any(String), expect.any(Array));
    alert.mockRestore();
  });

  it('keeps data in repository after recreating repository wrappers', async () => {
    const database = createFakeRepositoryDatabase();
    const first = demoReposFor(database);
    const account = await first.accountsRepository.createAccount({ name: 'Carteira', type: 'cash', initialBalanceCents: 1000 });
    expect(account.ok).toBe(true);

    const second = { accountsRepository: createAccountsRepository(database) };
    const seeded = await seedDemoData(demoReposFor(database));
    expect(seeded.ok).toBe(true);
    expect(await second.accountsRepository.getAccounts()).toEqual(expect.arrayContaining([expect.objectContaining({ name: expect.stringContaining(DEMO_PREFIX) })]));
  });

  it('configures internal EAS build docs', () => {
    expect(readRoot('eas.json')).toContain('"internal"');
    expect(readRoot('eas.json')).toContain('"apk"');
    expect(readRoot('app.json')).toContain('com.leo.financeapp');
    expect(readRoot('docs/release.md')).toContain('eas build --profile internal');
  });
});
