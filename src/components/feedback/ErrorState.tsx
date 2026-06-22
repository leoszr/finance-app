import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui';

type ErrorStateProps = { title?: string; message: string; onRetry?: () => void };

export function ErrorState({
  title = 'Algo saiu do esperado',
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <View style={styles.container} testID="error-state">
      <Text accessibilityRole="alert" style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? <Button onPress={onRetry}>Tentar novamente</Button> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#eef6f4', padding: 24, gap: 14 },
  title: { color: '#991b1b', fontSize: 22, fontWeight: '900' },
  message: { color: '#475569', fontSize: 15, lineHeight: 22, fontWeight: '600' },
});
