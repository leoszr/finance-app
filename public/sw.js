const CACHE_VERSION = 'v2'
const APP_SHELL_CACHE = `app-shell-${CACHE_VERSION}`
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`
const APP_SHELL_ASSETS = ['/', '/offline', '/manifest.webmanifest']

function shouldCacheRequest(request, url) {
  if (request.method !== 'GET') {
    return false
  }

  if (url.origin !== self.location.origin) {
    return false
  }

  if (url.pathname.startsWith('/api/')) {
    return false
  }

  return true
}

function notifyClients(message) {
  self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then((clients) => {
    clients.forEach((client) => {
      client.postMessage({ source: 'sw', ...message })
    })
  })
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(APP_SHELL_CACHE)
      .then((cache) => cache.addAll(APP_SHELL_ASSETS))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== APP_SHELL_CACHE && key !== RUNTIME_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url)

  if (!shouldCacheRequest(event.request, requestUrl)) {
    return
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone()
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(event.request, responseClone)
            })
          }

          return response
        })
        .catch(async () => {
          notifyClients({ level: 'warn', event: 'navigate-fallback', url: event.request.url })
          const cachedResponse = await caches.match(event.request)
          if (cachedResponse) {
            return cachedResponse
          }

          const offlinePage = await caches.match('/offline')
          if (offlinePage) {
            return offlinePage
          }

          return caches.match('/')
        })
    )

    return
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone()
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(event.request, responseClone)
            })
          }

          return response
        })
        .catch(() => {
          notifyClients({ level: 'warn', event: 'runtime-fallback', url: event.request.url })
          return cachedResponse
        })

      return cachedResponse || networkFetch
    })
  )
})
