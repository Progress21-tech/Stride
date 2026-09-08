import type { Metadata } from 'next';
import './globals.css';
import { AppSidebar } from '@/components/AppSidebar';
import { RegisterSW } from '@/components/RegisterSW';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
    title: 'STRIDE - Structured Learning Accountability Platform',
    description: 'A structured accountability platform for turning learning goals into consistent progress.',
    manifest: '/manifest.json',
    themeColor: '#18A957',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="light" suppressHydrationWarning>
            <body className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] selection:bg-emerald-500/20">
                <ThemeProvider>
                    <RegisterSW />
                    <AppSidebar />
                    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 md:pl-24">
                        {children}
                    </main>
                </ThemeProvider>
            </body>
        </html>
    );
}