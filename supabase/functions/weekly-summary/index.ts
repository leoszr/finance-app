import { createClient } from 'npm:@supabase/supabase-js@2.49.8'

type Env = {
  SUPABASE_URL?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
  RESEND_API_KEY?: string
  RESEND_FROM_EMAIL?: string
  APP_URL?: string
}

type WeeklyExpenseRow = {
  amount: number | string
  category: {
    name: string
  } | null
}

type MonthlyBudgetRow = {
  id: string
  limit_amount: number | string
  category_id: string
  category: {
    name: string
  } | null
}

type MonthlyExpenseRow = {
  amount: number | string
  category_id: string
}

type TopCategory = {
  name: string
  total: number
  percentage: number
}

type BudgetProgressItem = {
  name: string
  spent: number
  limit: number
  percentage: number
}

type EmailPayload = {
  userName: string
  totalSpent: number
  topCategories: TopCategory[]
  budgets: BudgetProgressItem[]
  weekStart: string
  weekEnd: string
  appUrl: string
}

function requireEnv(name: keyof Env, env: Env) {
  const value = env[name]?.trim()

  if (!value) {
    throw new Error(`Variavel obrigatoria ausente: ${name}`)
  }

  return value
}

function formatCurrencyBRL(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

function formatDateBR(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(`${value}T00:00:00Z`))
}

function getWeekRange() {
  const end = new Date()
  end.setUTCHours(0, 0, 0, 0)

  const start = new Date(end)
  start.setUTCDate(end.getUTCDate() - 7)

  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
    monthKey: end.toISOString().slice(0, 7)
  }
}

function getNextMonthStart(monthKey: string) {
  const [yearRaw, monthRaw] = monthKey.split('-')
  const year = Number(yearRaw)
  const monthIndex = Number(monthRaw) - 1
  const nextMonth = new Date(Date.UTC(year, monthIndex + 1, 1))

  return nextMonth.toISOString().slice(0, 10)
}

async function listAllUsers(supabase: ReturnType<typeof createClient>) {
  const users: Array<{ id: string; email?: string | null; user_metadata?: { full_name?: string } | null }> = []
  let page = 1
  const perPage = 100

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage })

    if (error) {
      throw error
    }

    users.push(...data.users)

    if (data.users.length < perPage) {
      break
    }

    page += 1
  }

  return users
}

function buildTopCategories(transactions: WeeklyExpenseRow[], totalSpent: number) {
  const totals = new Map<string, number>()

  transactions.forEach((transaction) => {
    const name = transaction.category?.name ?? 'Sem categoria'
    const current = totals.get(name) ?? 0
    totals.set(name, current + Number(transaction.amount))
  })

  return Array.from(totals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, total]) => ({
      name,
      total,
      percentage: totalSpent > 0 ? (total / totalSpent) * 100 : 0
    }))
}

function buildBudgetProgress(budgets: MonthlyBudgetRow[], expenses: MonthlyExpenseRow[]) {
  const expenseMap = new Map<string, number>()

  expenses.forEach((expense) => {
    const current = expenseMap.get(expense.category_id) ?? 0
    expenseMap.set(expense.category_id, current + Number(expense.amount))
  })

  return budgets
    .map((budget) => {
      const limit = Number(budget.limit_amount)
      const spent = expenseMap.get(budget.category_id) ?? 0
      const percentage = limit > 0 ? (spent / limit) * 100 : 0

      return {
        name: budget.category?.name ?? 'Categoria',
        spent,
        limit,
        percentage
      }
    })
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 3)
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function generateEmailHtml({ userName, totalSpent, topCategories, budgets, weekStart, weekEnd, appUrl }: EmailPayload) {
  const safeName = escapeHtml(userName)
  const safeAppUrl = escapeHtml(appUrl)
  const topCategoriesHtml = topCategories.length > 0
    ? topCategories
      .map((item) => `
        <div class="row">
          <span>${escapeHtml(item.name)}</span>
          <strong>${formatCurrencyBRL(item.total)} (${item.percentage.toFixed(0)}%)</strong>
        </div>
      `)
      .join('')
    : '<p class="muted">Nenhuma categoria encontrada na semana.</p>'

  const budgetsHtml = budgets.length > 0
    ? budgets
      .map((item) => `
        <div class="row budget-row">
          <span>${escapeHtml(item.name)}</span>
          <strong>${formatCurrencyBRL(item.spent)} de ${formatCurrencyBRL(item.limit)}</strong>
        </div>
      `)
      .join('')
    : '<p class="muted">Nenhum orçamento ativo neste mês.</p>'

  return `
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Resumo semanal</title>
    <style>
      body { margin: 0; padding: 24px; background: #f8fafc; color: #0f172a; font-family: Arial, sans-serif; }
      .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; }
      .eyebrow { color: #16a34a; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
      h1 { margin: 12px 0 8px; font-size: 28px; }
      p { margin: 0; line-height: 1.6; }
      .muted { color: #64748b; }
      .summary { margin-top: 20px; border-radius: 12px; background: #f1f5f9; padding: 16px; }
      .amount { margin-top: 8px; font-size: 32px; font-weight: 700; color: #16a34a; }
      .section { margin-top: 24px; }
      .section h2 { margin: 0 0 12px; font-size: 18px; }
      .row { display: flex; justify-content: space-between; gap: 12px; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
      .row:last-child { border-bottom: 0; }
      .budget-row strong { text-align: right; }
      .button { display: inline-block; margin-top: 24px; background: #0f172a; color: #ffffff !important; padding: 12px 18px; border-radius: 10px; text-decoration: none; font-weight: 700; }
      .footer { margin-top: 24px; font-size: 12px; color: #64748b; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="eyebrow">Finance App</div>
      <h1>Olá, ${safeName}!</h1>
      <p class="muted">Resumo dos seus gastos entre ${formatDateBR(weekStart)} e ${formatDateBR(weekEnd)}.</p>

      <div class="summary">
        <p class="muted">Total gasto na semana</p>
        <div class="amount">${formatCurrencyBRL(totalSpent)}</div>
      </div>

      <div class="section">
        <h2>Top 3 categorias</h2>
        ${topCategoriesHtml}
      </div>

      <div class="section">
        <h2>Progresso dos orçamentos</h2>
        ${budgetsHtml}
      </div>

      <a class="button" href="${safeAppUrl}/dashboard">Abrir dashboard</a>

      <div class="footer">
        Você recebeu este e-mail por ter movimentação recente no Finance App.
      </div>
    </div>
  </body>
</html>
  `
}

