import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { PwaRegister } from '@/components/pwa-register'
import { QueryProvider } from '@/lib/providers/query-provider'

import './globals.css'

export const metadata: Metadata = {
  title: 'Finance App',
  description: 'Controle financeiro pessoal mobile-first',
  manifest: '/manifest.webmanifest'
}

type RootLayoutProps = {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body>
        <QueryProvider>
          {children}
          <PwaRegister />
        </QueryProvider>
      </body>
    </html>
  )
}
