import type { Metadata } from 'next';
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
  LogIn
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'STRIDE — Structured Accountability Platform',
  description: 'A structured accountability platform for turning learning goals into consistent progress.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen flex flex-col selection:bg-emerald-600/30 selection:text-emerald-400">
        
        <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center font-bold text-lg tracking-wider text-emerald-500 shadow-sm">
                S
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                  STRIDE
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">PRD MVP</span>
                </span>
                <span className="text-[11px] text-zinc-400 -mt-0.5">Accountability System</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1 bg-zinc-900/90 p-1 rounded-lg border border-zinc-800/80 text-sm">
              <Link href="/today" className="px-3 py-1.5 rounded-md font-medium text-zinc-300 hover:text-white transition flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-emerald-400" /> Today
              </Link>
              <Link href="/plan" className="px-3 py-1.5 rounded-md font-medium text-zinc-400 hover:text-white transition flex items-center gap-1.5">
                <Target className="w-4 h-4" /> Plan
              </Link>
              <Link href="/check-in" className="px-3 py-1.5 rounded-md font-medium text-zinc-400 hover:text-white transition flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> Check-in
              </Link>
              <Link href="/progress" className="px-3 py-1.5 rounded-md font-medium text-zinc-400 hover:text-white transition flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" /> Progress
              </Link>
              <Link href="/resources" className="px-3 py-1.5 rounded-md font-medium text-zinc-400 hover:text-white transition flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" /> Resources
              </Link>
              <Link href="/review" className="px-3 py-1.5 rounded-md font-medium text-zinc-400 hover:text-white transition flex items-center gap-1.5">
                <Video className="w-4 h-4" /> Saturday Review
              </Link>
              <Link href="/admin" className="px-3 py-1.5 rounded-md font-medium text-amber-400/90 hover:text-amber-300 transition flex items-center gap-1.5">
                <Shield className="w-4 h-4" /> Admin Console
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/login" className="text-xs font-semibold text-zinc-300 hover:text-white transition flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-zinc-900">
                <LogIn className="w-3.5 h-3.5" /> Sign In
              </Link>
              <Link href="/apply" className="px-3.5 py-1.5 text-xs font-semibold rounded-md bg-[#18A957] hover:bg-[#15944c] text-white shadow-sm transition flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Apply Now
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        <footer className="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-xs text-zinc-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>STRIDE — Show up. Keep moving. Finish what you started.</div>
            <div className="font-mono text-[11px]">Strict Monochrome + Stride Green (#18A957)</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
