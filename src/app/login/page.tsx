'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmail, signInWithGoogle } from '@/lib/auth-supabase';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { StrideLogo } from '@/components/StrideLogo';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      await signInWithEmail(email, password);
      router.push('/today');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to initialize Google Sign-In.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 space-y-6">

      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <StrideLogo size="md" showWordmark={true} />
        </div>
        <h1 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">Sign in to Stride</h1>
        <p className="text-xs text-[var(--text-muted)]">Enter your credentials to access your accountability workspace.</p>
      </div>

      <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-5">

        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-main)] transition flex items-center justify-center gap-3 shadow-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          Continue with Google
        </button>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-[var(--border-color)] w-full"></div>
          <span className="bg-[var(--card-bg)] px-3 text-[11px] font-mono text-[var(--text-muted)] uppercase">or email</span>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-xs font-medium text-[var(--text-main)] mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                id="login-email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-lg pl-9 pr-3.5 py-2 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-emerald-500"
              />
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label htmlFor="login-password" className="block text-xs font-medium text-[var(--text-main)] mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                id="login-password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-lg pl-9 pr-3.5 py-2 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-emerald-500"
              />
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-xs font-semibold rounded-xl bg-[#18A957] hover:bg-[#15944c] text-white shadow-md transition flex items-center justify-center gap-2"
          >
            {loading ? 'Signing in...' : 'Sign In with Email'} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-[var(--text-muted)]">
          Don't have an account?{' '}
          <Link href="/signup" className="text-emerald-400 hover:underline font-medium">
            Sign up
          </Link>
        </div>

      </div>
    </div>
  );
}
