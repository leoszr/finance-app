import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { BackupScreen } from '@/features/backup/BackupScreen';
import { exportBackup } from '@/lib/backup/exportBackup';

jest.mock('@/lib/backup/exportBackup', () => ({ exportBackup: jest.fn() }));
jest.mock('@/lib/backup/importBackup', () => ({ importBackup: jest.fn(async () => ({ ok: true })) }));

describe('Sprint 11 backup', () => {
  it('exports json with schema version', async () => {
    const backup = { schemaVersion: 1, accounts: [{}], categories: [{}], transactions: [], settings: [] };
    (exportBackup as jest.Mock).mockResolvedValue(backup);
    const { getByText, getByDisplayValue } = await render(<BackupScreen />);
    fireEvent.press(getByText('Exportar JSON'));
    await waitFor(() => expect(getByDisplayValue(JSON.stringify(backup, null, 2))).toBeTruthy());
  });
});
