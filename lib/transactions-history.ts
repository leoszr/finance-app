import type { Transaction, TransactionType } from '@/lib/types'

export type TransactionHistoryFilters = {
  type: TransactionType | 'all'
  categoryId: string
  search: string
}

export type TransactionHistorySummary = {
  income: number
  expense: number
  balance: number
}

export const DEFAULT_TRANSACTION_HISTORY_FILTERS: TransactionHistoryFilters = {
  type: 'all',
  categoryId: 'all',
  search: ''
}

export function filterTransactions(transactions: Transaction[], filters: TransactionHistoryFilters) {
  const normalizedSearch = filters.search.trim().toLowerCase()

  return transactions.filter((transaction) => {
    if (filters.type !== 'all' && transaction.type !== filters.type) {
      return false
    }

    if (filters.categoryId !== 'all' && transaction.category_id !== filters.categoryId) {
      return false
    }

    if (!normalizedSearch) {
      return true
    }

    const haystack = [
      transaction.description,
      transaction.category?.name ?? ''
    ].join(' ').toLowerCase()

    return haystack.includes(normalizedSearch)
  })
}

export function summarizeTransactions(transactions: Transaction[]): TransactionHistorySummary {
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
}

export function buildTransactionFilterLabels(
  filters: TransactionHistoryFilters,
  categoryName?: string | null
) {
  const labels: string[] = []

  if (filters.type === 'income') {
    labels.push('Tipo: Receitas')
  }

  if (filters.type === 'expense') {
    labels.push('Tipo: Despesas')
  }

  if (filters.categoryId !== 'all' && categoryName) {
    labels.push(`Categoria: ${categoryName}`)
  }

  if (filters.search.trim()) {
    labels.push(`Busca: ${filters.search.trim()}`)
  }

  return labels
}
