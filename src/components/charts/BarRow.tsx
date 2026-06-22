import { StyleSheet, Text, View, type DimensionValue } from 'react-native';

type BarRowProps = { label: string; value: string; ratio: number; color?: string; testID?: string };

function barWidth(ratio: number): DimensionValue {
  if (ratio <= 0) return '0%';
  return `${Math.max(4, Math.min(100, ratio * 100))}%`;
}

export function BarRow({ label, value, ratio, color = '#14b8a6', testID }: BarRowProps) {
  return (
    <View style={styles.stack}>
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      <View style={styles.track}>
        <View testID={testID} style={[styles.bar, { width: barWidth(ratio), backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  label: { color: '#0f172a', fontSize: 15, fontWeight: '900' },
  value: { color: '#334155', fontSize: 15, fontWeight: '800', fontVariant: ['tabular-nums'] },
  track: { height: 10, overflow: 'hidden', borderRadius: 999, backgroundColor: '#e2e8f0' },
  bar: { height: 10, borderRadius: 999 },
});
