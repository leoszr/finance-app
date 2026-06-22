import { Screen } from '@/components/Screen';
import { GlassFab, GlassMenuButton, ScreenHeader } from '@/components/ui';
import { TransactionsManager } from '@/features/transactions/TransactionsManager';

export default function TransactionsScreen() {
  return (
    <Screen testID="transactions-screen">
      <GlassMenuButton />
      <ScreenHeader title="Transações" subtitle="Lista rápida para lançar, filtrar e revisar movimentações." />
      <TransactionsManager />
      <GlassFab />
    </Screen>
  );
}
