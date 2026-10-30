'use client';

import { usePathname } from 'next/navigation';
import { AppSidebar } from '@/components/AppSidebar';

const publicAppRoutes = ['/login', '/signup', '/auth/callback', '/offline'];

export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = publicAppRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  return <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-3 px-3 py-3 sm:px-6 sm:py-6 md:flex-row md:gap-6 lg:px-8">
    {!isPublic && <AppSidebar />}
    <main className={`min-w-0 flex-1 py-3 md:py-0 ${isPublic ? 'mx-auto flex w-full max-w-md items-center' : ''}`}>{children}</main>
  </div>;
}
