import type { Metadata, Viewport } from 'next';
import './globals.css';
import { RegisterServiceWorker } from '@/components/RegisterServiceWorker';
import { ThemeProvider, ThemeToggle } from '@/components/ThemeProvider';
import { InstallPrompt } from '@/components/InstallPrompt';

export const metadata: Metadata = {
  title: 'Sylpace | Learn with a plan',
  description: 'Sylpace learning workspace for students.',
  applicationName: 'Sylpace',
  referrer: 'no-referrer',
  manifest: '/manifest.json',
};

export const viewport: Viewport = { themeColor: '#18A957', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body><ThemeProvider><RegisterServiceWorker /><InstallPrompt /><ThemeToggle />{children}</ThemeProvider></body></html>;
}
