'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createClient } from '@/lib/supabase/client'
import type { Category, CategoryInput, CategoryKind } from '@/lib/types'

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

  const categories = (data as Category[]) ?? []

  if (categories.length > 0) {
    return categories
  }

  const { error: ensureDefaultsError } = await supabase.rpc('ensure_default_categories_for_current_user')

  if (ensureDefaultsError) {
    return categories
  }

  let fallbackQuery = supabase.from('categories').select('id, name, kind, color, icon').order('name')

  if (kind) {
    fallbackQuery = fallbackQuery.eq('kind', kind)
  }

  const { data: fallbackData, error: fallbackError } = await fallbackQuery

  if (fallbackError) {
    throw new Error('Nao foi possivel carregar as categorias.')
  }

  return (fallbackData as Category[]) ?? []
}

export function useCategories({ kind }: UseCategoriesParams = {}) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: [CATEGORIES_KEY, kind ?? 'all'],
    queryFn: () => fetchCategories(kind)
  })

  const createCategory = useMutation({
    mutationFn: async (input: CategoryInput) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: input.name,
          kind: input.kind,
          color: input.color ?? '#334155',
          icon: input.icon ?? 'Circle'
        })
        .select('id, name, kind, color, icon')
        .single()

      if (error) {
        if (error.code === '23505') {
          throw new Error('Ja existe uma categoria com esse nome.')
        }

        throw new Error('Nao foi possivel criar categoria.')
      }

      return data as Category
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        predicate: (queryItem) => queryItem.queryKey[0] === CATEGORIES_KEY
      })
    }
  })

  return {
    categories: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createCategory
  }
}
