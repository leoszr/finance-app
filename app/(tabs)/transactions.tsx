import { Text } from 'react-native';

import { Screen } from '@/components/Screen';
import { TransactionsManager } from '@/features/transactions/TransactionsManager';

export default function TransactionsScreen() {
  return (
    <Screen testID="transactions-screen">
      <Text accessibilityRole="header" style={{ color: '#f8fafc', fontSize: 30, fontWeight: '900', marginBottom: 18 }}>Transações</Text>
      <TransactionsManager />
    </Screen>
  );
}
