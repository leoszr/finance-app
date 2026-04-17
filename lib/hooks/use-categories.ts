'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createClient } from '@/lib/supabase/client'
import { AUTH_REQUIRED_ERROR_MESSAGE, isAuthError } from '@/lib/supabase/auth-session'
import type { Category, CategoryInput, CategoryKind } from '@/lib/types'

const CATEGORIES_KEY = 'categories'

type UseCategoriesParams = {
  kind?: CategoryKind
}

type DefaultCategoryTemplate = {
  name: string
  kind: CategoryKind
  color: string
  icon: string
}

type SupabaseRequestError = {
  code?: string
  message: string
  status?: number
}

const DEFAULT_CATEGORIES: DefaultCategoryTemplate[] = [
  { name: 'Salario', kind: 'income', color: '#16a34a', icon: 'Wallet' },
  { name: 'Freelance', kind: 'income', color: '#15803d', icon: 'Briefcase' },
  { name: 'Investimentos', kind: 'income', color: '#166534', icon: 'TrendingUp' },
  { name: 'Moradia', kind: 'expense', color: '#1d4ed8', icon: 'Home' },
  { name: 'Alimentacao', kind: 'expense', color: '#9333ea', icon: 'Utensils' },
  { name: 'Transporte', kind: 'expense', color: '#ea580c', icon: 'Car' },
  { name: 'Saude', kind: 'expense', color: '#dc2626', icon: 'HeartPulse' },
  { name: 'Educacao', kind: 'expense', color: '#0284c7', icon: 'GraduationCap' },
  { name: 'Lazer', kind: 'expense', color: '#f59e0b', icon: 'Gamepad2' },
  { name: 'Assinaturas', kind: 'expense', color: '#7c3aed', icon: 'Tv' },
  { name: 'Reserva', kind: 'investment', color: '#0f766e', icon: 'PiggyBank' }
]

function isRpcMissingError(error: SupabaseRequestError | null) {
  if (!error) {
    return false
  }

  if (error.status === 404 || error.code === 'PGRST202') {
    return true
  }

  return /could not find the function|function.*does not exist/i.test(error.message)
}

async function getCurrentUserId() {
  const supabase = createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  return user?.id ?? null
}

async function queryCategories(kind?: CategoryKind) {
  const supabase = createClient()

  let query = supabase.from('categories').select('id, name, kind, color, icon').order('name')

  if (kind) {
    query = query.eq('kind', kind)
  }

  return query
}

async function ensureDefaultCategoriesFallback() {
  const supabase = createClient()
  const userId = await getCurrentUserId()

  if (!userId) {
    return
  }

  await supabase.from('categories').upsert(
    DEFAULT_CATEGORIES.map((category) => ({
      user_id: userId,
      ...category
    })),
    { onConflict: 'user_id,name' }
  )
}

async function fetchCategories(kind?: CategoryKind): Promise<Category[]> {
  const userId = await getCurrentUserId()

  if (!userId) {
    throw new Error(AUTH_REQUIRED_ERROR_MESSAGE)
  }

  const { data, error } = await queryCategories(kind)

  if (error) {
    if (isAuthError(error)) {
      throw new Error(AUTH_REQUIRED_ERROR_MESSAGE)
    }

    throw new Error('Nao foi possivel carregar as categorias.')
  }

  const categories = (data as Category[]) ?? []

  if (categories.length > 0) {
    return categories
  }

  const supabase = createClient()
  const { error: ensureDefaultsError } = await supabase.rpc('ensure_default_categories_for_current_user')

  if (ensureDefaultsError) {
    if (isAuthError(ensureDefaultsError)) {
      throw new Error(AUTH_REQUIRED_ERROR_MESSAGE)
    }

    if (!isRpcMissingError(ensureDefaultsError)) {
      console.error('Falha ao executar RPC de categorias padrao, aplicando fallback:', ensureDefaultsError.message)
    }

    await ensureDefaultCategoriesFallback()
  }

  const { data: fallbackData, error: fallbackError } = await queryCategories(kind)

  if (fallbackError) {
    if (isAuthError(fallbackError)) {
      throw new Error(AUTH_REQUIRED_ERROR_MESSAGE)
    }

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
      const userId = await getCurrentUserId()

      if (!userId) {
        throw new Error(AUTH_REQUIRED_ERROR_MESSAGE)
      }

      const { data, error } = await supabase
        .from('categories')
        .insert({
          user_id: userId,
          name: input.name,
          kind: input.kind,
          color: input.color ?? '#334155',
          icon: input.icon ?? 'Circle'
        })
        .select('id, name, kind, color, icon')
        .single()

      if (error) {
        if (isAuthError(error)) {
          throw new Error(AUTH_REQUIRED_ERROR_MESSAGE)
        }

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
