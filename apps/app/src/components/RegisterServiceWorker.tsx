'use client';

import { useEffect, useRef, useState } from 'react';

export function RegisterServiceWorker() {
  const [updateReady, setUpdateReady] = useState(false);
  const acceptUpdate = useRef(false);
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    let registration: ServiceWorkerRegistration | null = null;
    const onControllerChange = () => { if (acceptUpdate.current) window.location.reload(); };
    const register = () => {
      void navigator.serviceWorker.register('/sw.js').then((reg) => {
        registration = reg;
        const showIfReady = () => { if (reg.waiting && navigator.serviceWorker.controller) setUpdateReady(true); };
        showIfReady();
        reg.addEventListener('updatefound', () => reg.installing?.addEventListener('statechange', showIfReady));
        navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
      }).catch(() => {});
    };
    if (document.readyState === 'complete') register();
    else window.addEventListener('load', register, { once: true });
    return () => { window.removeEventListener('load', register); navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange); };
  }, []);
  const update = async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration?.waiting) return;
    acceptUpdate.current = true;
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  };
  return updateReady ? <aside className="install-prompt" role="status"><span>A Sylpace update is ready.</span><button className="button" onClick={update}>Update</button></aside> : null;
}
