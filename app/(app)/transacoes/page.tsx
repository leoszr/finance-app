'use client'

import { useState } from 'react'

import { MonthPicker } from '@/components/transactions/month-picker'
import { TransactionForm } from '@/components/transactions/transaction-form'
import { TransactionsList } from '@/components/transactions/transactions-list'
import { TransactionsSummary } from '@/components/transactions/transactions-summary'
import { useTransactions } from '@/lib/hooks/use-transactions'
import type { Transaction } from '@/lib/types'

function currentMonth() {
  return new Date().toISOString().slice(0, 7)
}

export default function TransacoesPage() {
  const [month, setMonth] = useState(currentMonth)
  const [editingItem, setEditingItem] = useState<Transaction | null>(null)

  const {
    transactions,
    summary,
    isLoading,
    createTransaction,
    updateTransaction,
    deleteTransaction
  } = useTransactions({ month })

  const handleCreate = async (input: {
    type: 'income' | 'expense'
    category_id: string
    amount: number
    description: string
    occurred_on: string
  }) => {
    await createTransaction.mutateAsync(input)
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

    await updateTransaction.mutateAsync({
      id: editingItem.id,
      input
    })
    setEditingItem(null)
  }

  const handleDelete = async (id: string) => {
    await deleteTransaction.mutateAsync(id)
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-4 px-5 py-6">
      <header>
        <h1 className="text-xl font-semibold text-slate-900">Transacoes</h1>
        <p className="mt-1 text-sm text-slate-600">Gerencie seus lancamentos e acompanhe o saldo mensal.</p>
      </header>

      <MonthPicker onChange={setMonth} value={month} />

      <TransactionsSummary
        balance={summary.balance}
        expense={summary.expense}
        income={summary.income}
      />

      <section className="rounded-2xl border border-slate-200 bg-white p-4">
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
        <section className="rounded-2xl border border-slate-200 bg-white p-4">
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
        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-600">Carregando transacoes...</p>
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
