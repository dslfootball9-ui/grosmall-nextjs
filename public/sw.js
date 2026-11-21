// Gros Mall service worker: offline fallback + cache of visited pages, images and product data
const V = 'gm-v1', PRE = ['/offline.html', '/logo.png', '/icons/icon-192.png', '/icons/icon-512.png', '/manifest.json']
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(PRE))); self.skipWaiting() })
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x)))).then(() => self.clients.claim())) })
const put = (r, res) => { if (res && (res.ok || res.type === 'opaque')) { const c = res.clone(); caches.open(V).then(ch => ch.put(r, c)) } return res }
const miss = h => h || Response.error()
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return
  const u = new URL(r.url)
  if (r.mode === 'navigate') { // pages: network first, then visited copy, then offline page
    e.respondWith(fetch(r).then(x => put(r, x)).catch(() => caches.match(r).then(h => h || caches.match('/offline.html')))); return }
  if (u.hostname.endsWith('supabase.co') && /\/rest\/v1\/(products|categories)/.test(u.pathname)) { // public catalogue only
    e.respondWith(fetch(r).then(x => put(r, x)).catch(() => caches.match(r).then(miss))); return }
  if (r.destination === 'image' || u.pathname.startsWith('/_next/static') || u.pathname.startsWith('/icons')) // images + static: cache first
    e.respondWith(caches.match(r).then(h => h || fetch(r).then(x => put(r, x)).catch(() => miss())))
})
