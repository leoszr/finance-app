import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { err, ok, type Result } from '@/lib/result';
import { exportBackup } from './exportBackup';

export type BackupFileResult = { uri: string; filename: string };

export async function exportBackupFile(): Promise<Result<BackupFileResult>> {
  try {
    const filename = `backup-${new Date().toISOString().slice(0, 10)}.json`;
    const file = new File(Paths.cache, filename);
    file.create({ overwrite: true });
    file.write(JSON.stringify(await exportBackup(), null, 2));

    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) return ok({ uri: file.uri, filename });

    try {
      await Sharing.shareAsync(file.uri, { mimeType: 'application/json', dialogTitle: 'Compartilhar backup financeiro' });
      return ok({ uri: file.uri, filename });
    } catch {
      return ok({ uri: file.uri, filename });
    }
  } catch {
    return err('backup_export_failed', 'Não foi possível gerar o backup.');
  }
}

export async function pickBackupJson() {
  const picked = await File.pickFileAsync({ mimeTypes: 'application/json' });
  if (picked.canceled) return null;
  return picked.result.text();
}
