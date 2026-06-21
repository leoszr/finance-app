export type DomainError = {
  code: string;
  message: string;
  field?: string;
};

export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: DomainError };

export function ok<T>(value: T): Result<T> {
  return { ok: true, value };
}

export function err(code: string, message: string, field?: string): Result<never> {
  return { ok: false, error: { code, message, field } };
}
