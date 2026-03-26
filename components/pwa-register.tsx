'use client'

import { useEffect } from 'react'

export function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      return
    }

    if ('serviceWorker' in navigator) {
      const handleWorkerMessage = (event: MessageEvent) => {
        const payload = event.data

        if (!payload || payload.source !== 'sw') {
          return
        }

        if (payload.level === 'warn') {
          console.warn('PWA fallback:', payload.event, payload.url)
        }
      }

      navigator.serviceWorker.addEventListener('message', handleWorkerMessage)

      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.error('Falha ao registrar service worker:', error)
      })

      return () => {
        navigator.serviceWorker.removeEventListener('message', handleWorkerMessage)
      }
    }
  }, [])

  return null
}
