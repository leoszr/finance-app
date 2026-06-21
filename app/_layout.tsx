import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { initDatabase } from '@/db/initDatabase';

export default function RootLayout() {
  const [databaseReady, setDatabaseReady] = useState(false);
  const [databaseError, setDatabaseError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    initDatabase().then((result) => {
      if (!mounted) {
        return;
      }

      if (result.ok) {
        setDatabaseReady(true);
        return;
      }

      setDatabaseError(result.error.message);
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (databaseError) {
    return (
      <View style={styles.errorContainer}>
        <Text accessibilityRole="alert" style={styles.errorTitle}>
          Não foi possível iniciar o banco local.
        </Text>
        <Text style={styles.errorMessage}>{databaseError}</Text>
      </View>
    );
  }

  if (!databaseReady) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Inicializando banco local...</Text>
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#0f172a',
    padding: 24,
  },
  loadingText: {
    color: '#e0f2fe',
    fontSize: 16,
    fontWeight: '700',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#0f172a',
    padding: 24,
  },
  errorTitle: {
    color: '#fee2e2',
    fontSize: 20,
    fontWeight: '800',
  },
  errorMessage: {
    marginTop: 12,
    color: '#fecaca',
    fontSize: 15,
    lineHeight: 22,
  },
});
