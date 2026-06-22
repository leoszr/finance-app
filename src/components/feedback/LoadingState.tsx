import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export function LoadingState({ message = 'Carregando...' }: { message?: string }) {
  return (
    <View style={styles.container} testID="loading-state">
      <ActivityIndicator color="#2563eb" size="large" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#eef6f4', padding: 24 },
  message: { marginTop: 12, color: '#334155', fontSize: 16, fontWeight: '800', textAlign: 'center' },
});
