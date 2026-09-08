'use client';

import { useEffect, useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';

type DeferredInstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> };

export function InstallAppPrompt() {
  const [prompt, setPrompt] = useState<DeferredInstallPrompt | null>(null);
  const [visible, setVisible] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || localStorage.getItem('stride-install-dismissed')) return;
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIos(isIos);
    if (isIos) setVisible(true);
    const handlePrompt = (event: Event) => { event.preventDefault(); setPrompt(event as DeferredInstallPrompt); setVisible(true); };
    window.addEventListener('beforeinstallprompt', handlePrompt);
    return () => window.removeEventListener('beforeinstallprompt', handlePrompt);
  }, []);

  const dismiss = () => { localStorage.setItem('stride-install-dismissed', 'true'); setVisible(false); };
  const install = async () => {
    if (!prompt) return;
    await prompt.prompt();
    const choice = await prompt.userChoice;
    if (choice.outcome === 'accepted') setVisible(false);
    else dismiss();
  };

  if (!visible) return null;
  return <div role="status" className="fixed top-3 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-emerald-500/30 bg-zinc-950/95 p-3 text-white shadow-2xl backdrop-blur-md">
    <div className="flex items-center gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400"><Smartphone className="h-4 w-4" /></div><p className="flex-1 text-xs leading-relaxed">{ios ? 'Add Stride to your Home Screen from Safari’s Share menu for the full app experience.' : 'Install Stride on your phone for quick access and a focused app experience.'}</p><button onClick={dismiss} aria-label="Dismiss install suggestion" className="rounded-lg p-1 text-zinc-400 hover:bg-white/10 hover:text-white"><X className="h-4 w-4" /></button></div>
    {prompt && <button onClick={install} className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#18A957] px-3 py-2 text-xs font-semibold text-white hover:bg-[#15944c]"><Download className="h-3.5 w-3.5" /> Install app</button>}
  </div>;
}
