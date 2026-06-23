import { StyleSheet, Text, TextInput as RNTextInput, type TextInputProps as RNTextInputProps, View } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme';

type TextInputProps = RNTextInputProps & { label: string; error?: string };

export function TextInput({ label, error, style, ...props }: TextInputProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <RNTextInput
        accessibilityLabel={props.accessibilityLabel ?? label}
        placeholderTextColor={colors.text.secondary}
        selectionColor={colors.border.focus}
        style={[styles.input, props.editable === false && styles.disabled, error && styles.error, style]}
        {...props}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.xs },
  label: { color: colors.text.primary, fontSize: 14, fontWeight: typography.weight.bold },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border.strong,
    borderRadius: radius.md,
    backgroundColor: colors.component.inputBackground,
    paddingHorizontal: 14,
    color: colors.text.primary,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
  },
  disabled: { backgroundColor: colors.background.subtle, color: colors.text.secondary },
  error: { borderColor: colors.border.danger },
  errorText: { color: colors.text.danger, fontSize: typography.size.sm, fontWeight: typography.weight.semibold },
});
