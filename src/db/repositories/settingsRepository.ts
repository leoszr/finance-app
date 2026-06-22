import { getRepositoryDatabase } from '@/db/repositories/database';
import { repoOk, type RepositoryDatabase, type RepositoryResult } from '@/db/repositories/types';

export type SettingRecord = {
  key: string;
  value: string;
};

type SettingRow = {
  key: string;
  value: string;
};

export function createSettingsRepository(database: RepositoryDatabase = getRepositoryDatabase()) {
  return {
    async getSettings(): Promise<SettingRecord[]> {
      const rows = await database.getAllAsync<SettingRow>(`SELECT key, value FROM settings ORDER BY key ASC`);
      return rows.map((row) => ({ key: row.key, value: row.value }));
    },

    async getSetting(key: string): Promise<SettingRecord | null> {
      const normalizedKey = key.trim();
      if (!normalizedKey) return null;

      const row = await database.getFirstAsync<SettingRow>(`SELECT key, value FROM settings WHERE key = ?`, [normalizedKey]);
      return row ? { key: row.key, value: row.value } : null;
    },

    async setSetting(key: string, value: string): Promise<RepositoryResult<SettingRecord>> {
      const normalizedKey = key.trim();
      if (!normalizedKey) {
        return { ok: false, error: { code: 'setting_key_required', message: 'Chave da configuração é obrigatória.', field: 'key' } };
      }

      await database.runAsync(
        `INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`,
        [normalizedKey, value],
      );

      return repoOk({ key: normalizedKey, value });
    },

    async deleteSetting(key: string): Promise<RepositoryResult<null>> {
      const normalizedKey = key.trim();
      await database.runAsync(`DELETE FROM settings WHERE key = ?`, [normalizedKey]);
      return repoOk(null);
    },
  };
}
