import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { BackupScreen } from '@/features/backup/BackupScreen';
import { exportBackupFile, pickBackupJson } from '@/lib/backup/backupFile';
import { importBackup, validateBackup } from '@/lib/backup/importBackup';

jest.mock('@/lib/backup/backupFile', () => ({ exportBackupFile: jest.fn(), pickBackupJson: jest.fn() }));
jest.mock('@/lib/backup/importBackup', () => {
  const actual = jest.requireActual('@/lib/backup/importBackup');
  return { ...actual, importBackup: jest.fn(async () => ({ ok: true })) };
});

const backup = {
  schemaVersion: 1,
  accounts: [{ id: 1, name: 'Carteira', type: 'cash', currency: 'BRL', initialBalanceCents: 0, createdAt: 'x', updatedAt: 'x' }],
  categories: [{ id: 1, name: 'Salário', type: 'income', createdAt: 'x', updatedAt: 'x' }],
  transactions: [{ id: 1, accountId: 1, categoryId: 1, type: 'income', amountCents: 1, transactionDate: 'x', createdAt: 'x', updatedAt: 'x' }],
  settings: [{ key: 'currency', value: 'BRL' }],
};

describe('Sprint 11 backup', () => {
  beforeEach(() => jest.clearAllMocks());

  it('exports and shares json with dated filename', async () => {
    (exportBackupFile as jest.Mock).mockResolvedValue({ ok: true, value: { filename: 'backup-2026-06-21.json', uri: 'file://backup.json' } });
    const { getByText } = await render(<BackupScreen />);
    expect(getByText('Backup manual local. Nenhuma conta online ou sincronização externa.')).toBeTruthy();
    await act(async () => { fireEvent.press(getByText('Exportar e compartilhar JSON')); });
    await waitFor(() => expect(getByText('Backup pronto: backup-2026-06-21.json')).toBeTruthy());
  });

  it('validates backup shape before import', () => {
    expect(validateBackup(backup).ok).toBe(true);
    expect(validateBackup({ ...backup, schemaVersion: 99 })).toEqual({ ok: false, error: 'backup_schema_invalid' });
    expect(validateBackup({ ...backup, accounts: [{ id: 'wrong' }] })).toEqual({ ok: false, error: 'backup_accounts_invalid' });
  });

  it('asks confirmation before replacing local data', async () => {
    jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => buttons?.[1]?.onPress?.());
    (pickBackupJson as jest.Mock).mockResolvedValue(JSON.stringify(backup));

    const { getByText } = await render(<BackupScreen />);
    await act(async () => { fireEvent.press(getByText('Importar JSON')); });

    await waitFor(() => expect(importBackup).toHaveBeenCalledWith(backup));
    expect(Alert.alert).toHaveBeenCalledWith('Restaurar backup', 'Isso substitui todos os dados locais.', expect.any(Array));
  });
});
