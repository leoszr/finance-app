'use client'

import { useRouter } from 'next/navigation'

import { createClient } from '@/lib/supabase/client'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium"
      onClick={handleLogout}
      type="button"
    >
      Sair
    </button>
  )
}
