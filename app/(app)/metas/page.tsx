'use client'

import { useMemo, useState } from 'react'

import { BudgetForm } from '@/components/metas/budget-form'
import { GoalForm } from '@/components/metas/goal-form'
import { Skeleton } from '@/components/shared/skeleton'
import { formatCurrencyBRL } from '@/lib/formatters'
import { useBudgets, type BudgetWithProgress } from '@/lib/hooks/use-budgets'
import { useGoals, type GoalWithProgress } from '@/lib/hooks/use-goals'
import type { Budget, Goal } from '@/lib/types'

function currentMonth() {
  return new Date().toISOString().slice(0, 7)
}

function statusBadge(status: BudgetWithProgress['status']) {
  if (status === 'exceeded') {
    return 'bg-rose-100 text-rose-700'
  }

  if (status === 'warning') {
    return 'bg-amber-100 text-amber-700'
  }

  return 'bg-emerald-100 text-emerald-700'
}

function progressColor(percentage: number) {
  if (percentage > 100) {
    return 'bg-rose-500'
  }

  if (percentage >= 80) {
    return 'bg-amber-500'
  }

  return 'bg-emerald-500'
}

export default function MetasPage() {
  const month = currentMonth()

  const {
    budgets,
    isLoading: isBudgetsLoading,
    isError: isBudgetsError,
    error: budgetsError,
    refetch: refetchBudgets,
    createBudget,
    updateBudget,
    deleteBudget
  } = useBudgets({ month })

  const {
    goals,
    isLoading: isGoalsLoading,
    isError: isGoalsError,
    error: goalsError,
    refetch: refetchGoals,
    createGoal,
    updateGoal,
    archiveGoal,
    addToGoal
  } = useGoals()

  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [showBudgetForm, setShowBudgetForm] = useState(false)
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [goalTopUp, setGoalTopUp] = useState<Record<string, string>>({})
  const [actionError, setActionError] = useState<string | null>(null)

  const monthlyGoal = useMemo(() => goals.find((goal) => goal.kind === 'monthly_saving') ?? null, [goals])
  const finalGoals = useMemo(() => goals.filter((goal) => goal.kind === 'final_target'), [goals])

  const handleBudgetSubmit = async (input: { category_id: string; month: string; limit_amount: number }) => {
    setActionError(null)

    try {
      if (editingBudget) {
        await updateBudget.mutateAsync({ id: editingBudget.id, input })
      } else {
        await createBudget.mutateAsync(input)
      }

      setShowBudgetForm(false)
      setEditingBudget(null)
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Falha ao salvar orçamento.')
    }
  }

  const handleGoalSubmit = async (input: {
    name: string
    kind: 'monthly_saving' | 'final_target'
    target_amount: number
    current_amount?: number
    deadline?: string | null
    active?: boolean
  }) => {
    setActionError(null)

    try {
      if (editingGoal) {
        await updateGoal.mutateAsync({ id: editingGoal.id, input })
      } else {
        await createGoal.mutateAsync(input)
      }

      setShowGoalForm(false)
      setEditingGoal(null)
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Falha ao salvar meta.')
    }
  }

  const handleTopUp = async (goal: GoalWithProgress) => {
    const rawValue = goalTopUp[goal.id] ?? ''
    const parsed = Number(rawValue.replace(',', '.'))

    if (Number.isNaN(parsed) || parsed <= 0) {
      setActionError('Informe um aporte valido maior que zero.')
      return
    }

    setActionError(null)

    try {
      await addToGoal.mutateAsync({ id: goal.id, amount: parsed })
      setGoalTopUp((current) => ({ ...current, [goal.id]: '' }))
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Falha ao adicionar aporte.')
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-4 px-5 py-6">
      <header>
        <h1 className="text-xl font-semibold text-slate-900">Metas e orçamentos</h1>
        <p className="mt-1 text-sm text-slate-600">Planejamento do mês para manter gastos sob controle.</p>
      </header>

      {actionError ? (
        <section className="rounded-2xl border border-rose-200 bg-rose-50 p-3" role="alert" aria-live="assertive">
          <p className="text-sm text-rose-700">{actionError}</p>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-slate-900">Orçamentos do mês</h2>
          <button
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white"
            onClick={() => {
              setEditingBudget(null)
              setShowBudgetForm((value) => !value)
            }}
            type="button"
          >
            {showBudgetForm ? 'Fechar' : 'Novo orçamento'}
          </button>
        </div>

        {showBudgetForm ? (
          <div className="mt-3 rounded-xl border border-slate-200 p-3">
            <BudgetForm
              initialData={editingBudget ?? undefined}
              isSaving={createBudget.isPending || updateBudget.isPending}
              mode={editingBudget ? 'edit' : 'create'}
              month={month}
              onCancel={() => {
                setShowBudgetForm(false)
                setEditingBudget(null)
              }}
              onSubmit={handleBudgetSubmit}
            />
          </div>
        ) : null}

        <div className="mt-3 space-y-3">
          {isBudgetsLoading ? (
            <div className="space-y-3" role="status">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
          ) : null}
          {isBudgetsError ? (
            <div className="space-y-2" role="alert">
              <p className="text-sm text-rose-700">{budgetsError instanceof Error ? budgetsError.message : 'Falha ao carregar orçamentos.'}</p>
              <button
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium"
                onClick={() => {
                  void refetchBudgets()
                }}
                type="button"
              >
                Tentar novamente
              </button>
            </div>
          ) : null}

          {!isBudgetsLoading && !isBudgetsError && budgets.length === 0 ? (
            <p className="text-sm text-slate-600">Nenhum orçamento criado para este mês.</p>
          ) : null}

          {budgets.map((budget) => (
            <article className="rounded-xl border border-slate-200 p-3" key={budget.id}>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">{budget.category?.name ?? 'Categoria'}</p>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusBadge(budget.status)}`}>
                  {budget.status === 'ok' ? 'Dentro do limite' : budget.status === 'warning' ? 'No limite' : 'Excedido'}
                </span>
              </div>

              <p className="mt-1 text-xs text-slate-600">
                {formatCurrencyBRL(budget.spent)} de {formatCurrencyBRL(Number(budget.limit_amount))}
              </p>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full ${progressColor(budget.percentage)}`}
                  style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                />
              </div>

              <div className="mt-3 flex items-center gap-2">
                <button
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium"
                  onClick={() => {
                    setEditingBudget(budget)
                    setShowBudgetForm(true)
                  }}
                  type="button"
                >
                  Editar
                </button>
                <button
                  className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700"
                  onClick={() => {
                    void deleteBudget.mutateAsync(budget.id)
                  }}
                  type="button"
                >
                  Excluir
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-slate-900">Metas</h2>
          <button
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white"
            onClick={() => {
              setEditingGoal(null)
              setShowGoalForm((value) => !value)
            }}
            type="button"
          >
            {showGoalForm ? 'Fechar' : 'Nova meta'}
          </button>
        </div>

        {showGoalForm ? (
          <div className="mt-3 rounded-xl border border-slate-200 p-3">
            <GoalForm
              initialData={editingGoal ?? undefined}
              isSaving={createGoal.isPending || updateGoal.isPending}
              mode={editingGoal ? 'edit' : 'create'}
              onCancel={() => {
                setShowGoalForm(false)
                setEditingGoal(null)
              }}
              onSubmit={handleGoalSubmit}
            />
          </div>
        ) : null}

        <div className="mt-3 space-y-3">
          {isGoalsLoading ? (
            <div className="space-y-3" role="status">
              <Skeleton className="h-20" />
              <Skeleton className="h-28" />
            </div>
          ) : null}
          {isGoalsError ? (
            <div className="space-y-2" role="alert">
              <p className="text-sm text-rose-700">{goalsError instanceof Error ? goalsError.message : 'Falha ao carregar metas.'}</p>
              <button
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium"
                onClick={() => {
                  void refetchGoals()
                }}
                type="button"
              >
                Tentar novamente
              </button>
            </div>
          ) : null}

          {monthlyGoal ? (
            <article className="rounded-xl border border-slate-200 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Meta mensal</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{monthlyGoal.name}</p>
              <p className="mt-1 text-xs text-slate-600">
                {formatCurrencyBRL(Number(monthlyGoal.current_amount))} de {formatCurrencyBRL(Number(monthlyGoal.target_amount))}
              </p>
            </article>
          ) : (
            <p className="text-sm text-slate-600">Nenhuma meta mensal ativa.</p>
          )}

          <div className="space-y-3">
            {finalGoals.map((goal) => (
              <article className="rounded-xl border border-slate-200 p-3" key={goal.id}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{goal.name}</p>
                    <p className="mt-1 text-xs text-slate-600">
                      {formatCurrencyBRL(Number(goal.current_amount))} de {formatCurrencyBRL(Number(goal.target_amount))}
                    </p>
                  </div>
                  {goal.isCompleted ? (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                      Concluída
                    </span>
                  ) : null}
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full bg-sky-500" style={{ width: `${Math.min(goal.percentage, 100)}%` }} />
                </div>

                <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                  <input
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs"
                    inputMode="decimal"
                    placeholder="Adicionar aporte"
                    type="text"
                    value={goalTopUp[goal.id] ?? ''}
                    onChange={(event) => {
                      setGoalTopUp((current) => ({ ...current, [goal.id]: event.target.value }))
                    }}
                  />
                  <button
                    className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white"
                    onClick={() => {
                      void handleTopUp(goal)
                    }}
                    type="button"
                  >
                    Aportar
                  </button>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium"
                    onClick={() => {
                      setEditingGoal(goal)
                      setShowGoalForm(true)
                    }}
                    type="button"
                  >
                    Editar
                  </button>
                  <button
                    className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700"
                    onClick={() => {
                      void archiveGoal.mutateAsync(goal.id)
                    }}
                    type="button"
                  >
                    Arquivar
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
