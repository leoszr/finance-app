'use client'

import { useMemo, useState } from 'react'

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
  const [feedback, setFeedback] = useState<string | null>(null)
  const [feedbackTone, setFeedbackTone] = useState<'success' | 'error'>('success')

  const disabled = transactions.length === 0 || isExporting
  const monthLabel = useMemo(() => formatExportMonthLabel(month), [month])

  const handleExport = async (format: 'pdf' | 'xlsx') => {
    if (transactions.length === 0) {
      setFeedbackTone('error')
      setFeedback('Nao ha transacoes no recorte selecionado para exportar.')
      return
    }

    setIsExporting(true)
    setFeedback(null)

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

      setFeedbackTone('success')
      setFeedback(`Exportacao ${format.toUpperCase()} iniciada para ${monthLabel}.`)
    } catch (error) {
      setFeedbackTone('error')
      setFeedback(error instanceof Error ? error.message : 'Nao foi possivel exportar o arquivo.')
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

      {feedback ? (
        <p className={`mt-3 text-xs ${feedbackTone === 'success' ? 'text-emerald-700' : 'text-rose-700'}`}>
          {feedback}
        </p>
      ) : null}
    </section>
  )
}
