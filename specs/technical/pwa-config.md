# PWA Configuration — Finance App

**Versão:** 1.0  
**Última atualização:** Março 2026  
**Nível:** Avançado — Progressive Web App Architecture

---

## 1. Introdução ao PWA

### 1.1 O Que É uma PWA?

**Progressive Web App** é uma aplicação web que utiliza tecnologias modernas para oferecer experiência similar a apps nativos:

- ✅ **Instalável**: Adicionar à tela inicial (sem app store)
- ✅ **Offline-capable**: Funciona sem internet (cache local)
- ✅ **Push notifications**: Notificações mesmo com app fechado
- ✅ **App-like**: Tela cheia, sem barra do navegador
- ✅ **Rápida**: Service Worker cacheia assets críticos
- ✅ **Segura**: Requer HTTPS

### 1.2 Por Que PWA para Finance App?

**Benefícios**:
- 📱 **Mobile-first**: 90% dos usuários em mobile
- 💾 **Zero downloads**: Não ocupa 50MB+ da app store
- 🔄 **Updates automáticos**: Sem precisar atualizar manualmente
- 📶 **Offline resilience**: Ver transações sem internet (futuro)
- 🔔 **Notificações**: Lembrar de lançar transações
- 💰 **Zero custo**: Hospedado na Vercel (free tier)

**MVP (atual)**:
- ✅ Manifest configurado
- ✅ Service Worker básico (cacheamento de assets)
- ✅ Instalável (prompt nativo do browser)
- ❌ Offline support completo (futuro)
- ❌ Push notifications (futuro)

---

## 2. Web App Manifest

### 2.1 Manifest Completo

```json
{
  "name": "Finanças - Controle Financeiro",
  "short_name": "Finanças",
  "description": "Aplicativo de controle financeiro pessoal para casais. Gerencie suas transações, orçamentos, metas e investimentos de forma simples e eficiente.",
  "start_url": "/dashboard",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#ffffff",
  "orientation": "portrait",
  "scope": "/",
  "lang": "pt-BR",
  "dir": "ltr",
  "categories": ["finance", "productivity"],
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-maskable-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/icons/icon-maskable-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/dashboard-mobile.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow",
      "label": "Dashboard com resumo do mês"
    },
    {
      "src": "/screenshots/transactions-mobile.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow",
      "label": "Lista de transações"
    }
  ],
  "shortcuts": [
    {
      "name": "Nova Transação",
      "short_name": "Transação",
      "description": "Adicionar nova transação rapidamente",
      "url": "/transacoes/nova",
      "icons": [
        {
          "src": "/icons/shortcut-transaction.png",
          "sizes": "96x96",
          "type": "image/png"
        }
      ]
    },
    {
      "name": "Dashboard",
      "short_name": "Dashboard",
      "description": "Ver resumo do mês",
      "url": "/dashboard",
      "icons": [
        {
          "src": "/icons/shortcut-dashboard.png",
          "sizes": "96x96",
          "type": "image/png"
        }
      ]
    }
  ],
  "share_target": {
    "action": "/share-target",
    "method": "GET",
    "params": {
      "title": "title",
      "text": "text"
    }
  }
}
```

### 2.2 Campos Explicados

#### 2.2.1 Campos Obrigatórios

| Campo | Valor | Descrição |
|-------|-------|-----------|
| `name` | "Finanças - Controle Financeiro" | Nome completo (até 45 caracteres) |
| `short_name` | "Finanças" | Nome curto (até 12 caracteres, usado no ícone) |
| `start_url` | "/dashboard" | URL inicial ao abrir o app |
| `display` | "standalone" | Modo de exibição (sem barra do navegador) |
| `icons` | Array | Ícones em múltiplos tamanhos |

#### 2.2.2 `display` Modes

| Modo | Descrição | Uso |
|------|-----------|-----|
| `fullscreen` | Tela cheia (esconde status bar) | Jogos, apps imersivos |
| `standalone` | ✅ **Recomendado** - App-like, sem UI do browser | Finance App |
| `minimal-ui` | Mínimo de UI (back/forward buttons) | Apps que precisam de navegação |
| `browser` | Tab normal do browser | Não parece app |

**Escolha**: `standalone` (melhor UX para finance app)

#### 2.2.3 `orientation`

```json
"orientation": "portrait"
```

