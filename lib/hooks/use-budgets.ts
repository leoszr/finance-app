'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createClient } from '@/lib/supabase/client'
import type { Budget, BudgetInput, Transaction } from '@/lib/types'

const BUDGETS_KEY = 'budgets'

export type BudgetStatus = 'ok' | 'warning' | 'exceeded'

export type BudgetWithProgress = Budget & {
  spent: number
  remaining: number
  percentage: number
  status: BudgetStatus
}

type UseBudgetsParams = {
  month: string
}

function parseMonth(month: string) {
  const [yearRaw, monthRaw] = month.split('-')
  const year = Number(yearRaw)
  const monthIndex = Number(monthRaw) - 1

  if (Number.isNaN(year) || Number.isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
    throw new Error('Mes invalido. Use o formato AAAA-MM.')
  }

  const start = new Date(Date.UTC(year, monthIndex, 1))
  const end = new Date(Date.UTC(year, monthIndex + 1, 1))

  return {
    monthDate: `${month}-01`,
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10)
  }
}

function getStatus(percentage: number): BudgetStatus {
  if (percentage > 100) {
    return 'exceeded'
  }

  if (percentage >= 80) {
    return 'warning'
  }

  return 'ok'
}

async function fetchBudgetsByMonth(month: string): Promise<BudgetWithProgress[]> {
  const supabase = createClient()
  const { monthDate, start, end } = parseMonth(month)

  const [{ data: budgetsData, error: budgetsError }, { data: spentData, error: spentError }] = await Promise.all([
    supabase
      .from('budgets')
      .select('*, category:categories(id, name, kind, color, icon)')
      .eq('month', monthDate)
      .order('created_at', { ascending: true }),
    supabase
      .from('transactions')
      .select('category_id, amount')
      .eq('type', 'expense')
      .gte('occurred_on', start)
      .lt('occurred_on', end)
  ])

  if (budgetsError) {
    throw new Error('Nao foi possivel carregar os orcamentos.')
  }

  if (spentError) {
    throw new Error('Nao foi possivel calcular o consumo dos orcamentos.')
  }

  const spentByCategory = new Map<string, number>()
  ;((spentData as Pick<Transaction, 'category_id' | 'amount'>[] | null) ?? []).forEach((item) => {
    const current = spentByCategory.get(item.category_id) ?? 0
    spentByCategory.set(item.category_id, current + Number(item.amount))
  })

  return ((budgetsData as Budget[] | null) ?? []).map((budget) => {
    const spent = spentByCategory.get(budget.category_id) ?? 0
    const limit = Number(budget.limit_amount)
    const percentage = limit > 0 ? (spent / limit) * 100 : 0

    return {
      ...budget,
      spent,
      remaining: Math.max(limit - spent, 0),
      percentage,
      status: getStatus(percentage)
    }
  })
}

export function useBudgets({ month }: UseBudgetsParams) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: [BUDGETS_KEY, month],
    queryFn: () => fetchBudgetsByMonth(month)
  })

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: [BUDGETS_KEY, month] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    ])
  }

  const createBudget = useMutation({
    mutationFn: async (input: BudgetInput) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('budgets')
        .insert({
          category_id: input.category_id,
          month: `${input.month}-01`,
          limit_amount: input.limit_amount
        })
        .select('*, category:categories(id, name, kind, color, icon)')
        .single()

      if (error) {
        if (error.code === '23505') {
          throw new Error('Ja existe orcamento para essa categoria no mes selecionado.')
        }

        throw new Error('Nao foi possivel criar o orcamento.')
      }

      return data as Budget
    },
    onSuccess: async () => {
      await invalidate()
    }
  })

  const updateBudget = useMutation({
    mutationFn: async (payload: { id: string; input: BudgetInput }) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('budgets')
        .update({
          category_id: payload.input.category_id,
          month: `${payload.input.month}-01`,
          limit_amount: payload.input.limit_amount
        })
        .eq('id', payload.id)
        .select('*, category:categories(id, name, kind, color, icon)')
        .single()

      if (error) {
        if (error.code === '23505') {
          throw new Error('Ja existe orcamento para essa categoria no mes selecionado.')
        }

        throw new Error('Nao foi possivel atualizar o orcamento.')
      }

      return data as Budget
    },
    onSuccess: async () => {
      await invalidate()
    }
  })

  const deleteBudget = useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('budgets').delete().eq('id', id)

      if (error) {
        throw new Error('Nao foi possivel excluir o orcamento.')
      }
    },
    onSuccess: async () => {
      await invalidate()
    }
  })

  return {
    budgets: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createBudget,
    updateBudget,
    deleteBudget
  }
}
