import { Screen } from '@/components/Screen';
import { GlassMenuButton, ScreenHeader } from '@/components/ui';
import { ReportScreen } from '@/features/reports/ReportScreen';

export default function ReportsRoute() {
  return (
    <Screen testID="reports-screen">
      <GlassMenuButton />
      <ScreenHeader kicker="Relatórios locais" title="Relatórios" subtitle="Análise mensal criada só com dados do aparelho." />
      <ReportScreen />
    </Screen>
  );
}
