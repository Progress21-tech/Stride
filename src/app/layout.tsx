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
  FileText 
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
    <html lang="en" class="dark">
      <body class="bg-zinc-950 text-zinc-100 min-h-screen flex flex-col selection:bg-emerald-600/30 selection:text-emerald-400">
        
        <!-- Header Nav -->
        <header class="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            
            <Link href="/" class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center font-bold text-lg tracking-wider text-emerald-500 shadow-sm">
                S
              </div>
              <div class="flex flex-col">
                <span class="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                  STRIDE
                  <span class="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">PRD MVP</span>
                </span>
                <span class="text-[11px] text-zinc-400 -mt-0.5">Accountability System</span>
              </div>
            </Link>

            <nav class="hidden md:flex items-center gap-1 bg-zinc-900/90 p-1 rounded-lg border border-zinc-800/80 text-sm">
              <Link href="/today" class="px-3 py-1.5 rounded-md font-medium text-zinc-300 hover:text-white transition flex items-center gap-1.5">
                <CheckSquare class="w-4 h-4 text-emerald-400" /> Today
              </Link>
              <Link href="/plan" class="px-3 py-1.5 rounded-md font-medium text-zinc-400 hover:text-white transition flex items-center gap-1.5">
                <Target class="w-4 h-4" /> Plan
              </Link>
              <Link href="/check-in" class="px-3 py-1.5 rounded-md font-medium text-zinc-400 hover:text-white transition flex items-center gap-1.5">
                <Calendar class="w-4 h-4" /> Check-in
              </Link>
              <Link href="/progress" class="px-3 py-1.5 rounded-md font-medium text-zinc-400 hover:text-white transition flex items-center gap-1.5">
                <TrendingUp class="w-4 h-4" /> Progress
              </Link>
              <Link href="/resources" class="px-3 py-1.5 rounded-md font-medium text-zinc-400 hover:text-white transition flex items-center gap-1.5">
                <BookOpen class="w-4 h-4" /> Resources
              </Link>
              <Link href="/review" class="px-3 py-1.5 rounded-md font-medium text-zinc-400 hover:text-white transition flex items-center gap-1.5">
                <Video class="w-4 h-4" /> Saturday Review
              </Link>
              <Link href="/admin" class="px-3 py-1.5 rounded-md font-medium text-amber-400/90 hover:text-amber-300 transition flex items-center gap-1.5">
                <Shield class="w-4 h-4" /> Admin Console
              </Link>
            </nav>

            <div class="flex items-center gap-3">
              <Link href="/apply" class="px-3.5 py-1.5 text-xs font-semibold rounded-md bg-[#18A957] hover:bg-[#15944c] text-white shadow-sm transition flex items-center gap-1.5">
                <FileText class="w-3.5 h-3.5" /> Apply Now
              </Link>
            </div>
          </div>
        </header>

        <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        <footer class="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-xs text-zinc-500">
          <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>STRIDE — Show up. Keep moving. Finish what you started.</div>
            <div class="font-mono text-[11px]">Strict Monochrome + Stride Green (#18A957)</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
