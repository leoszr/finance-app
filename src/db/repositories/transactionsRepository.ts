import { getRepositoryDatabase } from '@/db/repositories/database';
import { notifyFinanceDataChanged } from '@/lib/dataEvents';
import { repoErr, repoOk, type RepositoryDatabase, type RepositoryResult } from '@/db/repositories/types';
import { getMonthRange } from '@/lib/month';
import { validateTransaction, type TransactionInput } from '@/lib/validation/transactionValidation';
import type { TransactionType } from '@/types/finance';

export type TransactionRecord = {
  id: number;
  accountId: number;
  categoryId: number;
  type: TransactionType;
  amountCents: number;
  description: string | null;
  transactionDate: string;
  createdAt: string;
  updatedAt: string;
};

type TransactionRow = {
  id: number;
  account_id: number;
  category_id: number;
  type: TransactionType;
  amount_cents: number;
  description: string | null;
  transaction_date: string;
  created_at: string;
  updated_at: string;
};

function mapTransaction(row: TransactionRow): TransactionRecord {
  return {
    id: row.id,
    accountId: row.account_id,
    categoryId: row.category_id,
    type: row.type,
    amountCents: row.amount_cents,
    description: row.description,
    transactionDate: row.transaction_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function validateLinks(database: RepositoryDatabase, accountId: number, categoryId: number, type: TransactionType): Promise<RepositoryResult<null>> {
  const account = await database.getFirstAsync<{ id: number }>(`SELECT id FROM accounts WHERE id = ?`, [accountId]);
  if (!account) {
    return repoErr('transaction_account_not_found', 'Conta da transação não encontrada.', 'accountId');
  }

  const category = await database.getFirstAsync<{ id: number; type: TransactionType }>(`SELECT id, type FROM categories WHERE id = ?`, [categoryId]);
  if (!category) {
    return repoErr('transaction_category_not_found', 'Categoria da transação não encontrada.', 'categoryId');
  }

  if (category.type !== type) {
    return repoErr('transaction_category_type_mismatch', 'Tipo da categoria não corresponde ao tipo da transação.', 'categoryId');
  }

  return repoOk(null);
}

export function createTransactionsRepository(database: RepositoryDatabase = getRepositoryDatabase()) {
  async function getTransactionById(id: number): Promise<TransactionRecord | null> {
    const row = await database.getFirstAsync<TransactionRow>(`SELECT * FROM transactions WHERE id = ?`, [id]);
    return row ? mapTransaction(row) : null;
  }

  async function createTransaction(input: TransactionInput): Promise<RepositoryResult<TransactionRecord>> {
    const valid = validateTransaction(input);
    if (!valid.ok) return valid;

    const links = await validateLinks(database, valid.value.accountId, valid.value.categoryId, valid.value.type);
    if (!links.ok) return links;

    const result = await database.runAsync(
      `INSERT INTO transactions (account_id, category_id, type, amount_cents, description, transaction_date) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        valid.value.accountId,
        valid.value.categoryId,
        valid.value.type,
        valid.value.amountCents,
        valid.value.description ?? null,
        valid.value.transactionDate,
      ],
    );

    const transaction = await getTransactionById(result.lastInsertRowId ?? 0);
    if (transaction) notifyFinanceDataChanged();
    return transaction ? repoOk(transaction) : repoErr('transaction_create_failed', 'Transação não foi criada.');
  }

  async function getTransactions(): Promise<TransactionRecord[]> {
    const rows = await database.getAllAsync<TransactionRow>(`SELECT * FROM transactions ORDER BY transaction_date DESC, id DESC`);
    return rows.map(mapTransaction);
  }

  async function getTransactionsByMonth(year: number, month: number): Promise<RepositoryResult<TransactionRecord[]>> {
    const range = getMonthRange(year, month);
    if (!range.ok) return range;

    const rows = await database.getAllAsync<TransactionRow>(
      `SELECT * FROM transactions WHERE transaction_date >= ? AND transaction_date <= ? ORDER BY transaction_date DESC, id DESC`,
      [range.value.start, range.value.end],
    );
    return repoOk(rows.map(mapTransaction));
  }

  async function updateTransaction(id: number, input: TransactionInput): Promise<RepositoryResult<TransactionRecord>> {
    const valid = validateTransaction(input);
    if (!valid.ok) return valid;

    const links = await validateLinks(database, valid.value.accountId, valid.value.categoryId, valid.value.type);
    if (!links.ok) return links;

    await database.runAsync(
      `UPDATE transactions SET account_id = ?, category_id = ?, type = ?, amount_cents = ?, description = ?, transaction_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [
        valid.value.accountId,
        valid.value.categoryId,
        valid.value.type,
        valid.value.amountCents,
        valid.value.description ?? null,
        valid.value.transactionDate,
        id,
      ],
    );

    const transaction = await getTransactionById(id);
    if (transaction) notifyFinanceDataChanged();
    return transaction ? repoOk(transaction) : repoErr('transaction_not_found', 'Transação não encontrada.', 'id');
  }

  async function deleteTransaction(id: number): Promise<RepositoryResult<null>> {
    const result = await database.runAsync(`DELETE FROM transactions WHERE id = ?`, [id]);
    if ((result.changes ?? 0) > 0) notifyFinanceDataChanged();
    return result.changes === 0 ? repoErr('transaction_not_found', 'Transação não encontrada.', 'id') : repoOk(null);
  }

  return {
    createTransaction,
    getTransactions,
    getTransactionsByMonth,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
  };
}
