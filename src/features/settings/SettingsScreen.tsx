import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button, Card } from '@/components/ui';
import { createSettingsRepository } from '@/db/repositories/settingsRepository';
import { APP_NAME, APP_TAGLINE } from '@/lib/appInfo';
import { formatCentsToCurrency, type AppCurrency } from '@/lib/money';
import { DEFAULT_CURRENCY, DEFAULT_INITIAL_MONTH, normalizeCurrency, normalizeInitialMonth, SETTINGS_KEYS, type InitialMonthPreference } from '@/lib/settings/preferences';

type SettingsRepository = ReturnType<typeof createSettingsRepository>;

let defaultSettingsRepository: SettingsRepository | undefined;

function getDefaultSettingsRepository() {
  defaultSettingsRepository ??= createSettingsRepository();
  return defaultSettingsRepository;
}

export function SettingsScreen({ settingsRepository }: { settingsRepository?: SettingsRepository }) {
  const repository = useMemo(() => settingsRepository ?? getDefaultSettingsRepository(), [settingsRepository]);
  const [currency, setCurrency] = useState<AppCurrency>(DEFAULT_CURRENCY);
  const [initialMonth, setInitialMonth] = useState<InitialMonthPreference>(DEFAULT_INITIAL_MONTH);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      void Promise.all([
        repository.getSetting(SETTINGS_KEYS.currency),
        repository.getSetting(SETTINGS_KEYS.initialMonth),
      ]).then(([savedCurrency, savedInitialMonth]) => {
        setCurrency(normalizeCurrency(savedCurrency?.value));
        setInitialMonth(normalizeInitialMonth(savedInitialMonth?.value));
      });
    }, 0);
    return () => clearTimeout(timer);
  }, [repository]);

  async function saveCurrency(next: AppCurrency) {
    const result = await repository.setSetting(SETTINGS_KEYS.currency, next);
    if (!result.ok) { setStatus(result.error.message); return; }
    setCurrency(next);
    setStatus('Moeda salva.');
  }

  async function saveInitialMonth(next: InitialMonthPreference) {
    const result = await repository.setSetting(SETTINGS_KEYS.initialMonth, next);
    if (!result.ok) { setStatus(result.error.message); return; }
    setInitialMonth(next);
    setStatus('Mês inicial salvo.');
  }

  const preview = formatCentsToCurrency(123456, currency);

  return (
    <View style={styles.stack}>
      <Card>
        <Text style={styles.title}>{APP_NAME}</Text>
        <Text style={styles.text}>{APP_TAGLINE}</Text>
      </Card>

      <Card>
        <Text style={styles.section}>Preferências</Text>
        <Text style={styles.label}>Moeda padrão: {currency}</Text>
        <Text style={styles.text}>Prévia: {preview.ok ? preview.value : 'R$ 0,00'}</Text>
        <View style={styles.row}>
          {(['BRL', 'USD', 'EUR'] as const).map((option) => <Button key={option} onPress={() => void saveCurrency(option)} disabled={currency === option}>{option}</Button>)}
        </View>
        <Text style={styles.label}>Mês inicial: {initialMonth === 'current' ? 'mês atual' : 'último mês com dados'}</Text>
        <View style={styles.row}>
          <Button onPress={() => void saveInitialMonth('current')} disabled={initialMonth === 'current'}>Mês atual</Button>
          <Button onPress={() => void saveInitialMonth('lastWithData')} disabled={initialMonth === 'lastWithData'}>Último mês com dados</Button>
        </View>
      </Card>

      <Card>
        <Text style={styles.section}>Dados locais</Text>
        <Text style={styles.text}>Seus dados ficam neste dispositivo.</Text>
        <Text style={styles.text}>Não há sincronização automática.</Text>
        <Text style={styles.text}>Faça backup manual com frequência.</Text>
        <Button onPress={() => router.push('/backup' as never)}>Backup</Button>
      </Card>

      {status ? <Text style={styles.status}>{status}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 },
  title: { color: '#0f172a', fontSize: 22, fontWeight: '900' },
  section: { color: '#0f172a', fontSize: 20, fontWeight: '900', marginBottom: 10 },
  label: { color: '#0f172a', fontSize: 16, fontWeight: '900', marginTop: 10 },
  text: { color: '#475569', fontSize: 15, fontWeight: '700', marginTop: 6 },
  status: { color: '#f8fafc', fontWeight: '900' },
});
