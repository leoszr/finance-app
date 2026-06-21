import { err, ok, type Result } from '@/lib/result';
import { accountTypes, type AccountType } from '@/types/finance';

export type AccountInput = {
  name?: string | null;
  type?: AccountType | string | null;
  currency?: string | null;
  initialBalanceCents?: number | null;
};

export type ValidAccount = {
  name: string;
  type: AccountType;
  currency: string;
  initialBalanceCents: number;
};

export function validateAccount(input: AccountInput): Result<ValidAccount> {
  const name = input.name?.trim() ?? '';
  if (!name) {
    return err('account_name_required', 'Nome da conta é obrigatório.', 'name');
  }

  const type = input.type ?? 'checking';
  if (!accountTypes.includes(type as AccountType)) {
    return err('account_type_invalid', 'Tipo de conta inválido.', 'type');
  }

  const initialBalanceCents = input.initialBalanceCents ?? 0;
  if (!Number.isInteger(initialBalanceCents) || !Number.isSafeInteger(initialBalanceCents)) {
    return err('account_initial_balance_invalid', 'Saldo inicial deve ser inteiro seguro em centavos.', 'initialBalanceCents');
  }

  return ok({
    name,
    type: type as AccountType,
    currency: input.currency?.trim() || 'BRL',
    initialBalanceCents,
  });
}
