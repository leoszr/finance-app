import { validateTransaction } from '@/lib/validation/transactionValidation';

describe('Sprint 02 transaction validation', () => {
  it('covers T0205: rejects zero amount', () => {
    expect(
      validateTransaction({ accountId: 1, categoryId: 1, type: 'expense', amountCents: 0, transactionDate: '2026-06-20' }),
    ).toEqual({
      ok: false,
      error: { code: 'transaction_amount_invalid', message: 'Valor deve ser maior que zero em centavos.', field: 'amountCents' },
    });
  });

  it('covers T0205: requires valid positive integer account category and date', () => {
    expect(validateTransaction({ categoryId: 1, type: 'expense', amountCents: 100, transactionDate: '2026-06-20' }).ok).toBe(false);
    expect(validateTransaction({ accountId: 1, type: 'expense', amountCents: 100, transactionDate: '2026-06-20' }).ok).toBe(false);
    expect(validateTransaction({ accountId: 1, categoryId: 1, type: 'expense', amountCents: 100 }).ok).toBe(false);
    expect(validateTransaction({ accountId: -1, categoryId: 1, type: 'expense', amountCents: 100, transactionDate: '2026-06-20' }).ok).toBe(false);
    expect(validateTransaction({ accountId: 1.5, categoryId: 1, type: 'expense', amountCents: 100, transactionDate: '2026-06-20' }).ok).toBe(false);
  });

  it('rejects invalid transaction dates', () => {
    expect(validateTransaction({ accountId: 1, categoryId: 1, type: 'expense', amountCents: 100, transactionDate: 'foo' })).toEqual({
      ok: false,
      error: { code: 'transaction_date_invalid', message: 'Data deve ser válida no formato YYYY-MM-DD.', field: 'transactionDate' },
    });
    expect(validateTransaction({ accountId: 1, categoryId: 1, type: 'expense', amountCents: 100, transactionDate: '2026-99-99' }).ok).toBe(false);
  });

  it('covers sprint integration: validates a complete transaction', () => {
    expect(
      validateTransaction({
        accountId: 1,
        categoryId: 2,
        type: 'expense',
        amountCents: 2590,
        transactionDate: '2026-06-20',
        description: 'Mercado',
      }),
    ).toEqual({
      ok: true,
      value: {
        accountId: 1,
        categoryId: 2,
        type: 'expense',
        amountCents: 2590,
        transactionDate: '2026-06-20',
        description: 'Mercado',
      },
    });
  });
});
