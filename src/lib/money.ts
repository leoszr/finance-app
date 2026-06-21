import { err, ok, type Result } from '@/lib/result';

const currencyInputPattern = /^\s*(?:R\$\s*)?(?:(?:\d{1,3}(?:\.\d{3})+)|\d+)(?:,\d{2})?\s*$/;

export function parseCurrencyToCents(input: string): Result<number> {
  if (!currencyInputPattern.test(input)) {
    return err('invalid_currency', 'Valor monetário inválido.', 'amount');
  }

  const normalized = input.replace(/\s/g, '').replace(/^R\$/, '').replace(/\./g, '').replace(',', '.');
  const value = Number(normalized);
  const cents = Math.round(value * 100);

  if (!Number.isFinite(value) || value < 0 || !Number.isSafeInteger(cents)) {
    return err('invalid_currency', 'Valor monetário inválido.', 'amount');
  }

  return ok(cents);
}

export function formatCentsToCurrency(cents: number): Result<string> {
  if (!Number.isInteger(cents) || !Number.isSafeInteger(cents) || cents < 0) {
    return err('invalid_cents', 'Centavos devem ser um inteiro seguro maior ou igual a zero.', 'amountCents');
  }

  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
    .format(cents / 100)
    .replace(/\u00a0/g, ' ');

  return ok(formatted);
}