**Por quê portrait?**
- Finance app é mobile-first vertical
- Dashboard, listas, formulários funcionam melhor em portrait
- Landscape não adiciona valor (não há gráficos wide)

**Alternativa**: `any` (permite rotação)

#### 2.2.4 `theme_color` vs `background_color`

```json
"theme_color": "#ffffff",     // Cor da barra de status (Android)
"background_color": "#ffffff" // Cor do splash screen
```

**Dark mode support** (futuro):
```json
"theme_color": "#ffffff",
"background_color": "#ffffff",
"theme_color_dark": "#0a0a0a",
"background_color_dark": "#0a0a0a"
```

#### 2.2.5 `icons` — Purpose

**`any`** (normal icons):
- Usado em tela inicial, app switcher
- Pode ter cantos arredondados, sombras

**`maskable`** (adaptive icons):
- Usado em Android 8+ (adaptive icons)
- Deve ter safe area (80% do ícone)
- Background sólido (sem transparência)

```
┌─────────────────────────┐
│   Maskable Icon         │
│  ┌───────────────────┐  │
│  │                   │  │ ← 20% safe area
│  │   ┌─────────┐     │  │
│  │   │  Icon   │     │  │ ← 80% central (visível)
│  │   └─────────┘     │  │
│  │                   │  │
│  └───────────────────┘  │
└─────────────────────────┘
```

**Gerar maskable icons**: https://maskable.app/

### 2.3 Gerar Ícones

```bash
# Instalar ferramenta de geração de ícones
npm install -g pwa-asset-generator

# Gerar todos os tamanhos a partir de um logo.svg
pwa-asset-generator logo.svg public/icons \
  --icon-only \
  --favicon \
  --opaque false \
  --type png \
  --path-override icons
  
# Gerar maskable icons
pwa-asset-generator logo.svg public/icons \
  --icon-only \
  --maskable \
  --padding "20%" \
  --background "#ffffff"
```

**Tamanhos necessários**:
- 72x72, 96x96, 128x128, 144x144, 152x152 (iOS)
- 192x192, 384x384, 512x512 (Android)
- 192x192 maskable, 512x512 maskable (Android adaptive)

### 2.4 Screenshots (App Store-like)

```json
"screenshots": [
  {
    "src": "/screenshots/dashboard-mobile.png",
    "sizes": "390x844",      // iPhone 14 Pro
    "type": "image/png",
    "form_factor": "narrow", // Mobile
    "label": "Dashboard com resumo do mês"
  },
  {
    "src": "/screenshots/dashboard-desktop.png",
    "sizes": "1920x1080",
    "type": "image/png",
    "form_factor": "wide",   // Desktop
    "label": "Dashboard em desktop"
  }
]
```

**Uso**: Chrome exibe screenshots no prompt de instalação (Android)

**Como capturar**:
```bash
# Playwright (automatizado)
npx playwright screenshot https://finance-app.vercel.app/dashboard dashboard-mobile.png \
  --device="iPhone 14 Pro" \
  --full-page
```

### 2.5 Shortcuts (App Icons)

```json
"shortcuts": [
  {
    "name": "Nova Transação",
    "url": "/transacoes/nova",
    "icons": [{ "src": "/icons/shortcut-transaction.png", "sizes": "96x96" }]
  }
]
```

**Como usar**:
- Android: Long press no ícone do app → menu com shortcuts
- iOS: Não suportado (ignorado)

**Limite**: Até 4 shortcuts (Android exibe apenas 4)

---

## 3. Service Worker

### 3.1 Setup com next-pwa

```bash
npm install next-pwa
```

```typescript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  sw: 'sw.js',
  swSrc: 'service-worker.js', // Custom SW (futuro)
})

module.exports = withPWA({
  // Next.js config
  reactStrictMode: true,
  // ...
})
```

**O que `next-pwa` faz?**
- ✅ Gera `sw.js` automaticamente (Workbox)
- ✅ Pré-cacheia assets estáticos (JS, CSS, fonts)
- ✅ Runtime caching para imagens
- ✅ Offline fallback (página offline.html)

### 3.2 Service Worker Gerado (Workbox)

