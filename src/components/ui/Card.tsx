import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

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
    borderColor: '#dbe4f0',
    borderRadius: 24,
    backgroundColor: '#f8fafc',
    padding: 20,
    shadowColor: '#020617',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
});
