function readEnv(name: string): string | undefined {
  const value = process.env[name]
  if (!value || value.trim().length === 0) {
    return undefined
  }

  return value
}

export function getSupabaseUrl() {
  const value = readEnv('NEXT_PUBLIC_SUPABASE_URL')
  if (!value) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL nao configurada')
  }

  return value
}

export function getSupabasePublishableKey() {
  const value = readEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') ?? readEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY')

  if (!value) {
    throw new Error(
      'Configure NEXT_PUBLIC_SUPABASE_ANON_KEY ou NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'
    )
  }

  return value
}
