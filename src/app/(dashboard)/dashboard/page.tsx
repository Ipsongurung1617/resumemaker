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
  modern: 'Modern',
  classic: 'Classic',
  minimal: 'Minimal',
};

const TEMPLATE_COLORS: Record<ResumeTemplate, string> = {
  modern:  '#2F5D3A',
  classic: '#1A1A16',
  minimal: '#5C5C52',
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [resumes, setResumes] = useState<ResumeCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const isPro = session?.user?.plan === 'pro';
  const maxResumes = isPro ? 10 : 1;
  const canCreate = resumes.length < maxResumes;

  useEffect(() => {
    setMounted(true);
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
    if (!confirm('Delete this resume? This cannot be undone.')) return;
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
      month: 'short', day: 'numeric', year: 'numeric',
    });
  }

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        {/* Header skeleton */}
        <div className="flex items-center justify-between pb-6 border-b" style={{ borderColor: 'var(--line)' }}>
          <div className="space-y-2">
            <div className="skeleton h-3 w-28 rounded" />
            <div className="skeleton h-7 w-36 rounded" />
            <div className="skeleton h-3 w-24 rounded" />
          </div>
          <div className="skeleton h-10 w-32 rounded-[8px]" />
        </div>
        {/* Card skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {[1, 2, 3].map(i => (
            <div key={i} className="card animate-fade-in-up">
              <div className="skeleton h-44 w-full rounded-[8px] mb-4" />
              <div className="skeleton h-4 w-3/4 rounded mb-2" />
              <div className="skeleton h-3 w-1/2 rounded mb-5" />
              <div className="skeleton h-9 w-full rounded-[8px]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>

      {/* ── Header Row ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b" style={{ borderColor: 'var(--line)' }}>
        <div className="animate-slide-in-left">
          <div className="text-[12px] font-semibold uppercase tracking-[0.08em] mb-1.5 flex items-center gap-2" style={{ color: 'var(--accent)' }}>
            <span className="pulse-dot" />
            Workspace
          </div>
          <h1 className="text-[28px] font-semibold tracking-[-0.01em]" style={{ color: 'var(--ink)' }}>
            My Resumes
          </h1>
          <p className="text-[14px] mt-1" style={{ color: 'var(--muted)' }}>
            {resumes.length} / {isPro ? '10 Pro' : '1 Free'} used
          </p>
        </div>

        <div className="flex items-center gap-4 animate-fade-in">
          {/* Cloud sync */}
          <div className="flex items-center gap-1.5 text-[13px]" style={{ color: 'var(--accent)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Synced</span>
          </div>

          {canCreate && (
            <Link href="/resume/new" className="btn-primary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              New Resume
            </Link>
          )}
        </div>
      </div>

      {/* ── Upgrade Banner for Free Users ── */}
      {!isPro && (
        <div
          className="p-5 rounded-[12px] flex items-center justify-between flex-wrap gap-4 animate-fade-in-up"
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--line)',
            boxShadow: '0 1px 3px rgba(26, 26, 22, 0.08)',
          }}
        >
          <div className="flex items-start gap-3">
            {/* Accent icon */}
            <div className="w-9 h-9 rounded-[8px] flex items-center justify-center shrink-0 mt-0.5"
              style={{ backgroundColor: 'rgba(47,93,58,0.1)' }}>
              <svg className="w-5 h-5" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-[15px]" style={{ color: 'var(--ink)' }}>
                Upgrade to Pro — <span style={{ color: 'var(--accent)' }}>\$9/mo</span>
              </div>
              <p className="text-[13px] mt-0.5" style={{ color: 'var(--muted)' }}>
                Get 10 resumes, remove watermark, all templates, and AI-powered bullet rewriting.
              </p>
            </div>
          </div>
          <Link href="/pricing" className="btn-primary text-[13px]" style={{ padding: '9px 18px' }}>
            Upgrade Now →
          </Link>
        </div>
      )}

      {/* ── Free limit hit banner ── */}
      {!isPro && !canCreate && (
        <div
          className="p-4 rounded-[8px] flex items-center gap-3 animate-scale-in"
          style={{ backgroundColor: 'rgba(47,93,58,0.08)', border: '1px solid rgba(47,93,58,0.2)' }}
        >
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <p className="text-[13px] font-medium" style={{ color: 'var(--ink)' }}>
            You've used your 1 free resume.{' '}
            <Link href="/pricing" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
              Upgrade to Pro
            </Link>{' '}
            to create up to 10 resumes and remove the watermark.
          </p>
        </div>
      )}

      {/* ── Resume Grid ── */}
      {resumes.length === 0 ? (
        <div
          className="p-16 text-center rounded-[12px] animate-scale-in"
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px dashed var(--line)',
          }}
        >
          <div className="w-16 h-16 rounded-[12px] mx-auto mb-5 flex items-center justify-center"
            style={{ backgroundColor: 'var(--faint)' }}>
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="11" x2="12" y2="17" />
              <line x1="9" y1="14" x2="15" y2="14" />
            </svg>
          </div>
          <h2 className="text-[22px] font-semibold mb-2" style={{ color: 'var(--ink)' }}>
            No resumes yet
          </h2>
          <p className="text-[14px] max-w-sm mx-auto mb-7" style={{ color: 'var(--muted)' }}>
            Create your first ATS-optimized resume and land more interviews.
          </p>
          <Link href="/resume/new" className="btn-primary">
            Create My First Resume
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {resumes.map((resume, idx) => {
            const personal = resume.data?.personalInfo;
            const experience = resume.data?.workExperience?.[0];
            const candidateName = personal?.name?.trim() || 'Candidate Name';
            const candidateRole = experience?.title || 'Professional Resume';
            const templateColor = TEMPLATE_COLORS[resume.template] || 'var(--ink)';

            return (
              <div
                key={resume.id}
                className="card flex flex-col justify-between group animate-fade-in-up"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                {/* ── Mini Preview Thumbnail ── */}
                <div>
                  <div
                    className="h-44 rounded-[8px] mb-4 overflow-hidden relative select-none border"
                    style={{
                      backgroundColor: 'var(--paper)',
                      borderColor: 'var(--line)',
                    }}
                  >
                    {/* Colored top bar (template accent) */}
                    <div className="h-1 w-full" style={{ backgroundColor: templateColor }} />

                    <div className="p-3.5 font-serif text-[8px] leading-tight" style={{ color: 'var(--ink)' }}>
                      {/* Header */}
                      <div className="border-b pb-1.5 mb-2 text-center" style={{ borderColor: 'var(--line)' }}>
                        <div className="font-bold text-[9px] uppercase tracking-wider truncate" style={{ color: 'var(--ink)' }}>
                          {candidateName}
                        </div>
                        <div className="text-[7px] truncate" style={{ color: 'var(--muted)' }}>
                          {personal?.email || 'contact@domain.com'} · {personal?.location || 'Location'}
                        </div>
                      </div>

                      {/* Summary */}
                      {personal?.summary && (
                        <div className="mb-2">
                          <div className="font-bold uppercase tracking-wider text-[6.5px] mb-0.5 font-sans" style={{ color: 'var(--ink)' }}>Summary</div>
                          <p className="line-clamp-2 text-[6.5px]" style={{ color: 'var(--muted)' }}>{personal.summary}</p>
                        </div>
                      )}

                      {/* Experience */}
                      <div>
                        <div className="font-bold uppercase tracking-wider text-[6.5px] mb-0.5 font-sans" style={{ color: 'var(--ink)' }}>Experience</div>
                        <div className="font-semibold text-[7px] truncate">{candidateRole}</div>
                        <div className="text-[6.5px] italic truncate" style={{ color: 'var(--muted)' }}>
                          {experience?.company || 'Company'}
                        </div>
                      </div>
                    </div>

                    {/* Free watermark on thumbnail */}
                    {!isPro && (
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ pointerEvents: 'none' }}
                      >
                        <div
                          style={{
                            transform: 'rotate(-35deg)',
                            fontSize: '9px',
                            fontWeight: 800,
                            letterSpacing: '0.15em',
                            color: 'rgba(47, 93, 58, 0.18)',
                            userSelect: 'none',
                          }}
                        >
                          FREE PLAN
                        </div>
                      </div>
                    )}

                    {/* Template badge */}
                    <div
                      className="absolute bottom-2 right-2 text-[7.5px] font-semibold px-1.5 py-0.5 rounded-[4px]"
                      style={{ backgroundColor: templateColor, color: '#FDFCF9' }}
                    >
                      {TEMPLATE_LABELS[resume.template]}
                    </div>
                  </div>

                  {/* Title & Date */}
                  <h3 className="text-[16px] font-semibold truncate mb-1" style={{ color: 'var(--ink)' }} title={resume.title}>
                    {resume.title}
                  </h3>
                  <p className="text-[12px] mb-5" style={{ color: 'var(--muted)' }}>
                    Updated {formatDate(resume.updatedAt)}
                  </p>
                </div>

                {/* ── Actions ── */}
                <div className="flex items-center gap-2 pt-3 border-t" style={{ borderColor: 'var(--line)' }}>
                  <Link
                    href={`/resume/${resume.id}/edit`}
                    className="btn-primary flex-1 text-[13px]"
                    style={{ padding: '8px 12px' }}
                  >
                    ✏ Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => router.push(`/resume/${resume.id}/edit?download=1`)}
                    className="btn-secondary text-[13px]"
                    style={{ padding: '8px 14px' }}
                    title={isPro ? 'Export PDF' : 'Upgrade to export'}
                  >
                    {isPro ? '↓ PDF' : '🔒 PDF'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(resume.id)}
                    disabled={deletingId === resume.id}
                    className="btn-secondary text-[13px]"
                    style={{ padding: '8px 10px', color: deletingId === resume.id ? 'var(--muted)' : undefined }}
                    title="Delete resume"
                  >
                    {deletingId === resume.id ? '…' : '✕'}
                  </button>
                </div>
              </div>
            );
          })}

          {/* Add New card (if limit not reached) */}
          {canCreate && (
            <Link
              href="/resume/new"
              className="card flex flex-col items-center justify-center p-8 cursor-pointer animate-fade-in-up group"
              style={{ borderStyle: 'dashed', minHeight: '280px', animationDelay: `${resumes.length * 60}ms` }}
            >
              <div
                className="w-12 h-12 rounded-[12px] flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                style={{ backgroundColor: 'rgba(47,93,58,0.1)' }}
              >
                <svg className="w-6 h-6" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="text-[15px] font-semibold mb-1" style={{ color: 'var(--ink)' }}>New Resume</div>
              <p className="text-[13px] text-center" style={{ color: 'var(--muted)' }}>
                Start with a guided template
              </p>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
