import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { APP_NAME, APP_TAGLINE, buildWelcomeMessage } from '@/lib/appInfo';

export default function HomeScreen() {
  return (
    <Screen>
      <View style={styles.eyebrowBox}>
        <Text style={styles.eyebrow}>local-first</Text>
      </View>

      <Text accessibilityRole="header" style={styles.title}>
        {APP_NAME}
      </Text>

      <Text style={styles.subtitle}>{APP_TAGLINE}</Text>
      <Text style={styles.body}>{buildWelcomeMessage()}</Text>

      <View style={styles.notice}>
        <Text style={styles.noticeText}>
          Fundação técnica ativa: Expo, TypeScript, lint e testes prontos.
        </Text>
      </View>

      <StatusBar style="light" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  eyebrowBox: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  eyebrow: {
    color: '#166534',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    marginTop: 20,
    color: '#0f172a',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  subtitle: {
    marginTop: 12,
    color: '#334155',
    fontSize: 19,
    fontWeight: '600',
    lineHeight: 27,
  },
  body: {
    marginTop: 14,
    color: '#475569',
    fontSize: 16,
    lineHeight: 24,
  },
  notice: {
    marginTop: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
    borderRadius: 16,
    backgroundColor: '#dbeafe',
    padding: 16,
  },
  noticeText: {
    color: '#1e3a8a',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
});
