'use client'

import { useMemo, useState } from 'react'

import { useToast } from '@/components/ui/toast-provider'
import { exportTransactionsPdf } from '@/lib/export/export-transactions-pdf'
import { exportTransactionsXlsx } from '@/lib/export/export-transactions-xlsx'
import { formatExportMonthLabel } from '@/lib/export/transactions-export-shared'
import type { TransactionsExportSummary } from '@/lib/export/transactions-export-shared'
import type { Transaction } from '@/lib/types'

type ExportButtonProps = {
  month: string
  transactions: Transaction[]
  summary: TransactionsExportSummary
  appliedFilters?: string[]
}

export function ExportButton({
  month,
  transactions,
  summary,
  appliedFilters = []
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const { showToast } = useToast()

  const disabled = transactions.length === 0 || isExporting
  const monthLabel = useMemo(() => formatExportMonthLabel(month), [month])

  const handleExport = async (format: 'pdf' | 'xlsx') => {
    if (transactions.length === 0) {
      showToast('Nao ha transacoes no recorte selecionado para exportar.', 'error')
      return
    }

    setIsExporting(true)

    try {
      if (format === 'pdf') {
        await exportTransactionsPdf({
          month,
          transactions,
          summary,
          appliedFilters
        })
      } else {
        exportTransactionsXlsx({
          month,
          transactions,
          summary,
          appliedFilters
        })
      }

      showToast(`Exportacao ${format.toUpperCase()} iniciada para ${monthLabel}.`)
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Nao foi possivel exportar o arquivo.', 'error')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <section className="glass-card rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Exportar extrato</h2>
          <p className="mt-1 text-xs text-slate-600">Baixe PDF ou Excel do recorte atual.</p>
        </div>

        <div className="flex gap-2">
          <button
            className="glass-btn rounded-lg px-3 py-2 text-xs font-medium text-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={disabled}
            onClick={() => {
              void handleExport('pdf')
            }}
            type="button"
          >
            {isExporting ? 'Gerando...' : 'PDF'}
          </button>
          <button
            className="glass-btn rounded-lg px-3 py-2 text-xs font-medium text-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={disabled}
            onClick={() => {
              void handleExport('xlsx')
            }}
            type="button"
          >
            {isExporting ? 'Gerando...' : 'Excel'}
          </button>
        </div>
      </div>

      {transactions.length === 0 ? (
        <p className="mt-3 text-xs text-amber-700">Sem transacoes no recorte atual. Ajuste filtros para liberar exportacao.</p>
      ) : null}

    </section>
  )
}
