import type { ReactNode } from 'react';

import { LoadingState } from '@/components/feedback/LoadingState';
import { createSettingsRepository } from '@/db/repositories/settingsRepository';
import { AppLockScreen } from '@/features/security/AppLockScreen';
import { useAppLock } from '@/hooks/useAppLock';
import type { LocalAuth } from '@/lib/localAuth';

type SettingsRepository = ReturnType<typeof createSettingsRepository>;

type AppLockGateProps = {
  children: ReactNode;
  localAuth?: LocalAuth;
  settingsRepository?: SettingsRepository;
};

export function AppLockGate({ children, localAuth, settingsRepository }: AppLockGateProps) {
  const lock = useAppLock(settingsRepository, localAuth);

  if (lock.loading) return <LoadingState message="Verificando bloqueio local..." />;
  if (lock.enabled && lock.locked) {
    return <AppLockScreen available={lock.availability.available} message={lock.message} onUnlock={() => void lock.unlock()} unlocking={lock.unlocking} />;
  }

  return children;
}
