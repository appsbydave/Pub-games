// Pub Games service worker: saves the whole app on the phone so it plays offline.
//
// How updates reach phones: the app always opens from the saved copy (instant, and
// works with no signal). Whenever there is signal, it quietly checks for a newer copy
// in the background and saves it, so a change you push shows up the next time the
// app is opened. Bump VERSION only if you want to wipe the saved copy and start clean.
const VERSION = 'pubgames-v1';
const FILES = [
  './',
  'index.html',
  'pwa.js',
  'manifest.webmanifest',
  'icons/icon-32.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png',
];

// Safari refuses to open a page from a saved response that came via a redirect,
// so store a plain copy instead.
async function clean(res) {
  if (!res || !res.redirected) return res;
  return new Response(await res.blob(), { status: res.status, statusText: res.statusText, headers: res.headers });
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    await Promise.all(FILES.map(async (f) => {
      const res = await clean(await fetch(new Request(f, { cache: 'reload' })));
      if (!res.ok) throw new Error(`Could not save ${f} (${res.status})`);
      await cache.put(f, res);
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  // Opening the app (any page address in scope) always gets the saved app page.
  const isPage = req.mode === 'navigate';
  const key = isPage ? new URL('./', self.registration.scope).href : req;

  event.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const saved = (await cache.match(key, { ignoreSearch: true })) ||
                  (isPage ? await cache.match('index.html') : undefined);

    // Check for a newer copy in the background (or wait for it if nothing is saved yet).
    const fresh = fetch(isPage ? key : req, { cache: 'no-cache' })
      .then(clean)
      .then((res) => {
        if (res && res.ok && res.type !== 'opaque') cache.put(key, res.clone());
        return res;
      })
      .catch(() => undefined);

    if (saved) {
      event.waitUntil(fresh);
      return saved;
    }
    return (await fresh) || new Response('Offline, and this file has not been saved yet.', {
      status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  })());
});
