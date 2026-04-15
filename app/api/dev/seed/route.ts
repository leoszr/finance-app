import { NextResponse, type NextRequest } from 'next/server'

import { createClient } from '@/lib/supabase/server'

type SeedOptions = {
  reset?: boolean
}

function monthDate(base: Date, offset: number) {
  const date = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth() + offset, 1))
  return date.toISOString().slice(0, 10)
}

function dayInMonth(base: Date, offset: number, day: number) {
  const date = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth() + offset, day))
  return date.toISOString().slice(0, 10)
}

async function runSeed(request: NextRequest, options: SeedOptions = {}) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Seed desabilitado em produção.' }, { status: 403 })
  }

  const supabase = await createClient()
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: 'Usuário não autenticado.' }, { status: 401 })
  }

  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('id, name, kind')
    .order('name')

  if (categoriesError || !categories || categories.length === 0) {
    return NextResponse.json({ error: 'Não foi possível carregar categorias do usuário.' }, { status: 400 })
  }

  const incomeCategories = categories.filter((item) => item.kind === 'income')
  const expenseCategories = categories.filter((item) => item.kind === 'expense')

  if (incomeCategories.length === 0 || expenseCategories.length === 0) {
    return NextResponse.json({ error: 'Usuário precisa ter categorias de receita e despesa.' }, { status: 400 })
  }

  const pick = (kind: 'income' | 'expense', names: string[]) => {
    const source = kind === 'income' ? incomeCategories : expenseCategories
    const found = source.find((item) => names.includes(item.name))
    return found ?? source[0]
  }

  const salaryCategory = pick('income', ['Salario'])
  const freelanceCategory = pick('income', ['Freelance'])
  const housingCategory = pick('expense', ['Moradia'])
  const foodCategory = pick('expense', ['Alimentacao'])
  const transportCategory = pick('expense', ['Transporte'])
  const healthCategory = pick('expense', ['Saude'])

  const { count: existingCount, error: countError } = await supabase
    .from('transactions')
    .select('*', { count: 'exact', head: true })

  if (countError) {
    return NextResponse.json({ error: 'Não foi possível verificar transações existentes.' }, { status: 400 })
  }

  const shouldReset = Boolean(options.reset)

  if (!shouldReset && (existingCount ?? 0) >= 20) {
    return NextResponse.json({
      message: 'Seed ignorado: já existem dados suficientes. Use reset=true para recriar.',
      existingTransactions: existingCount
    })
  }

  if (shouldReset) {
    const [deleteTransactions, deleteBudgets, deleteGoals, deleteRecurrents] = await Promise.all([
      supabase.from('transactions').delete().eq('user_id', user.id),
      supabase.from('budgets').delete().eq('user_id', user.id),
      supabase.from('goals').delete().eq('user_id', user.id),
      supabase.from('recurrents').delete().eq('user_id', user.id)
    ])

    const hasDeleteError =
      deleteTransactions.error || deleteBudgets.error || deleteGoals.error || deleteRecurrents.error

    if (hasDeleteError) {
      return NextResponse.json({ error: 'Falha ao limpar dados anteriores para reset.' }, { status: 400 })
    }
  }

  const now = new Date()

  const transactions = [
    // mês atual
    {
      user_id: user.id,
      category_id: salaryCategory.id,
      type: 'income',
      amount: 7500,
      description: 'Salário mensal',
      occurred_on: dayInMonth(now, 0, 5),
      source: 'manual'
    },
    {
      user_id: user.id,
      category_id: freelanceCategory.id,
      type: 'income',
      amount: 1800,
      description: 'Freelance de dashboard',
      occurred_on: dayInMonth(now, 0, 19),
      source: 'manual'
    },
    {
      user_id: user.id,
      category_id: housingCategory.id,
      type: 'expense',
      amount: 2300,
      description: 'Aluguel',
      occurred_on: dayInMonth(now, 0, 8),
      source: 'manual'
    },
    {
      user_id: user.id,
      category_id: foodCategory.id,
      type: 'expense',
      amount: 420.5,
      description: 'Supermercado',
      occurred_on: dayInMonth(now, 0, 12),
      source: 'manual'
    },
    {
      user_id: user.id,
      category_id: transportCategory.id,
      type: 'expense',
      amount: 120.9,
      description: 'Uber trabalho',
      occurred_on: dayInMonth(now, 0, 14),
      source: 'csv_nubank'
    },
    {
      user_id: user.id,
      category_id: healthCategory.id,
      type: 'expense',
      amount: 95,
      description: 'Farmácia',
      occurred_on: dayInMonth(now, 0, 16),
      source: 'csv_nubank'
    },

    // últimos 5 meses
    {
      user_id: user.id,
      category_id: salaryCategory.id,
      type: 'income',
      amount: 7300,
      description: 'Salário mensal',
      occurred_on: dayInMonth(now, -1, 5),
      source: 'manual'
    },
    {
      user_id: user.id,
      category_id: housingCategory.id,
      type: 'expense',
      amount: 2200,
      description: 'Aluguel',
      occurred_on: dayInMonth(now, -1, 8),
      source: 'manual'
    },
    {
      user_id: user.id,
      category_id: foodCategory.id,
      type: 'expense',
      amount: 510,
      description: 'Mercado do mês',
      occurred_on: dayInMonth(now, -1, 18),
      source: 'manual'
    },
    {
      user_id: user.id,
      category_id: salaryCategory.id,
      type: 'income',
      amount: 7100,
      description: 'Salário mensal',
      occurred_on: dayInMonth(now, -2, 5),
      source: 'manual'
    },
    {
      user_id: user.id,
      category_id: foodCategory.id,
      type: 'expense',
      amount: 470,
      description: 'Supermercado',
      occurred_on: dayInMonth(now, -2, 20),
      source: 'manual'
    },
    {
      user_id: user.id,
      category_id: transportCategory.id,
      type: 'expense',
      amount: 250,
      description: 'Combustível',
      occurred_on: dayInMonth(now, -2, 22),
      source: 'manual'
    },
    {
      user_id: user.id,
      category_id: salaryCategory.id,
      type: 'income',
      amount: 7000,
      description: 'Salário mensal',
      occurred_on: dayInMonth(now, -3, 5),
      source: 'manual'
    },
    {
      user_id: user.id,
      category_id: housingCategory.id,
      type: 'expense',
      amount: 2100,
      description: 'Aluguel',
      occurred_on: dayInMonth(now, -3, 8),
      source: 'manual'
    },
    {
      user_id: user.id,
      category_id: healthCategory.id,
      type: 'expense',
      amount: 330,
      description: 'Consulta médica',
      occurred_on: dayInMonth(now, -3, 25),
      source: 'manual'
    },
    {
      user_id: user.id,
      category_id: salaryCategory.id,
      type: 'income',
      amount: 6900,
      description: 'Salário mensal',
      occurred_on: dayInMonth(now, -4, 5),
      source: 'manual'
    },
    {
      user_id: user.id,
      category_id: foodCategory.id,
      type: 'expense',
      amount: 390,
      description: 'Feira',
      occurred_on: dayInMonth(now, -4, 11),
      source: 'manual'
    },
    {
      user_id: user.id,
      category_id: transportCategory.id,
      type: 'expense',
      amount: 140,
      description: 'Passagem',
      occurred_on: dayInMonth(now, -4, 15),
      source: 'manual'
    },
    {
      user_id: user.id,
      category_id: salaryCategory.id,
      type: 'income',
      amount: 6800,
      description: 'Salário mensal',
      occurred_on: dayInMonth(now, -5, 5),
      source: 'manual'
    },
    {
      user_id: user.id,
      category_id: housingCategory.id,
      type: 'expense',
      amount: 2050,
      description: 'Aluguel',
      occurred_on: dayInMonth(now, -5, 8),
      source: 'manual'
    }
  ]

  const budgets = [
    {
      user_id: user.id,
      category_id: housingCategory.id,
      month: monthDate(now, 0),
      limit_amount: 2500
    },
    {
      user_id: user.id,
      category_id: foodCategory.id,
      month: monthDate(now, 0),
      limit_amount: 900
    },
    {
      user_id: user.id,
      category_id: transportCategory.id,
      month: monthDate(now, 0),
      limit_amount: 400
    }
  ]

  const goals = [
    {
      user_id: user.id,
      name: 'Reserva mensal',
      kind: 'monthly_saving',
      target_amount: 2000,
      current_amount: 650,
      deadline: null,
      active: true
    },
    {
      user_id: user.id,
      name: 'Viagem fim de ano',
      kind: 'final_target',
      target_amount: 12000,
      current_amount: 4200,
      deadline: monthDate(now, 8),
      active: true
    }
  ]

  const recurrents = [
    {
      user_id: user.id,
      category_id: salaryCategory.id,
      type: 'income',
      amount: 7500,
      description: 'Salário',
      day_of_month: 5,
      active: true
    },
    {
      user_id: user.id,
      category_id: housingCategory.id,
      type: 'expense',
      amount: 2300,
      description: 'Aluguel',
      day_of_month: 8,
      active: true
    }
  ]

  const [insertTransactions, upsertBudgets, insertGoals, insertRecurrents] = await Promise.all([
    supabase.from('transactions').insert(transactions),
    supabase.from('budgets').upsert(budgets, { onConflict: 'user_id,category_id,month' }),
    supabase.from('goals').insert(goals),
    supabase.from('recurrents').insert(recurrents)
  ])

  const hasInsertError =
    insertTransactions.error || upsertBudgets.error || insertGoals.error || insertRecurrents.error

  if (hasInsertError) {
    return NextResponse.json(
      {
        error: 'Falha ao inserir dados de seed.',
        details: {
          transactions: insertTransactions.error?.message,
          budgets: upsertBudgets.error?.message,
          goals: insertGoals.error?.message,
          recurrents: insertRecurrents.error?.message
        }
      },
      { status: 400 }
    )
  }

  return NextResponse.json({
    message: 'Dados mock inseridos com sucesso.',
    inserted: {
      transactions: transactions.length,
      budgets: budgets.length,
      goals: goals.length,
      recurrents: recurrents.length
    },
    reset: shouldReset,
    userId: user.id
  })
}

export async function GET(request: NextRequest) {
  const reset = request.nextUrl.searchParams.get('reset') === '1'
  return runSeed(request, { reset })
}

export async function POST(request: NextRequest) {
  let reset = false

  try {
    const body = (await request.json()) as { reset?: boolean }
    reset = Boolean(body?.reset)
  } catch {
    reset = false
  }

  return runSeed(request, { reset })
}
