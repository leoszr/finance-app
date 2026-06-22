import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { GlassMenuButton, ScreenHeader, Card } from '@/components/ui';

export default function BudgetScreen() {
  return (
    <Screen testID="budget-screen">
      <GlassMenuButton />
      <ScreenHeader title="Budget" subtitle="Planejamento mensal e por categoria, sem fingir funcionalidade pronta." />
      <Card>
        <Text style={styles.title}>Budget em breve</Text>
        <Text style={styles.text}>Você vai definir um budget mensal geral e limites por categoria. O app compara despesas reais, mostra progresso e avisa antes do limite.</Text>
        <View style={styles.mock}>
          <View style={[styles.bar, { width: '72%', backgroundColor: '#0f766e' }]} />
          <View style={[styles.bar, { width: '46%', backgroundColor: '#22c55e' }]} />
          <View style={[styles.bar, { width: '84%', backgroundColor: '#f59e0b' }]} />
        </View>
        <Text style={styles.helper}>Enquanto isso, use Transações para registrar gastos e Relatórios para analisar o mês.</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: '#0f172a', fontSize: 24, fontWeight: '900' },
  text: { marginTop: 10, color: '#334155', fontSize: 16, fontWeight: '700', lineHeight: 23 },
  mock: { gap: 12, marginTop: 22 },
  bar: { height: 14, borderRadius: 999 },
  helper: { marginTop: 18, color: '#64748b', fontSize: 15, fontWeight: '800', lineHeight: 22 },
});
