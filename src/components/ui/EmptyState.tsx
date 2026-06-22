import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type EmptyStateProps = { title: string; message: string; action?: ReactNode; testID?: string };

export function EmptyState({ title, message, action, testID }: EmptyStateProps) {
  return (
    <View style={styles.container} testID={testID}>
      <Text style={styles.icon}>◌</Text>
      <Text accessibilityRole="header" style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', borderRadius: 22, backgroundColor: '#ccfbf1', padding: 24 },
  icon: { color: '#0f766e', fontSize: 34, fontWeight: '900' },
  title: { marginTop: 8, color: '#0f172a', fontSize: 20, fontWeight: '900', textAlign: 'center' },
  message: { marginTop: 8, color: '#334155', fontSize: 15, lineHeight: 22, textAlign: 'center' },
  action: { marginTop: 16, width: '100%' },
});
