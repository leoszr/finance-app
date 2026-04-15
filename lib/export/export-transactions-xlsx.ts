import { utils, writeFileXLSX } from 'xlsx'

import { formatCurrencyBRL } from '@/lib/formatters'
import {
  assertTransactionsAvailable,
  formatExportMonthLabel,
  formatExportMonthStamp,
  mapTransactionsExportRows,
  type ExportTransactionsPayload
} from '@/lib/export/transactions-export-shared'

export function exportTransactionsXlsx({
  month,
  transactions,
  summary,
  appliedFilters = []
}: ExportTransactionsPayload) {
  assertTransactionsAvailable(transactions)

  const workbook = utils.book_new()
  const fileName = `extrato_${formatExportMonthStamp(month)}.xlsx`
  const monthLabel = formatExportMonthLabel(month)

  const summarySheet = utils.json_to_sheet([
    {
      Referencia: monthLabel,
      'Transacoes exportadas': transactions.length,
      Receitas: formatCurrencyBRL(summary.income),
      Despesas: formatCurrencyBRL(summary.expense),
      Saldo: formatCurrencyBRL(summary.balance),
      Filtros: appliedFilters.length > 0 ? appliedFilters.join(' | ') : 'Sem filtros adicionais'
    }
  ])

  const transactionsSheet = utils.json_to_sheet(mapTransactionsExportRows(transactions))

  utils.book_append_sheet(workbook, summarySheet, 'Resumo')
  utils.book_append_sheet(workbook, transactionsSheet, 'Transacoes')

  writeFileXLSX(workbook, fileName)
}
