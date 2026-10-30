import type { Metadata } from 'next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_MARKETING_URL ?? 'https://sylpace.example';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
