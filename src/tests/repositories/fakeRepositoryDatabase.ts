import type { RepositoryDatabase, SqlParams, SqlRunResult } from '@/db/repositories/types';

type Table = Record<string, unknown>;

const now = '2026-06-21 00:00:00';

function sortTransactions(rows: Table[]) {
  return [...rows].sort((left, right) => {
    const leftDate = String(left.transaction_date);
    const rightDate = String(right.transaction_date);
    if (leftDate !== rightDate) return rightDate.localeCompare(leftDate);
    return Number(right.id) - Number(left.id);
  });
}

export function createFakeRepositoryDatabase(): RepositoryDatabase {
  const tables: Record<string, Table[]> = {
    accounts: [],
    categories: [],
    transactions: [],
    settings: [],
  };
  const ids = { accounts: 0, categories: 0, transactions: 0, settings: 0 };

  function countTransactions(column: string, value: unknown) {
    return tables.transactions.filter((row) => row[column] === value).length;
  }

  return {
    async getAllAsync<T>(source: string, params: SqlParams = []): Promise<T[]> {
      if (source.includes('FROM accounts')) return [...tables.accounts] as T[];
      if (source.includes('FROM categories WHERE type = ?')) return tables.categories.filter((row) => row.type === params[0]) as T[];
      if (source.includes('FROM categories')) return [...tables.categories] as T[];
      if (source.includes('FROM transactions WHERE transaction_date')) {
        return sortTransactions(tables.transactions.filter((row) => String(row.transaction_date) >= String(params[0]) && String(row.transaction_date) <= String(params[1]))) as T[];
      }
      if (source.includes('FROM transactions')) return sortTransactions(tables.transactions) as T[];
      return [];
    },

    async getFirstAsync<T>(source: string, params: SqlParams = []): Promise<T | null> {
      if (source.includes('COUNT(*)') && source.includes('account_id')) return { total: countTransactions('account_id', params[0]) } as T;
      if (source.includes('COUNT(*)') && source.includes('category_id')) return { total: countTransactions('category_id', params[0]) } as T;
      if (source.includes('FROM accounts')) return (tables.accounts.find((row) => row.id === params[0]) as T) ?? null;
      if (source.includes('FROM categories')) return (tables.categories.find((row) => row.id === params[0]) as T) ?? null;
      if (source.includes('FROM transactions') && source.includes('ORDER BY transaction_date')) return (sortTransactions(tables.transactions)[0] as T) ?? null;
      if (source.includes('FROM transactions')) return (tables.transactions.find((row) => row.id === params[0]) as T) ?? null;
      if (source.includes('FROM settings')) return (tables.settings.find((row) => row.key === params[0]) as T) ?? null;
      return null;
    },

    async runAsync(source: string, params: SqlParams = []): Promise<SqlRunResult> {
      if (source.startsWith('INSERT INTO accounts')) {
        const id = ++ids.accounts;
        tables.accounts.push({ id, name: params[0], type: params[1], currency: params[2], initial_balance_cents: params[3], created_at: now, updated_at: now });
        return { lastInsertRowId: id, changes: 1 };
      }
      if (source.startsWith('UPDATE accounts')) {
        const row = tables.accounts.find((item) => item.id === params[4]);
        if (row) Object.assign(row, { name: params[0], type: params[1], currency: params[2], initial_balance_cents: params[3], updated_at: now });
        return { changes: row ? 1 : 0 };
      }
      if (source.startsWith('DELETE FROM accounts')) {
        const before = tables.accounts.length;
        tables.accounts = tables.accounts.filter((row) => row.id !== params[0]);
        return { changes: before - tables.accounts.length };
      }
      if (source.startsWith('INSERT INTO categories')) {
        const id = ++ids.categories;
        tables.categories.push({ id, name: params[0], type: params[1], color: params[2], icon: params[3], created_at: now, updated_at: now });
        return { lastInsertRowId: id, changes: 1 };
      }
      if (source.startsWith('UPDATE categories')) {
        const row = tables.categories.find((item) => item.id === params[4]);
        if (row) Object.assign(row, { name: params[0], type: params[1], color: params[2], icon: params[3], updated_at: now });
        return { changes: row ? 1 : 0 };
      }
      if (source.startsWith('DELETE FROM categories')) {
        const before = tables.categories.length;
        tables.categories = tables.categories.filter((row) => row.id !== params[0]);
        return { changes: before - tables.categories.length };
      }
      if (source.startsWith('INSERT INTO transactions')) {
        const id = ++ids.transactions;
        tables.transactions.push({ id, account_id: params[0], category_id: params[1], type: params[2], amount_cents: params[3], description: params[4], transaction_date: params[5], created_at: now, updated_at: now });
        return { lastInsertRowId: id, changes: 1 };
      }
      if (source.startsWith('UPDATE transactions')) {
        const row = tables.transactions.find((item) => item.id === params[6]);
        if (row) Object.assign(row, { account_id: params[0], category_id: params[1], type: params[2], amount_cents: params[3], description: params[4], transaction_date: params[5], updated_at: now });
        return { changes: row ? 1 : 0 };
      }
      if (source.startsWith('DELETE FROM transactions')) {
        const before = tables.transactions.length;
        tables.transactions = tables.transactions.filter((row) => row.id !== params[0]);
        return { changes: before - tables.transactions.length };
      }
      if (source.startsWith('INSERT INTO settings')) {
        const existing = tables.settings.find((row) => row.key === params[0]);
        if (existing) existing.value = params[1];
        else tables.settings.push({ id: ++ids.settings, key: params[0], value: params[1], created_at: now, updated_at: now });
        return { changes: 1 };
      }
      if (source.startsWith('DELETE FROM settings')) {
        tables.settings = tables.settings.filter((row) => row.key !== params[0]);
        return { changes: 1 };
      }
      return { changes: 0 };
    },
  };
}
