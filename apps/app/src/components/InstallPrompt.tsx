'use client';

import { useEffect, useState } from 'react';
type InstallEvent = Event & { prompt(): Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> };

export function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState<InstallEvent | null>(null);
  const [ios, setIos] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || localStorage.getItem('sylpace-install-dismissed')) return;
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as Window & { MSStream?: unknown }).MSStream;
    setIos(isIos);
    if (isIos) setVisible(true);
    const onPrompt = (event: Event) => { event.preventDefault(); setInstallEvent(event as InstallEvent); setVisible(true); };
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);
  if (!visible) return null;
  const dismiss = () => { localStorage.setItem('sylpace-install-dismissed', 'true'); setVisible(false); };
  const install = async () => { if (!installEvent) return; await installEvent.prompt(); const result = await installEvent.userChoice; if (result.outcome === 'accepted') setVisible(false); else dismiss(); };
  return <aside className="install-prompt" role="status"><p>{ios ? 'Add Sylpace to your Home Screen from Safari’s Share menu.' : 'Install Sylpace on your phone for quick access.'}</p>{installEvent && <button className="button" onClick={install}>Install</button>}<button className="dismiss" onClick={dismiss} aria-label="Dismiss install suggestion">×</button></aside>;
}
