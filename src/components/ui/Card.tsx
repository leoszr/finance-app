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
    borderColor: 'rgba(15, 118, 110, 0.12)',
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    padding: 20,
    ...Platform.select({
      web: { boxShadow: '0 10px 28px rgba(15, 23, 42, 0.07)' },
      default: {
        shadowColor: '#020617',
        shadowOpacity: 0.07,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 2,
      },
    }),
  },
});