```javascript
// public/sw.js (gerado automaticamente)
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js')

// Precache (assets críticos)
workbox.precaching.precacheAndRoute([
  { url: '/_next/static/chunks/main.js', revision: 'abc123' },
  { url: '/_next/static/css/app.css', revision: 'def456' },
  { url: '/icons/icon-192x192.png', revision: 'ghi789' },
  // ... outros assets
])

// Runtime caching para imagens
workbox.routing.registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 dias
      }),
    ],
  })
)

// Runtime caching para Google Fonts
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
)

// Offline fallback
workbox.routing.setCatchHandler(async ({ event }) => {
  if (event.request.destination === 'document') {
    return caches.match('/offline.html')
  }
  return Response.error()
})
```

### 3.3 Caching Strategies

#### 3.3.1 Cache First (imagens, fonts)

```
Request → Cache hit? → YES → Return from cache
                    ↓ NO
                 Network → Cache → Return
```

**Quando usar**: Assets estáticos que não mudam (imagens, fonts)

#### 3.3.2 Network First (API calls)

```
Request → Network → SUCCESS → Cache → Return
                  ↓ FAIL
               Cache hit? → YES → Return from cache
                          ↓ NO
                       Error
```

**Quando usar**: Dados dinâmicos (transações, usuário)

#### 3.3.3 Stale While Revalidate (CSS, JS)

```
Request → Cache hit? → YES → Return from cache
                    ↓ NO      ↓ (em background)
                 Network ←────┘ Network → Update cache
```

**Quando usar**: Assets que mudam ocasionalmente (JS, CSS)

### 3.4 Custom Service Worker (Futuro)

```javascript
// service-worker.js (custom)
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'

// Precache (gerado pelo build)
precacheAndRoute(self.__WB_MANIFEST)

// API do Supabase (Network First com timeout)
registerRoute(
  /^https:\/\/.*\.supabase\.co\/rest\/v1\//,
  new NetworkFirst({
    cacheName: 'supabase-api',
    networkTimeoutSeconds: 5, // Fallback para cache após 5s
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 minutos
      }),
    ],
  })
)

// BCB Proxy (Cache First com revalidação)
registerRoute(
  /^https:\/\/finance-app\.vercel\.app\/api\/bcb-proxy/,
  new StaleWhileRevalidate({
    cacheName: 'bcb-rates',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 24 * 60 * 60, // 24 horas
      }),
    ],
  })
)

// Background Sync (enviar transações offline)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-transactions') {
    event.waitUntil(syncTransactions())
  }
})

async function syncTransactions() {
  const db = await openDB('finance-app-offline', 1)
  const pendingTransactions = await db.getAll('pending-transactions')
  
  for (const transaction of pendingTransactions) {
    try {
      await fetch('https://finance-app.vercel.app/api/transactions', {
        method: 'POST',
        body: JSON.stringify(transaction),
      })
      
      // Remover do queue após sucesso
      await db.delete('pending-transactions', transaction.id)
    } catch (error) {
      console.error('Failed to sync transaction:', error)
    }
  }
}
```

### 3.5 Registrar Service Worker

```typescript
// app/layout.tsx
'use client'

import { useEffect } from 'react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered:', registration)
          
          // Verificar updates a cada hora
          setInterval(() => {
            registration.update()
          }, 60 * 60 * 1000)
        })
        .catch((error) => {
          console.error('SW registration failed:', error)
        })
    }
  }, [])
  
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
```

---

## 4. Install Prompt

### 4.1 Detectar se PWA é Instalável

```typescript
// lib/hooks/usePWAInstall.ts
'use client'

import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  
  useEffect(() => {
    // Verificar se já está instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }
    
    // Escutar evento de instalação
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsInstallable(true)
    }
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])
  
  const install = async () => {
    if (!deferredPrompt) return
    
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setIsInstalled(true)
      setIsInstallable(false)
    }
    
    setDeferredPrompt(null)
  }
  
  return { isInstallable, isInstalled, install }
}
```

### 4.2 Install Banner

