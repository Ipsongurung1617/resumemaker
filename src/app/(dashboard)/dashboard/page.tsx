'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ResumeData, ResumeTemplate } from '@/types/resume';

interface ResumeCard {
  id: string;
  title: string;
  template: ResumeTemplate;
  createdAt: string;
  updatedAt: string;
  data: ResumeData;
}

const TEMPLATE_LABELS: Record<ResumeTemplate, string> = {
  modern: 'Modern Corporate',
  classic: 'Minimalist Serif',
  minimal: 'Tech Mono',
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [resumes, setResumes] = useState<ResumeCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isPro = session?.user?.plan === 'pro';
  const maxResumes = isPro ? Infinity : 3;

  useEffect(() => {
    fetchResumes();
  }, []);

  async function fetchResumes() {
    try {
      const res = await fetch('/api/resume');
      const json = await res.json();
      if (json.success) setResumes(json.data);
    } catch {
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this resume document? This action cannot be undone.')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/resume/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setResumes(prev => prev.filter(r => r.id !== id));
        toast.success('Resume deleted');
      } else {
        toast.error(json.message || 'Delete failed');
      }
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeletingId(null);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div
          className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mb-3"
          style={{ borderColor: 'var(--ink)', borderTopColor: 'transparent' }}
        />
        <p className="text-[14px]" style={{ color: 'var(--muted)' }}>
          Retrieving your documents…
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ─── Top Status & Header Row ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b" style={{ borderColor: 'var(--line)' }}>
        <div>
          {/* Wayfinding Breadcrumb / Micro label */}
          <div className="text-[13px] font-medium uppercase tracking-[0.04em] mb-1" style={{ color: 'var(--accent)' }}>
            Workspace Overview
          </div>
          <h1
            className="text-[28px] font-semibold tracking-[-0.01em]"
            style={{ color: 'var(--ink)' }}
          >
            My Resumes
          </h1>
          <p className="text-[14px] mt-1" style={{ color: 'var(--muted)' }}>
            {resumes.length} / {isPro ? 'Unlimited' : `${maxResumes}`} documents used
          </p>
        </div>

        <div className="flex items-center gap-6">
          {/* Persistent Autosave / Cloud Sync Indicator */}
          <div className="flex items-center gap-1.5 text-[13px] font-medium" style={{ color: 'var(--accent)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>Cloud synced</span>
          </div>

          {/* New Resume CTA in --accent (Single primary action on dashboard) */}
          {(isPro || resumes.length < 3) && (
            <Link
              href="/resume/new"
              className="btn-primary"
            >
              <span>+</span>
              <span>New Resume</span>
            </Link>
          )}
        </div>
      </div>

      {/* Upgrade Callout for Free Tier (No neon, flat surface) */}
      {!isPro && (
        <div
          className="p-5 rounded-[12px] flex items-center justify-between flex-wrap gap-4"
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--line)',
            boxShadow: '0 1px 3px rgba(26, 26, 22, 0.08)',
          }}
        >
          <div>
            <div className="font-semibold text-[15px]" style={{ color: 'var(--ink)' }}>
              Pro Plan Membership
            </div>
            <p className="text-[14px] mt-0.5" style={{ color: 'var(--muted)' }}>
              Unlock unlimited resumes, Tech Mono engineering layout, and AI-powered sentence enhancement.
            </p>
          </div>
          <Link
            href="/pricing"
            className="btn-secondary text-[13px]"
          >
            Upgrade Plan ($9/mo) →
          </Link>
        </div>
      )}

      {/* ─── Resume Grid ─── */}
      {resumes.length === 0 ? (
        <div
          className="p-16 text-center rounded-[12px]"
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--line)',
            boxShadow: '0 1px 3px rgba(26, 26, 22, 0.08)',
          }}
        >
          <div className="w-12 h-12 rounded-[8px] mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'rgba(26, 26, 22, 0.08)' }}>
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#1A1A16" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <h2 className="text-[20px] font-semibold mb-2" style={{ color: 'var(--ink)' }}>
            No resumes created yet
          </h2>
          <p className="text-[14px] max-w-sm mx-auto mb-6" style={{ color: 'var(--muted)' }}>
            Create your first ATS-formatted resume with real-time typesetting and verified structure.
          </p>
          <Link
            href="/resume/new"
            className="btn-primary"
          >
            Create My First Resume
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map(resume => {
            const personal = resume.data?.personalInfo;
            const experience = resume.data?.workExperience?.[0];
            const candidateName = personal?.name?.trim() || 'Candidate Name';
            const candidateRole = experience?.title || personal?.summary?.slice(0, 32) || 'Professional Resume';

            return (
              <div
                key={resume.id}
                className="card flex flex-col justify-between group"
              >
                <div>
                  {/* REAL Mini-Preview Thumbnail (Not skeleton bars) */}
                  <div
                    className="h-44 rounded-[8px] p-3.5 mb-4 overflow-hidden relative font-serif text-[8px] leading-tight select-none border"
                    style={{
                      backgroundColor: 'var(--paper)',
                      borderColor: 'var(--line)',
                      color: 'var(--ink)',
                    }}
                  >
                    {/* Header in thumbnail */}
                    <div className="border-b pb-1.5 mb-2 text-center" style={{ borderColor: 'var(--line)' }}>
                      <div className="font-bold text-[9px] uppercase tracking-wider truncate" style={{ color: 'var(--ink)' }}>
                        {candidateName}
                      </div>
                      <div className="text-[7px] truncate" style={{ color: 'var(--muted)' }}>
                        {personal?.email || 'contact@domain.com'} • {personal?.location || 'Location'}
                      </div>
                    </div>

                    {/* Summary in thumbnail */}
                    <div className="mb-2">
                      <div className="font-sans font-bold uppercase tracking-wider text-[7px] mb-0.5" style={{ color: 'var(--ink)' }}>
                        Summary
                      </div>
                      <p className="line-clamp-2 text-[7px]" style={{ color: 'var(--muted)' }}>
                        {personal?.summary || 'Experienced professional with proven track record in operations and execution.'}
                      </p>
                    </div>

                    {/* Work Experience in thumbnail */}
                    <div>
                      <div className="font-sans font-bold uppercase tracking-wider text-[7px] mb-0.5" style={{ color: 'var(--ink)' }}>
                        Experience
                      </div>
                      <div className="flex justify-between font-sans font-semibold text-[7px]">
                        <span className="truncate">{candidateRole}</span>
                        <span style={{ color: 'var(--muted)' }}>2021 – Present</span>
                      </div>
                      <p className="line-clamp-1 italic text-[6.5px]" style={{ color: 'var(--muted)' }}>
                        {experience?.company || 'Company Organization'}
                      </p>
                    </div>

                    {/* Template micro badge inside preview */}
                    <div
                      className="absolute bottom-2 right-2 text-[8px] font-mono px-1.5 py-0.5 rounded-[4px] border"
                      style={{
                        backgroundColor: 'var(--surface)',
                        borderColor: 'var(--line)',
                        color: 'var(--muted)',
                      }}
                    >
                      {TEMPLATE_LABELS[resume.template] || 'Template'}
                    </div>
                  </div>

                  {/* Document Title & Metadata */}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3
                      className="text-[16px] font-semibold truncate flex-1"
                      style={{ color: 'var(--ink)' }}
                      title={resume.title}
                    >
                      {resume.title}
                    </h3>
                  </div>

                  <p className="text-[13px] mb-5" style={{ color: 'var(--muted)' }}>
                    Last updated {formatDate(resume.updatedAt)}
                  </p>
                </div>

                {/* Actions row: Secondary links / buttons */}
                <div
                  className="flex items-center gap-2 pt-3 border-t"
                  style={{ borderColor: 'var(--line)' }}
                >
                  <Link
                    href={`/resume/${resume.id}/edit`}
                    className="btn-secondary flex-1 text-[13px]"
                    style={{ padding: '8px 12px' }}
                  >
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => router.push(`/resume/${resume.id}/edit?download=1`)}
                    className="btn-secondary text-[13px]"
                    style={{ padding: '8px 12px' }}
                  >
                    Export
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(resume.id)}
                    disabled={deletingId === resume.id}
                    className="btn-secondary text-[13px] hover:text-red-700"
                    style={{ padding: '8px 10px' }}
                    title="Delete resume"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}

          {/* Add New Card (If limit not reached) */}
          {(isPro || resumes.length < 3) && (
            <Link
              href="/resume/new"
              className="card flex flex-col items-center justify-center p-8 transition-colors group cursor-pointer"
              style={{
                borderStyle: 'dashed',
                minHeight: '280px',
              }}
            >
              <div
                className="w-10 h-10 rounded-[8px] flex items-center justify-center text-lg mb-3"
                style={{
                  backgroundColor: 'rgba(26, 26, 22, 0.08)',
                  color: 'var(--ink)',
                }}
              >
                +
              </div>
              <div className="text-[15px] font-semibold mb-1" style={{ color: 'var(--ink)' }}>
                Create New Resume
              </div>
              <p className="text-[13px] text-center" style={{ color: 'var(--muted)' }}>
                Start fresh with guided sections
              </p>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
