'use client'

import { useEffect, useState } from 'react'

import { createClient } from '@/lib/supabase/client'
import { getLoginErrorMessage } from '@/lib/supabase/auth-session'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loginMessage, setLoginMessage] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setLoginMessage(getLoginErrorMessage(params.get('error')))
  }, [])

  const getRedirectTo = () => {
    if (typeof window !== 'undefined' && window.location.origin) {
      return `${window.location.origin}/auth/callback`
    }

    const publicSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()
    if (publicSiteUrl) {
      return `${publicSiteUrl.replace(/\/$/, '')}/auth/callback`
    }

    return '/auth/callback'
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const redirectTo = getRedirectTo()

      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo
        }
      })

      if (authError) {
        setError('Nao foi possivel iniciar o login. Tente novamente.')
      }
    } catch {
      setError('Configuracao do login ausente. Verifique as variaveis de ambiente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <section className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Finance App</h1>
        <p className="mt-2 text-sm text-slate-600">Entre com sua conta Google para continuar.</p>

        {loginMessage ? (
          <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">{loginMessage}</p>
        ) : null}

        <button
          className="mt-6 w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
          onClick={handleGoogleLogin}
          type="button"
        >
          {loading ? 'Conectando...' : 'Entrar com Google'}
        </button>

        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      </section>
    </main>
  )
}
