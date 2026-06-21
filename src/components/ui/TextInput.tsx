import { StyleSheet, Text, TextInput as RNTextInput, type TextInputProps as RNTextInputProps, View } from 'react-native';

type TextInputProps = RNTextInputProps & { label: string; error?: string };

export function TextInput({ label, error, style, ...props }: TextInputProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <RNTextInput
        placeholderTextColor="#94a3b8"
        style={[styles.input, props.editable === false && styles.disabled, error && styles.error, style]}
        {...props}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 8 },
  label: { color: '#1e293b', fontSize: 14, fontWeight: '800' },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 14,
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    color: '#0f172a',
    fontSize: 16,
  },
  disabled: { backgroundColor: '#e2e8f0', color: '#64748b' },
  error: { borderColor: '#dc2626' },
  errorText: { color: '#b91c1c', fontSize: 13, fontWeight: '700' },
});
