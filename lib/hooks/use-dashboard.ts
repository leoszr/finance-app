'use client'

import { useQuery } from '@tanstack/react-query'

import { createClient } from '@/lib/supabase/client'
import type { Transaction } from '@/lib/types'

const DASHBOARD_KEY = 'dashboard'

export type DashboardSummary = {
  income: number
  expense: number
  balance: number
}

export type DashboardExpenseByCategory = {
  categoryId: string
  name: string
  color: string
  total: number
  percentage: number
}

export type DashboardMonthComparison = {
  month: string
  label: string
  income: number
  expense: number
}

export type DashboardData = {
  summary: DashboardSummary
  expensesByCategory: DashboardExpenseByCategory[]
  recentTransactions: Transaction[]
  comparison: DashboardMonthComparison[]
}

type UseDashboardParams = {
  month?: string
}

function currentMonth() {
  return new Date().toISOString().slice(0, 7)
}

function parseMonth(month: string) {
  const [yearRaw, monthRaw] = month.split('-')
  const year = Number(yearRaw)
  const monthIndex = Number(monthRaw) - 1

  if (Number.isNaN(year) || Number.isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
    throw new Error('Mes invalido. Use o formato AAAA-MM.')
  }

  return { year, monthIndex }
}

function monthBounds(month: string) {
  const { year, monthIndex } = parseMonth(month)
  const start = new Date(Date.UTC(year, monthIndex, 1))
  const end = new Date(Date.UTC(year, monthIndex + 1, 1))

  return {
    start,
    end,
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10)
  }
}

function monthLabel(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    month: 'short',
    year: '2-digit',
    timeZone: 'UTC'
  })
    .format(date)
    .replace('.', '')
}

function buildComparison(month: string, transactions: Transaction[]) {
  const { year, monthIndex } = parseMonth(month)
  const monthMap = new Map<string, { income: number; expense: number }>()

  transactions.forEach((transaction) => {
    const monthKey = transaction.occurred_on.slice(0, 7)
    const current = monthMap.get(monthKey) ?? { income: 0, expense: 0 }

    if (transaction.type === 'income') {
      current.income += Number(transaction.amount)
    } else {
      current.expense += Number(transaction.amount)
    }

    monthMap.set(monthKey, current)
  })

  const comparison: DashboardMonthComparison[] = []

  for (let offset = 5; offset >= 0; offset -= 1) {
    const date = new Date(Date.UTC(year, monthIndex - offset, 1))
    const monthKey = date.toISOString().slice(0, 7)
    const values = monthMap.get(monthKey) ?? { income: 0, expense: 0 }

    comparison.push({
      month: monthKey,
      label: monthLabel(date),
      income: values.income,
      expense: values.expense
    })
  }

  return comparison
}

function buildExpenseByCategory(transactions: Transaction[]) {
  const totals = new Map<string, DashboardExpenseByCategory>()

  transactions
    .filter((transaction) => transaction.type === 'expense')
    .forEach((transaction) => {
      const categoryId = transaction.category_id
      const categoryName = transaction.category?.name ?? 'Sem categoria'
      const color = transaction.category?.color ?? '#64748b'
      const current = totals.get(categoryId) ?? {
        categoryId,
        name: categoryName,
        color,
        total: 0,
        percentage: 0
      }

      current.total += Number(transaction.amount)
      totals.set(categoryId, current)
    })

  const totalExpense = Array.from(totals.values()).reduce((sum, item) => sum + item.total, 0)

  return Array.from(totals.values())
    .map((item) => ({
      ...item,
      percentage: totalExpense > 0 ? (item.total / totalExpense) * 100 : 0
    }))
    .sort((a, b) => b.total - a.total)
}

async function fetchDashboard(month: string): Promise<DashboardData> {
  const supabase = createClient()
  const { start, startDate, endDate } = monthBounds(month)
  const historyStart = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() - 5, 1))

  const { data, error } = await supabase
    .from('transactions')
    .select('*, category:categories(id, name, kind, color, icon)')
    .gte('occurred_on', historyStart.toISOString().slice(0, 10))
    .lt('occurred_on', endDate)
    .order('occurred_on', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('Nao foi possivel carregar os dados do dashboard.')
  }

  const transactions = (data as Transaction[]) ?? []
  const currentMonthTransactions = transactions.filter(
    (transaction) => transaction.occurred_on >= startDate && transaction.occurred_on < endDate
  )

  const income = currentMonthTransactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0)
  const expense = currentMonthTransactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0)

  return {
    summary: {
      income,
      expense,
      balance: income - expense
    },
    expensesByCategory: buildExpenseByCategory(currentMonthTransactions),
    recentTransactions: currentMonthTransactions.slice(0, 5),
    comparison: buildComparison(month, transactions)
  }
}

export function useDashboard({ month = currentMonth() }: UseDashboardParams = {}) {
  const query = useQuery({
    queryKey: [DASHBOARD_KEY, month],
    queryFn: () => fetchDashboard(month)
  })

  return {
    summary: query.data?.summary ?? { income: 0, expense: 0, balance: 0 },
    expensesByCategory: query.data?.expensesByCategory ?? [],
    recentTransactions: query.data?.recentTransactions ?? [],
    comparison: query.data?.comparison ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  }
}