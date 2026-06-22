import { router } from 'expo-router';
import { Text } from 'react-native';

import { Screen } from '@/components/Screen';
import { Button, Card, TextInput } from '@/components/ui';

export default function SettingsScreen() {
  return (
    <Screen testID="settings-screen">
      <Text accessibilityRole="header" style={{ color: '#f8fafc', fontSize: 30, fontWeight: '900', marginBottom: 18 }}>Configurações</Text>
      <Card><TextInput label="Moeda padrão" value="BRL" editable={false} /></Card>
      <Button onPress={() => router.push('/backup' as never)}>Backup</Button>
    </Screen>
  );
}
