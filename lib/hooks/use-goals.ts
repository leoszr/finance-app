'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createClient } from '@/lib/supabase/client'
import type { Goal, GoalInput } from '@/lib/types'

const GOALS_KEY = 'goals'

export type GoalWithProgress = Goal & {
  percentage: number
  isCompleted: boolean
}

function enrichGoal(goal: Goal): GoalWithProgress {
  const percentage = goal.target_amount > 0 ? (Number(goal.current_amount) / Number(goal.target_amount)) * 100 : 0

  return {
    ...goal,
    percentage,
    isCompleted: Number(goal.current_amount) >= Number(goal.target_amount)
  }
}

async function fetchGoals(): Promise<GoalWithProgress[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('Nao foi possivel carregar as metas.')
  }

  return ((data as Goal[] | null) ?? []).map(enrichGoal)
}

export function useGoals() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: [GOALS_KEY],
    queryFn: fetchGoals
  })

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: [GOALS_KEY] })
  }

  const createGoal = useMutation({
    mutationFn: async (input: GoalInput) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('goals')
        .insert({
          name: input.name,
          kind: input.kind,
          target_amount: input.target_amount,
          current_amount: input.current_amount ?? 0,
          deadline: input.deadline ?? null,
          active: input.active ?? true
        })
        .select('*')
        .single()

      if (error) {
        throw new Error('Nao foi possivel criar a meta.')
      }

      return enrichGoal(data as Goal)
    },
    onSuccess: async () => {
      await invalidate()
    }
  })

  const updateGoal = useMutation({
    mutationFn: async (payload: { id: string; input: GoalInput }) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('goals')
        .update({
          name: payload.input.name,
          kind: payload.input.kind,
          target_amount: payload.input.target_amount,
          current_amount: payload.input.current_amount,
          deadline: payload.input.deadline ?? null,
          active: payload.input.active ?? true
        })
        .eq('id', payload.id)
        .select('*')
        .single()

      if (error) {
        throw new Error('Nao foi possivel atualizar a meta.')
      }

      return enrichGoal(data as Goal)
    },
    onSuccess: async () => {
      await invalidate()
    }
  })

  const archiveGoal = useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('goals').update({ active: false }).eq('id', id)

      if (error) {
        throw new Error('Nao foi possivel arquivar a meta.')
      }
    },
    onSuccess: async () => {
      await invalidate()
    }
  })

  const addToGoal = useMutation({
    mutationFn: async (payload: { id: string; amount: number }) => {
      const goal = (query.data ?? []).find((item) => item.id === payload.id)

      if (!goal) {
        throw new Error('Meta nao encontrada.')
      }

      const supabase = createClient()
      const nextAmount = Number(goal.current_amount) + payload.amount
      const { data, error } = await supabase
        .from('goals')
        .update({ current_amount: nextAmount })
        .eq('id', payload.id)
        .select('*')
        .single()

      if (error) {
        throw new Error('Nao foi possivel adicionar aporte.')
      }

      return enrichGoal(data as Goal)
    },
    onSuccess: async () => {
      await invalidate()
    }
  })

  return {
    goals: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createGoal,
    updateGoal,
    archiveGoal,
    addToGoal
  }
}
