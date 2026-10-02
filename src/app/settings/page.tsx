'use client';

import { useState, useEffect } from 'react';
import { Settings, Sun, Moon, Laptop, Bell, User, Shield, LogOut, Globe, GraduationCap, Save } from 'lucide-react';
import { signOutUser } from '@/lib/auth-supabase';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { supabase } from '@/lib/supabase';

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [lmsUrl, setLmsUrl] = useState('');
  const [lmsSaved, setLmsSaved] = useState(false);

  useEffect(() => {
    setDailyReminder(localStorage.getItem('stride-daily-reminder') !== 'off');
    setLmsUrl(localStorage.getItem('stride-lms-url') || '');
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          setProfile({
            id: user.id,
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
            email: user.email,
            timezone: 'UTC',
          });
        } else {
          setProfile(data);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      router.push('/login');
    } catch (err: any) {
      alert(err.message || 'Failed to sign out.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="glass-card rounded-xl p-6 sm:p-8">
          <div className="text-xs text-[var(--text-muted)]">Loading settings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="glass-card rounded-xl p-6 sm:p-8 space-y-6">
        <div>
          <div className="text-xs font-mono uppercase text-[#18A957] mb-1 flex items-center gap-1.5">
            <Settings className="w-3.5 h-3.5" /> Configuration
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">Settings</h1>
        </div>

        <div className="space-y-6">
          {/* Appearance Section */}
          <div className="border border-[var(--border-color)] rounded-xl p-5 bg-[var(--card-bg)] space-y-3">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-[#18A957]" />
              <h2 className="text-sm font-semibold text-[var(--text-main)]">Appearance</h2>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              Choose how Stride looks. Light theme is default.
            </p>
            <div className="flex items-center gap-1.5 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setTheme('light')}
                className={`flex-1 px-3 py-2 rounded-md transition flex items-center justify-center gap-1.5 ${
                  theme === 'light'
                    ? 'bg-[var(--bg-surface)] text-[var(--text-main)] shadow-sm font-semibold border border-[var(--border-color)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <Sun className="w-3.5 h-3.5" /> Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex-1 px-3 py-2 rounded-md transition flex items-center justify-center gap-1.5 ${
                  theme === 'dark'
                    ? 'bg-[var(--bg-surface)] text-[var(--text-main)] shadow-sm font-semibold border border-[var(--border-color)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <Moon className="w-3.5 h-3.5" /> Dark
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`flex-1 px-3 py-2 rounded-md transition flex items-center justify-center gap-1.5 ${
                  theme === 'system'
                    ? 'bg-[var(--bg-surface)] text-[var(--text-main)] shadow-sm font-semibold border border-[var(--border-color)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" /> System
              </button>
            </div>
          </div>

          <div className="border border-[var(--border-color)] rounded-xl p-5 bg-[var(--card-bg)] space-y-3">
            <div className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-[#18A957]" /><h2 className="text-sm font-semibold text-[var(--text-main)]">Connect your LMS</h2></div>
            <p className="text-[11px] text-[var(--text-muted)]">Add the web address of your learning platform. If it allows embedding, it will appear in Resources alongside your Stride goals.</p>
            <form onSubmit={(event) => { event.preventDefault(); try { const parsed = new URL(lmsUrl); if (!['https:', 'http:'].includes(parsed.protocol)) return; localStorage.setItem('stride-lms-url', parsed.toString()); setLmsUrl(parsed.toString()); setLmsSaved(true); window.setTimeout(() => setLmsSaved(false), 2500); } catch { setLmsSaved(false); } }} className="flex flex-col gap-2 sm:flex-row">
              <input type="url" value={lmsUrl} onChange={(event) => setLmsUrl(event.target.value)} placeholder="https://your-learning-platform.com" aria-label="LMS website address" className="min-w-0 flex-1 rounded-lg border border-[var(--border-color)] bg-[var(--bg-subtle)] px-3 py-2 text-sm text-[var(--text-main)] outline-none focus:border-[#18A957]" />
              <button className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#18A957] px-3 py-2 text-xs font-semibold text-white hover:bg-[#15944c]"><Save className="h-3.5 w-3.5" />{lmsSaved ? 'Saved' : 'Save LMS'}</button>
            </form>
            <p className="text-[10px] text-[var(--text-muted)]">Some platforms block embedding or require a separate sign-in. Your LMS progress tracking depends on that platform allowing access.</p>
          </div>

          {/* Notifications Section */}
          <div className="border border-[var(--border-color)] rounded-xl p-5 bg-[var(--card-bg)] space-y-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#18A957]" />
              <h2 className="text-sm font-semibold text-[var(--text-main)]">Notifications</h2>
            </div>
            <div className="text-xs text-[var(--text-muted)] space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={dailyReminder} onChange={(event) => { setDailyReminder(event.target.checked); localStorage.setItem('stride-daily-reminder', event.target.checked ? 'on' : 'off'); }} className="w-3.5 h-3.5 rounded accent-[#18A957]" />
                Remind me of today's tasks when I open Stride
              </label>
              <label className="flex items-center gap-2 opacity-60">
                <input type="checkbox" defaultChecked className="w-3.5 h-3.5 rounded accent-[#18A957]" />
                Weekly review summary (coming soon)
              </label>
              <p className="text-[10px]">The daily reminder appears in Stride when you sign in. Browser push notifications require separate permission and are not enabled yet.</p>
            </div>
          </div>

          {/* Account Section */}
          <div className="border border-[var(--border-color)] rounded-xl p-5 bg-[var(--card-bg)] space-y-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#18A957]" />
              <h2 className="text-sm font-semibold text-[var(--text-main)]">Account</h2>
            </div>
            <div className="text-xs text-[var(--text-muted)] space-y-1.5">
              <div className="flex justify-between">
                <span>Name</span>
                <span className="text-[var(--text-main)] font-medium">{profile?.name || ' —'}</span>
              </div>
              <div className="flex justify-between">
                <span>Email</span>
                <span className="text-[var(--text-main)] font-medium">{profile?.email || ' —'}</span>
              </div>
              <div className="flex justify-between">
                <span>Timezone</span>
                <span className="text-[var(--text-main)] font-mono">{profile?.timezone || 'UTC'}</span>
              </div>
              <div className="flex justify-between">
                <span>Role</span>
                <span className="text-[var(--text-main)] font-mono">{profile?.role || 'MEMBER'}</span>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full mt-2 px-4 py-2 text-xs font-medium rounded-lg border border-[var(--border-color)] bg-[var(--bg-subtle)] hover:bg-[var(--border-color)] text-[var(--text-main)] transition flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>

          {/* About Section */}
          <div className="border border-[var(--border-color)] rounded-xl p-5 bg-[var(--card-bg)] space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#18A957]" />
              <h2 className="text-sm font-semibold text-[var(--text-main)]">About Stride</h2>
            </div>
            <div className="text-xs text-[var(--text-muted)] space-y-1">
              <div>Stride v1.0 — Structured Learning Accountability Platform</div>
              <div className="flex items-center gap-1.5">
                <Globe className="w-3 h-3" />
                <span>PWA-ready. Install from your browser menu for app-like experience.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
