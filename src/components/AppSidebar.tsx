'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { BookOpen, CalendarDays, CheckSquare, ChevronRight, Goal, LayoutPanelLeft, LineChart, Menu, Settings, Shield, Users, Video, X } from 'lucide-react';
import { StrideLogo } from './StrideLogo';
import { ThemeToggle } from './ThemeToggle';

const routes = [
  { href: '/today', label: 'Today', icon: LayoutPanelLeft },
  { href: '/goals', label: 'Goals', icon: Goal },
  { href: '/plan', label: 'Planner', icon: CalendarDays },
  { href: '/check-in', label: 'Check-in', icon: CheckSquare },
  { href: '/progress', label: 'Progress', icon: LineChart },
  { href: '/community', label: 'Community', icon: Users },
  { href: '/resources', label: 'Resources', icon: BookOpen },
  { href: '/review', label: 'Review', icon: Video },
  { href: '/admin', label: 'Admin', icon: Shield },
];

const publicRoutes = ['/', '/login', '/signup', '/apply', '/application-status'];

export function AppSidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  if (publicRoutes.includes(pathname)) return null;

  const sidebarWidth = expanded ? 'w-60' : 'w-14';

  return <>
    {expanded && <button type="button" aria-label="Close navigation" onClick={() => setExpanded(false)} className="fixed inset-0 z-40 bg-black/30 md:hidden" />}
    <aside className={`fixed inset-y-3 left-3 z-50 flex flex-col rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]/95 p-2 shadow-xl backdrop-blur-xl transition-[width] duration-200 ${sidebarWidth}`}>
      <div className="flex items-center justify-between gap-2 px-1 py-1">
        <Link href="/today" className="min-w-0 overflow-hidden" onClick={() => setExpanded(false)}><StrideLogo size="sm" showWordmark={expanded} /></Link>
        <button type="button" onClick={() => setExpanded((value) => !value)} aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'} aria-expanded={expanded} className="rounded-lg p-2 text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-main)]">
          {expanded ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>
      <nav aria-label="Workspace navigation" className="mt-5 flex flex-1 flex-col gap-1">
        {routes.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return <Link key={href} href={href} title={expanded ? undefined : label} onClick={() => setExpanded(false)} className={`flex items-center gap-3 rounded-xl px-2 py-2.5 text-sm transition ${active ? 'bg-[#18A957]/12 text-[#18A957]' : 'text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-main)]'}`}><Icon className="h-4 w-4 shrink-0" /><span className={`whitespace-nowrap transition-opacity ${expanded ? 'opacity-100' : 'pointer-events-none w-0 overflow-hidden opacity-0'}`}>{label}</span></Link>;
        })}
      </nav>
      <div className="space-y-1 border-t border-[var(--border-color)] pt-2">
        <Link href="/settings" title={expanded ? undefined : 'Settings'} onClick={() => setExpanded(false)} className="flex items-center gap-3 rounded-xl px-2 py-2.5 text-sm text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-main)]"><Settings className="h-4 w-4 shrink-0" /><span className={`${expanded ? 'opacity-100' : 'hidden'}`}>Settings</span></Link>
        {expanded && <div className="px-1 pt-1"><ThemeToggle /></div>}
      </div>
    </aside>
  </>;
}
