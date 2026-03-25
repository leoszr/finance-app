export function getSupabaseUrl() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  if (!value) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL nao configurada')
  }

  return value
}

export function getSupabaseAnonKey() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

  if (!value) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY nao configurada')
  }

  return value
}
