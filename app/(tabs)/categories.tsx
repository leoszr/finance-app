import { Text } from 'react-native';

import { Screen } from '@/components/Screen';
import { Card, EmptyState } from '@/components/ui';

export default function CategoriesScreen() {
  return (
    <Screen testID="categories-screen">
      <Text accessibilityRole="header" style={{ color: '#f8fafc', fontSize: 30, fontWeight: '900', marginBottom: 18 }}>Categorias</Text>
      <Card><EmptyState title="Sem categorias" message="Organize receitas e despesas por categoria." /></Card>
    </Screen>
  );
}
