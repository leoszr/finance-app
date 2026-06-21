import { Text } from 'react-native';

import { Screen } from '@/components/Screen';
import { AccountsManager } from '@/features/accounts/AccountsManager';

export default function AccountsScreen() {
  return (
    <Screen testID="accounts-screen">
      <Text accessibilityRole="header" style={{ color: '#f8fafc', fontSize: 30, fontWeight: '900', marginBottom: 18 }}>Contas</Text>
      <AccountsManager />
    </Screen>
  );
}
