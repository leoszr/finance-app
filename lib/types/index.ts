export type AppUser = {
  id: string
  email: string | null
}

export type CategoryKind = 'income' | 'expense' | 'investment'

export type Category = {
  id: string
  name: string
  kind: CategoryKind
  color: string
  icon: string
}

export type CategoryInput = {
  name: string
  kind: CategoryKind
  color?: string
  icon?: string
}

export type TransactionType = 'income' | 'expense'

export type TransactionSource = 'manual' | 'recurring' | 'csv_nubank'

export type Transaction = {
  id: string
  user_id: string
  category_id: string
  recurrent_id?: string | null
  type: TransactionType
  amount: number
  description: string
  occurred_on: string
  source: TransactionSource
  created_at: string
  updated_at: string
  category?: Category | null
}

export type TransactionInput = {
  category_id: string
  type: TransactionType
  amount: number
  description: string
  occurred_on: string
}

export type Budget = {
  id: string
  user_id: string
  category_id: string
  month: string
  limit_amount: number
  created_at: string
  updated_at: string
  category?: Category | null
}

export type BudgetInput = {
  category_id: string
  month: string
  limit_amount: number
}

export type GoalKind = 'monthly_saving' | 'final_target'

export type Goal = {
  id: string
  user_id: string
  name: string
  kind: GoalKind
  target_amount: number
  current_amount: number
  deadline: string | null
  active: boolean
  created_at: string
  updated_at: string
}

export type GoalInput = {
  name: string
  kind: GoalKind
  target_amount: number
  current_amount?: number
  deadline?: string | null
  active?: boolean
}

export type InvestmentType = 'cdb' | 'tesouro_direto' | 'lci' | 'lca' | 'poupanca' | 'outros_renda_fixa'

export type InvestmentRateType = 'fixed' | 'cdi_pct' | 'selic_pct' | 'ipca_plus'

export type Investment = {
  id: string
  user_id: string
  name: string
  type: InvestmentType
  institution: string
  invested_amount: number
  rate_type: InvestmentRateType
  rate_value: number
  start_date: string
  maturity_date: string | null
  notes: string | null
  active: boolean
  created_at: string
  updated_at: string
}

export type InvestmentInput = {
  name: string
  type: InvestmentType
  institution: string
  invested_amount: number
  rate_type: InvestmentRateType
  rate_value: number
  start_date: string
  maturity_date?: string | null
  notes?: string | null
  active?: boolean
}
