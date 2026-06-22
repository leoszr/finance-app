import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Button, Card } from '@/components/ui';

type AppLockScreenProps = {
  available: boolean;
  message?: string;
  onUnlock: () => void;
  unlocking?: boolean;
};

export function AppLockScreen({ available, message, onUnlock, unlocking = false }: AppLockScreenProps) {
  return (
    <Screen centered testID="app-lock-screen">
      <Card>
        <View style={styles.stack}>
          <Text accessibilityRole="header" style={styles.title}>App bloqueado</Text>
          <Text style={styles.text}>Autentique no aparelho para ver seus dados financeiros.</Text>
          {message ? <Text style={styles.warning}>{message}</Text> : null}
          <Button loading={unlocking} onPress={onUnlock}>{available ? 'Desbloquear' : 'Tentar novamente'}</Button>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 14 },
  title: { color: '#0f172a', fontSize: 24, fontWeight: '900' },
  text: { color: '#475569', fontSize: 16, fontWeight: '700', lineHeight: 23 },
  warning: { color: '#b45309', fontSize: 14, fontWeight: '900' },
});
