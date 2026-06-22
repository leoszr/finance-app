import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { ReportScreen } from '@/features/reports/ReportScreen';

export default function ReportsRoute() {
  return (
    <Screen testID="reports-screen">
      <View style={styles.header}>
        <Text style={styles.kicker}>Relatórios locais</Text>
        <Text accessibilityRole="header" style={styles.title}>Relatórios</Text>
        <Text style={styles.subtitle}>Análise mensal criada só com dados do aparelho.</Text>
      </View>
      <ReportScreen />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 18 },
  kicker: { color: '#5eead4', fontSize: 13, fontWeight: '900', textTransform: 'uppercase' },
  title: { marginTop: 8, color: '#f8fafc', fontSize: 34, fontWeight: '900', letterSpacing: -0.8 },
  subtitle: { marginTop: 8, color: '#cbd5e1', fontSize: 16, lineHeight: 23 },
});
