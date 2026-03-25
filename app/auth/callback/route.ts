import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

import { getSupabaseAnonKey, getSupabaseUrl } from '@/lib/supabase/env'

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

  const { error: recurrentError } = await supabase.rpc('generate_monthly_recurrents')

  if (recurrentError) {
    console.error('Falha ao gerar recorrencias no login:', recurrentError.message)
  }

  return response
}
