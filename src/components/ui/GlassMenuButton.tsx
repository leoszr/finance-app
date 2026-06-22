import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { GlassSurface } from '@/components/ui/GlassSurface';

export function GlassMenuButton() {
  return (
    <Pressable
      accessibilityLabel="Abrir configurações"
      accessibilityRole="button"
      onPress={() => router.push('/settings' as never)}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      testID="glass-menu-button"
    >
      <GlassSurface strong style={styles.surface}>
        <Text style={styles.icon}>☰</Text>
      </GlassSurface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { alignSelf: 'flex-end', marginBottom: 14 },
  surface: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 18 },
  pressed: { opacity: 0.84, transform: [{ scale: 0.96 }] },
  icon: { color: '#0f172a', fontSize: 24, fontWeight: '900', lineHeight: 28 },
});
