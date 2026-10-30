import type { Metadata } from 'next';
import './globals.css';
import { siteUrl } from '../lib/site-url';

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: 'Sylpace — Learn your courses. Stay on track.',
  description: 'Sylpace brings university courses, lessons, practice and progress tracking together, with accountability built in to help students keep going.',
  applicationName: 'Sylpace',
  openGraph: {
    title: 'Sylpace — Learn your courses. Stay on track.',
    description: 'University courses, lessons, practice and progress tracking, with accountability built in.',
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
