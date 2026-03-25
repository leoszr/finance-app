'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createClient } from '@/lib/supabase/client'

export type Recurrent = {
  id: string
  user_id: string
  category_id: string
  type: 'income' | 'expense'
  amount: number
  description: string
  day_of_month: number
  active: boolean
  created_at: string
  updated_at: string
}

export type RecurrentInput = {
  category_id: string
  type: 'income' | 'expense'
  amount: number
  description: string
  day_of_month: number
  active: boolean
}

const RECURRENTS_KEY = 'recurrents'

async function fetchRecurrents() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('recurrents')
    .select('*')
    .order('active', { ascending: false })
    .order('day_of_month', { ascending: true })

  if (error) {
    throw new Error('Nao foi possivel carregar as recorrencias.')
  }

  return (data as Recurrent[]) ?? []
}

export function useRecurrents() {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: [RECURRENTS_KEY],
    queryFn: fetchRecurrents
  })

  const createRecurrent = useMutation({
    mutationFn: async (input: RecurrentInput) => {
      const supabase = createClient()
      const { data, error } = await supabase.from('recurrents').insert(input).select('*').single()

      if (error) {
        throw new Error('Nao foi possivel criar a recorrencia.')
      }

      return data as Recurrent
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [RECURRENTS_KEY] })
    }
  })

  const updateRecurrent = useMutation({
    mutationFn: async (payload: { id: string; input: RecurrentInput }) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('recurrents')
        .update(payload.input)
        .eq('id', payload.id)
        .select('*')
        .single()

      if (error) {
        throw new Error('Nao foi possivel atualizar a recorrencia.')
      }

      return data as Recurrent
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [RECURRENTS_KEY] })
    }
  })

  const deleteRecurrent = useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('recurrents').delete().eq('id', id)

      if (error) {
        throw new Error('Nao foi possivel excluir a recorrencia.')
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [RECURRENTS_KEY] })
    }
  })

  return {
    recurrents: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createRecurrent,
    updateRecurrent,
    deleteRecurrent
  }
}
