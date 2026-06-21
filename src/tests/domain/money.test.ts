import { formatCentsToCurrency, parseCurrencyToCents } from '@/lib/money';

describe('Sprint 02 money helpers', () => {
  it('covers T0201: parses BRL text to cents', () => {
    expect(parseCurrencyToCents('25,90')).toEqual({ ok: true, value: 2590 });
    expect(parseCurrencyToCents('1.200,00')).toEqual({ ok: true, value: 120000 });
  });

  it('covers T0201: formats cents to BRL currency', () => {
    expect(formatCentsToCurrency(2590)).toEqual({ ok: true, value: 'R$ 25,90' });
  });

  it('returns controlled error for invalid money values', () => {
    expect(parseCurrencyToCents('abc')).toEqual({
      ok: false,
      error: { code: 'invalid_currency', message: 'Valor monetário inválido.', field: 'amount' },
    });
  });

  it('rejects unsafe cent values', () => {
    expect(formatCentsToCurrency(Number.MAX_SAFE_INTEGER + 1)).toEqual({
      ok: false,
      error: {
        code: 'invalid_cents',
        message: 'Centavos devem ser um inteiro seguro maior ou igual a zero.',
        field: 'amountCents',
      },
    });
  });
});
