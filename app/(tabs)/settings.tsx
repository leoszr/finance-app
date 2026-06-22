import { router } from 'expo-router';

import { Screen } from '@/components/Screen';
import { Button, ScreenHeader } from '@/components/ui';
import { SettingsScreen as SettingsManager } from '@/features/settings/SettingsScreen';

export default function SettingsScreen() {
  return (
    <Screen testID="settings-screen">
      <Button onPress={() => router.replace('/dashboard' as never)}>Voltar ao Dashboard</Button>
      <ScreenHeader title="Configurações" subtitle="Preferências locais, backup, segurança e demonstração." />
      <SettingsManager />
    </Screen>
  );
}
