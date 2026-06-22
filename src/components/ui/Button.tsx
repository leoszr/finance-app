import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

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
      {loading ? <ActivityIndicator color="#e0f2fe" testID="button-loading" /> : null}
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
    gap: 8,
    borderRadius: 16,
    backgroundColor: '#0f766e',
    paddingHorizontal: 18,
  },
  pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  disabled: { backgroundColor: '#64748b', opacity: 0.72 },
  label: { color: '#f8fafc', fontSize: 16, fontWeight: '800' },
});
