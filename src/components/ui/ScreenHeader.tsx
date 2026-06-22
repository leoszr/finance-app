import { StyleSheet, Text, View } from 'react-native';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  kicker?: string;
};

export function ScreenHeader({ title, subtitle, kicker }: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      {kicker ? <Text style={styles.kicker}>{kicker}</Text> : null}
      <Text accessibilityRole="header" style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 18 },
  kicker: { color: '#2563eb', fontSize: 13, fontWeight: '900', textTransform: 'uppercase' },
  title: { marginTop: 6, color: '#0f172a', fontSize: 34, fontWeight: '900', letterSpacing: -0.6 },
  subtitle: { marginTop: 8, color: '#475569', fontSize: 16, lineHeight: 23, fontWeight: '700' },
});