```typescript
// components/InstallBanner.tsx
'use client'

import { usePWAInstall } from '@/lib/hooks/usePWAInstall'
import { X } from 'lucide-react'
import { useState } from 'react'

export function InstallBanner() {
  const { isInstallable, install } = usePWAInstall()
  const [dismissed, setDismissed] = useState(false)
  
  // Verificar se já foi dismissed antes (localStorage)
  useEffect(() => {
    const wasDismissed = localStorage.getItem('pwa-install-dismissed')
    if (wasDismissed) {
      setDismissed(true)
    }
  }, [])
  
  if (!isInstallable || dismissed) return null
  
  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem('pwa-install-dismissed', 'true')
  }
  
  const handleInstall = async () => {
    await install()
    setDismissed(true)
  }
  
  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h3 className="font-semibold mb-1">Instalar Finanças</h3>
          <p className="text-sm opacity-90">
            Adicione à tela inicial para acesso rápido e offline
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-primary-foreground/80 hover:text-primary-foreground"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleInstall}
          className="flex-1 bg-background text-foreground px-4 py-2 rounded-md font-medium"
        >
          Instalar
        </button>
        <button
          onClick={handleDismiss}
          className="px-4 py-2 text-primary-foreground/80 hover:text-primary-foreground"
        >
          Agora não
        </button>
      </div>
    </div>
  )
}
```

### 4.3 iOS Install Instructions

```typescript
// components/IOSInstallInstructions.tsx
'use client'

import { useEffect, useState } from 'react'
import { Share } from 'lucide-react'

export function IOSInstallInstructions() {
  const [isIOS, setIsIOS] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  
  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase()
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent)
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches
    
    setIsIOS(isIOSDevice)
    setIsInstalled(isInStandaloneMode)
    
    const wasDismissed = localStorage.getItem('ios-install-dismissed')
    if (wasDismissed) {
      setDismissed(true)
    }
  }, [])
  
  if (!isIOS || isInstalled || dismissed) return null
  
  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 bg-blue-500 text-white p-4 rounded-lg shadow-lg">
      <h3 className="font-semibold mb-2">Instalar no iPhone</h3>
      <ol className="text-sm space-y-2">
        <li className="flex items-center gap-2">
          1. Toque em <Share size={16} className="inline" /> (compartilhar)
        </li>
        <li>2. Role e toque em "Adicionar à Tela de Início"</li>
        <li>3. Toque em "Adicionar"</li>
      </ol>
      
      <button
        onClick={() => {
          setDismissed(true)
          localStorage.setItem('ios-install-dismissed', 'true')
        }}
        className="mt-3 text-sm underline"
      >
        Entendi, não mostrar novamente
      </button>
    </div>
  )
}
```

---

## 5. Offline Support (Futuro)

### 5.1 Offline Page

```html
<!-- public/offline.html -->
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Finanças - Offline</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
      padding: 20px;
    }
    
    h1 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    
    p {
      font-size: 1.125rem;
      opacity: 0.9;
      max-width: 400px;
    }
    
    button {
      margin-top: 2rem;
      padding: 0.75rem 2rem;
      font-size: 1rem;
      background: white;
      color: #667eea;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 600;
    }
    
    button:hover {
      opacity: 0.9;
    }
  </style>
</head>
<body>
  <h1>📶 Você está offline</h1>
  <p>
    Parece que você não está conectado à internet.
    Quando a conexão for restaurada, sincronizaremos seus dados automaticamente.
  </p>
  <button onclick="window.location.reload()">
    Tentar novamente
  </button>
</body>
</html>
```

### 5.2 Background Sync (Queued Mutations)

```typescript
// lib/utils/offline-queue.ts
import { openDB, DBSchema, IDBPDatabase } from 'idb'

interface OfflineQueueDB extends DBSchema {
  'pending-mutations': {
    key: string
    value: {
      id: string
      type: 'insert' | 'update' | 'delete'
      table: string
      data: any
      timestamp: number
    }
  }
}

let db: IDBPDatabase<OfflineQueueDB> | null = null

async function getDB() {
  if (!db) {
    db = await openDB<OfflineQueueDB>('finance-app-offline', 1, {
      upgrade(db) {
        db.createObjectStore('pending-mutations', { keyPath: 'id' })
      },
    })
  }
  return db
}

export async function queueMutation(mutation: {
  type: 'insert' | 'update' | 'delete'
  table: string
  data: any
}) {
  const db = await getDB()
  
  const id = crypto.randomUUID()
  await db.add('pending-mutations', {
    id,
    ...mutation,
    timestamp: Date.now(),
  })
  
  // Tentar sincronizar imediatamente
  if (navigator.onLine) {
    await syncPendingMutations()
  }
}

export async function syncPendingMutations() {
  const db = await getDB()
  const pending = await db.getAll('pending-mutations')
  
  for (const mutation of pending) {
    try {
      // Executar mutation no Supabase
      await executeMutation(mutation)
      
      // Remover da fila
      await db.delete('pending-mutations', mutation.id)
    } catch (error) {
      console.error('Failed to sync mutation:', error)
    }
  }
}

async function executeMutation(mutation: any) {
  const response = await fetch('/api/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mutation),
  })
  
  if (!response.ok) {
    throw new Error('Sync failed')
  }
}

// Escutar online/offline
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    syncPendingMutations()
  })
}
```

