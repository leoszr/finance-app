import { err, ok, type Result } from '@/lib/result';
import { transactionTypes, type TransactionType } from '@/types/finance';

export type CategoryInput = {
  name?: string | null;
  type?: TransactionType | string | null;
  color?: string | null;
  icon?: string | null;
};

export type ValidCategory = {
  name: string;
  type: TransactionType;
  color?: string;
  icon?: string;
};

export function validateCategory(input: CategoryInput): Result<ValidCategory> {
  const name = input.name?.trim() ?? '';
  if (!name) {
    return err('category_name_required', 'Nome da categoria é obrigatório.', 'name');
  }

  if (!input.type) {
    return err('category_type_required', 'Tipo da categoria é obrigatório.', 'type');
  }

  if (!transactionTypes.includes(input.type as TransactionType)) {
    return err('category_type_invalid', 'Tipo da categoria inválido.', 'type');
  }

  return ok({
    name,
    type: input.type as TransactionType,
    color: input.color?.trim() || undefined,
    icon: input.icon?.trim() || undefined,
  });
}
