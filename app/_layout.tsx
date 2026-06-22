import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';

import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { initDatabase } from '@/db/initDatabase';
import { AppLockGate } from '@/features/security/AppLockGate';

const DATABASE_ERROR_MESSAGE =
  'Não conseguimos preparar seus dados neste aparelho. Feche e abra o app; se continuar, tente novamente.';

export default function RootLayout() {
  const [databaseReady, setDatabaseReady] = useState(false);
  const [databaseError, setDatabaseError] = useState(false);

  useEffect(() => {
    let mounted = true;

    initDatabase().then((result) => {
      if (!mounted) return;
      if (result.ok) {
        setDatabaseReady(true);
        return;
      }
      setDatabaseError(true);
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (databaseError) {
    return <ErrorState title="Banco local indisponível" message={DATABASE_ERROR_MESSAGE} />;
  }

  if (!databaseReady) {
    return <LoadingState message="Inicializando banco local..." />;
  }

  return (
    <AppLockGate>
      <Stack screenOptions={{ headerShown: false }} />
    </AppLockGate>
  );
}
