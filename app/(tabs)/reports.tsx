import { Text } from 'react-native';

import { Screen } from '@/components/Screen';
import { Card, EmptyState } from '@/components/ui';

export default function ReportsScreen() {
  return (
    <Screen testID="reports-screen">
      <Text accessibilityRole="header" style={{ color: '#f8fafc', fontSize: 30, fontWeight: '900', marginBottom: 18 }}>Relatórios</Text>
      <Card><EmptyState title="Relatórios vazios" message="Gráficos serão montados com seus dados locais." /></Card>
    </Screen>
  );
}
