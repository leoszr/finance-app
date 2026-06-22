import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui';

type SummaryCardProps = { label: string; value: string; tone?: 'income' | 'expense' | 'neutral' };

export function SummaryCard({ label, value, tone = 'neutral' }: SummaryCardProps) {
  return (
    <Card>
      <View style={styles.stack}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, styles[tone]]}>{value}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 8 },
  label: { color: '#475569', fontSize: 13, fontWeight: '900', textTransform: 'uppercase' },
  value: { color: '#0f172a', fontSize: 24, fontWeight: '900' },
  income: { color: '#047857' },
  expense: { color: '#b91c1c' },
  neutral: { color: '#0f172a' },
});