Deno.serve(async () => {
  try {
    const env = Deno.env.toObject() as Env
    const supabaseUrl = requireEnv('SUPABASE_URL', env)
    const serviceRoleKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY', env)
    const resendApiKey = requireEnv('RESEND_API_KEY', env)
    const fromEmail = requireEnv('RESEND_FROM_EMAIL', env)
    const appUrl = requireEnv('APP_URL', env)
    const supabase = createClient(supabaseUrl, serviceRoleKey)
    const { startDate, endDate, monthKey } = getWeekRange()
    const nextMonthStart = getNextMonthStart(monthKey)
    const users = await listAllUsers(supabase)

    let emailsSent = 0
    let usersWithNoActivity = 0
    let failures = 0

    for (const user of users) {
      if (!user.email) {
        continue
      }

      try {
        const { data: weeklyTransactions, error: weeklyError } = await supabase
          .from('transactions')
          .select('amount, category:categories(name)')
          .eq('user_id', user.id)
          .eq('type', 'expense')
          .gte('occurred_on', startDate)
          .lt('occurred_on', endDate)

        if (weeklyError) {
          throw weeklyError
        }

        const expenses = (weeklyTransactions as WeeklyExpenseRow[] | null) ?? []

        if (expenses.length === 0) {
          usersWithNoActivity += 1
          continue
        }

        const totalSpent = expenses.reduce((sum, item) => sum + Number(item.amount), 0)
        const topCategories = buildTopCategories(expenses, totalSpent)

        const [{ data: budgetsData, error: budgetsError }, { data: monthlyExpensesData, error: monthlyExpensesError }] = await Promise.all([
          supabase
            .from('budgets')
            .select('id, limit_amount, category_id, category:categories(name)')
            .eq('user_id', user.id)
            .eq('month', monthKey),
          supabase
            .from('transactions')
            .select('amount, category_id')
            .eq('user_id', user.id)
            .eq('type', 'expense')
            .gte('occurred_on', `${monthKey}-01`)
            .lt('occurred_on', nextMonthStart)
        ])

        if (budgetsError) {
          throw budgetsError
        }

        if (monthlyExpensesError) {
          throw monthlyExpensesError
        }

        const budgets = buildBudgetProgress(
          (budgetsData as MonthlyBudgetRow[] | null) ?? [],
          (monthlyExpensesData as MonthlyExpenseRow[] | null) ?? []
        )

        const userName = user.user_metadata?.full_name?.trim() || user.email.split('@')[0]
        const emailHtml = generateEmailHtml({
          userName,
          totalSpent,
          topCategories,
          budgets,
          weekStart: startDate,
          weekEnd: endDate,
          appUrl
        })

        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendApiKey}`
          },
          body: JSON.stringify({
            from: fromEmail,
            to: user.email,
            subject: 'Seu resumo financeiro semanal',
            html: emailHtml
          })
        })

        if (!emailResponse.ok) {
          throw new Error(await emailResponse.text())
        }

        emailsSent += 1
      } catch (error) {
        failures += 1
        console.error(`Erro ao processar usuário ${user.email}:`, error)
      }
    }

    return Response.json({
      success: true,
      usersProcessed: users.length,
      emailsSent,
      usersWithNoActivity,
      failures
    })
  } catch (error) {
    console.error('Falha geral na weekly-summary:', error)

    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno'
      },
      { status: 500 }
    )
  }
})
