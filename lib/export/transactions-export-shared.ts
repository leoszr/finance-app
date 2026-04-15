import { formatCurrencyBRL, formatDateBR } from '@/lib/formatters'
import type { Transaction } from '@/lib/types'

export type TransactionsExportSummary = {
  income: number
  expense: number
  balance: number
}

export type ExportTransactionsPayload = {
  month: string
  transactions: Transaction[]
  summary: TransactionsExportSummary
  appliedFilters?: string[]
}

function getMonthDate(month: string) {
  const [yearRaw, monthRaw] = month.split('-')
  const year = Number(yearRaw)
  const monthIndex = Number(monthRaw) - 1

  if (Number.isNaN(year) || Number.isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
    throw new Error('Mes invalido. Use o formato AAAA-MM.')
  }

  return new Date(year, monthIndex, 1)
}

export function formatExportMonthLabel(month: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric'
  }).format(getMonthDate(month))
}

export function formatExportMonthStamp(month: string) {
  return month.replace('-', '_')
}

export function mapTransactionsExportRows(transactions: Transaction[]) {
  return transactions.map((transaction) => ({
    Data: formatDateBR(transaction.occurred_on),
    Tipo: transaction.type === 'income' ? 'Receita' : 'Despesa',
    Categoria: transaction.category?.name ?? 'Sem categoria',
    Descricao: transaction.description,
    Valor: transaction.type === 'income'
      ? formatCurrencyBRL(transaction.amount)
      : `- ${formatCurrencyBRL(transaction.amount)}`,
    Fonte: transaction.source
  }))
}

export function assertTransactionsAvailable(transactions: Transaction[]) {
  if (transactions.length === 0) {
    throw new Error('Nao ha transacoes no periodo selecionado para exportar.')
  }
}
