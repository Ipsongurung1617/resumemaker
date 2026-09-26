'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const NAV_ITEMS = [
  { label: 'My Resumes', href: '/dashboard', icon: 'file' },
  { label: 'New Resume', href: '/resume/new', icon: 'plus' },
  { label: 'Pricing', href: '/pricing', icon: 'badge' },
  { label: 'User Admin', href: '/admin', icon: 'users' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (status === 'loading') {
    return (
      <div
        className="min-h-screen flex items-center justify-center font-sans"
        style={{ backgroundColor: 'var(--paper)', color: 'var(--ink)' }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: 'var(--ink)', borderTopColor: 'transparent' }}
          />
          <p className="text-[14px]" style={{ color: 'var(--muted)' }}>
            Loading workspace…
          </p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.replace('/login');
    return null;
  }

  const user = session?.user as { name?: string; email?: string; plan?: string } | undefined;
  const isPro = user?.plan === 'pro';
  const displayName = user?.name || user?.email?.split('@')[0] || 'User';

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside
      className={`${
        mobile
          ? 'fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ' +
            (sidebarOpen ? 'translate-x-0' : '-translate-x-full')
          : 'hidden lg:flex flex-col w-64 shrink-0'
      } flex flex-col h-screen`}
      style={{ backgroundColor: '#1A1A16', color: '#FDFCF9' }}
    >
      {/* Brand Wordmark (Pixel-identical) */}
      <div
        className="px-6 py-6 border-b flex items-center justify-between"
        style={{ borderColor: 'rgba(253, 252, 249, 0.12)' }}
      >
        <Link href="/" className="flex items-center gap-2">
          <svg
            className="w-5 h-5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FDFCF9"
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
          <span className="text-lg font-bold tracking-tight" style={{ color: '#FDFCF9' }}>
            ATSResumeBuilder
          </span>
        </Link>

        {mobile && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-xs p-1"
            style={{ color: 'rgba(253, 252, 249, 0.55)' }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-6 space-y-1.5">
        {NAV_ITEMS.filter(item => item.href !== '/admin' || session?.user?.email === 'ipsongrg221@gmail.com').map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-[8px] text-[14px] font-medium transition-all"
              style={{
                backgroundColor: active ? 'rgba(253, 252, 249, 0.08)' : 'transparent',
                color: active ? '#FDFCF9' : 'rgba(253, 252, 249, 0.55)',
                borderLeft: active ? '3px solid #2F5D3A' : '3px solid transparent',
              }}
            >
              <span>{item.label}</span>
              {item.label === 'Pricing' && !isPro && (
                <span
                  className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-[8px]"
                  style={{
                    backgroundColor: 'rgba(47, 93, 58, 0.20)',
                    color: '#FDFCF9',
                  }}
                >
                  Pro
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User profile & Plan footer */}
      <div
        className="px-5 py-5 border-t"
        style={{ borderColor: 'rgba(253, 252, 249, 0.12)' }}
      >
        <div className="flex items-center justify-between mb-3 text-[13px]">
          <div className="truncate font-medium" style={{ color: '#FDFCF9' }}>
            {displayName}
          </div>
          <span
            className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-[8px]"
            style={{
              backgroundColor: isPro ? '#2F5D3A' : 'rgba(253, 252, 249, 0.15)',
              color: '#FDFCF9',
            }}
          >
            {isPro ? 'Pro' : 'Free'}
          </span>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="text-[13px] hover:underline transition-opacity"
          style={{ color: 'rgba(253, 252, 249, 0.55)' }}
        >
          Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <div
      className="min-h-screen flex font-sans"
      style={{ backgroundColor: 'var(--paper)', color: 'var(--ink)' }}
    >
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* Mobile Sidebar */}
      <Sidebar mobile />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top toggle */}
        <div
          className="lg:hidden flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'var(--line)' }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-[14px] font-medium"
            style={{ color: 'var(--ink)' }}
          >
            ☰ Menu
          </button>
          <span className="font-bold text-[15px]" style={{ color: 'var(--ink)' }}>
            ATSResumeBuilder
          </span>
          <div className="w-6" />
        </div>

        {/* Child Pages */}
        <main className="flex-1 p-6 lg:p-10 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
