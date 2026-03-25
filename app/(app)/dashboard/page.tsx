import { redirect } from 'next/navigation'

import { LogoutButton } from '@/components/logout-button'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-6 px-5 py-8">
      <header className="rounded-2xl bg-white p-5 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">Sessao ativa: {user.email}</p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-sm text-slate-700">Autenticacao inicial concluida para a Sprint 0.</p>
        <div className="mt-4">
          <LogoutButton />
        </div>
      </section>
    </main>
  )
}
