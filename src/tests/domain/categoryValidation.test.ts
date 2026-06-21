import { validateCategory } from '@/lib/validation/categoryValidation';

describe('Sprint 02 category validation', () => {
  it('covers T0204: rejects empty name', () => {
    expect(validateCategory({ name: '', type: 'expense' })).toEqual({
      ok: false,
      error: { code: 'category_name_required', message: 'Nome da categoria é obrigatório.', field: 'name' },
    });
  });

  it('covers T0204: rejects invalid type', () => {
    expect(validateCategory({ name: 'Mercado', type: 'transfer' })).toEqual({
      ok: false,
      error: { code: 'category_type_invalid', message: 'Tipo da categoria inválido.', field: 'type' },
    });
  });

  it('covers T0204: accepts optional color and icon', () => {
    expect(validateCategory({ name: 'Salário', type: 'income' })).toEqual({
      ok: true,
      value: { name: 'Salário', type: 'income', color: undefined, icon: undefined },
    });
  });
});
