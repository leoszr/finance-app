import { formatMonthLabel, getMonthRange, isDateInsideMonth } from '@/lib/month';

describe('Sprint 02 monthly date helpers', () => {
  it('covers T0202: returns month start and end', () => {
    expect(getMonthRange(2026, 2)).toEqual({ ok: true, value: { start: '2026-02-01', end: '2026-02-28' } });
  });

  it('covers T0202: handles year changes', () => {
    expect(getMonthRange(2025, 12)).toEqual({ ok: true, value: { start: '2025-12-01', end: '2025-12-31' } });
    expect(getMonthRange(2026, 1)).toEqual({ ok: true, value: { start: '2026-01-01', end: '2026-01-31' } });
  });

  it('covers T0202: checks dates inside and outside month', () => {
    expect(isDateInsideMonth('2026-03-10', 2026, 3)).toEqual({ ok: true, value: true });
    expect(isDateInsideMonth('2026-04-01', 2026, 3)).toEqual({ ok: true, value: false });
  });

  it('returns controlled error for invalid month', () => {
    expect(getMonthRange(2026, 13)).toEqual({
      ok: false,
      error: { code: 'invalid_month', message: 'Mês deve estar entre 1 e 12.', field: 'month' },
    });
  });

  it('formats a month label without external timezone', () => {
    expect(formatMonthLabel(2026, 3)).toEqual({ ok: true, value: 'março de 2026' });
  });
});
