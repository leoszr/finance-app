import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { createSettingsRepository } from '@/db/repositories/settingsRepository';
import { localAuth as defaultLocalAuth, type BiometricAvailability, type LocalAuth } from '@/lib/localAuth';
import { subscribeToSettingsChanges } from '@/lib/settings/settingsEvents';
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
  const [unlocking, setUnlocking] = useState(false);
  const unlockingRef = useRef(false);

  const refreshLock = useCallback(async () => {
    const saved = await repository.getSetting(SETTINGS_KEYS.appLockEnabled);
    const nextEnabled = normalizeBooleanSetting(saved?.value);
    if (!nextEnabled) {
      setEnabled(false);
      setLocked(false);
      setMessage('');
      return;
    }

    const nextAvailability = await auth.getBiometricAvailability().catch((): BiometricAvailability => ({
      available: false,
      labels: [],
      reason: 'Biometria indisponível. Tente novamente.',
    }));
    setEnabled(true);
    setAvailability(nextAvailability);
    setLocked(true);
    setMessage(!nextAvailability.available ? (nextAvailability.reason ?? 'Biometria indisponível.') : '');
  }, [auth, repository]);

  useEffect(() => {
    let mounted = true;

    refreshLock().then(() => {
      if (!mounted) return;
      setLoading(false);
    }).catch(() => {
      if (!mounted) return;
      setEnabled(false);
      setLocked(false);
      setLoading(false);
    });

    return () => { mounted = false; };
  }, [refreshLock]);

  useEffect(() => subscribeToSettingsChanges(() => void refreshLock()), [refreshLock]);

  useEffect(() => {
    let state: AppStateStatus = AppState.currentState;
    const subscription = AppState.addEventListener('change', (nextState) => {
      if ((state === 'inactive' || state === 'background') && nextState === 'active') {
        void refreshLock();
      }
      state = nextState;
    });
    return () => subscription?.remove?.();
  }, [refreshLock]);

  const unlock = useCallback(async () => {
    if (unlockingRef.current) return;
    if (!availability.available) {
      setLocked(false);
      setMessage('Entrada liberada sem biometria. Revise a configuração de bloqueio.');
      return;
    }

    unlockingRef.current = true;
    setUnlocking(true);
    const ok = await auth.authenticate().catch(() => false);
    unlockingRef.current = false;
    setUnlocking(false);
    setLocked(!ok);
    setMessage(ok ? '' : 'Não foi possível autenticar. Tente novamente.');
  }, [auth, availability.available]);

  return { availability, enabled, loading, locked, message, unlock, unlocking };
}
