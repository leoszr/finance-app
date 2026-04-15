'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { MonthlyComparisonChart } from '@/components/charts/monthly-comparison-chart'
import { MonthPicker } from '@/components/transactions/month-picker'
import { TransactionForm } from '@/components/transactions/transaction-form'
import { TransactionsList } from '@/components/transactions/transactions-list'
import { TransactionsSummary } from '@/components/transactions/transactions-summary'
import { useDashboard } from '@/lib/hooks/use-dashboard'
import { useTransactions } from '@/lib/hooks/use-transactions'
import type { Transaction } from '@/lib/types'

function currentMonth() {
  return new Date().toISOString().slice(0, 7)
}

export default function TransacoesPage() {
  const [month, setMonth] = useState(currentMonth)
  const [editingItem, setEditingItem] = useState<Transaction | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const {
    transactions,
    summary,
    isLoading,
    isError,
    error,
    refetch,
    createTransaction,
    updateTransaction,
    deleteTransaction
  } = useTransactions({ month })
  const { comparison } = useDashboard({ month })

  useEffect(() => {
    setEditingItem(null)
    setActionError(null)
  }, [month])

  useEffect(() => {
    if (!editingItem) {
      return
    }

    const exists = transactions.some((item) => item.id === editingItem.id)

    if (!exists) {
      setEditingItem(null)
    }
  }, [editingItem, transactions])

  const handleCreate = async (input: {
    type: 'income' | 'expense'
    category_id: string
    amount: number
    description: string
    occurred_on: string
  }) => {
    setActionError(null)

    try {
      await createTransaction.mutateAsync(input)
    } catch (mutationError) {
      setActionError(mutationError instanceof Error ? mutationError.message : 'Falha ao criar transacao.')
    }
  }

  const handleUpdate = async (input: {
    type: 'income' | 'expense'
    category_id: string
    amount: number
    description: string
    occurred_on: string
  }) => {
    if (!editingItem) {
      return
    }

    setActionError(null)

    try {
      await updateTransaction.mutateAsync({
        id: editingItem.id,
        input
      })
      setEditingItem(null)
    } catch (mutationError) {
      setActionError(mutationError instanceof Error ? mutationError.message : 'Falha ao atualizar transacao.')
    }
  }

  const handleDelete = async (transaction: Transaction) => {
    setActionError(null)

    try {
      await deleteTransaction.mutateAsync({
        id: transaction.id,
        occurred_on: transaction.occurred_on
      })
    } catch (mutationError) {
      setActionError(mutationError instanceof Error ? mutationError.message : 'Falha ao excluir transacao.')
    }
  }

  const isBusy = createTransaction.isPending || updateTransaction.isPending || deleteTransaction.isPending

  return (
    <main aria-busy={isBusy} className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-4 px-5 py-6">
      <header>
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-xl font-semibold text-slate-900">Transacoes</h1>
          <Link className="glass-btn rounded-lg px-3 py-1.5 text-xs font-medium text-slate-800" href="/transacoes/importar">
            Importar CSV
          </Link>
        </div>
        <p className="mt-1 text-sm text-slate-600">Gerencie seus lancamentos e acompanhe o saldo mensal.</p>
      </header>

      <MonthPicker onChange={setMonth} value={month} />

      {actionError ? (
        <section aria-live="assertive" className="glass-card rounded-2xl border border-rose-200 bg-rose-50/80 p-4" role="alert">
          <p className="text-sm text-rose-800">{actionError}</p>
        </section>
      ) : null}

      <TransactionsSummary
        balance={summary.balance}
        expense={summary.expense}
        income={summary.income}
      />

      <section className="glass-card rounded-2xl p-4">
        <h2 className="text-sm font-semibold text-slate-900">Comparativo dos últimos 6 meses</h2>
        <div className="mt-3">
          <MonthlyComparisonChart data={comparison} />
        </div>
      </section>

      <section className="glass-card rounded-2xl p-4">
        <h2 className="text-sm font-semibold text-slate-900">Nova transacao</h2>
        <div className="mt-3">
          <TransactionForm
            isSaving={createTransaction.isPending}
            mode="create"
            onSubmit={handleCreate}
          />
        </div>
      </section>

      {editingItem ? (
        <section className="glass-card rounded-2xl p-4">
          <h2 className="text-sm font-semibold text-slate-900">Editar transacao</h2>
          <div className="mt-3">
            <TransactionForm
              initialData={editingItem}
              isSaving={updateTransaction.isPending}
              mode="edit"
              onCancel={() => setEditingItem(null)}
              onSubmit={handleUpdate}
            />
          </div>
        </section>
      ) : null}

      {isLoading ? (
        <section aria-live="polite" className="glass-card rounded-2xl p-4" role="status">
          <p className="text-sm text-slate-600">Carregando transacoes...</p>
        </section>
      ) : isError ? (
        <section aria-live="assertive" className="glass-card rounded-2xl border border-rose-200 bg-rose-50/80 p-4" role="alert">
          <p className="text-sm text-rose-800">{error instanceof Error ? error.message : 'Falha ao carregar dados.'}</p>
          <button
            className="glass-btn mt-3 rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-medium text-rose-700"
            onClick={() => {
              void refetch()
            }}
            type="button"
          >
            Tentar novamente
          </button>
        </section>
      ) : (
        <TransactionsList
          isDeleting={deleteTransaction.isPending}
          onDelete={handleDelete}
          onEdit={setEditingItem}
          transactions={transactions}
        />
      )}
    </main>
  )
}
