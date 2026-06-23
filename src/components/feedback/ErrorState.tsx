import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui';
import { colors, spacing, typography } from '@/theme';

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
  container: { flex: 1, justifyContent: 'center', backgroundColor: colors.background.app, padding: spacing.xl, gap: 14 },
  title: { color: colors.text.danger, fontSize: 22, fontWeight: typography.weight.heavy },
  message: { color: colors.text.secondary, fontSize: typography.size.md, lineHeight: typography.lineHeight.md, fontWeight: typography.weight.medium },
});
