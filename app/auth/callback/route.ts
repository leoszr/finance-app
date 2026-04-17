import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

import { getSupabaseAnonKey, getSupabaseUrl } from '@/lib/supabase/env'

type SupabaseRequestError = {
  code?: string
  message: string
  status?: number
}

type DefaultCategoryTemplate = {
  name: string
  kind: 'income' | 'expense' | 'investment'
  color: string
  icon: string
}

const DEFAULT_CATEGORIES: DefaultCategoryTemplate[] = [
  { name: 'Salario', kind: 'income', color: '#16a34a', icon: 'Wallet' },
  { name: 'Freelance', kind: 'income', color: '#15803d', icon: 'Briefcase' },
  { name: 'Investimentos', kind: 'income', color: '#166534', icon: 'TrendingUp' },
  { name: 'Moradia', kind: 'expense', color: '#1d4ed8', icon: 'Home' },
  { name: 'Alimentacao', kind: 'expense', color: '#9333ea', icon: 'Utensils' },
  { name: 'Transporte', kind: 'expense', color: '#ea580c', icon: 'Car' },
  { name: 'Saude', kind: 'expense', color: '#dc2626', icon: 'HeartPulse' },
  { name: 'Educacao', kind: 'expense', color: '#0284c7', icon: 'GraduationCap' },
  { name: 'Lazer', kind: 'expense', color: '#f59e0b', icon: 'Gamepad2' },
  { name: 'Assinaturas', kind: 'expense', color: '#7c3aed', icon: 'Tv' },
  { name: 'Reserva', kind: 'investment', color: '#0f766e', icon: 'PiggyBank' }
]

function isRpcMissingError(error: SupabaseRequestError | null) {
  if (!error) {
    return false
  }

  if (error.status === 404 || error.code === 'PGRST202') {
    return true
  }

  return /could not find the function|function.*does not exist/i.test(error.message)
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const dashboardUrl = new URL('/dashboard', request.url)

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing_code', request.url))
  }

  let response = NextResponse.redirect(dashboardUrl)

  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set({ name, value, ...options })
        })

        response = NextResponse.redirect(dashboardUrl)

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set({ name, value, ...options })
        })
      }
    }
  })

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url))
  }

  const {
    data: { user }
  } = await supabase.auth.getUser()

  const { error: defaultsError } = await supabase.rpc('ensure_default_categories_for_current_user')

  if (defaultsError) {
    if (isRpcMissingError(defaultsError) && user) {
      const { error: fallbackDefaultsError } = await supabase.from('categories').upsert(
        DEFAULT_CATEGORIES.map((category) => ({
          user_id: user.id,
          ...category
        })),
        { onConflict: 'user_id,name' }
      )

      if (fallbackDefaultsError) {
        console.error('Falha no fallback de categorias padrao no login:', fallbackDefaultsError.message)
      }
    } else {
      console.error('Falha ao garantir categorias padrao no login:', defaultsError.message)
    }
  }

  const { error: recurrentError } = await supabase.rpc('generate_monthly_recurrents')

  if (recurrentError && !isRpcMissingError(recurrentError)) {
    console.error('Falha ao gerar recorrencias no login:', recurrentError.message)
  }

  return response
}
