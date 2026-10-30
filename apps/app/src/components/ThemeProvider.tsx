'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';
const ThemeContext = createContext<{ theme: Theme; cycle(): void }>({ theme: 'system', cycle() {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  useEffect(() => {
    const saved = localStorage.getItem('sylpace_theme');
    if (saved === 'light' || saved === 'dark' || saved === 'system') setTheme(saved);
  }, []);
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && media.matches);
      document.documentElement.classList.toggle('dark', dark);
      document.documentElement.classList.toggle('light', !dark);
    };
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [theme]);
  const value = useMemo(() => ({ theme, cycle() { const next: Theme = theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system'; localStorage.setItem('sylpace_theme', next); setTheme(next); } }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function ThemeToggle() {
  const { theme, cycle } = useContext(ThemeContext);
  return <button className="theme-toggle" onClick={cycle} aria-label={`Theme: ${theme}. Change theme.`} title={`Theme: ${theme}`} type="button">{theme === 'system' ? 'System' : theme === 'dark' ? 'Dark' : 'Light'}</button>;
}
