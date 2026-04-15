'use client'

import { useState } from 'react'

import { InvestmentForm } from '@/components/investments/investment-form'
import { InvestmentsCalculator } from '@/components/investments/investments-calculator'
import { InvestmentsList } from '@/components/investments/investments-list'
import { ErrorMessage } from '@/components/shared/error-message'
import { Skeleton } from '@/components/shared/skeleton'
import { useToast } from '@/components/ui/toast-provider'
import { formatCurrencyBRL } from '@/lib/formatters'
import { useInvestments } from '@/lib/hooks/use-investments'
import { getInvestmentTypeLabel } from '@/lib/investments'
import type { Investment, InvestmentInput } from '@/lib/types'

type Tab = 'portfolio' | 'calculadora'

function summaryCard(label: string, value: string, tone: 'default' | 'positive' = 'default') {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`mt-1 text-lg font-semibold ${tone === 'positive' ? 'text-emerald-700' : 'text-slate-900'}`}>{value}</p>
    </article>
  )
}

export default function InvestimentosPage() {
  const [activeTab, setActiveTab] = useState<Tab>('portfolio')
  const [editingItem, setEditingItem] = useState<Investment | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const { showToast } = useToast()

  const {
    investments,
    summary,
    isLoading,
    isError,
    error,
    refetch,
    createInvestment,
    updateInvestment,
    archiveInvestment
  } = useInvestments()

  const handleSubmit = async (input: InvestmentInput) => {
    try {
      if (editingItem) {
        await updateInvestment.mutateAsync({ id: editingItem.id, input })
        setEditingItem(null)
        showToast('Investimento atualizado com sucesso.')
      } else {
        await createInvestment.mutateAsync(input)
        setShowCreateForm(false)
        showToast('Investimento cadastrado com sucesso.')
      }
    } catch (mutationError) {
      showToast(mutationError instanceof Error ? mutationError.message : 'Falha ao salvar investimento.', 'error')
    }
  }

  const handleArchive = async (investment: Investment) => {
    try {
      await archiveInvestment.mutateAsync(investment.id)
      if (editingItem?.id === investment.id) {
        setEditingItem(null)
      }
      showToast('Investimento arquivado com sucesso.')
    } catch (mutationError) {
      showToast(mutationError instanceof Error ? mutationError.message : 'Falha ao arquivar investimento.', 'error')
    }
  }

  const isBusy = createInvestment.isPending || updateInvestment.isPending || archiveInvestment.isPending

  return (
    <main aria-busy={isBusy} className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-4 px-5 py-6">
      <header>
        <h1 className="text-xl font-semibold text-slate-900">Investimentos</h1>
        <p className="mt-1 text-sm text-slate-600">Acompanhe carteira de renda fixa e simule projeções com taxas do BCB.</p>
      </header>

      <section className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white p-2">
        <button
          aria-pressed={activeTab === 'portfolio'}
          className={`rounded-xl px-3 py-2 text-sm font-medium ${activeTab === 'portfolio' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
          onClick={() => setActiveTab('portfolio')}
          type="button"
        >
          Portfólio
        </button>
        <button
          aria-pressed={activeTab === 'calculadora'}
          className={`rounded-xl px-3 py-2 text-sm font-medium ${activeTab === 'calculadora' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
          onClick={() => setActiveTab('calculadora')}
          type="button"
        >
          Calculadora
        </button>
      </section>


      {activeTab === 'portfolio' ? (
        <>
          <section className="grid grid-cols-2 gap-3">
            {summaryCard('Total investido', formatCurrencyBRL(summary.totalInvested), 'positive')}
            {summaryCard('Investimentos ativos', String(summary.totalCount))}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-slate-900">Novo investimento</h2>
              <button
                className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white"
                onClick={() => {
                  setEditingItem(null)
                  setShowCreateForm((value) => !value)
                }}
                type="button"
              >
                {showCreateForm ? 'Fechar' : 'Adicionar'}
              </button>
            </div>

            {showCreateForm ? (
              <div className="mt-3 rounded-xl border border-slate-200 p-3">
                <InvestmentForm
                  isSaving={createInvestment.isPending}
                  mode="create"
                  onCancel={() => setShowCreateForm(false)}
                  onSubmit={handleSubmit}
                />
              </div>
            ) : null}
          </section>

          {editingItem ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-4">
              <h2 className="text-sm font-semibold text-slate-900">Editar investimento</h2>
              <div className="mt-3 rounded-xl border border-slate-200 p-3">
                <InvestmentForm
                  initialData={editingItem}
                  isSaving={updateInvestment.isPending}
                  mode="edit"
                  onCancel={() => setEditingItem(null)}
                  onSubmit={handleSubmit}
                />
              </div>
            </section>
          ) : null}

          <section className="rounded-2xl border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-semibold text-slate-900">Resumo da carteira</h2>

            {isLoading ? (
              <div className="mt-3 space-y-3" role="status">
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
              </div>
            ) : isError ? (
              <ErrorMessage
                className="mt-3"
                message={error instanceof Error ? error.message : 'Falha ao carregar investimentos.'}
                onRetry={() => {
                  void refetch()
                }}
              />
            ) : summary.byType.length === 0 ? (
              <p className="mt-3 text-sm text-slate-600">Cadastre investimentos para ver distribuição por tipo.</p>
            ) : (
              <div className="mt-3 space-y-3">
                {summary.byType.map((item) => (
                  <article className="rounded-xl border border-slate-200 p-3" key={item.type}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{getInvestmentTypeLabel(item.type)}</p>
                        <p className="text-xs text-slate-600">{item.count} item(ns)</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900">{formatCurrencyBRL(item.total)}</p>
                        <p className="text-xs text-slate-600">{item.percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full bg-emerald-500" style={{ width: `${Math.min(item.percentage, 100)}%` }} />
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {isLoading ? (
            <section className="space-y-3" role="status">
              <Skeleton className="h-20 rounded-2xl" />
              <Skeleton className="h-20 rounded-2xl" />
            </section>
          ) : isError ? null : (
            <InvestmentsList
              investments={investments}
              isArchiving={archiveInvestment.isPending}
              onArchive={(item) => {
                void handleArchive(item)
              }}
              onEdit={setEditingItem}
            />
          )}
        </>
      ) : (
        <InvestmentsCalculator />
      )}
    </main>
  )
}
