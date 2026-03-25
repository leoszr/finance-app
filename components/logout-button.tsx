'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { createClient } from '@/lib/supabase/client'

export function LogoutButton() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const handleLogout = async () => {
    if (isPending) {
      return
    }

    setIsPending(true)

    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/login')
      router.refresh()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <button
      className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium"
      disabled={isPending}
      onClick={handleLogout}
      type="button"
    >
      {isPending ? 'Saindo...' : 'Sair'}
    </button>
  )
}
