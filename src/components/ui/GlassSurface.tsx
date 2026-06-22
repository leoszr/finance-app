import type { ReactNode } from 'react';
import { Platform, StyleSheet, View, type ViewStyle } from 'react-native';

import { useGlassEnabled } from '@/hooks/useGlassEnabled';

type GlassSurfaceProps = {
  children: ReactNode;
  strong?: boolean;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
};

export function GlassSurface({ children, strong = false, style, testID }: GlassSurfaceProps) {
  const enabled = useGlassEnabled();
  return <View style={[styles.surface, strong && styles.strong, !enabled && styles.solid, style]} testID={testID}>{children}</View>;
}

const styles = StyleSheet.create({
  surface: {
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.34)',
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    ...Platform.select({
      web: { boxShadow: '0 16px 36px rgba(15, 23, 42, 0.10)' },
      default: {
        shadowColor: '#0f172a',
        shadowOpacity: 0.10,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 3,
      },
    }),
  },
  strong: {
    borderColor: 'rgba(37, 99, 235, 0.24)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  solid: {
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    shadowOpacity: 0.06,
  },
});
