'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Valid email is required.';
    if (form.password.length < 8)
      errs.password = 'Password must be at least 8 characters.';
    if (form.password !== form.confirm)
      errs.confirm = 'Passwords do not match.';
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || 'Registration failed. Please try again.');
        setLoading(false);
        return;
      }

      // Auto sign in after registration
      const signInResult = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (signInResult?.error) {
        toast.error('Account created! Please sign in.');
        router.push('/login');
      } else {
        toast.success('Account created successfully');
        router.push('/dashboard');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function field(key: keyof typeof form, label: string, type: string, placeholder: string) {
    return (
      <div>
        <label
          className="block text-[14px] font-medium mb-1.5"
          htmlFor={key}
          style={{ color: 'var(--ink)' }}
        >
          {label}
        </label>
        <input
          id={key}
          type={type}
          className={`input-field ${errors[key] ? 'border-red-500' : ''}`}
          placeholder={placeholder}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          autoComplete={type === 'password' ? 'new-password' : key}
        />
        {errors[key] && (
          <p className="text-xs mt-1" style={{ color: '#1A1A16', opacity: 0.8 }}>
            {errors[key]}
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col justify-between px-6 py-10 font-sans"
      style={{ backgroundColor: 'var(--paper)', color: 'var(--ink)' }}
    >
      {/* Top Header / Logo (Pixel-identical to landing page) */}
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

      {/* Main Form Container */}
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
              Create your account
            </h1>
            <p className="text-[14px]" style={{ color: 'var(--muted)' }}>
              Start building your ATS-compliant resume in minutes.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {field('name', 'Full Name', 'text', 'Jane Doe')}
            {field('email', 'Email Address', 'email', 'jane@example.com')}
            {field('password', 'Password', 'password', 'At least 8 characters')}
            {field('confirm', 'Confirm Password', 'password', 'Re-enter password')}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
                style={{ padding: '12px' }}
              >
                {loading ? 'Creating account…' : 'Create Free Account'}
              </button>
            </div>
          </form>

          <div
            className="mt-6 pt-5 text-center text-[14px] border-t"
            style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}
          >
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium underline hover:opacity-80"
              style={{ color: 'var(--accent)' }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-md w-full mx-auto text-center text-[13px]" style={{ color: 'var(--muted)' }}>
        Free tier includes 3 resume versions. No credit card required.
      </div>
    </div>
  );
}