### 5.3 TanStack Query com Offline Support

```typescript
// lib/hooks/useTransactions.ts (com offline)
export function useCreateTransaction() {
  const queryClient = useQueryClient()
  const user = useUser()
  const userId = user?.id
  
  return useMutation({
    mutationFn: async (data: TransactionFormData) => {
      if (!navigator.onLine) {
        // Adicionar à fila de offline
        await queueMutation({
          type: 'insert',
          table: 'transactions',
          data: { ...data, user_id: userId },
        })
        
        return { ...data, id: crypto.randomUUID(), _offline: true }
      }
      
      // Online: executar normalmente
      const { data: result, error } = await supabase
        .from('transactions')
        .insert({ ...data, user_id: userId })
        .select()
        .single()
      
      if (error) throw error
      return result
    },
    onSuccess: (newTransaction) => {
      if (newTransaction._offline) {
        toast.info('Transação salva localmente. Será sincronizada quando online.')
      } else {
        toast.success('Transação criada com sucesso!')
      }
      
      queryClient.invalidateQueries(['transactions'])
    },
  })
}
```

---

## 6. Push Notifications (Futuro)

### 6.1 Request Permission

```typescript
// lib/hooks/useNotifications.ts
export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  
  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission)
    }
  }, [])
  
  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert('Este navegador não suporta notificações')
      return
    }
    
    const result = await Notification.requestPermission()
    setPermission(result)
    
    if (result === 'granted') {
      // Registrar para push notifications
      await subscribeToPush()
    }
  }
  
  return { permission, requestPermission }
}
```

### 6.2 Service Worker Push Event

```javascript
// service-worker.js
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {}
  
  const title = data.title || 'Finanças'
  const options = {
    body: data.body || 'Você tem uma nova notificação',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: data.tag || 'default',
    data: {
      url: data.url || '/dashboard',
    },
  }
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  )
})
```

### 6.3 Send Push (Server-side)

```typescript
// app/api/notifications/send/route.ts
import webpush from 'web-push'

webpush.setVapidDetails(
  'mailto:contato@finance-app.com',
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export async function POST(request: Request) {
  const { userId, title, body, url } = await request.json()
  
  // Buscar subscription do usuário no banco
  const { data: subscription } = await supabase
    .from('push_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (!subscription) {
    return Response.json({ error: 'No subscription found' }, { status: 404 })
  }
  
  // Enviar push
  await webpush.sendNotification(
    JSON.parse(subscription.subscription_data),
    JSON.stringify({ title, body, url })
  )
  
  return Response.json({ success: true })
}
```

---

## 7. Testing PWA

### 7.1 Lighthouse Audit

```bash
# CLI
npm install -g lighthouse

lighthouse https://finance-app.vercel.app \
  --only-categories=pwa \
  --output=html \
  --output-path=./lighthouse-report.html

# DevTools
# Chrome → DevTools → Lighthouse → Analyze page load
```

**Métricas PWA**:
- ✅ Installable (manifest + service worker)
- ✅ Works offline
- ✅ Has a valid 200 response
- ✅ HTTPS
- ✅ Splash screen configured
- ✅ Address bar matches theme color

**Target**: ≥ 90/100

### 7.2 Manual Testing Checklist

#### iOS Safari
- [ ] Adicionar à tela inicial funciona
- [ ] Abre em modo standalone (sem barra do Safari)
- [ ] Ícone correto na home screen
- [ ] Splash screen aparece ao abrir
- [ ] Safe areas respeitadas (notch, home indicator)

#### Android Chrome
- [ ] Banner de instalação aparece
- [ ] Instalar via menu funciona
- [ ] Abre em modo standalone
- [ ] Ícone correto no launcher
- [ ] Shortcuts funcionam (long press)
- [ ] Tema color aplicado na status bar

#### Desktop Chrome
- [ ] Instalar via omnibox (ícone +)
- [ ] Abre em janela separada
- [ ] Ícone na taskbar/dock

