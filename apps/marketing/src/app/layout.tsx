import type { Metadata } from 'next';
import './globals.css';
import { siteUrl } from '../lib/site-url';

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: 'Sylpace — Turn intention into progress.',
  description: 'Sylpace is a structured learning accountability platform that helps learners turn goals into plans, follow through day by day, and review their progress.',
  applicationName: 'Sylpace',
  openGraph: {
    title: 'Sylpace — Turn intention into progress.',
    description: 'Set a learning goal, plan the work, show up consistently, and review your progress.',
    siteName: 'Sylpace',
    type: 'website',
  },
  robots: {
    index: process.env.MARKETING_INDEXING_ENABLED === 'true',
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
