import { Text } from 'react-native';

import { Screen } from '@/components/Screen';
import { Card, EmptyState } from '@/components/ui';

export default function TransactionsScreen() {
  return (
    <Screen testID="transactions-screen">
      <Text accessibilityRole="header" style={{ color: '#f8fafc', fontSize: 30, fontWeight: '900', marginBottom: 18 }}>Transações</Text>
      <Card><EmptyState title="Nenhuma transação" message="As entradas e saídas aparecerão aqui." /></Card>
    </Screen>
  );
}
