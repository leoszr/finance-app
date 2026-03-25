'use client'

import { useQuery } from '@tanstack/react-query'

import { createClient } from '@/lib/supabase/client'
import type { Category, CategoryKind } from '@/lib/types'

const CATEGORIES_KEY = 'categories'

type UseCategoriesParams = {
  kind?: CategoryKind
}

async function fetchCategories(kind?: CategoryKind): Promise<Category[]> {
  const supabase = createClient()

  let query = supabase.from('categories').select('id, name, kind, color, icon').order('name')

  if (kind) {
    query = query.eq('kind', kind)
  }

  const { data, error } = await query

  if (error) {
    throw new Error('Nao foi possivel carregar as categorias.')
  }

  return (data as Category[]) ?? []
}

export function useCategories({ kind }: UseCategoriesParams = {}) {
  const query = useQuery({
    queryKey: [CATEGORIES_KEY, kind ?? 'all'],
    queryFn: () => fetchCategories(kind)
  })

  return {
    categories: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  }
}
