import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '@/theme';

export function LoadingState({ message = 'Carregando...' }: { message?: string }) {
  return (
    <View style={styles.container} testID="loading-state">
      <ActivityIndicator color={colors.feedback.loading} size="large" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background.app, padding: spacing.xl },
  message: { marginTop: spacing.sm, color: colors.text.primary, fontSize: typography.size.lg, fontWeight: typography.weight.bold, textAlign: 'center' },
});
