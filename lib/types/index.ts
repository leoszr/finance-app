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
