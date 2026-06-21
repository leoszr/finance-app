import { err, ok, type Result } from '@/lib/result';
import { transactionTypes, type TransactionType } from '@/types/finance';

export type TransactionInput = {
  accountId?: number | null;
  categoryId?: number | null;
  type?: TransactionType | string | null;
  amountCents?: number | null;
  transactionDate?: string | null;
  description?: string | null;
};

export type ValidTransaction = {
  accountId: number;
  categoryId: number;
  type: TransactionType;
  amountCents: number;
  transactionDate: string;
  description?: string;
};

function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0;
}

function isValidIsoDate(date: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) {
    return false;
  }

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

export function validateTransaction(input: TransactionInput): Result<ValidTransaction> {
  if (!isPositiveInteger(input.accountId)) {
    return err('transaction_account_required', 'Conta válida é obrigatória.', 'accountId');
  }

  if (!isPositiveInteger(input.categoryId)) {
    return err('transaction_category_required', 'Categoria válida é obrigatória.', 'categoryId');
  }

  if (!input.type || !transactionTypes.includes(input.type as TransactionType)) {
    return err('transaction_type_invalid', 'Tipo da transação inválido.', 'type');
  }

  if (!input.amountCents || !Number.isInteger(input.amountCents) || !Number.isSafeInteger(input.amountCents) || input.amountCents <= 0) {
    return err('transaction_amount_invalid', 'Valor deve ser maior que zero em centavos.', 'amountCents');
  }

  const transactionDate = input.transactionDate?.trim() ?? '';
  if (!transactionDate) {
    return err('transaction_date_required', 'Data é obrigatória.', 'transactionDate');
  }

  if (!isValidIsoDate(transactionDate)) {
    return err('transaction_date_invalid', 'Data deve ser válida no formato YYYY-MM-DD.', 'transactionDate');
  }

  return ok({
    accountId: input.accountId,
    categoryId: input.categoryId,
    type: input.type as TransactionType,
    amountCents: input.amountCents,
    transactionDate,
    description: input.description?.trim() || undefined,
  });
}
