import { router } from 'expo-router';

import { Screen } from '@/components/Screen';
import { Button, ScreenHeader } from '@/components/ui';
import { AccountsManager } from '@/features/accounts/AccountsManager';

export default function AccountsScreen() {
  return (
    <Screen testID="accounts-screen">
      <Button onPress={() => router.replace('/settings' as never)}>Voltar às Configurações</Button>
      <ScreenHeader title="Contas" subtitle="Cadastre as origens do dinheiro usadas nas transações." />
      <AccountsManager />
    </Screen>
  );
}
