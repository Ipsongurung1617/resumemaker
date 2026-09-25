'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const ADMIN_EMAIL = 'ipsongrg221@gmail.com';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro';
  createdAt: string;
  resumesCount: number;
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const isAuthorized = session?.user?.email === ADMIN_EMAIL;

  async function fetchUsers() {
    if (!isAuthorized) return;
    try {
      const res = await fetch('/api/admin/users');
      const json = await res.json();
      if (json.success && json.data?.users) {
        setUsers(json.data.users);
      } else {
        toast.error(json.message || 'Failed to load users');
      }
    } catch {
      toast.error('Error connecting to database');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (status === 'authenticated' && isAuthorized) {
      fetchUsers();
    } else if (status !== 'loading') {
      setLoading(false);
    }
  }, [status, isAuthorized]);

  async function handleTogglePlan(userId: string, currentPlan: string) {
    const newPlan = currentPlan === 'pro' ? 'free' : 'pro';
    setUpdatingId(userId);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, plan: newPlan }),
      });
      const json = await res.json();
      if (json.success) {
        setUsers(prev =>
          prev.map(u => (u.id === userId ? { ...u, plan: newPlan as 'free' | 'pro' } : u))
        );
        toast.success(`User plan updated to ${newPlan.toUpperCase()}!`);
      } else {
        toast.error(json.message || 'Failed to update plan');
      }
    } catch {
      toast.error('Network error updating plan');
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDeleteUser(userId: string, email: string) {
    if (!confirm(`Are you sure you want to delete user ${email}? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setUsers(prev => prev.filter(u => u.id !== userId));
        toast.success('User deleted');
      } else {
        toast.error(json.message || 'Delete failed');
      }
    } catch {
      toast.error('Network error deleting user');
    }
  }

  const filteredUsers = users.filter(
    u =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalUsers = users.length;
  const proUsers = users.filter(u => u.plan === 'pro').length;
  const freeUsers = users.filter(u => u.plan === 'free').length;
  const totalResumes = users.reduce((acc, u) => acc + u.resumesCount, 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <LoadingSpinner size={24} />
        <p className="text-zinc-500 text-xs">Loading user management dashboard...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-3">
        <div className="text-4xl">🔒</div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-900">Access Restricted</h1>
        <p className="text-xs text-zinc-500 leading-relaxed">
          The User Administration Portal is restricted exclusively to authorized administrator (<span className="font-mono text-zinc-700">{ADMIN_EMAIL}</span>).
        </p>
        <div className="pt-2">
          <Link href="/dashboard" className="btn-primary text-xs !py-2 !px-4">
            ← Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-2 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Admin Portal</h1>
            <span className="text-[10px] bg-zinc-900 text-white font-mono px-2 py-0.5 rounded font-bold">
              SUPERADMIN
            </span>
          </div>
          <p className="text-zinc-500 text-xs mt-1">
            Manage user accounts, toggle subscription tiers, and oversee platform activity.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="btn-secondary text-xs py-2 px-3 flex items-center gap-1"
          >
            ← User Dashboard
          </Link>
          <button
            onClick={fetchUsers}
            className="btn-secondary text-xs py-2 px-3 flex items-center gap-1"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Total Users</p>
          <p className="text-2xl font-black text-zinc-900 mt-1">{totalUsers}</p>
          <p className="text-[10px] text-zinc-400 mt-0.5">Registered accounts</p>
        </div>

        <div className="card p-4 border-l-4 border-l-zinc-900">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Pro Subscribers</p>
          <p className="text-2xl font-black text-zinc-900 mt-1">{proUsers}</p>
          <p className="text-[10px] text-zinc-500 mt-0.5">{totalUsers > 0 ? Math.round((proUsers / totalUsers) * 100) : 0}% conversion rate</p>
        </div>

        <div className="card p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Free Tier</p>
          <p className="text-2xl font-black text-zinc-900 mt-1">{freeUsers}</p>
          <p className="text-[10px] text-zinc-400 mt-0.5">Standard accounts</p>
        </div>

        <div className="card p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Total Resumes</p>
          <p className="text-2xl font-black text-zinc-900 mt-1">{totalResumes}</p>
          <p className="text-[10px] text-zinc-400 mt-0.5">Documents generated</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="card p-0 overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-zinc-200 flex items-center justify-between gap-4 flex-wrap bg-zinc-50/50">
          <div className="flex-1 max-w-sm">
            <input
              type="text"
              placeholder="Search user by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field text-xs py-1.5"
            />
          </div>
          <div className="text-xs text-zinc-500">
            Showing <strong className="text-zinc-900">{filteredUsers.length}</strong> of {totalUsers} users
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-100/70 border-b border-zinc-200 text-zinc-600 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Current Plan</th>
                <th className="py-3 px-4">Resumes</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-400 text-xs">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => {
                  const isUpdating = updatingId === user.id;
                  const isPro = user.plan === 'pro';

                  return (
                    <tr key={user.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-zinc-900">{user.name}</div>
                        <div className="text-zinc-500 font-mono text-[11px]">{user.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            isPro
                              ? 'bg-zinc-900 text-white'
                              : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                          }`}
                        >
                          {isPro ? '⚡ PRO' : 'FREE'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-zinc-900">{user.resumesCount}</span>
                        <span className="text-zinc-400 text-[11px]"> created</span>
                      </td>
                      <td className="py-3 px-4 text-zinc-500 text-[11px]">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleTogglePlan(user.id, user.plan)}
                            disabled={isUpdating}
                            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all border ${
                              isPro
                                ? 'border-zinc-300 text-zinc-700 hover:bg-zinc-100'
                                : 'border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800'
                            }`}
                          >
                            {isUpdating ? (
                              'Updating...'
                            ) : isPro ? (
                              'Downgrade to Free'
                            ) : (
                              'Upgrade to Pro ⚡'
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(user.id, user.email)}
                            className="text-zinc-400 hover:text-red-600 p-1 text-xs"
                            title="Delete user"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alternative CLI Option Notice */}
      <div className="p-4 bg-zinc-100 border border-zinc-200 rounded-xl text-xs text-zinc-600 space-y-1">
        <p className="font-semibold text-zinc-900">💻 Alternative: Visual Database GUI (Prisma Studio)</p>
        <p className="text-[11px] text-zinc-500">
          You can also inspect the SQLite database directly in a browser interface by running:
        </p>
        <code className="block bg-zinc-900 text-zinc-100 px-3 py-1.5 rounded font-mono text-[11px] w-fit">
          npx prisma studio
        </code>
      </div>
    </div>
  );
}
