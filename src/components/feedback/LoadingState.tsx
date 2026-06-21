import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export function LoadingState({ message = 'Carregando...' }: { message?: string }) {
  return (
    <View style={styles.container} testID="loading-state">
      <ActivityIndicator color="#5eead4" size="large" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0b1220', padding: 24 },
  message: { marginTop: 12, color: '#ccfbf1', fontSize: 16, fontWeight: '800', textAlign: 'center' },
});
