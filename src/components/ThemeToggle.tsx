'use client';

import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-lg p-0.5 text-xs">
      <button
        onClick={() => setTheme('light')}
        className={`p-1.5 rounded-md transition flex items-center gap-1 ${
          theme === 'light'
            ? 'bg-[var(--bg-surface)] text-[var(--text-main)] shadow-sm font-semibold'
            : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
        }`}
        title="Light Mode"
      >
        <Sun className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={() => setTheme('dark')}
        className={`p-1.5 rounded-md transition flex items-center gap-1 ${
          theme === 'dark'
            ? 'bg-[var(--bg-surface)] text-[var(--text-main)] shadow-sm font-semibold'
            : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
        }`}
        title="Dark Mode"
      >
        <Moon className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={() => setTheme('system')}
        className={`p-1.5 rounded-md transition flex items-center gap-1 ${
          theme === 'system'
            ? 'bg-[var(--bg-surface)] text-[var(--text-main)] shadow-sm font-semibold'
            : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
        }`}
        title="System Preference"
      >
        <Laptop className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
