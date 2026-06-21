export type SqlValue = string | number | boolean | null | Uint8Array;
export type SqlParams = readonly SqlValue[];

export type SqlRunResult = {
  lastInsertRowId?: number;
  changes?: number;
};

export type RepositoryDatabase = {
  getAllAsync: <T>(source: string, params?: SqlParams) => Promise<T[]>;
  getFirstAsync: <T>(source: string, params?: SqlParams) => Promise<T | null>;
  runAsync: (source: string, params?: SqlParams) => Promise<SqlRunResult>;
};

export type RepositoryResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: { code: string; message: string; field?: string } };

export function repoOk<T>(value: T): RepositoryResult<T> {
  return { ok: true, value };
}

export function repoErr(code: string, message: string, field?: string): RepositoryResult<never> {
  return { ok: false, error: { code, message, field } };
}
