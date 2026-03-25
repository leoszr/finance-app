'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChartNoAxesCombined, Landmark, PiggyBank, Wallet } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Resumo', icon: ChartNoAxesCombined },
  { href: '/transacoes', label: 'Transacoes', icon: Wallet },
  { href: '/metas', label: 'Metas', icon: PiggyBank },
  { href: '/investimentos', label: 'Invest', icon: Landmark }
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-t border-slate-200 bg-white/95 px-2 pb-3 pt-2 backdrop-blur">
      <ul className="grid grid-cols-4 gap-1">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <li key={item.href}>
              <Link
                className={`flex flex-col items-center justify-center rounded-xl px-2 py-2 text-[11px] font-medium ${
                  active ? 'bg-slate-900 text-white' : 'text-slate-600'
                }`}
                href={item.href}
              >
                <Icon size={16} />
                <span className="mt-1">{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
