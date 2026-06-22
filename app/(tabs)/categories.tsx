import { router } from 'expo-router';

import { Screen } from '@/components/Screen';
import { Button, ScreenHeader } from '@/components/ui';
import { CategoriesManager } from '@/features/categories/CategoriesManager';

export default function CategoriesScreen() {
  return (
    <Screen testID="categories-screen">
      <Button onPress={() => router.replace('/settings' as never)}>Voltar às Configurações</Button>
      <ScreenHeader title="Categorias" subtitle="Organize receitas e despesas para filtros e relatórios." />
      <CategoriesManager />
    </Screen>
  );
}
