import type { Metadata } from 'next';
import './globals.css';
import { siteUrl } from '../lib/site-url';

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: 'Sylpace — Learn with a plan. Keep showing up.',
  description: 'Sylpace is a learning platform in development for university students, with tutor-led courses and practical tools to help students follow through.',
  applicationName: 'Sylpace',
  openGraph: {
    title: 'Sylpace — Learn with a plan. Keep showing up.',
    description: 'A university learning platform is coming soon.',
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
