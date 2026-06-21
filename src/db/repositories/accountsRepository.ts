import { getRepositoryDatabase } from '@/db/repositories/database';
import { repoErr, repoOk, type RepositoryDatabase, type RepositoryResult } from '@/db/repositories/types';
import { validateAccount, type AccountInput } from '@/lib/validation/accountValidation';
import type { AccountType } from '@/types/finance';

export type AccountRecord = {
  id: number;
  name: string;
  type: AccountType;
  currency: string;
  initialBalanceCents: number;
  createdAt: string;
  updatedAt: string;
};

type AccountRow = {
  id: number;
  name: string;
  type: AccountType;
  currency: string;
  initial_balance_cents: number;
  created_at: string;
  updated_at: string;
};

function mapAccount(row: AccountRow): AccountRecord {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    currency: row.currency,
    initialBalanceCents: row.initial_balance_cents,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function createAccountsRepository(database: RepositoryDatabase = getRepositoryDatabase()) {
  return {
    async createAccount(input: AccountInput): Promise<RepositoryResult<AccountRecord>> {
      const valid = validateAccount(input);
      if (!valid.ok) return valid;

      const result = await database.runAsync(
        `INSERT INTO accounts (name, type, currency, initial_balance_cents) VALUES (?, ?, ?, ?)`,
        [valid.value.name, valid.value.type, valid.value.currency, valid.value.initialBalanceCents],
      );

      const account = await this.getAccountById(result.lastInsertRowId ?? 0);
      return account ? repoOk(account) : repoErr('account_create_failed', 'Conta não foi criada.');
    },

    async getAccounts(): Promise<AccountRecord[]> {
      const rows = await database.getAllAsync<AccountRow>(`SELECT * FROM accounts ORDER BY created_at ASC, id ASC`);
      return rows.map(mapAccount);
    },

    async getAccountById(id: number): Promise<AccountRecord | null> {
      const row = await database.getFirstAsync<AccountRow>(`SELECT * FROM accounts WHERE id = ?`, [id]);
      return row ? mapAccount(row) : null;
    },

    async updateAccount(id: number, input: AccountInput): Promise<RepositoryResult<AccountRecord>> {
      const valid = validateAccount(input);
      if (!valid.ok) return valid;

      await database.runAsync(
        `UPDATE accounts SET name = ?, type = ?, currency = ?, initial_balance_cents = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [valid.value.name, valid.value.type, valid.value.currency, valid.value.initialBalanceCents, id],
      );

      const account = await this.getAccountById(id);
      return account ? repoOk(account) : repoErr('account_not_found', 'Conta não encontrada.', 'id');
    },

    async deleteAccount(id: number): Promise<RepositoryResult<null>> {
      const usage = await database.getFirstAsync<{ total: number }>(`SELECT COUNT(*) AS total FROM transactions WHERE account_id = ?`, [id]);
      if ((usage?.total ?? 0) > 0) {
        return repoErr('account_in_use', 'Conta possui transações associadas.', 'id');
      }

      const result = await database.runAsync(`DELETE FROM accounts WHERE id = ?`, [id]);
      return result.changes === 0 ? repoErr('account_not_found', 'Conta não encontrada.', 'id') : repoOk(null);
    },
  };
}

