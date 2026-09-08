import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { 
  CheckSquare, 
  Target, 
  Calendar, 
  TrendingUp, 
  BookOpen, 
  Video, 
  Shield, 
  FileText,
  Users,
  Settings,
  LogIn
} from 'lucide-react';
import { StrideLogo } from '@/components/StrideLogo';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { RegisterSW } from '@/components/RegisterSW';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'STRIDE — Structured Learning Accountability Platform',
  description: 'A structured accountability platform for turning learning goals into consistent progress.',
  manifest: '/manifest.json',
  themeColor: '#18A957',
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`light ${inter.variable}`} suppressHydrationWarning>
      <body className={`bg-[var(--bg-main)] text-[var(--text-main)] min-h-screen flex flex-col selection:bg-emerald-500/20 selection:text-emerald-600 dark:selection:text-emerald-400`}>
        <ThemeProvider>
          <RegisterSW />
           
           {/* Header Bar */}
          <header className="sticky top-0 z-40 w-full border-b border-[var(--border-color)] bg-[var(--bg-surface)]/90 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              
              {/* Logo Lockup */}
              <Link href="/" className="flex items-center gap-2 group">
                <StrideLogo size="md" showWordmark={true} />
                <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 ml-1">
                  PRD MVP
                </span>
              </Link>

              {/* Primary Navigation Destinations */}
              <nav className="hidden lg:flex items-center gap-1 bg-[var(--bg-subtle)] p-1 rounded-xl border border-[var(--border-color)] text-xs font-medium">
                <Link href="/today" className="px-3 py-1.5 rounded-lg text-[var(--text-main)] hover:bg-[var(--bg-surface)] transition flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-[#18A957]" /> Today
                </Link>
                <Link href="/plan" className="px-3 py-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)] transition flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" /> Plan
                </Link>
                <Link href="/goals" className="px-3 py-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)] transition flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" /> Goals
                </Link>
                <Link href="/check-in" className="px-3 py-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)] transition flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Check-in
                </Link>
                <Link href="/progress" className="px-3 py-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)] transition flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" /> Progress
                </Link>
                <Link href="/community" className="px-3 py-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)] transition flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> Community
                </Link>
                <Link href="/resources" className="px-3 py-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)] transition flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> Catalog
                </Link>
                <Link href="/review" className="px-3 py-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)] transition flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5" /> Review
                </Link>
                <Link href="/admin" className="px-3 py-1.5 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-[var(--bg-surface)] transition flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> Admin
                </Link>
              </nav>

              {/* Utility Actions */}
              <div className="flex items-center gap-2">
                <ThemeToggle />
                
                <Link href="/settings" className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-subtle)] transition" title="Settings">
                  <Settings className="w-4 h-4" />
                </Link>

                <Link href="/login" className="hidden sm:flex text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-[var(--bg-subtle)]">
                  <LogIn className="w-3.5 h-3.5" /> Sign In
                </Link>
                
                <Link href="/apply" className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#18A957] hover:bg-[#15944c] text-white shadow-sm transition flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Apply
                </Link>
              </div>
            </div>

            {/* Mobile Navigation Row */}
            <div className="lg:hidden flex items-center justify-between overflow-x-auto px-4 py-2 bg-[var(--bg-subtle)] border-t border-[var(--border-color)] text-xs no-scrollbar">
              <Link href="/today" className="px-2.5 py-1 text-[var(--text-main)] font-semibold flex items-center gap-1">Today</Link>
              <Link href="/plan" className="px-2.5 py-1 text-[var(--text-muted)] flex items-center gap-1">Plan</Link>
              <Link href="/goals" className="px-2.5 py-1 text-[var(--text-muted)] flex items-center gap-1">Goals</Link>
              <Link href="/check-in" className="px-2.5 py-1 text-[var(--text-muted)] flex items-center gap-1">Check-in</Link>
              <Link href="/progress" className="px-2.5 py-1 text-[var(--text-muted)] flex items-center gap-1">Progress</Link>
              <Link href="/community" className="px-2.5 py-1 text-[var(--text-muted)] flex items-center gap-1">Community</Link>
              <Link href="/resources" className="px-2.5 py-1 text-[var(--text-muted)] flex items-center gap-1">Catalog</Link>
              <Link href="/review" className="px-2.5 py-1 text-[var(--text-muted)] flex items-center gap-1">Review</Link>
              <Link href="/admin" className="px-2.5 py-1 text-amber-600 dark:text-amber-400 flex items-center gap-1">Admin</Link>
            </div>
          </header>

          {/* Main Content Body */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-[var(--border-color)] bg-[var(--bg-surface)] py-6 text-center text-xs text-[var(--text-muted)]">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <StrideLogo size="sm" showWordmark={true} />
                <span>— Show up. Keep moving.</span>
              </div>
              <div className="font-mono text-[11px] text-[var(--text-muted)]">
                PWA Ready • Monochrome + Stride Green (#18A957)
              </div>
            </div>
          </footer>

        </ThemeProvider>
      </body>
    </html>
  );
}
