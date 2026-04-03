'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useCategories } from '@/lib/hooks/use-categories'
import type { Category, CategoryKind } from '@/lib/types'

const categorySchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter ao menos 2 caracteres.')
    .max(40, 'Nome deve ter no maximo 40 caracteres.'),
  kind: z.enum(['income', 'expense', 'investment']),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Cor invalida.')
})

type CategoryFormValues = z.infer<typeof categorySchema>

type CreateCategoryFormProps = {
  defaultKind: CategoryKind
  onCreated?: (category: Category) => void
}

export function CreateCategoryForm({ defaultKind, onCreated }: CreateCategoryFormProps) {
  const { createCategory } = useCategories()

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      kind: defaultKind,
      color: '#334155'
    }
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    const created = await createCategory.mutateAsync({
      name: values.name.trim(),
      kind: values.kind,
      color: values.color,
      icon: 'Circle'
    })

    form.reset({
      name: '',
      kind: values.kind,
      color: values.color
    })

    onCreated?.(created)
  })

  return (
    <form className="glass-card mt-2 space-y-3 rounded-xl p-3" onSubmit={handleSubmit}>
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <input
          className="glass-btn rounded-lg px-3 py-2 text-sm"
          placeholder="Nome da categoria"
          type="text"
          {...form.register('name')}
        />
        <input className="h-10 w-12 rounded-lg border" type="color" {...form.register('color')} />
      </div>

      <div className="flex items-center gap-2">
        <select className="glass-btn rounded-lg px-3 py-2 text-xs" {...form.register('kind')}>
          <option value="income">Receita</option>
          <option value="expense">Despesa</option>
          <option value="investment">Investimento</option>
        </select>

        <button
          className="glass-btn rounded-lg px-3 py-2 text-xs font-medium"
          disabled={createCategory.isPending}
          type="submit"
        >
          {createCategory.isPending ? 'Criando...' : 'Criar categoria'}
        </button>
      </div>

      {form.formState.errors.name ? <p className="text-xs text-rose-700">{form.formState.errors.name.message}</p> : null}
      {createCategory.isError ? (
        <p className="text-xs text-rose-700">
          {createCategory.error instanceof Error ? createCategory.error.message : 'Falha ao criar categoria.'}
        </p>
      ) : null}
      {createCategory.isSuccess ? <p className="text-xs text-emerald-700">Categoria criada com sucesso.</p> : null}
    </form>
  )
}
