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
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#0b1220', padding: 24, gap: 14 },
  title: { color: '#fee2e2', fontSize: 22, fontWeight: '900' },
  message: { color: '#fecaca', fontSize: 15, lineHeight: 22, fontWeight: '600' },
});
