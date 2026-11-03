// Pub Games service worker: saves the whole app on the phone so it plays offline.
//
// How updates reach phones: the app always opens from the saved copy (instant, and
// works with no signal). Whenever there is signal, it quietly checks for a newer copy
// in the background and saves it. If the game page has changed, the open app is told,
// and it offers a "Reload" bar so the new version can be used straight away.
// Bump VERSION to make every phone fetch a fresh copy of all the files.
const VERSION = 'pubgames-v2';
const UPDATED = '__updated'; // a note in the saved files: when a new game page was last saved
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
  // The app also asks for the page itself now and then, to check for updates.
  const home = new URL('./', self.registration.scope).href;
  const isPage = req.mode === 'navigate' || url.href.split(/[?#]/)[0] === home || url.pathname.endsWith('/index.html');
  const key = isPage ? home : req;

  event.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const saved = (await cache.match(key, { ignoreSearch: true })) ||
                  (isPage ? await cache.match('index.html') : undefined);
    const before = isPage && saved ? saved.clone() : null;

    // Check for a newer copy in the background (or wait for it if nothing is saved yet).
    const fresh = fetch(isPage ? key : req, { cache: 'no-cache' })
      .then(clean)
      .then(async (res) => {
        if (!res || !res.ok || res.type === 'opaque') return res;
        const changed = before ? (await before.text()) !== (await res.clone().text()) : false;
        await cache.put(key, res.clone());
        if (changed) {
          await cache.put(new URL(UPDATED, self.registration.scope).href, new Response(String(Date.now())));
          const open = await self.clients.matchAll({ type: 'window' });
          open.forEach((c) => c.postMessage({ type: 'pubgames-updated' }));
        }
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
