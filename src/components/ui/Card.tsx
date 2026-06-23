import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, shadows, spacing } from '@/theme';

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
    borderColor: colors.border.default,
    borderRadius: radius.xl,
    backgroundColor: colors.component.cardBackground,
    padding: spacing.lg,
    ...shadows.card,
  },
});
