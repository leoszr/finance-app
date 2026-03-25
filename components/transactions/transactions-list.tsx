import type { Transaction } from '@/lib/types'

type TransactionsListProps = {
  transactions: Transaction[]
  onEdit: (item: Transaction) => void
  onDelete: (id: string) => void
  isDeleting: boolean
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(`${value}T00:00:00`))
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export function TransactionsList({ transactions, onEdit, onDelete, isDeleting }: TransactionsListProps) {
  if (transactions.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
        <p className="text-sm text-slate-600">Nenhuma transacao encontrada para este mes.</p>
      </section>
    )
  }

  return (
    <section className="space-y-2">
      {transactions.map((item) => (
        <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-900">{item.description}</p>
              <p className="mt-1 text-xs text-slate-600">
                {item.category?.name ?? 'Sem categoria'} - {formatDate(item.occurred_on)}
              </p>
            </div>

            <p className={`text-sm font-semibold ${item.type === 'income' ? 'text-emerald-700' : 'text-rose-700'}`}>
              {item.type === 'income' ? '+' : '-'} {formatCurrency(item.amount)}
            </p>
          </div>

          <div className="mt-3 flex justify-end gap-2">
            <button
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700"
              onClick={() => onEdit(item)}
              type="button"
            >
              Editar
            </button>
            <button
              className="rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-medium text-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isDeleting}
              onClick={() => onDelete(item.id)}
              type="button"
            >
              Excluir
            </button>
          </div>
        </article>
      ))}
    </section>
  )
}
