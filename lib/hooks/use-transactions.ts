'use client'

import { useMemo } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { Transaction, TransactionInput } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'

const TRANSACTIONS_KEY = 'transactions'

type MonthlySummary = {
  income: number
  expense: number
  balance: number
}

type UseTransactionsParams = {
  month: string
}

function monthKeyFromDate(dateValue: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return null
  }

  return dateValue.slice(0, 7)
}

function monthRange(month: string) {
  const [yearRaw, monthRaw] = month.split('-')
  const year = Number(yearRaw)
  const monthIndex = Number(monthRaw) - 1

  if (Number.isNaN(year) || Number.isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
    throw new Error('Mes invalido. Use o formato AAAA-MM.')
  }

  const start = new Date(Date.UTC(year, monthIndex, 1))
  const end = new Date(Date.UTC(year, monthIndex + 1, 1))

  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10)
  }
}

async function fetchTransactionsByMonth(month: string): Promise<Transaction[]> {
  const supabase = createClient()
  const { start, end } = monthRange(month)

  const { data, error } = await supabase
    .from('transactions')
    .select('*, category:categories(id, name, kind, color, icon)')
    .gte('occurred_on', start)
    .lt('occurred_on', end)
    .order('occurred_on', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('Nao foi possivel carregar as transacoes.')
  }

  return (data as Transaction[]) ?? []
}

export function useTransactions({ month }: UseTransactionsParams) {
  const queryClient = useQueryClient()

  const invalidateMonthData = async (monthKey?: string | null) => {
    const keys = new Set<string>([month])

    if (monthKey) {
      keys.add(monthKey)
    }

    await Promise.all(
      Array.from(keys).map((key) =>
        queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_KEY, key] })
      )
    )

    await queryClient.invalidateQueries({ queryKey: ['dashboard'] })
  }

  const query = useQuery({
    queryKey: [TRANSACTIONS_KEY, month],
    queryFn: () => fetchTransactionsByMonth(month)
  })

  const summary = useMemo<MonthlySummary>(() => {
    const transactions = query.data ?? []
    const income = transactions
      .filter((item) => item.type === 'income')
      .reduce((total, item) => total + Number(item.amount), 0)
    const expense = transactions
      .filter((item) => item.type === 'expense')
      .reduce((total, item) => total + Number(item.amount), 0)

    return {
      income,
      expense,
      balance: income - expense
    }
  }, [query.data])

  const createTransaction = useMutation({
    mutationFn: async (input: TransactionInput) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          category_id: input.category_id,
          type: input.type,
          amount: input.amount,
          description: input.description,
          occurred_on: input.occurred_on,
          source: 'manual'
        })
        .select('*, category:categories(id, name, kind, color, icon)')
        .single()

      if (error) {
        throw new Error('Nao foi possivel criar a transacao.')
      }

      return data as Transaction
    },
    onSuccess: async (_, input) => {
      await invalidateMonthData(monthKeyFromDate(input.occurred_on))
    }
  })

  const updateTransaction = useMutation({
    mutationFn: async (payload: { id: string; input: TransactionInput }) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('transactions')
        .update(payload.input)
        .eq('id', payload.id)
        .select('*, category:categories(id, name, kind, color, icon)')
        .single()

      if (error) {
        throw new Error('Nao foi possivel atualizar a transacao.')
      }

      return data as Transaction
    },
    onSuccess: async (_, payload) => {
      await invalidateMonthData(monthKeyFromDate(payload.input.occurred_on))
    }
  })

  const deleteTransaction = useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('transactions').delete().eq('id', id)

      if (error) {
        throw new Error('Nao foi possivel excluir a transacao.')
      }
    },
    onSuccess: async () => {
      await invalidateMonthData()
    }
  })

  return {
    transactions: query.data ?? [],
    summary,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createTransaction,
    updateTransaction,
    deleteTransaction
  }
}
