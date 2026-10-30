'use client';

import { useEffect, useRef, useState } from 'react';

export function RegisterSW() {
  const [updateReady, setUpdateReady] = useState(false);
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);
  const reloadOnControllerChange = useRef(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    const onControllerChange = () => {
      if (reloadOnControllerChange.current) window.location.reload();
    };
    const onLoad = async () => {
      try {
        registrationRef.current = await navigator.serviceWorker.register('/sw.js');
        const registration = registrationRef.current;
        const checkWaiting = () => {
          if (registration.waiting && navigator.serviceWorker.controller) setUpdateReady(true);
        };
        checkWaiting();
        registration.addEventListener('updatefound', () => {
          const installing = registration?.installing;
          installing?.addEventListener('statechange', checkWaiting);
        });
        navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
      } catch (err) {
        console.error('Service worker registration failed:', err);
      }
    };
    if (document.readyState === 'complete') void onLoad();
    else window.addEventListener('load', onLoad, { once: true });
    return () => {
      window.removeEventListener('load', onLoad);
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
    };
  }, []);

  const update = () => {
    const waiting = registrationRef.current?.waiting;
    if (!waiting) return;
    reloadOnControllerChange.current = true;
    waiting.postMessage({ type: 'SKIP_WAITING' });
  };

  return updateReady ? <div role="status" className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-3 text-xs shadow-xl">
    <span>A Sylpace update is ready.</span>
    <button onClick={update} className="rounded-lg bg-[#18A957] px-3 py-2 font-semibold text-white">Update</button>
  </div> : null;
}
