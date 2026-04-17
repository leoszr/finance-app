'use client'

import { useCategories } from '@/lib/hooks/use-categories'
import type { TransactionHistoryFilters } from '@/lib/transactions-history'

type TransactionsFiltersProps = {
  filters: TransactionHistoryFilters
  onChange: (filters: TransactionHistoryFilters) => void
  onClear: () => void
}

export function TransactionsFilters({ filters, onChange, onClear }: TransactionsFiltersProps) {
  const {
    categories,
    isLoading,
    isError,
    error,
    refetch
  } = useCategories()

  return (
    <section className="glass-card rounded-2xl p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Filtros do historico</h2>
          <p className="mt-1 text-xs text-slate-600">Refine lista e exportacao do mes selecionado.</p>
        </div>
        <button
          className="text-xs font-medium text-slate-700 underline"
          onClick={onClear}
          type="button"
        >
          Limpar
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="transaction-filter-type">
            Tipo
          </label>
          <select
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            id="transaction-filter-type"
            onChange={(event) =>
              onChange({
                ...filters,
                type: event.target.value as TransactionHistoryFilters['type']
              })
            }
            value={filters.type}
          >
            <option value="all">Todos</option>
            <option value="income">Receitas</option>
            <option value="expense">Despesas</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="transaction-filter-category">
            Categoria
          </label>
          <select
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            disabled={isLoading || isError}
            id="transaction-filter-category"
            onChange={(event) =>
              onChange({
                ...filters,
                categoryId: event.target.value
              })
            }
            value={filters.categoryId}
          >
            <option value="all">
              {isLoading ? 'Carregando categorias...' : isError ? 'Falha ao carregar' : 'Todas'}
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {isError ? (
            <div className="mt-1 flex items-center gap-2" role="alert">
              <p className="text-xs text-red-600">{error instanceof Error ? error.message : 'Nao foi possivel carregar categorias.'}</p>
              <button
                className="text-xs font-medium text-slate-700 underline"
                onClick={() => {
                  void refetch()
                }}
                type="button"
              >
                Tentar novamente
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-3">
        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="transaction-filter-search">
          Buscar por descricao ou categoria
        </label>
        <input
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          id="transaction-filter-search"
          onChange={(event) =>
            onChange({
              ...filters,
              search: event.target.value
            })
          }
          placeholder="Ex: mercado"
          type="text"
          value={filters.search}
        />
      </div>
    </section>
  )
}
