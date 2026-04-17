import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

import { hasSupabaseAuthCookie } from '@/lib/supabase/auth-session'

function createLoginRedirect(request: NextRequest) {
  const loginUrl = new URL('/login', request.url)

  if (hasSupabaseAuthCookie(request.cookies.getAll().map((cookie) => cookie.name))) {
    loginUrl.searchParams.set('error', 'session_ended')
  }

  return NextResponse.redirect(loginUrl)
}

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const pathname = request.nextUrl.pathname
  const isProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/transacoes') ||
    pathname.startsWith('/metas') ||
    pathname.startsWith('/investimentos')

  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase env vars missing in middleware')
    if (isProtectedRoute) {
      return createLoginRedirect(request)
    }

    return NextResponse.next()
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers
    }
  })

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({ name, value, ...options })
            response = NextResponse.next({
              request: {
                headers: request.headers
              }
            })
            response.cookies.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({ name, value: '', ...options })
            response = NextResponse.next({
              request: {
                headers: request.headers
              }
            })
            response.cookies.set({ name, value: '', ...options })
          }
        }
      }
    )

    const {
      data: { user }
    } = await supabase.auth.getUser()

    const isAuthRoute = pathname.startsWith('/login')

    if (!user && isProtectedRoute) {
      return createLoginRedirect(request)
    }

    if (user && isAuthRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
  } catch (error) {
    console.error('Middleware auth check failed:', error)
    if (isProtectedRoute) {
      return createLoginRedirect(request)
    }

    return NextResponse.next()
  }
}
