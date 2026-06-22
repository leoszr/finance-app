import { Screen } from '@/components/Screen';
import { GlassMenuButton, ScreenHeader } from '@/components/ui';
import { DashboardManager } from '@/features/dashboard/DashboardManager';

export default function DashboardScreen() {
  return (
    <Screen testID="dashboard-screen">
      <GlassMenuButton />
      <ScreenHeader kicker="Visão geral" title="Dashboard" subtitle="Resumo financeiro local, sem sincronização externa." />
      <DashboardManager />
    </Screen>
  );
}
