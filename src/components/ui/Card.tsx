import type { ReactNode } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

type CardProps = { children: ReactNode; testID?: string };

export function Card({ children, testID }: CardProps) {
  return (
    <View style={styles.card} testID={testID}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.32)',
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    padding: 20,
    ...Platform.select({
      web: { boxShadow: '0 8px 16px rgba(2, 6, 23, 0.08)' },
      default: {
        shadowColor: '#020617',
        shadowOpacity: 0.08,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 2,
      },
    }),
  },
});
