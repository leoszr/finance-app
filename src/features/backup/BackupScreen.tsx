import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Button, Card, ScreenHeader } from '@/components/ui';
import { exportBackupFile, pickBackupJson } from '@/lib/backup/backupFile';
import { importBackup } from '@/lib/backup/importBackup';

export function BackupScreen() {
  const [status, setStatus] = useState('');

  async function onExport() {
    const result = await exportBackupFile();
    setStatus(result.ok ? `Backup pronto: ${result.value.filename}` : result.error.message);
  }

  async function restoreFromJson(source: string) {
    try {
      const parsed = JSON.parse(source);
      const result = await importBackup(parsed);
      setStatus(result.ok ? 'Backup restaurado.' : 'Backup inválido.');
    } catch {
      Alert.alert('Erro', 'JSON inválido.');
    }
  }

  async function onPickFile() {
    try {
      const text = await pickBackupJson();
      if (!text) return;
      Alert.alert('Restaurar backup', 'Isso substitui todos os dados locais.', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Restaurar', style: 'destructive', onPress: () => void restoreFromJson(text) },
      ]);
    } catch {
      setStatus('Não foi possível abrir o arquivo.');
    }
  }

  return (
    <Screen testID="backup-screen">
      <Button onPress={() => router.replace('/settings' as never)}>Voltar às Configurações</Button>
      <ScreenHeader title="Backup" subtitle="Backup manual local. Nenhuma conta online ou sincronização externa." />
      <Card>
        <View style={styles.actions}>
          <Button onPress={onExport}>Exportar e compartilhar JSON</Button>
          <Button onPress={onPickFile}>Importar JSON</Button>
        </View>
        {status ? <Text style={styles.status}>{status}</Text> : null}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: { gap: 10 },
  status: { marginTop: 12, color: '#334155', fontWeight: '900' },
});
