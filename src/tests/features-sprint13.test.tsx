import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { AppState, Text } from 'react-native';

import { createSettingsRepository } from '@/db/repositories/settingsRepository';
import { AppLockGate } from '@/features/security/AppLockGate';
import { AppLockScreen } from '@/features/security/AppLockScreen';
import { SettingsScreen } from '@/features/settings/SettingsScreen';
import type { LocalAuth } from '@/lib/localAuth';
import { notifySettingsChanged } from '@/lib/settings/settingsEvents';
import { createFakeRepositoryDatabase } from '@/tests/repositories/fakeRepositoryDatabase';

jest.mock('expo-router', () => ({ router: { push: jest.fn() } }));

function auth(available = true, authenticate = true): LocalAuth {
  return {
    authenticate: jest.fn(async () => authenticate),
    getBiometricAvailability: jest.fn(async () => available
      ? { available: true, labels: ['Face ID / rosto'] }
      : { available: false, labels: [], reason: 'Cadastre uma biometria no aparelho para ativar o bloqueio.' }),
  };
}

function failingAuth(): LocalAuth {
  return {
    authenticate: jest.fn(async () => { throw new Error('native auth failed'); }),
    getBiometricAvailability: jest.fn(async () => { throw new Error('native auth failed'); }),
  };
}

describe('Sprint 13 local security', () => {
  it('detects biometrics and saves app lock setting', async () => {
    const repository = createSettingsRepository(createFakeRepositoryDatabase());
    const screen = await render(<SettingsScreen localAuth={auth()} settingsRepository={repository} />);

    await waitFor(() => expect(screen.getByText('Biometria disponível: Face ID / rosto')).toBeTruthy());
    await act(async () => { fireEvent.press(screen.getByText('Ativar bloqueio')); });

    await waitFor(() => expect(screen.getByText('Bloqueio local ativado.')).toBeTruthy());
    await expect(repository.getSetting('appLockEnabled')).resolves.toEqual({ key: 'appLockEnabled', value: 'true' });

    await act(async () => { fireEvent.press(screen.getByText('Desativar bloqueio')); });
    await waitFor(() => expect(screen.getByText('Bloqueio local desativado.')).toBeTruthy());
  });

  it('shows the lock screen before app content and unlocks after authentication', async () => {
    const repository = createSettingsRepository(createFakeRepositoryDatabase());
    await repository.setSetting('appLockEnabled', 'true');

    const screen = await render(
      <AppLockGate localAuth={auth()} settingsRepository={repository}>
        <Text>Dashboard privado</Text>
      </AppLockGate>,
    );

    await waitFor(() => expect(screen.getByText('App bloqueado')).toBeTruthy());
    expect(screen.queryByText('Dashboard privado')).toBeNull();

    await act(async () => { fireEvent.press(screen.getByText('Desbloquear')); });

    await waitFor(() => expect(screen.getByText('Dashboard privado')).toBeTruthy());
  });

  it('keeps locked on failed auth and allows retry', async () => {
    const repository = createSettingsRepository(createFakeRepositoryDatabase());
    const localAuth = auth(true, false);
    await repository.setSetting('appLockEnabled', 'true');

    const screen = await render(
      <AppLockGate localAuth={localAuth} settingsRepository={repository}>
        <Text>Dados</Text>
      </AppLockGate>,
    );

    await waitFor(() => expect(screen.getByText('App bloqueado')).toBeTruthy());
    await act(async () => { fireEvent.press(screen.getByText('Desbloquear')); });

    await waitFor(() => expect(screen.getByText('Não foi possível autenticar. Tente novamente.')).toBeTruthy());
    expect(screen.queryByText('Dados')).toBeNull();
    await act(async () => { fireEvent.press(screen.getByText('Desbloquear')); });
    expect(localAuth.authenticate).toHaveBeenCalledTimes(2);
  });

  it('shows controlled fallback when biometrics are unavailable', async () => {
    const repository = createSettingsRepository(createFakeRepositoryDatabase());
    await repository.setSetting('appLockEnabled', 'true');

    const screen = await render(
      <AppLockGate localAuth={auth(false)} settingsRepository={repository}>
        <Text>Dados preservados</Text>
      </AppLockGate>,
    );

    await waitFor(() => expect(screen.getByText('Cadastre uma biometria no aparelho para ativar o bloqueio.')).toBeTruthy());
    await act(async () => { fireEvent.press(screen.getByText('Continuar sem biometria')); });

    await waitFor(() => expect(screen.getByText('Dados preservados')).toBeTruthy());
  });

  it('does not block users with app lock disabled when native auth fails', async () => {
    const repository = createSettingsRepository(createFakeRepositoryDatabase());

    const screen = await render(
      <AppLockGate localAuth={failingAuth()} settingsRepository={repository}>
        <Text>App aberto</Text>
      </AppLockGate>,
    );

    await waitFor(() => expect(screen.getByText('App aberto')).toBeTruthy());
  });

  it('re-locks when the app returns to foreground', async () => {
    const repository = createSettingsRepository(createFakeRepositoryDatabase());
    await repository.setSetting('appLockEnabled', 'true');
    let onAppStateChange: ((state: 'active' | 'background' | 'inactive') => void) | undefined;
    const appStateSpy = jest.spyOn(AppState, 'addEventListener').mockImplementation((_event, listener) => {
      onAppStateChange = listener;
      return { remove: jest.fn() };
    });

    const screen = await render(
      <AppLockGate localAuth={auth()} settingsRepository={repository}>
        <Text>Dados protegidos</Text>
      </AppLockGate>,
    );

    await waitFor(() => expect(screen.getByText('App bloqueado')).toBeTruthy());
    await act(async () => { fireEvent.press(screen.getByText('Desbloquear')); });
    await waitFor(() => expect(screen.getByText('Dados protegidos')).toBeTruthy());

    await act(async () => {
      onAppStateChange?.('background');
      onAppStateChange?.('active');
      await Promise.resolve();
    });

    await waitFor(() => expect(screen.getByText('App bloqueado')).toBeTruthy());
    expect(screen.queryByText('Dados protegidos')).toBeNull();
    appStateSpy.mockRestore();
  });

  it('refreshes when app lock setting changes without remount', async () => {
    const repository = createSettingsRepository(createFakeRepositoryDatabase());
    const screen = await render(
      <AppLockGate localAuth={auth()} settingsRepository={repository}>
        <Text>Configurações abertas</Text>
      </AppLockGate>,
    );

    await waitFor(() => expect(screen.getByText('Configurações abertas')).toBeTruthy());
    await act(async () => {
      await repository.setSetting('appLockEnabled', 'true');
      notifySettingsChanged();
      await Promise.resolve();
    });
    await waitFor(() => expect(screen.getByText('App bloqueado')).toBeTruthy());

    await act(async () => {
      await repository.setSetting('appLockEnabled', 'false');
      notifySettingsChanged();
      await Promise.resolve();
    });
    await waitFor(() => expect(screen.getByText('Configurações abertas')).toBeTruthy());
  });

  it('disables unlock action while native auth is in flight', async () => {
    const screen = await render(<AppLockScreen available unlocking onUnlock={jest.fn()} />);

    expect(screen.getByText('Desbloquear').parent?.props.accessibilityState).toEqual({ busy: true, disabled: true });
  });
});
