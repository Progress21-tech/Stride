import type { Metadata } from 'next';
import './globals.css';
import { AppFrame } from '@/components/AppFrame';
import { RegisterSW } from '@/components/RegisterSW';
import { InstallAppPrompt } from '@/components/InstallAppPrompt';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
    title: 'Sylpace | Structured Learning Platform',
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
                    <InstallAppPrompt />
                    <AppFrame>{children}</AppFrame>
                </ThemeProvider>
            </body>
        </html>
    );
}
