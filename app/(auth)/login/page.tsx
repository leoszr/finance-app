'use client'

import { useState } from 'react'

import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      console.log('Login iniciado')
      console.log('SUPABASE URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      const supabase = createClient()
      const redirectTo = getRedirectTo()

      const { data, error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo
        }
      })

      console.log('Resposta OAuth:', data)

      if (authError) {
        console.error('OAuth error:', authError)
        setError('Nao foi possivel iniciar o login. Tente novamente.')
      }
    } catch (loginError) {
      console.error('Erro ao iniciar login:', loginError)
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
