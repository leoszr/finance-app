export const BACKUP_SCHEMA_VERSION = 1 as const;

export type BackupData = {
  schemaVersion: number;
  accounts: Record<string, unknown>[];
  categories: Record<string, unknown>[];
  transactions: Record<string, unknown>[];
  settings: Record<string, unknown>[];
};
