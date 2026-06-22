import type { AppCurrency } from '@/lib/money';

export const SETTINGS_KEYS = {
  currency: 'currency',
  initialMonth: 'initialMonth',
} as const;

export type InitialMonthPreference = 'current' | 'lastWithData';

export const DEFAULT_CURRENCY: AppCurrency = 'BRL';
export const DEFAULT_INITIAL_MONTH: InitialMonthPreference = 'current';

export function normalizeCurrency(value: string | null | undefined): AppCurrency {
  return value === 'USD' || value === 'EUR' ? value : DEFAULT_CURRENCY;
}

export function normalizeInitialMonth(value: string | null | undefined): InitialMonthPreference {
  return value === 'lastWithData' ? value : DEFAULT_INITIAL_MONTH;
}
