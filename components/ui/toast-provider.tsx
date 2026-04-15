'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

type ToastTone = 'success' | 'error'

type ToastItem = {
  id: string
  message: string
  tone: ToastTone
}

type ToastContextValue = {
  showToast: (message: string, tone?: ToastTone) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback((message: string, tone: ToastTone = 'success') => {
    const id = crypto.randomUUID()

    setToasts((current) => [...current, { id, message, tone }])

    window.setTimeout(() => {
      removeToast(id)
    }, 4000)
  }, [removeToast])

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-50 mx-auto flex w-full max-w-md flex-col gap-2 px-4">
        {toasts.map((toast) => (
          <section
            aria-live="polite"
            className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-sm ${toast.tone === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800'}`}
            key={toast.id}
            role="status"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm">{toast.message}</p>
              <button
                aria-label="Fechar aviso"
                className="text-xs font-semibold"
                onClick={() => removeToast(toast.id)}
                type="button"
              >
                Fechar
              </button>
            </div>
          </section>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast precisa estar dentro de ToastProvider.')
  }

  return context
}
