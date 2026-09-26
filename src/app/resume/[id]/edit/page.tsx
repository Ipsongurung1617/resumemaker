'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Download,
  Cloud,
  Check,
  Loader2,
  ChevronDown,
  ChevronUp,
  Trash2,
  Plus,
  GripVertical,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  Sparkles,
  Eye,
  ZoomIn,
  ZoomOut,
  Target,
  FileText,
} from 'lucide-react';

import ResumePreview from '@/components/resume/ResumePreview';
import Modal from '@/components/ui/Modal';
import PaymentModal from '@/components/ui/PaymentModal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { generatePDF } from '@/lib/pdf';
import { emptyResumeData, generateId, debounce } from '@/lib/utils';
import {
  ResumeData,
  ResumeTemplate,
  WorkExperience,
  Education,
  SkillGroup,
  Certification,
  Project,
} from '@/types/resume';

type AccordionSection = 'personal' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications';

export default function ResumeEditorPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const [title, setTitle] = useState('');
  const [template, setTemplate] = useState<ResumeTemplate>('modern');
  const [data, setData] = useState<ResumeData>(emptyResumeData());

  // Accordion open/collapse states
  const [openSections, setOpenSections] = useState<Record<AccordionSection, boolean>>({
    personal: true,
    experience: true,
    education: true,
    skills: false,
    projects: false,
    certifications: false,
  });

  // Active hover/focus section highlight on preview
  const [activeHighlightSection, setActiveHighlightSection] = useState<string>('header');

  // Preview zoom scale & mobile drawer
  const [previewScale, setPreviewScale] = useState<number>(0.62);
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');

  // Modals
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentReason, setPaymentReason] = useState('');
  const [descriptionModal, setDescriptionModal] = useState(false);
  const [descInput, setDescInput] = useState('');
  const [descTargetRole, setDescTargetRole] = useState('');
  const [tailorModal, setTailorModal] = useState(false);
  const [jdText, setJdText] = useState('');
  const [tailorSuggestions, setTailorSuggestions] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [rewritingBullet, setRewritingBullet] = useState<string | null>(null);

  const isPro = session?.user?.plan === 'pro';

  // Toggle accordion section
  function toggleSection(section: AccordionSection) {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  }

  // Load resume data
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/resume/${id}`);
        const json = await res.json();
        if (json.success && json.data) {
          setTitle(json.data.title || 'Untitled Resume');
          setTemplate(json.data.template || 'modern');
          setData(json.data.data || emptyResumeData());
          setLastSaved(new Date());
        } else {
          toast.error('Resume not found');
          router.push('/dashboard');
        }
      } catch {
        toast.error('Failed to load resume');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  // Handle immediate download if requested via query param
  useEffect(() => {
    if (!loading && searchParams?.get('download') === '1') {
      handleDownloadPDF();
    }
  }, [loading, searchParams]);

  // Debounced Auto-save
  const autoSave = useCallback(
    debounce(async (resumeData: ResumeData, resumeTemplate: ResumeTemplate, resumeTitle: string) => {
      setSaving(true);
      try {
        await fetch(`/api/resume/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: resumeData, template: resumeTemplate, title: resumeTitle }),
        });
        setLastSaved(new Date());
      } catch {
        // silent error handled by indicator
      } finally {
        setSaving(false);
      }
    }, 600),
    [id]
  );

  function updateData(updater: (prev: ResumeData) => ResumeData) {
    setData(prev => {
      const next = updater(prev);
      autoSave(next, template, title);
      return next;
    });
  }

  function updateTemplate(t: ResumeTemplate) {
    if (t === 'minimal' && !isPro) {
      setPaymentReason('The Tech Mono template is reserved for Pro members.');
      setPaymentModalOpen(true);
      return;
    }
    setTemplate(t);
    autoSave(data, t, title);
  }

  function updateTitle(newTitle: string) {
    setTitle(newTitle);
    autoSave(data, template, newTitle);
  }

  // Export PDF Handler
  async function handleDownloadPDF() {
    if (!isPro) {
      setPaymentReason('Official watermark-free PDF exports require an active Pro subscription.');
      setPaymentModalOpen(true);
      return;
    }

    const toastId = toast.loading('Typesetting and exporting official PDF…');
    try {
      const safeFilename = `${title.trim().replace(/[^a-zA-Z0-9_-]/g, '_') || 'Resume'}.pdf`;
      await generatePDF('resume-preview', safeFilename);
      toast.success('Resume PDF exported successfully!', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF. Please try again.', { id: toastId });
    }
  }

  // AI: Rewrite Bullet
  async function rewriteBullet(expId: string, bulletIndex: number, bulletText: string) {
    if (!isPro) {
      setPaymentReason('AI Bullet Rewriting requires an active Pro subscription.');
      setPaymentModalOpen(true);
      return;
    }
    const key = `${expId}-${bulletIndex}`;
    setRewritingBullet(key);
    try {
      const exp = data.workExperience.find(e => e.id === expId);
      const res = await fetch('/api/ai/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bullet: bulletText, jobTitle: exp?.title || '' }),
      });
      const json = await res.json();
      if (json.success && json.data?.rewritten) {
        updateData(prev => ({
          ...prev,
          workExperience: prev.workExperience.map(e =>
            e.id === expId
              ? { ...e, bullets: e.bullets.map((b, i) => (i === bulletIndex ? json.data.rewritten : b)) }
              : e
          ),
        }));
        toast.success('Bullet point enhanced!');
      } else {
        toast.error(json.message || 'AI rewrite service unavailable');
      }
    } catch {
      toast.error('AI service error');
    } finally {
      setRewritingBullet(null);
    }
  }

  // AI: Tailor to Job Description
  async function handleTailor() {
    if (!isPro) {
      setPaymentReason('Job Description keyword matching requires a Pro subscription.');
      setPaymentModalOpen(true);
      return;
    }
    if (!jdText.trim()) {
      toast.error('Paste a target job description first');
      return;
    }
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData: data, jobDescription: jdText }),
      });
      const json = await res.json();
      if (json.success && json.data?.suggestions) {
        setTailorSuggestions(json.data.suggestions);
      } else {
        toast.error(json.message || 'Tailoring failed');
      }
    } catch {
      toast.error('AI service error');
    } finally {
      setAiLoading(false);
    }
  }

  // AI: Full Description Parser
  async function handleDescribeImport() {
    if (!descInput.trim() || descInput.trim().length < 15) {
      toast.error('Please enter your career notes or background summary.');
      return;
    }
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/describe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: descInput.trim(),
          targetRole: descTargetRole.trim() || title,
        }),
      });
      const json = await res.json();
      if (json.success && json.data?.resumeData) {
        updateData(prev => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            summary: json.data.resumeData.personalInfo?.summary || prev.personalInfo.summary,
            location: json.data.resumeData.personalInfo?.location || prev.personalInfo.location,
          },
          workExperience: [
            ...(prev.workExperience || []),
            ...(json.data.resumeData.workExperience || []),
          ],
          education: [
            ...(prev.education || []),
            ...(json.data.resumeData.education || []),
          ],
          skills: json.data.resumeData.skills?.length ? json.data.resumeData.skills : prev.skills,
        }));
        toast.success('Career background structured into sections!');
        setDescriptionModal(false);
        setDescInput('');
      } else {
        toast.error(json.message || 'Failed to parse notes.');
      }
    } catch {
      toast.error('Service error while parsing background.');
    } finally {
      setAiLoading(false);
    }
  }

  // Reordering helpers
  function moveExperience(index: number, direction: 'up' | 'down') {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= data.workExperience.length) return;
    updateData(prev => {
      const items = [...prev.workExperience];
      const temp = items[index];
      items[index] = items[targetIndex];
      items[targetIndex] = temp;
      return { ...prev, workExperience: items };
    });
  }

  function moveEducation(index: number, direction: 'up' | 'down') {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= data.education.length) return;
    updateData(prev => {
      const items = [...prev.education];
      const temp = items[index];
      items[index] = items[targetIndex];
      items[targetIndex] = temp;
      return { ...prev, education: items };
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[75vh]">
        <div className="text-center">
          <LoadingSpinner size={36} color="black" />
          <p className="text-sm text-zinc-500 mt-4 font-medium">Opening your resume workspace…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 font-sans" style={{ backgroundColor: 'var(--paper)', color: 'var(--ink)' }}>
      {/* ─── 1. Minimal Top Navigation Bar ────────────────────────────── */}
      <header className="sticky top-0 z-30 transition-all" style={{ backgroundColor: 'var(--paper)', borderBottom: '1px solid var(--line)' }}>
        {/* Full-width thin progress bar */}
        <div className="w-full h-1" style={{ backgroundColor: 'rgba(26, 26, 22, 0.08)' }}>
          <div style={{ width: '85%', backgroundColor: 'var(--accent)' }} className="h-full transition-all duration-300" />
        </div>

        <div className="max-w-[1600px] mx-auto px-6 py-3.5 flex items-center justify-between gap-4 flex-wrap">
          {/* Left: Branding & Back & Document Title */}
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors py-1 px-2 rounded-[8px] hover:underline"
              style={{ color: 'var(--muted)' }}
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>

            <div className="h-4 w-px hidden sm:block" style={{ backgroundColor: 'var(--line)' }} />

            {/* Editable Title */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={title}
                onChange={e => updateTitle(e.target.value)}
                className="font-bold text-base px-2.5 py-1 rounded-[8px] border transition-all w-52 sm:w-72"
                style={{
                  color: 'var(--ink)',
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--line)',
                }}
                placeholder="Resume Document Title"
              />
            </div>
          </div>

          {/* Center: Real-time Cloud Save Status Indicator */}
          <div className="hidden md:flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--accent)' }}>
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Saved</span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Mobile View Toggle */}
            <div className="flex lg:hidden p-0.5 rounded-[8px] border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--line)' }}>
              <button
                type="button"
                onClick={() => setMobileTab('editor')}
                className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold transition-all ${
                  mobileTab === 'editor' ? 'bg-[#1A1A16] text-[#FDFCF9]' : 'text-zinc-500'
                }`}
              >
                Editor
              </button>
              <button
                type="button"
                onClick={() => setMobileTab('preview')}
                className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold transition-all ${
                  mobileTab === 'preview' ? 'bg-[#1A1A16] text-[#FDFCF9]' : 'text-zinc-500'
                }`}
              >
                Preview
              </button>
            </div>

            {/* AI Notes Drawer (Styled with --accent outline + --faint fill) */}
            <button
              type="button"
              onClick={() => setDescriptionModal(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-[8px] transition-all"
              style={{
                border: '1px solid var(--accent)',
                backgroundColor: 'rgba(47, 93, 58, 0.08)',
                color: 'var(--accent)',
              }}
              title="Paste your unstructured notes or full career story"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AI Career Notes</span>
            </button>

            {/* Primary Export Button */}
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="btn-primary inline-flex items-center gap-2 text-sm !px-5 !py-2 font-semibold"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── 2. Asymmetrical Two-Column Layout ────────────────────────── */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ══════════ LEFT COLUMN: Accordion Editor Panel ══════════ */}
          <div className={`${mobileTab === 'preview' ? 'hidden' : 'block'} lg:block lg:col-span-7 space-y-4`}>
            
            {/* Editorial Lead Note */}
            <div
              className="p-5 mb-5 rounded-[12px] flex items-start justify-between gap-4"
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--line)',
                boxShadow: '0 1px 3px rgba(26, 26, 22, 0.08)',
              }}
            >
              <div>
                <h2 className="text-[16px] font-semibold tracking-tight" style={{ color: 'var(--ink)' }}>
                  Structured Document Editor
                </h2>
                <p className="text-[13px] mt-0.5 leading-relaxed" style={{ color: 'var(--muted)' }}>
                  Refine your credentials below. Updates typeset automatically in the live right panel.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTailorModal(true)}
                className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-[8px] transition-colors"
                style={{
                  border: '1px solid var(--line)',
                  backgroundColor: 'var(--paper)',
                  color: 'var(--ink)',
                }}
              >
                <Target className="w-3.5 h-3.5" />
                <span>Job Match {!isPro && '• Pro'}</span>
              </button>
            </div>

            {/* Section 1: Personal Info */}
            <AccordionSection
              id="personal"
              title="Personal Information"
              subtitle="Contact header and executive summary"
              icon={<User className="w-4 h-4 text-zinc-700" />}
              isOpen={openSections.personal}
              onToggle={() => toggleSection('personal')}
              onFocus={() => setActiveHighlightSection('header')}
            >
              <div className="space-y-4 pt-2">
                <Field
                  label="Full Name"
                  value={data.personalInfo.name}
                  onChange={v => updateData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, name: v } }))}
                  placeholder="e.g. Jane Vance"
                  helper="Legal or preferred executive name"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="Email Address"
                    type="email"
                    value={data.personalInfo.email}
                    onChange={v => updateData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, email: v } }))}
                    placeholder="jane.vance@example.com"
                  />
                  <Field
                    label="Phone Number"
                    value={data.personalInfo.phone}
                    onChange={v => updateData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, phone: v } }))}
                    placeholder="+1 (555) 234-5678"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="Location"
                    value={data.personalInfo.location}
                    onChange={v => updateData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, location: v } }))}
                    placeholder="San Francisco, CA (or Remote)"
                  />
                  <Field
                    label="Website / Portfolio URL"
                    value={data.personalInfo.website || ''}
                    onChange={v => updateData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, website: v } }))}
                    placeholder="https://janevance.design"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="LinkedIn Handle"
                    value={data.personalInfo.linkedin || ''}
                    onChange={v => updateData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, linkedin: v } }))}
                    placeholder="linkedin.com/in/janevance"
                  />
                  <Field
                    label="GitHub / Code Repository"
                    value={data.personalInfo.github || ''}
                    onChange={v => updateData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, github: v } }))}
                    placeholder="github.com/janevance"
                  />
                </div>

                {/* Professional Summary */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-semibold text-zinc-800">
                      Executive Summary
                    </label>
                    <span className="text-xs text-zinc-400">Recommended: 40–80 words</span>
                  </div>
                  <textarea
                    rows={4}
                    value={data.personalInfo.summary || ''}
                    onChange={e => updateData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, summary: e.target.value } }))}
                    onFocus={() => setActiveHighlightSection('summary')}
                    className="input-field text-sm leading-relaxed resize-y"
                    placeholder="Brief 2–4 sentence overview summarizing your professional pedigree, core strengths, and strategic vision..."
                  />
                </div>
              </div>
            </AccordionSection>

            {/* Section 2: Work Experience */}
            <AccordionSection
              id="experience"
              title="Work Experience"
              subtitle={`${data.workExperience.length} position${data.workExperience.length === 1 ? '' : 's'} recorded`}
              icon={<Briefcase className="w-4 h-4 text-zinc-700" />}
              isOpen={openSections.experience}
              onToggle={() => toggleSection('experience')}
              onFocus={() => setActiveHighlightSection('experience')}
            >
              <div className="space-y-6 pt-2">
                {data.workExperience.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50/50">
                    <p className="text-sm font-semibold text-zinc-700">No employment entries yet</p>
                    <p className="text-xs text-zinc-500 mt-1 mb-4">Add your leadership positions, past employers, or consulting engagements.</p>
                    <button
                      type="button"
                      onClick={() => {
                        const newExp: WorkExperience = {
                          id: generateId(),
                          title: '',
                          company: '',
                          location: '',
                          startDate: '',
                          endDate: '',
                          current: false,
                          bullets: [''],
                        };
                        updateData(prev => ({ ...prev, workExperience: [...prev.workExperience, newExp] }));
                      }}
                      className="btn-primary text-xs !py-2 !px-4"
                    >
                      + Add First Position
                    </button>
                  </div>
                )}

                {data.workExperience.map((exp, idx) => (
                  <div
                    key={exp.id}
                    className="p-5 bg-white border border-zinc-200 rounded-xl shadow-xs space-y-4 hover:border-zinc-300 transition-colors"
                  >
                    {/* Item Toolbar: Move & Delete */}
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-zinc-400" />
                        <span className="font-bold text-sm text-zinc-900">
                          {exp.title || `Position #${idx + 1}`} {exp.company && `at ${exp.company}`}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveExperience(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 text-zinc-400 hover:text-zinc-800 disabled:opacity-20 transition-colors rounded"
                          title="Move up"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveExperience(idx, 'down')}
                          disabled={idx === data.workExperience.length - 1}
                          className="p-1 text-zinc-400 hover:text-zinc-800 disabled:opacity-20 transition-colors rounded"
                          title="Move down"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            updateData(prev => ({
                              ...prev,
                              workExperience: prev.workExperience.filter(e => e.id !== exp.id),
                            }));
                          }}
                          className="p-1 text-zinc-400 hover:text-red-600 transition-colors rounded ml-1"
                          title="Delete position"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field
                        label="Position Title"
                        value={exp.title}
                        onChange={v => {
                          updateData(prev => ({
                            ...prev,
                            workExperience: prev.workExperience.map(e => e.id === exp.id ? { ...e, title: v } : e),
                          }));
                        }}
                        placeholder="e.g. Lead Product Engineer"
                      />
                      <Field
                        label="Company or Organization"
                        value={exp.company}
                        onChange={v => {
                          updateData(prev => ({
                            ...prev,
                            workExperience: prev.workExperience.map(e => e.id === exp.id ? { ...e, company: v } : e),
                          }));
                        }}
                        placeholder="e.g. Stripe, Inc."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Field
                        label="Location"
                        value={exp.location}
                        onChange={v => {
                          updateData(prev => ({
                            ...prev,
                            workExperience: prev.workExperience.map(e => e.id === exp.id ? { ...e, location: v } : e),
                          }));
                        }}
                        placeholder="e.g. New York, NY"
                      />
                      <Field
                        label="Start Date"
                        value={exp.startDate}
                        onChange={v => {
                          updateData(prev => ({
                            ...prev,
                            workExperience: prev.workExperience.map(e => e.id === exp.id ? { ...e, startDate: v } : e),
                          }));
                        }}
                        placeholder="e.g. Mar 2021"
                      />
                      <div>
                        <Field
                          label="End Date"
                          value={exp.current ? 'Present' : exp.endDate}
                          onChange={v => {
                            updateData(prev => ({
                              ...prev,
                              workExperience: prev.workExperience.map(e => e.id === exp.id ? { ...e, endDate: v } : e),
                            }));
                          }}
                          placeholder="e.g. Jan 2024"
                          disabled={exp.current}
                        />
                        <label className="flex items-center gap-2 mt-2 text-xs text-zinc-600 font-medium cursor-pointer">
                          <input
                            type="checkbox"
                            checked={exp.current}
                            onChange={e => {
                              updateData(prev => ({
                                ...prev,
                                workExperience: prev.workExperience.map(it => it.id === exp.id ? { ...it, current: e.target.checked } : it),
                              }));
                            }}
                            className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                          />
                          Currently in this role
                        </label>
                      </div>
                    </div>

                    {/* Accomplishment Bullets */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                          Key Responsibilities &amp; Impact
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            updateData(prev => ({
                              ...prev,
                              workExperience: prev.workExperience.map(e => e.id === exp.id ? { ...e, bullets: [...e.bullets, ''] } : e),
                            }));
                          }}
                          className="text-xs font-semibold text-zinc-800 hover:text-zinc-950 inline-flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Bullet
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {exp.bullets.map((bullet, bIdx) => {
                          const isRewriting = rewritingBullet === `${exp.id}-${bIdx}`;
                          return (
                            <div key={bIdx} className="flex gap-2 items-start">
                              <span className="text-zinc-400 text-sm mt-3">•</span>
                              <div className="flex-1 relative">
                                <textarea
                                  rows={2}
                                  value={bullet}
                                  onChange={e => {
                                    const val = e.target.value;
                                    updateData(prev => ({
                                      ...prev,
                                      workExperience: prev.workExperience.map(it =>
                                        it.id === exp.id
                                          ? { ...it, bullets: it.bullets.map((b, i) => (i === bIdx ? val : b)) }
                                          : it
                                      ),
                                    }));
                                  }}
                                  className="input-field text-sm leading-relaxed resize-y pr-28"
                                  placeholder="Action verb + quantitative achievement (e.g. Scaled platform to 10M daily queries while reducing p99 latency by 35%)..."
                                />
                                <button
                                  type="button"
                                  onClick={() => rewriteBullet(exp.id, bIdx, bullet)}
                                  disabled={isRewriting || !bullet.trim()}
                                  className="absolute right-2.5 bottom-2.5 text-xs bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-40 px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors shadow-2xs font-medium"
                                  title="Enhance with executive ATS action verbs"
                                >
                                  {isRewriting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                  <span>Rewrite</span>
                                </button>
                              </div>
                              {exp.bullets.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateData(prev => ({
                                      ...prev,
                                      workExperience: prev.workExperience.map(it =>
                                        it.id === exp.id
                                          ? { ...it, bullets: it.bullets.filter((_, i) => i !== bIdx) }
                                          : it
                                      ),
                                    }));
                                  }}
                                  className="p-1 text-zinc-400 hover:text-red-500 transition-colors mt-2"
                                  title="Delete bullet"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    const newExp: WorkExperience = {
                      id: generateId(),
                      title: '',
                      company: '',
                      location: '',
                      startDate: '',
                      endDate: '',
                      current: false,
                      bullets: [''],
                    };
                    updateData(prev => ({ ...prev, workExperience: [...prev.workExperience, newExp] }));
                  }}
                  className="w-full py-3 border border-dashed border-zinc-300 hover:border-zinc-700 bg-white hover:bg-zinc-50 rounded-xl text-sm font-semibold text-zinc-700 hover:text-zinc-900 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Another Position</span>
                </button>
              </div>
            </AccordionSection>

            {/* Section 3: Education */}
            <AccordionSection
              id="education"
              title="Education & Credentials"
              subtitle={`${data.education.length} degree${data.education.length === 1 ? '' : 's'} recorded`}
              icon={<GraduationCap className="w-4 h-4 text-zinc-700" />}
              isOpen={openSections.education}
              onToggle={() => toggleSection('education')}
              onFocus={() => setActiveHighlightSection('education')}
            >
              <div className="space-y-6 pt-2">
                {data.education.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50/50">
                    <p className="text-sm font-semibold text-zinc-700">No education entries yet</p>
                    <p className="text-xs text-zinc-500 mt-1 mb-4">Add your university degrees, master's programs, or formal certifications.</p>
                    <button
                      type="button"
                      onClick={() => {
                        const newEdu: Education = {
                          id: generateId(),
                          degree: '',
                          school: '',
                          location: '',
                          graduationDate: '',
                          gpa: '',
                        };
                        updateData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
                      }}
                      className="btn-primary text-xs !py-2 !px-4"
                    >
                      + Add Degree
                    </button>
                  </div>
                )}

                {data.education.map((edu, idx) => (
                  <div
                    key={edu.id}
                    className="p-5 bg-white border border-zinc-200 rounded-xl shadow-xs space-y-4 hover:border-zinc-300 transition-colors"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-zinc-400" />
                        <span className="font-bold text-sm text-zinc-900">
                          {edu.degree || `Degree #${idx + 1}`} {edu.school && `at ${edu.school}`}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveEducation(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 text-zinc-400 hover:text-zinc-800 disabled:opacity-20 transition-colors rounded"
                          title="Move up"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveEducation(idx, 'down')}
                          disabled={idx === data.education.length - 1}
                          className="p-1 text-zinc-400 hover:text-zinc-800 disabled:opacity-20 transition-colors rounded"
                          title="Move down"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            updateData(prev => ({
                              ...prev,
                              education: prev.education.filter(e => e.id !== edu.id),
                            }));
                          }}
                          className="p-1 text-zinc-400 hover:text-red-600 transition-colors rounded ml-1"
                          title="Delete degree"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field
                        label="Degree / Major"
                        value={edu.degree}
                        onChange={v => {
                          updateData(prev => ({
                            ...prev,
                            education: prev.education.map(e => e.id === edu.id ? { ...e, degree: v } : e),
                          }));
                        }}
                        placeholder="e.g. B.S. in Computer Science"
                      />
                      <Field
                        label="Institution or University"
                        value={edu.school}
                        onChange={v => {
                          updateData(prev => ({
                            ...prev,
                            education: prev.education.map(e => e.id === edu.id ? { ...e, school: v } : e),
                          }));
                        }}
                        placeholder="e.g. Stanford University"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Field
                        label="Location"
                        value={edu.location}
                        onChange={v => {
                          updateData(prev => ({
                            ...prev,
                            education: prev.education.map(e => e.id === edu.id ? { ...e, location: v } : e),
                          }));
                        }}
                        placeholder="e.g. Stanford, CA"
                      />
                      <Field
                        label="Graduation Year / Date"
                        value={edu.graduationDate}
                        onChange={v => {
                          updateData(prev => ({
                            ...prev,
                            education: prev.education.map(e => e.id === edu.id ? { ...e, graduationDate: v } : e),
                          }));
                        }}
                        placeholder="e.g. 2022"
                      />
                      <Field
                        label="GPA (Optional)"
                        value={edu.gpa || ''}
                        onChange={v => {
                          updateData(prev => ({
                            ...prev,
                            education: prev.education.map(e => e.id === edu.id ? { ...e, gpa: v } : e),
                          }));
                        }}
                        placeholder="e.g. 3.9 / 4.0"
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    const newEdu: Education = {
                      id: generateId(),
                      degree: '',
                      school: '',
                      location: '',
                      graduationDate: '',
                      gpa: '',
                    };
                    updateData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
                  }}
                  className="w-full py-3 border border-dashed border-zinc-300 hover:border-zinc-700 bg-white hover:bg-zinc-50 rounded-xl text-sm font-semibold text-zinc-700 hover:text-zinc-900 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Degree or Qualification</span>
                </button>
              </div>
            </AccordionSection>

            {/* Section 4: Skills & Competencies */}
            <AccordionSection
              id="skills"
              title="Skills & Core Competencies"
              subtitle={`${data.skills.reduce((acc, s) => acc + s.items.length, 0)} skills grouped`}
              icon={<Wrench className="w-4 h-4 text-zinc-700" />}
              isOpen={openSections.skills}
              onToggle={() => toggleSection('skills')}
              onFocus={() => setActiveHighlightSection('skills')}
            >
              <div className="space-y-5 pt-2">
                {data.skills.map((group, idx) => (
                  <div key={idx} className="p-5 bg-white border border-zinc-200 rounded-xl shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <Field
                        label="Category Label"
                        value={group.category}
                        onChange={v => {
                          updateData(prev => ({
                            ...prev,
                            skills: prev.skills.map((s, i) => (i === idx ? { ...s, category: v } : s)),
                          }));
                        }}
                        placeholder="e.g. Languages & Frameworks, Cloud Infrastructure"
                      />
                      {data.skills.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            updateData(prev => ({
                              ...prev,
                              skills: prev.skills.filter((_, i) => i !== idx),
                            }));
                          }}
                          className="p-1.5 text-zinc-400 hover:text-red-600 transition-colors mt-6 ml-3"
                          title="Remove group"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-zinc-800 block mb-1.5">
                        Competencies (separated by commas)
                      </label>
                      <input
                        type="text"
                        value={group.items.join(', ')}
                        onChange={e => {
                          const items = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                          updateData(prev => ({
                            ...prev,
                            skills: prev.skills.map((s, i) => (i === idx ? { ...s, items } : s)),
                          }));
                        }}
                        className="input-field text-sm"
                        placeholder="TypeScript, Next.js, Distributed Systems, SQL, Docker"
                      />
                      {group.items.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2.5">
                          {group.items.map((item, i) => (
                            <span key={i} className="bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs font-semibold px-2.5 py-1 rounded-md">
                              {item}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    updateData(prev => ({
                      ...prev,
                      skills: [...prev.skills, { category: 'Specialized Skills', items: [] }],
                    }));
                  }}
                  className="w-full py-3 border border-dashed border-zinc-300 hover:border-zinc-700 bg-white hover:bg-zinc-50 rounded-xl text-sm font-semibold text-zinc-700 hover:text-zinc-900 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Skill Category</span>
                </button>
              </div>
            </AccordionSection>

            {/* Section 5: Projects */}
            <AccordionSection
              id="projects"
              title="Projects & Publications"
              subtitle={`${data.projects.length} project${data.projects.length === 1 ? '' : 's'} documented`}
              icon={<FolderGit2 className="w-4 h-4 text-zinc-700" />}
              isOpen={openSections.projects}
              onToggle={() => toggleSection('projects')}
              onFocus={() => setActiveHighlightSection('additional')}
            >
              <div className="space-y-5 pt-2">
                {data.projects.map((proj, idx) => (
                  <div key={proj.id} className="p-5 bg-white border border-zinc-200 rounded-xl shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                      <span className="font-bold text-sm text-zinc-900">
                        {proj.name || `Project #${idx + 1}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          updateData(prev => ({
                            ...prev,
                            projects: prev.projects.filter(p => p.id !== proj.id),
                          }));
                        }}
                        className="p-1 text-zinc-400 hover:text-red-600 transition-colors"
                        title="Remove project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field
                        label="Project Title"
                        value={proj.name}
                        onChange={v => {
                          updateData(prev => ({
                            ...prev,
                            projects: prev.projects.map(p => p.id === proj.id ? { ...p, name: v } : p),
                          }));
                        }}
                        placeholder="e.g. Distributed Consensus Engine"
                      />
                      <Field
                        label="Project URL"
                        value={proj.url || ''}
                        onChange={v => {
                          updateData(prev => ({
                            ...prev,
                            projects: prev.projects.map(p => p.id === proj.id ? { ...p, url: v } : p),
                          }));
                        }}
                        placeholder="https://github.com/username/project"
                      />
                    </div>

                    <Field
                      label="Technologies Used (comma-separated)"
                      value={proj.technologies.join(', ')}
                      onChange={v => {
                        const arr = v.split(',').map(s => s.trim()).filter(Boolean);
                        updateData(prev => ({
                          ...prev,
                          projects: prev.projects.map(p => p.id === proj.id ? { ...p, technologies: arr } : p),
                        }));
                      }}
                      placeholder="e.g. Rust, Raft, Docker, Redis"
                    />

                    <div>
                      <label className="text-sm font-semibold text-zinc-800 block mb-1.5">Project Scope &amp; Outcome</label>
                      <textarea
                        rows={2}
                        value={proj.description}
                        onChange={e => {
                          const val = e.target.value;
                          updateData(prev => ({
                            ...prev,
                            projects: prev.projects.map(p => p.id === proj.id ? { ...p, description: val } : p),
                          }));
                        }}
                        className="input-field text-sm resize-y"
                        placeholder="Brief explanation of technical challenges solved and measurable results..."
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    const newProj: Project = {
                      id: generateId(),
                      name: '',
                      description: '',
                      technologies: [],
                      url: '',
                    };
                    updateData(prev => ({ ...prev, projects: [...prev.projects, newProj] }));
                  }}
                  className="w-full py-3 border border-dashed border-zinc-300 hover:border-zinc-700 bg-white hover:bg-zinc-50 rounded-xl text-sm font-semibold text-zinc-700 hover:text-zinc-900 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </div>
            </AccordionSection>

            {/* Section 6: Certifications */}
            <AccordionSection
              id="certifications"
              title="Certifications & Awards"
              subtitle={`${data.certifications.length} credential${data.certifications.length === 1 ? '' : 's'}`}
              icon={<Award className="w-4 h-4 text-zinc-700" />}
              isOpen={openSections.certifications}
              onToggle={() => toggleSection('certifications')}
              onFocus={() => setActiveHighlightSection('additional')}
            >
              <div className="space-y-4 pt-2">
                {data.certifications.map((cert, idx) => (
                  <div key={cert.id} className="p-4 bg-white border border-zinc-200 rounded-xl shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-zinc-900">{cert.name || `Certification #${idx + 1}`}</span>
                      <button
                        type="button"
                        onClick={() => {
                          updateData(prev => ({
                            ...prev,
                            certifications: prev.certifications.filter(c => c.id !== cert.id),
                          }));
                        }}
                        className="p-1 text-zinc-400 hover:text-red-600 transition-colors"
                        title="Remove certification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <Field
                        label="Certification Title"
                        value={cert.name}
                        onChange={v => {
                          updateData(prev => ({
                            ...prev,
                            certifications: prev.certifications.map(c => c.id === cert.id ? { ...c, name: v } : c),
                          }));
                        }}
                        placeholder="e.g. AWS Solutions Architect"
                      />
                      <Field
                        label="Issuing Body"
                        value={cert.issuer}
                        onChange={v => {
                          updateData(prev => ({
                            ...prev,
                            certifications: prev.certifications.map(c => c.id === cert.id ? { ...c, issuer: v } : c),
                          }));
                        }}
                        placeholder="e.g. Amazon Web Services"
                      />
                      <Field
                        label="Year Received"
                        value={cert.date}
                        onChange={v => {
                          updateData(prev => ({
                            ...prev,
                            certifications: prev.certifications.map(c => c.id === cert.id ? { ...c, date: v } : c),
                          }));
                        }}
                        placeholder="e.g. 2024"
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    const newCert: Certification = {
                      id: generateId(),
                      name: '',
                      issuer: '',
                      date: '',
                    };
                    updateData(prev => ({ ...prev, certifications: [...prev.certifications, newCert] }));
                  }}
                  className="w-full py-3 border border-dashed border-zinc-300 hover:border-zinc-700 bg-white hover:bg-zinc-50 rounded-xl text-sm font-semibold text-zinc-700 hover:text-zinc-900 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Certification</span>
                </button>
              </div>
            </AccordionSection>

          </div>

          {/* ══════════ RIGHT COLUMN: Live Pinned Preview ══════════ */}
          <div className={`${mobileTab === 'editor' ? 'hidden' : 'block'} lg:block lg:col-span-5`}>
            <div
              className="sticky top-20 p-5 rounded-[12px] flex flex-col items-center"
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--line)',
                boxShadow: '0 1px 3px rgba(26, 26, 22, 0.08)',
              }}
            >
              {/* Persistent label above preview */}
              <div
                className="w-full text-left text-[13px] font-medium mb-3"
                style={{ color: 'var(--muted)' }}
              >
                Live preview — updates as you type
              </div>

              {/* Top Controls: Template Switcher + Zoom Controls */}
              <div className="w-full flex items-center justify-between pb-3 mb-3 border-b flex-wrap gap-3" style={{ borderColor: 'var(--line)' }}>
                {/* 3 Editorial Templates Switcher */}
                <div className="flex p-0.5 rounded-[8px] border" style={{ backgroundColor: 'var(--paper)', borderColor: 'var(--line)' }}>
                  {(
                    [
                      { id: 'modern', label: 'Modern Corporate' },
                      { id: 'classic', label: 'Minimalist Serif' },
                      { id: 'minimal', label: 'Tech Mono' },
                    ] as { id: ResumeTemplate; label: string }[]
                  ).map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => updateTemplate(t.id)}
                      className="px-2.5 py-1 rounded-[6px] text-xs font-semibold transition-all"
                      style={{
                        backgroundColor: template === t.id ? 'var(--surface)' : 'transparent',
                        color: template === t.id ? 'var(--accent)' : 'var(--muted)',
                        boxShadow: template === t.id ? '0 1px 2px rgba(26, 26, 22, 0.06)' : 'none',
                      }}
                    >
                      {t.label}
                      {t.id === 'minimal' && !isPro && ' 🔒'}
                    </button>
                  ))}
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center gap-1 border rounded-[8px] p-0.5" style={{ borderColor: 'var(--line)', backgroundColor: 'var(--paper)' }}>
                  <button
                    type="button"
                    onClick={() => setPreviewScale(prev => Math.max(0.45, Math.round((prev - 0.05) * 100) / 100))}
                    className="p-1 rounded text-xs transition-colors hover:opacity-80"
                    style={{ color: 'var(--ink)' }}
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-semibold px-1 font-mono" style={{ color: 'var(--muted)' }}>
                    {Math.round(previewScale * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setPreviewScale(prev => Math.min(0.9, Math.round((prev + 0.05) * 100) / 100))}
                    className="p-1 rounded text-xs transition-colors hover:opacity-80"
                    style={{ color: 'var(--ink)' }}
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Real-time Document Paper */}
              <div className="w-full flex justify-center py-2 overflow-hidden">
                <ResumePreview
                  data={data}
                  template={template}
                  scale={previewScale}
                  activeSection={activeHighlightSection}
                  id="resume-preview"
                  onDownloadClick={handleDownloadPDF}
                />
              </div>

              {/* Short caption underneath stating what's highlighted */}
              <div className="w-full text-center text-[12px] font-medium mt-3" style={{ color: 'var(--muted)' }}>
                Currently editing: {
                  activeHighlightSection === 'header' ? 'Personal Info' :
                  activeHighlightSection === 'summary' ? 'Summary' :
                  activeHighlightSection === 'experience' ? 'Experience' :
                  activeHighlightSection === 'education' ? 'Education' :
                  activeHighlightSection === 'skills' ? 'Skills' :
                  activeHighlightSection === 'projects' ? 'Projects' :
                  activeHighlightSection === 'certifications' ? 'Certifications' :
                  'Document Sections'
                }
              </div>

              <div className="w-full mt-3 pt-3 border-t flex items-center justify-between text-xs" style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}>
                <span>Standard ISO 216 A4</span>
                <span className="font-medium" style={{ color: 'var(--accent)' }}>ATS Compliant</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ─── Modals ─────────────────────────────────────────────────── */}

      {/* Description / Raw Career Notes Parser Modal */}
      <Modal open={descriptionModal} onClose={() => setDescriptionModal(false)} title="Generate Sections from Career Notes">
        <div className="space-y-4">
          <p className="text-sm text-zinc-600 leading-relaxed">
            Write or paste raw bullet points, LinkedIn text, past job duties, or your career history. The parser will organize your information into clean, executive resume sections.
          </p>
          <Field
            label="Target Role or Focus (Optional)"
            value={descTargetRole}
            onChange={setDescTargetRole}
            placeholder="e.g. Lead Distributed Systems Engineer"
          />
          <div>
            <label className="text-sm font-semibold text-zinc-800 block mb-1.5">Career Background Notes</label>
            <textarea
              rows={6}
              value={descInput}
              onChange={e => setDescInput(e.target.value)}
              className="input-field text-sm font-mono leading-relaxed"
              placeholder="e.g. I worked at Stripe for 3 years as a backend engineer, built the payments API, scaled microservices to 15k req/sec, then transitioned to lead architect..."
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setDescriptionModal(false)}
              className="btn-ghost text-sm py-2 px-4"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDescribeImport}
              disabled={aiLoading}
              className="btn-primary text-sm py-2.5 px-5 flex items-center gap-2"
            >
              {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Parse into Resume</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* Tailor to Job Description Modal */}
      <Modal open={tailorModal} onClose={() => setTailorModal(false)} title="Analyze Job Description Keyword Match">
        <div className="space-y-4">
          <p className="text-sm text-zinc-600 leading-relaxed">
            Paste the job description of your target position. Our scanner checks your resume against key requirements and suggests targeted bullet improvements.
          </p>
          <textarea
            rows={6}
            value={jdText}
            onChange={e => setJdText(e.target.value)}
            className="input-field text-sm font-mono leading-relaxed"
            placeholder="Paste target job description and requirements here..."
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setTailorModal(false)}
              className="btn-ghost text-sm py-2 px-4"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleTailor}
              disabled={aiLoading}
              className="btn-primary text-sm py-2.5 px-5 flex items-center gap-2"
            >
              {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
              <span>Scan ATS Match</span>
            </button>
          </div>

          {tailorSuggestions.length > 0 && (
            <div className="mt-4 p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
              <h4 className="text-sm font-bold text-zinc-900">Recommended Enhancements:</h4>
              <ul className="space-y-2 text-sm text-zinc-700">
                {tailorSuggestions.map((sug, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-zinc-900 font-bold">•</span>
                    <span>{sug}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Modal>

      {/* Payment / Upgrade Modal */}
      <PaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="Upgrade to ATSResumeBuilder Pro"
        subtitle={paymentReason || 'Unlock unrestricted, unwatermarked high-resolution PDF exports and AI writing tools.'}
        confirmLabel="Activate Pro & Continue"
        onSuccess={() => {
          toast.success('Pro plan active! Re-generating PDF now…');
          setTimeout(() => {
            handleDownloadPDF();
          }, 350);
        }}
      />
    </div>
  );
}

// ─── Reusable Accordion Section Component ────────────────────────────────────

function AccordionSection({
  id,
  title,
  subtitle,
  icon,
  isOpen,
  onToggle,
  onFocus,
  children,
}: {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  onFocus?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="overflow-hidden transition-all duration-200 ease-in-out rounded-[12px]"
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--line)',
        boxShadow: '0 1px 3px rgba(26, 26, 22, 0.08)',
      }}
      onMouseEnter={onFocus}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-black/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3.5">
          <div
            className="w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0"
            style={{
              backgroundColor: 'rgba(26, 26, 22, 0.08)',
              color: 'var(--ink)',
            }}
          >
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-[16px] tracking-tight leading-tight" style={{ color: 'var(--ink)' }}>
              {title}
            </h3>
            <p className="text-[13px] mt-0.5 leading-tight" style={{ color: 'var(--muted)' }}>
              {subtitle}
            </p>
          </div>
        </div>

        <div className="p-1 rounded-[6px]" style={{ color: 'var(--muted)' }}>
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-6 pb-6 pt-1 border-t animate-in fade-in-50 duration-200" style={{ borderColor: 'var(--line)' }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Reusable Input Field Component ──────────────────────────────────────────

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  helper,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  helper?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[14px] font-medium" style={{ color: 'var(--ink)' }}>
          {label}
        </label>
        {helper && <span className="text-[12px]" style={{ color: 'var(--muted)' }}>{helper}</span>}
      </div>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="input-field text-sm px-3.5 py-2.5 transition-all duration-200"
      />
    </div>
  );
}
