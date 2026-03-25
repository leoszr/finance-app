import { ReactNode } from 'react'

import { BottomNav } from '@/components/layout/bottom-nav'

type AppLayoutProps = {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-slate-50 pb-24">
      {children}
      <BottomNav />
    </div>
  )
}
