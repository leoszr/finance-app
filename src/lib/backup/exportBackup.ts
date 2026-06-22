import { createAccountsRepository } from '@/db/repositories/accountsRepository';
import { createCategoriesRepository } from '@/db/repositories/categoriesRepository';
import { createSettingsRepository } from '@/db/repositories/settingsRepository';
import { createTransactionsRepository } from '@/db/repositories/transactionsRepository';
import { BACKUP_SCHEMA_VERSION, type BackupData } from './backupSchema';

export async function exportBackup(): Promise<BackupData> {
  const accountsRepository = createAccountsRepository();
  const categoriesRepository = createCategoriesRepository();
  const transactionsRepository = createTransactionsRepository();
  const settingsRepository = createSettingsRepository();

  return {
    schemaVersion: BACKUP_SCHEMA_VERSION,
    accounts: await accountsRepository.getAccounts(),
    categories: await categoriesRepository.getCategories(),
    transactions: await transactionsRepository.getTransactions(),
    settings: await settingsRepository.getSettings(),
  };
}
