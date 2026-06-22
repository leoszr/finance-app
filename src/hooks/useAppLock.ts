import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { createSettingsRepository } from '@/db/repositories/settingsRepository';
import { localAuth as defaultLocalAuth, type BiometricAvailability, type LocalAuth } from '@/lib/localAuth';
import { normalizeBooleanSetting, SETTINGS_KEYS } from '@/lib/settings/preferences';

type SettingsRepository = ReturnType<typeof createSettingsRepository>;

let defaultSettingsRepository: SettingsRepository | undefined;

function getDefaultSettingsRepository() {
  defaultSettingsRepository ??= createSettingsRepository();
  return defaultSettingsRepository;
}

export function useAppLock(settingsRepository?: SettingsRepository, auth: LocalAuth = defaultLocalAuth) {
  const repository = useMemo(() => settingsRepository ?? getDefaultSettingsRepository(), [settingsRepository]);
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const [locked, setLocked] = useState(false);
  const [availability, setAvailability] = useState<BiometricAvailability>({ available: false, labels: [] });
  const [message, setMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    repository.getSetting(SETTINGS_KEYS.appLockEnabled).then(async (saved) => {
      if (!mounted) return;
      const nextEnabled = normalizeBooleanSetting(saved?.value);
      if (!nextEnabled) {
        setEnabled(false);
        setLocked(false);
        setLoading(false);
        return;
      }

      const nextAvailability = await auth.getBiometricAvailability().catch((): BiometricAvailability => ({
        available: false,
        labels: [],
        reason: 'Biometria indisponível. Tente novamente.',
      }));
      if (!mounted) return;
      setEnabled(nextEnabled);
      setAvailability(nextAvailability);
      setLocked(nextEnabled);
      setMessage(nextEnabled && !nextAvailability.available ? (nextAvailability.reason ?? 'Biometria indisponível.') : '');
      setLoading(false);
    }).catch(() => {
      if (!mounted) return;
      setEnabled(false);
      setLocked(false);
      setLoading(false);
    });

    return () => { mounted = false; };
  }, [auth, repository]);

  useEffect(() => {
    if (!enabled) return undefined;
    let state: AppStateStatus = AppState.currentState;
    const subscription = AppState.addEventListener('change', (nextState) => {
      if ((state === 'inactive' || state === 'background') && nextState === 'active') {
        setLocked(true);
        setMessage('');
      }
      state = nextState;
    });
    return () => subscription.remove();
  }, [enabled]);

  const unlock = useCallback(async () => {
    if (!availability.available) {
      setLocked(false);
      setMessage('Entrada liberada sem biometria. Revise a configuração de bloqueio.');
      return;
    }

    const ok = await auth.authenticate().catch(() => false);
    setLocked(!ok);
    setMessage(ok ? '' : 'Não foi possível autenticar. Tente novamente.');
  }, [auth, availability.available]);

  return { availability, enabled, loading, locked, message, unlock };
}
