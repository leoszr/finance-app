import { StyleSheet, Text, View } from 'react-native';

import { formatCentsToCurrency, type AppCurrency } from '@/lib/money';

type BudgetDonutProps = {
  spentCents: number;
  totalCents: number;
  daysLeft: number;
  currency?: AppCurrency;
};

function money(cents: number, currency: AppCurrency) {
  const result = formatCentsToCurrency(Math.max(0, cents), currency);
  return result.ok ? result.value : 'R$ 0,00';
}

function ringColor(ratio: number) {
  if (ratio >= 1) return '#dc2626';
  if (ratio >= 0.82) return '#d97706';
  if (ratio <= 0.55) return '#16a34a';
  return '#0f766e';
}

export function BudgetDonut({ spentCents, totalCents, daysLeft, currency = 'BRL' }: BudgetDonutProps) {
  const safeTotal = Math.max(totalCents, 1);
  const ratio = spentCents / safeTotal;
  const remaining = Math.max(safeTotal - spentCents, 0);

  return (
    <View style={styles.wrap}>
      <View style={[styles.ring, { borderColor: ringColor(ratio) }]}>
        <Text style={styles.kicker}>Budget restante</Text>
        <Text style={styles.value}>Restante: {money(remaining, currency)}</Text>
        <Text style={styles.days}>{daysLeft} dias restantes</Text>
      </View>
      <Text style={styles.helper}>{Math.min(Math.round(ratio * 100), 999)}% usado no mês</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 10 },
  ring: {
    width: 198,
    height: 198,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 16,
    borderRadius: 99,
    backgroundColor: '#ffffff',
  },
  kicker: { color: '#475569', fontSize: 13, fontWeight: '900' },
  value: { marginTop: 6, color: '#0f172a', fontSize: 24, fontWeight: '900', fontVariant: ['tabular-nums'], textAlign: 'center' },
  days: { marginTop: 4, color: '#64748b', fontSize: 13, fontWeight: '800', fontVariant: ['tabular-nums'] },
  helper: { color: '#475569', fontSize: 14, fontWeight: '800' },
});
