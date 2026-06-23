import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors, motion, radius, shadows, spacing, typography } from '@/theme';

type ButtonProps = {
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  testID?: string;
  accessibilityLabel?: string;
};

export function Button({ accessibilityLabel, children, onPress, disabled = false, loading = false, testID }: ButtonProps) {
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, inactive && styles.disabled]}
      testID={testID}
    >
      {loading ? <ActivityIndicator color={colors.text.inverse} testID="button-loading" /> : null}
      <Text style={styles.label}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    flexDirection: 'row',
    flexGrow: 1,
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderRadius: radius.lg,
    backgroundColor: colors.action.primary,
    paddingHorizontal: 18,
    ...shadows.button,
  },
  pressed: { opacity: motion.pressedOpacity, transform: [{ scale: motion.pressScale }] },
  disabled: { backgroundColor: colors.action.disabled, opacity: 0.72 },
  label: { color: colors.text.inverse, fontSize: typography.size.lg, fontWeight: typography.weight.bold },
});
