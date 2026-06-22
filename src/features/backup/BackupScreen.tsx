import { useMemo, useState } from 'react';
import { Alert, Button as RNButton, Text, TextInput } from 'react-native';

import { Screen } from '@/components/Screen';
import { exportBackup } from '@/lib/backup/exportBackup';
import { importBackup } from '@/lib/backup/importBackup';

export function BackupScreen() {
  const [json, setJson] = useState('');
  const [status, setStatus] = useState('');
  const filename = useMemo(() => `backup-${new Date().toISOString().slice(0, 10)}.json`, []);

  async function onExport() {
    const data = await exportBackup();
    setJson(JSON.stringify(data, null, 2));
    setStatus(`Backup pronto: ${filename}`);
  }

  async function onImport() {
    try {
      const parsed = JSON.parse(json);
      const result = await importBackup(parsed);
      setStatus(result.ok ? 'Backup restaurado.' : 'Backup inválido.');
    } catch {
      Alert.alert('Erro', 'JSON inválido.');
    }
  }

  return <Screen testID="backup-screen"><Text accessibilityRole="header" style={{ color: '#f8fafc', fontSize: 30, fontWeight: '900', marginBottom: 18 }}>Backup</Text><RNButton title="Exportar JSON" onPress={onExport} /><RNButton title="Importar JSON" onPress={onImport} /><TextInput value={json} onChangeText={setJson} multiline placeholder="Cole o backup JSON" placeholderTextColor="#64748b" style={{ minHeight: 160, backgroundColor: '#111827', color: '#f8fafc', marginTop: 12, borderRadius: 12, padding: 12 }} /><Text style={{ color: '#cbd5e1', marginTop: 12 }}>{status}</Text></Screen>;
}