### 7.3 Service Worker Testing

```typescript
// Testar cache
navigator.serviceWorker.ready.then(async (registration) => {
  const cache = await caches.open('precache')
  const keys = await cache.keys()
  console.log('Cached files:', keys)
})

// Forçar update do SW
navigator.serviceWorker.ready.then((registration) => {
  registration.update()
})

// Remover cache (debug)
caches.keys().then((names) => {
  names.forEach((name) => {
    caches.delete(name)
  })
})

// Unregister SW (debug)
navigator.serviceWorker.getRegistrations().then((registrations) => {
  registrations.forEach((registration) => {
    registration.unregister()
  })
})
```

---

## 8. Performance Optimization

### 8.1 Lazy Load Service Worker

```typescript
// app/layout.tsx
useEffect(() => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    // Adiar registro para não bloquear critical path
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
    })
  }
}, [])
```

### 8.2 Prefetch Critical Routes

```typescript
// next.config.js
module.exports = withPWA({
  // Prefetch apenas rotas críticas
  prefetchDNSOnLink: true,
  
  // Runtime caching config
  pwa: {
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/.*\.supabase\.co/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'supabase-api',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 5 * 60,
          },
        },
      },
    ],
  },
})
```

### 8.3 Reduce Bundle Size

```bash
# Análise de bundle
npm install -g @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(withPWA({...}))

# Rodar análise
ANALYZE=true npm run build
```

---

## 9. SEO & Meta Tags

```typescript
// app/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Finanças - Controle Financeiro',
  description: 'Gerencie suas transações, orçamentos e investimentos de forma simples',
  manifest: '/manifest.json',
  themeColor: '#ffffff',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Finanças',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/icon-180x180.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover', // iOS safe area
  },
}
```

```html
<!-- Meta tags adicionais no head -->
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Finanças">

<link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180x180.png">
<link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#5bbad5">
```

---

## 10. Deployment

### 10.1 Vercel Configuration

```json
// vercel.json
{
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        },
        {
          "key": "Service-Worker-Allowed",
          "value": "/"
        }
      ]
    },
    {
      "source": "/manifest.json",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 10.2 Build Checklist

- [ ] `manifest.json` está em `/public`
- [ ] Todos os ícones estão em `/public/icons`
- [ ] `next-pwa` configurado no `next.config.js`
- [ ] Service Worker registrado no `app/layout.tsx`
- [ ] HTTPS habilitado (Vercel faz automaticamente)
- [ ] Lighthouse PWA score ≥ 90
- [ ] Testado em iOS Safari e Android Chrome

---

## 11. Troubleshooting

### 11.1 Service Worker Não Atualiza

```typescript
// Forçar update após deploy
navigator.serviceWorker.ready.then((registration) => {
  registration.update()
  
  // Recarregar quando novo SW estiver waiting
  registration.addEventListener('updatefound', () => {
    const newWorker = registration.installing
    
    newWorker?.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        // Novo SW disponível, recarregar
        window.location.reload()
      }
    })
  })
})
```

### 11.2 iOS Não Instala

**Checklist**:
- [ ] HTTPS habilitado
- [ ] `manifest.json` linkado no head
- [ ] `apple-mobile-web-app-capable` meta tag presente
- [ ] Ícones 180x180 para apple-touch-icon
- [ ] Viewport com `viewport-fit=cover`

### 11.3 Cache Desatualizado

```bash
# Limpar cache do Service Worker
# Chrome DevTools → Application → Storage → Clear site data
```

---

## 12. Conclusão

### 12.1 PWA MVP (Implementado)

- ✅ Manifest configurado
- ✅ Service Worker básico
- ✅ Instalável em mobile
- ✅ Ícones otimizados
- ✅ Splash screen

### 12.2 Próximos Passos

1. Offline support completo (IndexedDB + Background Sync)
2. Push notifications (lembrar de lançar transações)
3. Share target (compartilhar CSV/PDF)
4. App shortcuts (Nova transação, Ver dashboard)
5. Periodic background sync (atualizar taxas BCB)

---

**Referências**:
- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Workbox Docs](https://developers.google.com/web/tools/workbox)
- [next-pwa](https://github.com/shadowwalker/next-pwa)
- [iOS PWA Support](https://webkit.org/blog/8311/web-app-manifest/)
