import { err, ok, type Result } from '@/lib/result';

export type MonthRange = {
  start: string;
  end: string;
};

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function isValidMonth(month: number): boolean {
  return Number.isInteger(month) && month >= 1 && month <= 12;
}

function isValidYear(year: number): boolean {
  return Number.isInteger(year) && year >= 1 && year <= 9999;
}

export function getMonthRange(year: number, month: number): Result<MonthRange> {
  if (!isValidYear(year)) {
    return err('invalid_year', 'Ano inválido.', 'year');
  }

  if (!isValidMonth(month)) {
    return err('invalid_month', 'Mês deve estar entre 1 e 12.', 'month');
  }

  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();

  return ok({
    start: `${year}-${pad(month)}-01`,
    end: `${year}-${pad(month)}-${pad(lastDay)}`,
  });
}

export function formatMonthLabel(year: number, month: number): Result<string> {
  if (!isValidYear(year)) {
    return err('invalid_year', 'Ano inválido.', 'year');
  }

  if (!isValidMonth(month)) {
    return err('invalid_month', 'Mês deve estar entre 1 e 12.', 'month');
  }

  return ok(
    new Intl.DateTimeFormat('pt-BR', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(year, month - 1, 1))),
  );
}

export function isDateInsideMonth(date: string, year: number, month: number): Result<boolean> {
  const range = getMonthRange(year, month);
  if (!range.ok) {
    return range;
  }

  const day = date.slice(0, 10);
  return ok(day >= range.value.start && day <= range.value.end);
}
