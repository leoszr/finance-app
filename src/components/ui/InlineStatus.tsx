import { StyleSheet, Text } from 'react-native';

type InlineStatusProps = { message: string; tone?: 'success' | 'error' | 'warning'; testID?: string };

export function InlineStatus({ message, tone = 'success', testID }: InlineStatusProps) {
  return <Text accessibilityLiveRegion={tone === 'error' ? undefined : 'polite'} accessibilityRole={tone === 'error' ? 'alert' : undefined} style={[styles.base, styles[tone]]} testID={testID}>{message}</Text>;
}

const styles = StyleSheet.create({
  base: { borderWidth: 1, borderRadius: 999, padding: 10, fontSize: 14, fontWeight: '900', textAlign: 'center' },
  success: { borderColor: '#bbf7d0', backgroundColor: '#dcfce7', color: '#166534' },
  error: { borderColor: '#fecaca', backgroundColor: '#fee2e2', color: '#991b1b' },
  warning: { borderColor: '#fde68a', backgroundColor: '#fef3c7', color: '#92400e' },
});
