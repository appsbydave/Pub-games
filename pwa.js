// Pub Games: offline saving and the "add to home screen" hint.
// Kept separate from index.html so the game page can be replaced with a fresh
// copy from Claude without losing any of this.
(function () {
  'use strict';
  const KEY = 'pubgames.installHint';
  const standalone = () =>
    window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  const css = `
  .pwa-bar{position:fixed;left:50%;transform:translateX(-50%);bottom:max(12px,env(safe-area-inset-bottom));z-index:30;
    width:min(540px,calc(100% - 20px));background:#4e1f4d;color:#fff;border-radius:16px;padding:12px 12px 12px 16px;
    display:flex;gap:10px;align-items:center;box-shadow:0 8px 24px rgba(46,16,45,.35);font-size:14px;line-height:1.3;animation:pwa-up .25s ease-out}
  .pwa-bar b{display:block;font-weight:700;font-size:15px}
  .pwa-bar .pwa-tx{flex:1;min-width:0}
  .pwa-bar button{font:inherit;cursor:pointer;border-radius:999px;border:2px solid #fff;background:#fff;color:#4e1f4d;font-weight:700;padding:8px 14px;min-height:40px}
  .pwa-bar button.pwa-x{background:transparent;color:#fff;border-color:transparent;padding:6px 8px;min-height:40px;font-size:20px;line-height:1}
  .pwa-share{display:inline-block;vertical-align:-3px;width:16px;height:16px}
  .pwa-toast{position:fixed;left:50%;transform:translateX(-50%);top:max(12px,env(safe-area-inset-top));z-index:60;background:#dd7f27;color:#fff;
    font-weight:700;border-radius:999px;padding:10px 18px;box-shadow:0 6px 18px rgba(46,16,45,.3);animation:pwa-up .25s ease-out;font-size:14px}
  @keyframes pwa-up{from{opacity:0;translate:0 10px}to{opacity:1;translate:0 0}}`;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  function toast(text) {
    const t = document.createElement('div');
    t.className = 'pwa-toast';
    t.setAttribute('role', 'status');
    t.textContent = text;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3200);
  }

  // ---- Save the app for offline play ----
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    const firstTime = !navigator.serviceWorker.controller;
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').then((reg) => {
        if (!firstTime) return;
        const w = reg.installing || reg.waiting;
        if (!w) return;
        w.addEventListener('statechange', () => {
          if (w.state === 'activated') toast('✓ Saved — works offline now');
        });
      }).catch(() => { /* offline saving not available here; the app still works online */ });
    });
  }

  // ---- "Add to home screen" hint (only in the browser, not once installed) ----
  if (standalone()) return;
  let deferred = null;
  let bar = null;
  const dismissed = () => { try { return localStorage.getItem(KEY) === 'no'; } catch (e) { return false; } };
  const remember = () => { try { localStorage.setItem(KEY, 'no'); } catch (e) { /* ignore */ } };
  const hide = () => { if (bar) { bar.remove(); bar = null; } };
  const shareIcon = '<svg class="pwa-share" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7.5 7.5 12 3l4.5 4.5"/><path d="M8 11H6a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-2"/></svg>';

  function show(mode) {
    if (bar || dismissed()) return;
    bar = document.createElement('div');
    bar.className = 'pwa-bar';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'Install Pub Games');
    const tx = mode === 'ios'
      ? `<b>Play offline</b>Tap Share ${shareIcon} then <b style="display:inline">Add to Home Screen</b>.`
      : '<b>Play offline</b>Add Pub Games to your home screen.';
    bar.innerHTML = `<div class="pwa-tx">${tx}</div>${mode === 'prompt' ? '<button class="pwa-go">Install</button>' : ''}<button class="pwa-x" aria-label="Not now">✕</button>`;
    bar.querySelector('.pwa-x').addEventListener('click', () => { remember(); hide(); });
    const go = bar.querySelector('.pwa-go');
    if (go) go.addEventListener('click', async () => {
      if (!deferred) return hide();
      deferred.prompt();
      try { await deferred.userChoice; } catch (e) { /* ignore */ }
      deferred = null;
      hide();
    });
    document.body.appendChild(bar);
  }

  // Android / Chrome / Edge: the browser offers its own install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e;
    setTimeout(() => show('prompt'), 1500);
  });
  window.addEventListener('appinstalled', () => { remember(); hide(); toast('✓ Installed — find it on your home screen'); });

  // iPhone / iPad: Safari has no prompt, so explain the Share button
  if (isIOS) setTimeout(() => show('ios'), 2000);
})();
