import { getRepositoryDatabase } from '@/db/repositories/database';
import { repoErr, repoOk, type RepositoryDatabase, type RepositoryResult } from '@/db/repositories/types';
import { validateCategory, type CategoryInput } from '@/lib/validation/categoryValidation';
import type { TransactionType } from '@/types/finance';

export type CategoryRecord = {
  id: number;
  name: string;
  type: TransactionType;
  color: string | null;
  icon: string | null;
  createdAt: string;
  updatedAt: string;
};

type CategoryRow = {
  id: number;
  name: string;
  type: TransactionType;
  color: string | null;
  icon: string | null;
  created_at: string;
  updated_at: string;
};

function isForeignKeyConstraintError(error: unknown) {
  return error instanceof Error && /foreign key|constraint/i.test(error.message);
}

function mapCategory(row: CategoryRow): CategoryRecord {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    color: row.color,
    icon: row.icon,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function createCategoriesRepository(database: RepositoryDatabase = getRepositoryDatabase()) {
  async function getCategoryById(id: number): Promise<CategoryRecord | null> {
    const row = await database.getFirstAsync<CategoryRow>(`SELECT * FROM categories WHERE id = ?`, [id]);
    return row ? mapCategory(row) : null;
  }

  async function createCategory(input: CategoryInput): Promise<RepositoryResult<CategoryRecord>> {
    const valid = validateCategory(input);
    if (!valid.ok) return valid;

    const result = await database.runAsync(
      `INSERT INTO categories (name, type, color, icon) VALUES (?, ?, ?, ?)`,
      [valid.value.name, valid.value.type, valid.value.color ?? null, valid.value.icon ?? null],
    );

    const category = await getCategoryById(result.lastInsertRowId ?? 0);
    return category ? repoOk(category) : repoErr('category_create_failed', 'Categoria não foi criada.');
  }

  async function getCategories(): Promise<CategoryRecord[]> {
    const rows = await database.getAllAsync<CategoryRow>(`SELECT * FROM categories ORDER BY created_at ASC, id ASC`);
    return rows.map(mapCategory);
  }

  async function getCategoriesByType(type: TransactionType): Promise<CategoryRecord[]> {
    const rows = await database.getAllAsync<CategoryRow>(`SELECT * FROM categories WHERE type = ? ORDER BY created_at ASC, id ASC`, [type]);
    return rows.map(mapCategory);
  }

  async function updateCategory(id: number, input: CategoryInput): Promise<RepositoryResult<CategoryRecord>> {
    const valid = validateCategory(input);
    if (!valid.ok) return valid;

    const existing = await database.getFirstAsync<CategoryRow>(`SELECT * FROM categories WHERE id = ?`, [id]);
    if (!existing) {
      return repoErr('category_not_found', 'Categoria não encontrada.', 'id');
    }

    if (existing.type !== valid.value.type) {
      const usage = await database.getFirstAsync<{ total: number }>(`SELECT COUNT(*) AS total FROM transactions WHERE category_id = ?`, [id]);
      if ((usage?.total ?? 0) > 0) {
        return repoErr('category_type_in_use', 'Categoria usada em transações não pode mudar de tipo.', 'type');
      }
    }

    await database.runAsync(
      `UPDATE categories SET name = ?, type = ?, color = ?, icon = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [valid.value.name, valid.value.type, valid.value.color ?? null, valid.value.icon ?? null, id],
    );

    const category = await getCategoryById(id);
    return category ? repoOk(category) : repoErr('category_not_found', 'Categoria não encontrada.', 'id');
  }

  async function deleteCategory(id: number): Promise<RepositoryResult<null>> {
    const usage = await database.getFirstAsync<{ total: number }>(`SELECT COUNT(*) AS total FROM transactions WHERE category_id = ?`, [id]);
    if ((usage?.total ?? 0) > 0) {
      return repoErr('category_in_use', 'Categoria possui transações associadas.', 'id');
    }

    try {
      const result = await database.runAsync(`DELETE FROM categories WHERE id = ?`, [id]);
      return result.changes === 0 ? repoErr('category_not_found', 'Categoria não encontrada.', 'id') : repoOk(null);
    } catch (error) {
      if (isForeignKeyConstraintError(error)) {
        return repoErr('category_in_use', 'Categoria possui transações associadas.', 'id');
      }
      throw error;
    }
  }

  return { createCategory, getCategories, getCategoriesByType, getCategoryById, updateCategory, deleteCategory };
}
