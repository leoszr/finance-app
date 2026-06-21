import { Alert } from 'react-native';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';

import { createAccountsRepository } from '@/db/repositories/accountsRepository';
import { createCategoriesRepository } from '@/db/repositories/categoriesRepository';
import { createFakeRepositoryDatabase } from '@/tests/repositories/fakeRepositoryDatabase';
import { AccountsManager } from '@/features/accounts/AccountsManager';
import { CategoriesManager } from '@/features/categories/CategoriesManager';

type AlertButton = { text?: string; style?: string; onPress?: () => void };

describe('Sprint 05 managers UI', () => {
  beforeEach(() => {
    jest.spyOn(Alert, 'alert').mockImplementation((_title, _message, buttons?: AlertButton[]) => {
      buttons?.find((button) => button.style === 'destructive')?.onPress?.();
    });
  });

  afterEach(() => jest.restoreAllMocks());

  it('covers R004: renders AccountsManager and validates required name', async () => {
    const repository = createAccountsRepository(createFakeRepositoryDatabase());
    const { getByTestId, getByText } = await render(<AccountsManager repository={repository} />);

    await waitFor(() => expect(getByTestId('save-account-button')).toBeTruthy());
    await act(async () => { fireEvent.press(getByTestId('save-account-button')); });

    await waitFor(() => expect(getByText('Nome da conta é obrigatório.')).toBeTruthy());
  });

  it('covers R004: renders CategoriesManager and validates required name', async () => {
    const repository = createCategoriesRepository(createFakeRepositoryDatabase());
    const { getByTestId, getByText } = await render(<CategoriesManager repository={repository} />);

    await waitFor(() => expect(getByTestId('save-category-button')).toBeTruthy());
    await act(async () => { fireEvent.press(getByTestId('save-category-button')); });

    await waitFor(() => expect(getByText('Nome da categoria é obrigatório.')).toBeTruthy());
  });
});
