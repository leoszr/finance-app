import { Text } from 'react-native';

import { Screen } from '@/components/Screen';
import { SettingsScreen as SettingsManager } from '@/features/settings/SettingsScreen';

export default function SettingsScreen() {
  return (
    <Screen testID="settings-screen">
      <Text accessibilityRole="header" style={{ color: '#f8fafc', fontSize: 30, fontWeight: '900', marginBottom: 18 }}>Configurações</Text>
      <SettingsManager />
    </Screen>
  );
}
