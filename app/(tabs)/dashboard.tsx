import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { DashboardManager } from '@/features/dashboard/DashboardManager';

export default function DashboardScreen() {
  return (
    <Screen testID="dashboard-screen">
      <View style={styles.header}>
        <Text style={styles.kicker}>Visão geral</Text>
        <Text accessibilityRole="header" style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Resumo financeiro local, sem sincronização externa.</Text>
      </View>
      <DashboardManager />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 18 },
  kicker: { color: '#5eead4', fontSize: 13, fontWeight: '900', textTransform: 'uppercase' },
  title: { marginTop: 8, color: '#f8fafc', fontSize: 34, fontWeight: '900', letterSpacing: -0.8 },
  subtitle: { marginTop: 8, color: '#cbd5e1', fontSize: 16, lineHeight: 23 },
});
