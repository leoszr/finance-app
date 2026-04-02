'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import type { Goal, GoalInput, GoalKind } from '@/lib/types'

const goalSchema = z
  .object({
    name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres.').max(80, 'Nome muito longo.'),
    kind: z.enum(['monthly_saving', 'final_target']),
    target_amount: z
      .string()
      .min(1, 'Informe o valor alvo.')
      .refine((value) => !Number.isNaN(Number(value.replace(',', '.'))), 'Informe um valor valido.')
      .refine((value) => Number(value.replace(',', '.')) > 0, 'O valor deve ser maior que zero.'),
    current_amount: z
      .string()
      .min(1, 'Informe o valor atual.')
      .refine((value) => !Number.isNaN(Number(value.replace(',', '.'))), 'Informe um valor valido.')
      .refine((value) => Number(value.replace(',', '.')) >= 0, 'O valor atual nao pode ser negativo.'),
    deadline: z.string().optional().or(z.literal(''))
  })
  .superRefine((data, ctx) => {
    if (data.kind === 'final_target') {
      if (!data.deadline) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Prazo futuro obrigatorio para meta com objetivo final.',
          path: ['deadline']
        })
        return
      }

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const deadline = new Date(`${data.deadline}T00:00:00`)

      if (Number.isNaN(deadline.getTime()) || deadline <= today) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Informe uma data futura valida.',
          path: ['deadline']
        })
      }
    }
  })

type GoalFormValues = z.infer<typeof goalSchema>

type GoalFormProps = {
  mode: 'create' | 'edit'
  initialData?: Goal
  isSaving: boolean
  onCancel?: () => void
  onSubmit: (input: GoalInput) => Promise<void>
}

function mapKind(kind: GoalKind) {
  return kind === 'monthly_saving' ? 'Economia mensal' : 'Objetivo final'
}

export function GoalForm({ mode, initialData, isSaving, onCancel, onSubmit }: GoalFormProps) {
  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      kind: initialData?.kind ?? 'monthly_saving',
      target_amount: initialData ? String(initialData.target_amount) : '',
      current_amount: initialData ? String(initialData.current_amount) : '0',
      deadline: initialData?.deadline ?? ''
    }
  })

  useEffect(() => {
    form.reset({
      name: initialData?.name ?? '',
      kind: initialData?.kind ?? 'monthly_saving',
      target_amount: initialData ? String(initialData.target_amount) : '',
      current_amount: initialData ? String(initialData.current_amount) : '0',
      deadline: initialData?.deadline ?? ''
    })
  }, [form, initialData])

  const selectedKind = form.watch('kind')

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit({
      name: values.name.trim(),
      kind: values.kind,
      target_amount: Number(values.target_amount.replace(',', '.')),
      current_amount: Number(values.current_amount.replace(',', '.')),
      deadline: values.kind === 'final_target' ? values.deadline || null : null,
      active: true
    })
  })

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="goal-name">
          Nome da meta
        </label>
        <input
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          id="goal-name"
          placeholder="Ex: Reserva de emergência"
          type="text"
          {...form.register('name')}
        />
        {form.formState.errors.name ? (
          <p className="mt-1 text-xs text-rose-600">{form.formState.errors.name.message}</p>
        ) : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="goal-kind">
          Tipo
        </label>
        <select
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          id="goal-kind"
          {...form.register('kind')}
        >
          <option value="monthly_saving">{mapKind('monthly_saving')}</option>
          <option value="final_target">{mapKind('final_target')}</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="goal-target">
            Valor alvo
          </label>
          <input
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            id="goal-target"
            inputMode="decimal"
            placeholder="0,00"
            type="text"
            {...form.register('target_amount')}
          />
          {form.formState.errors.target_amount ? (
            <p className="mt-1 text-xs text-rose-600">{form.formState.errors.target_amount.message}</p>
          ) : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="goal-current">
            Valor atual
          </label>
          <input
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            id="goal-current"
            inputMode="decimal"
            placeholder="0,00"
            type="text"
            {...form.register('current_amount')}
          />
          {form.formState.errors.current_amount ? (
            <p className="mt-1 text-xs text-rose-600">{form.formState.errors.current_amount.message}</p>
          ) : null}
        </div>
      </div>

      {selectedKind === 'final_target' ? (
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="goal-deadline">
            Prazo
          </label>
          <input
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            id="goal-deadline"
            type="date"
            {...form.register('deadline')}
          />
          {form.formState.errors.deadline ? (
            <p className="mt-1 text-xs text-rose-600">{form.formState.errors.deadline.message}</p>
          ) : null}
        </div>
      ) : null}

      <div className="flex items-center justify-end gap-2">
        {onCancel ? (
          <button
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700"
            onClick={onCancel}
            type="button"
          >
            Cancelar
          </button>
        ) : null}
        <button
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          disabled={isSaving}
          type="submit"
        >
          {isSaving ? 'Salvando...' : mode === 'create' ? 'Criar meta' : 'Salvar meta'}
        </button>
      </div>
    </form>
  )
}
