import { redirect } from 'next/navigation';

// Keep the installed PWA on authentication; public marketing lives in apps/marketing.
export default function AppEntry() {
  redirect('/login');
}
