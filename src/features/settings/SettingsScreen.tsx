import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { Button, Card } from '@/components/ui';
import { createSettingsRepository } from '@/db/repositories/settingsRepository';
import { APP_NAME, APP_TAGLINE } from '@/lib/appInfo';
import { clearDemoData, seedDemoData } from '@/lib/demoData';
import { localAuth as defaultLocalAuth, type BiometricAvailability, type LocalAuth } from '@/lib/localAuth';
import { formatCentsToCurrency, type AppCurrency } from '@/lib/money';
import { DEFAULT_CURRENCY, DEFAULT_INITIAL_MONTH, normalizeBooleanSetting, normalizeCurrency, normalizeInitialMonth, SETTINGS_KEYS, type InitialMonthPreference } from '@/lib/settings/preferences';
import { notifySettingsChanged } from '@/lib/settings/settingsEvents';

type SettingsRepository = ReturnType<typeof createSettingsRepository>;

let defaultSettingsRepository: SettingsRepository | undefined;

function getDefaultSettingsRepository() {
  defaultSettingsRepository ??= createSettingsRepository();
  return defaultSettingsRepository;
}

export function SettingsScreen({ localAuth = defaultLocalAuth, settingsRepository }: { localAuth?: LocalAuth; settingsRepository?: SettingsRepository }) {
  const repository = useMemo(() => settingsRepository ?? getDefaultSettingsRepository(), [settingsRepository]);
  const [currency, setCurrency] = useState<AppCurrency>(DEFAULT_CURRENCY);
  const [initialMonth, setInitialMonth] = useState<InitialMonthPreference>(DEFAULT_INITIAL_MONTH);
  const [appLockEnabled, setAppLockEnabled] = useState(false);
  const [biometrics, setBiometrics] = useState<BiometricAvailability>({ available: false, labels: [] });
  const [status, setStatus] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      void Promise.all([
        repository.getSetting(SETTINGS_KEYS.currency),
        repository.getSetting(SETTINGS_KEYS.initialMonth),
        repository.getSetting(SETTINGS_KEYS.appLockEnabled),
      ]).then(([savedCurrency, savedInitialMonth, savedAppLock]) => {
        setCurrency(normalizeCurrency(savedCurrency?.value));
        setInitialMonth(normalizeInitialMonth(savedInitialMonth?.value));
        setAppLockEnabled(normalizeBooleanSetting(savedAppLock?.value));
      });
      void localAuth.getBiometricAvailability()
        .then(setBiometrics)
        .catch(() => setBiometrics({ available: false, labels: [], reason: 'Biometria indisponível neste aparelho.' }));
    }, 0);
    return () => clearTimeout(timer);
  }, [localAuth, repository]);

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

  async function saveAppLock(next: boolean) {
    if (next && !biometrics.available) {
      setStatus(biometrics.reason ?? 'Biometria indisponível neste aparelho.');
      return;
    }
    const result = await repository.setSetting(SETTINGS_KEYS.appLockEnabled, String(next));
    if (!result.ok) { setStatus(result.error.message); return; }
    setAppLockEnabled(next);
    notifySettingsChanged();
    setStatus(next ? 'Bloqueio local ativado.' : 'Bloqueio local desativado.');
  }

  async function loadDemoData() {
    const result = await seedDemoData();
    setStatus(result.ok ? 'Dados de demonstração criados.' : result.error.message);
  }

  async function deleteDemoData() {
    const result = await clearDemoData();
    setStatus(result.ok ? 'Dados de demonstração apagados.' : result.error.message);
  }

  function confirmDeleteDemoData() {
    if (Alert.alert) {
      Alert.alert('Apagar demonstração', 'Remover somente os dados de demonstração criados pelo app?', [
        { text: 'Cancelar' },
        { text: 'Apagar', style: 'destructive', onPress: () => void deleteDemoData() },
      ]);
      return;
    }
    void deleteDemoData();
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

      <Card>
        <Text style={styles.section}>Demonstração</Text>
        <Text style={styles.text}>Crie dados locais marcados com [Demo] para testar telas e relatórios.</Text>
        <View style={styles.row}>
          <Button onPress={() => void loadDemoData()} testID="seed-demo-data-button">Criar demo</Button>
          <Button onPress={confirmDeleteDemoData} testID="clear-demo-data-button">Apagar demo</Button>
        </View>
      </Card>

      <Card>
        <Text style={styles.section}>Segurança local</Text>
        <Text style={styles.label}>Bloqueio do app: {appLockEnabled ? 'ativado' : 'desativado'}</Text>
        <Text style={styles.text}>
          {biometrics.available
            ? `Biometria disponível${biometrics.labels.length ? `: ${biometrics.labels.join(', ')}` : '.'}`
            : (biometrics.reason ?? 'Biometria indisponível neste aparelho.')}
        </Text>
        <View style={styles.row}>
          <Button onPress={() => void saveAppLock(true)} disabled={appLockEnabled || !biometrics.available}>Ativar bloqueio</Button>
          <Button onPress={() => void saveAppLock(false)} disabled={!appLockEnabled}>Desativar bloqueio</Button>
        </View>
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
