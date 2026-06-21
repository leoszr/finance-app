import { Text } from 'react-native';

import { Screen } from '@/components/Screen';
import { CategoriesManager } from '@/features/categories/CategoriesManager';

export default function CategoriesScreen() {
  return (
    <Screen testID="categories-screen">
      <Text accessibilityRole="header" style={{ color: '#f8fafc', fontSize: 30, fontWeight: '900', marginBottom: 18 }}>Categorias</Text>
      <CategoriesManager />
    </Screen>
  );
}
