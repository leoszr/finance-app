import type { AppCurrency } from '@/lib/money';

export const SETTINGS_KEYS = {
  currency: 'currency',
  initialMonth: 'initialMonth',
  appLockEnabled: 'appLockEnabled',
  glassEnabled: 'glassEnabled',
} as const;

export type InitialMonthPreference = 'current' | 'lastWithData';

export const DEFAULT_CURRENCY: AppCurrency = 'BRL';
export const DEFAULT_INITIAL_MONTH: InitialMonthPreference = 'current';
export const DEFAULT_GLASS_ENABLED = true;

export function normalizeCurrency(value: string | null | undefined): AppCurrency {
  return value === 'USD' || value === 'EUR' ? value : DEFAULT_CURRENCY;
}

export function normalizeInitialMonth(value: string | null | undefined): InitialMonthPreference {
  return value === 'lastWithData' ? value : DEFAULT_INITIAL_MONTH;
}

export function normalizeBooleanSetting(value: string | null | undefined): boolean {
  return value === 'true';
}

export function normalizeGlassSetting(value: string | null | undefined): boolean {
  return value == null ? DEFAULT_GLASS_ENABLED : normalizeBooleanSetting(value);
}
