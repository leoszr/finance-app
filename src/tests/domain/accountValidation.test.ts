import { validateAccount } from '@/lib/validation/accountValidation';

describe('Sprint 02 account validation', () => {
  it('covers T0203: rejects empty name', () => {
    expect(validateAccount({ name: '   ' })).toEqual({
      ok: false,
      error: { code: 'account_name_required', message: 'Nome da conta é obrigatório.', field: 'name' },
    });
  });

  it('covers T0203: accepts zero initial balance and defaults BRL', () => {
    expect(validateAccount({ name: 'Conta corrente', initialBalanceCents: 0 })).toEqual({
      ok: true,
      value: { name: 'Conta corrente', type: 'checking', currency: 'BRL', initialBalanceCents: 0 },
    });
  });
});
