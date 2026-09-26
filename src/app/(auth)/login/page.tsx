'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Invalid email or password.');
      } else {
        toast.success('Signed in successfully');
        router.push('/dashboard');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col justify-between px-6 py-10 font-sans"
      style={{ backgroundColor: 'var(--paper)', color: 'var(--ink)' }}
    >
      {/* Top Header / Logo (Pixel-identical to landing and register) */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <svg
            className="w-5 h-5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1A1A16"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <span className="text-lg font-bold tracking-tight" style={{ color: 'var(--ink)' }}>
            ATSResumeBuilder
          </span>
        </Link>

        <Link
          href="/"
          className="text-[14px] font-medium transition-colors hover:underline"
          style={{ color: 'var(--muted)' }}
        >
          ← Back to home
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md mx-auto my-8">
        <div
          className="p-8 rounded-[12px]"
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--line)',
            boxShadow: '0 1px 3px rgba(26, 26, 22, 0.08)',
          }}
        >
          <div className="mb-6">
            <h1
              className="text-[28px] font-semibold tracking-[-0.01em] mb-1"
              style={{ color: 'var(--ink)' }}
            >
              Sign in to ATSResumeBuilder
            </h1>
            <p className="text-[14px]" style={{ color: 'var(--muted)' }}>
              Access your saved resumes and continue editing.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-[14px] font-medium mb-1.5"
                htmlFor="email"
                style={{ color: 'var(--ink)' }}
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label
                className="block text-[14px] font-medium mb-1.5"
                htmlFor="password"
                style={{ color: 'var(--ink)' }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
                style={{ padding: '12px' }}
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </div>
          </form>

          <div
            className="mt-6 pt-5 text-center text-[14px] border-t"
            style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}
          >
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-medium underline hover:opacity-80"
              style={{ color: 'var(--accent)' }}
            >
              Create free account
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-md w-full mx-auto text-center text-[13px]" style={{ color: 'var(--muted)' }}>
        Encrypted credential authentication.
      </div>
    </div>
  );
}
