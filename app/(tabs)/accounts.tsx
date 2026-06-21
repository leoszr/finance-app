import { Text } from 'react-native';

import { Screen } from '@/components/Screen';
import { Card, EmptyState } from '@/components/ui';

export default function AccountsScreen() {
  return (
    <Screen testID="accounts-screen">
      <Text accessibilityRole="header" style={{ color: '#f8fafc', fontSize: 30, fontWeight: '900', marginBottom: 18 }}>Contas</Text>
      <Card><EmptyState title="Nenhuma conta" message="Suas carteiras, bancos e cartões aparecerão aqui." /></Card>
    </Screen>
  );
}
