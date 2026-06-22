import { useState } from 'react';
import { Alert, Button as RNButton, Text } from 'react-native';

import { Screen } from '@/components/Screen';
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

  return <Screen testID="backup-screen"><Text accessibilityRole="header" style={{ color: '#f8fafc', fontSize: 30, fontWeight: '900', marginBottom: 18 }}>Backup</Text><Text style={{ color: '#cbd5e1', marginBottom: 12 }}>Backup manual local. Nenhuma conta online ou sincronização externa.</Text><RNButton title="Exportar e compartilhar JSON" onPress={onExport} /><RNButton title="Importar JSON" onPress={onPickFile} /><Text style={{ color: '#cbd5e1', marginTop: 12 }}>{status}</Text></Screen>;
}
