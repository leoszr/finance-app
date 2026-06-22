import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useGlassEnabled } from '@/hooks/useGlassEnabled';

export function GlassFab() {
  const glassEnabled = useGlassEnabled();
  return (
    <Pressable
      accessibilityLabel="Nova transação"
      accessibilityRole="button"
      onPress={() => router.push('/transactions' as never)}
      style={({ pressed }) => [styles.fab, !glassEnabled && styles.solid, pressed && styles.pressed]}
      testID="glass-fab"
    >
      <Text style={styles.plus}>+</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 22,
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.32)',
    borderRadius: 29,
    backgroundColor: 'rgba(37, 99, 235, 0.92)',
    shadowColor: '#1d4ed8',
    shadowOpacity: 0.26,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  pressed: { opacity: 0.86, transform: [{ scale: 0.97 }] },
  plus: { marginTop: -2, color: '#ffffff', fontSize: 34, fontWeight: '800' },
  solid: { backgroundColor: '#2563eb', borderColor: '#2563eb', shadowOpacity: 0.14 },
});
