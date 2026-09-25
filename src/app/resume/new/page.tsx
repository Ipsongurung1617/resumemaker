'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ResumeTemplate, ResumeData } from '@/types/resume';
import { emptyResumeData } from '@/lib/utils';

type CreationMethod = 'wizard' | 'description';

interface TemplateOption {
  id: ResumeTemplate;
  label: string;
  tagline: string;
  description: string;
  proOnly: boolean;
}

const templates: TemplateOption[] = [
  {
    id: 'modern',
    label: 'Modern Executive',
    tagline: 'Dark Header & Clean Accents',
    description: 'Crisp sans-serif typography with a solid header band and pill skills. Ideal for tech, product, and business.',
    proOnly: false,
  },
  {
    id: 'classic',
    label: 'Classic Traditional',
    tagline: 'Formal Serif & Divider Lines',
    description: 'Timeless single-column layout with centered serif headings and formal dividers. Preferred by finance, law, and corporate.',
    proOnly: false,
  },
  {
    id: 'minimal',
    label: 'Minimal Two-Column',
    tagline: 'Sidebar & Structured Layout',
    description: 'Two-column design featuring a dark contact/skills sidebar and an open content column. Great for design, engineering, and consulting.',
    proOnly: true,
  },
];

export default function NewResumePage() {
  const { data: session } = useSession();
  const router = useRouter();

  // Workflow states
  const [method, setMethod] = useState<CreationMethod>('wizard');
  const [title, setTitle] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>('modern');

  // Format 2: Full user description
  const [fullDescription, setFullDescription] = useState('');

  const [loading, setLoading] = useState(false);

  const isPro = session?.user?.plan === 'pro';

  async function handleCreate() {
    const resumeTitle = title.trim() || (targetRole.trim() ? `${targetRole.trim()} Resume` : 'My Resume');

    const tpl = templates.find(t => t.id === selectedTemplate);
    if (tpl?.proOnly && !isPro) {
      toast('The Minimal template requires the Pro plan. Please select Modern or Classic, or upgrade.', { icon: '🔒' });
      return;
    }

    setLoading(true);
    let initialData: ResumeData = emptyResumeData();

    // Auto-fill user name and email from session if available
    if (session?.user?.name) {
      initialData.personalInfo.name = session.user.name;
    }
    if (session?.user?.email) {
      initialData.personalInfo.email = session.user.email;
    }

    try {
      // 1. Process based on selected creation method
      if (method === 'description') {
        if (!fullDescription.trim() || fullDescription.trim().length < 20) {
          toast.error('Please enter a description of your career background (at least a few sentences).');
          setLoading(false);
          return;
        }

        toast('AI structuring your full description…', { icon: '✍️' });
        const descRes = await fetch('/api/ai/describe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            description: fullDescription.trim(),
            targetRole: targetRole.trim(),
          }),
        });

        const descJson = await descRes.json();
        if (descJson.success && descJson.data?.resumeData) {
          initialData = { ...initialData, ...descJson.data.resumeData };
          // Preserve name if session had it and AI didn't find one
          if (session?.user?.name && !initialData.personalInfo.name) {
            initialData.personalInfo.name = session.user.name;
          }
          if (session?.user?.email && !initialData.personalInfo.email) {
            initialData.personalInfo.email = session.user.email;
          }
        } else {
          toast.error(descJson.message || 'Failed to parse description. Proceeding with guided builder.');
        }
      } else {
        // Method 1: Step-by-Step Guided Wizard
        if (targetRole.trim()) {
          initialData.personalInfo.summary = `Dedicated ${targetRole.trim()} with proven track record of delivering measurable outcomes and driving operational excellence.`;
        }
      }

      // If user provided a target role, ensure it is set in summary if still empty
      if (targetRole.trim() && !initialData.personalInfo.summary) {
        initialData.personalInfo.summary = `Experienced ${targetRole.trim()} dedicated to driving measurable results and operational excellence.`;
      }

      // 2. Save new resume to database
      const res = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: resumeTitle,
          template: selectedTemplate,
          data: initialData,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        toast.success(method === 'wizard' ? 'Starting Guided Builder!' : 'Resume generated from description!');
        router.push(`/resume/${json.data.id}/edit`);
      } else {
        toast.error(json.message || 'Failed to create resume');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to create resume. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      {/* Top breadcrumb */}
      <div className="mb-6">
        <Link href="/dashboard" className="text-zinc-500 hover:text-zinc-900 text-xs font-medium flex items-center gap-1 mb-2 transition-colors">
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Create New Resume</h1>
        <p className="text-zinc-500 text-xs mt-1">Choose your preferred format to build your ATS-optimized resume.</p>
      </div>

      <div className="space-y-6">
        {/* ─── STEP 1: Two Clear Creation Formats ─── */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
                Step 1: Choose Your Creation Format
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Select between the step-by-step interactive wizard or one-shot AI generation from your description.
              </p>
            </div>
            <span className="text-xs font-mono text-zinc-400">Format {method === 'wizard' ? '1 of 2' : '2 of 2'}</span>
          </div>

          {/* 2 Format Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Format 1: Step-by-Step Guided Builder (matching the screenshot) */}
            <div
              onClick={() => setMethod('wizard')}
              className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                method === 'wizard'
                  ? 'border-zinc-900 bg-zinc-50/70 shadow-sm ring-1 ring-zinc-900'
                  : 'border-zinc-200 hover:border-zinc-300 bg-white'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-zinc-900 text-white flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-zinc-700 bg-zinc-200/80 px-2 py-0.5 rounded">
                    Guided Wizard
                  </span>
                  {method === 'wizard' && (
                    <span className="text-[10px] font-bold text-zinc-900 bg-zinc-300 px-2 py-0.5 rounded">
                      Selected
                    </span>
                  )}
                </div>
              </div>
              <h3 className="text-sm font-bold text-zinc-900 mb-1.5 flex items-center gap-1.5">
                Step-by-Step Guided Builder
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed mb-3">
                Walk through each section (Header → Experience → Education → Skills → Summary) with a live highlighted preview and AI writing suggestions at every step.
              </p>
              {/* Visual stepper indicator preview */}
              <div className="bg-zinc-100/80 p-2.5 rounded-lg border border-zinc-200/70 flex items-center justify-between text-[10px] text-zinc-600 font-medium">
                <span className="flex items-center gap-1 text-zinc-900 font-bold">✓ Header</span>
                <span>→</span>
                <span className="font-bold text-zinc-900 bg-white px-1.5 py-0.5 rounded shadow-xs">2 Experience</span>
                <span>→</span>
                <span>Education</span>
                <span>→</span>
                <span>Skills</span>
              </div>
            </div>

            {/* Format 2: All Description Pasted by the User */}
            <div
              onClick={() => setMethod('description')}
              className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                method === 'description'
                  ? 'border-zinc-900 bg-zinc-50/70 shadow-sm ring-1 ring-zinc-900'
                  : 'border-zinc-200 hover:border-zinc-300 bg-white'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-zinc-800 text-white flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-zinc-700 bg-zinc-200/80 px-2 py-0.5 rounded">
                    Fast AI Import
                  </span>
                  {method === 'description' && (
                    <span className="text-[10px] font-bold text-zinc-900 bg-zinc-300 px-2 py-0.5 rounded">
                      Selected
                    </span>
                  )}
                </div>
              </div>
              <h3 className="text-sm font-bold text-zinc-900 mb-1.5 flex items-center gap-1.5">
                From Full Career Description
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed mb-3">
                Paste all your background details, work history, past duties, degrees, and skills at once. AI will automatically parse and build all resume sections in seconds.
              </p>
              {/* Visual text indicator preview */}
              <div className="bg-zinc-100/80 p-2.5 rounded-lg border border-zinc-200/70 flex items-center justify-between text-[10px] text-zinc-600">
                <span className="font-mono truncate">“Paste your full background & duties...”</span>
                <span className="font-bold text-zinc-900 shrink-0 ml-2">⚡ Instant Build</span>
              </div>
            </div>
          </div>

          {/* Form inputs based on selected format */}
          <div className="pt-2 space-y-4 bg-zinc-50/60 p-5 rounded-xl border border-zinc-200/70">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Target Role / Job Title <span className="text-zinc-400 font-normal">(e.g. Software Engineer, Operations Lead)</span>
                </label>
                <input
                  type="text"
                  className="input-field text-xs"
                  placeholder="e.g. Senior Software Engineer"
                  value={targetRole}
                  onChange={e => setTargetRole(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Resume Document Name
                </label>
                <input
                  type="text"
                  className="input-field text-xs"
                  placeholder="e.g. Executive Resume 2025"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>
            </div>

            {/* Format 2 Full Description Textarea */}
            {method === 'description' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-zinc-900">
                    Paste Your Complete Career Description & Background <span className="text-zinc-500 font-normal">(Required)</span>
                  </label>
                  <span className="text-[11px] text-zinc-400">AI structures everything automatically</span>
                </div>
                <textarea
                  className="input-field h-40 resize-none text-xs font-sans leading-relaxed"
                  placeholder="Paste everything about your career here:&#10;• Past employers, job titles, and dates&#10;• Key responsibilities, metrics, and accomplishments&#10;• Education, degrees, universities&#10;• Technical and soft skills, tools, certifications&#10;&#10;Example: '5 years at Amazon leading payments infrastructure. Scaled Kafka pipeline to 20k events/sec. Experienced in Go, AWS, Docker, Kubernetes. Bachelor of Science in Computer Science from University of Washington...'"
                  value={fullDescription}
                  onChange={e => setFullDescription(e.target.value)}
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  Tip: You can paste messy notes, bullet points, or old resume text. The AI cleans up the grammar and formats every section.
                </p>
              </div>
            )}

            {/* Format 1 Helper note */}
            {method === 'wizard' && (
              <div className="p-3 bg-white rounded-lg border border-zinc-200 text-xs text-zinc-600 flex items-center gap-2">
                <span className="text-base">🪄</span>
                <span>
                  You will enter our <strong>interactive step-by-step wizard</strong> with a live side-by-side preview and AI assistance on each section.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ─── STEP 2: Realistic Visual Template Previews ─── */}
        <div className="card space-y-4">
          <div className="border-b border-zinc-100 pb-3">
            <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
              Step 2: Choose Template Layout
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Review visual structure and select your document layout. All templates are 100% ATS-compliant.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map(tpl => {
              const locked = tpl.proOnly && !isPro;
              const isSelected = selectedTemplate === tpl.id;

              return (
                <div
                  key={tpl.id}
                  onClick={() => {
                    if (locked) {
                      toast('Upgrade to Pro to unlock the Minimal two-column template.', { icon: '🔒' });
                      return;
                    }
                    setSelectedTemplate(tpl.id);
                  }}
                  className={`group relative rounded-xl border-2 p-3.5 text-left cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-zinc-900 bg-zinc-50/60 shadow-md ring-1 ring-zinc-900'
                      : locked
                      ? 'border-zinc-200 bg-zinc-50/40 opacity-70'
                      : 'border-zinc-200 hover:border-zinc-400 bg-white'
                  }`}
                >
                  <div>
                    {/* Realistic Visual Miniature Wireframe */}
                    <div className="mb-3 rounded-lg overflow-hidden border border-zinc-300 bg-white shadow-inner p-1 h-36 relative flex flex-col justify-between">
                      {tpl.id === 'modern' && (
                        <div className="h-full flex flex-col justify-between text-[6px]">
                          {/* Dark header bar */}
                          <div className="bg-zinc-900 text-white p-2 rounded-t-sm">
                            <div className="w-16 h-1.5 bg-white rounded-sm mb-1" />
                            <div className="w-24 h-1 bg-zinc-400 rounded-sm" />
                          </div>
                          {/* Body lines */}
                          <div className="p-2 space-y-1.5 flex-1">
                            <div className="flex items-center gap-1">
                              <div className="w-12 h-1 bg-zinc-800 rounded-sm" />
                              <div className="flex-1 h-[0.5px] bg-zinc-300" />
                            </div>
                            <div className="w-full h-1 bg-zinc-200 rounded-sm" />
                            <div className="w-4/5 h-1 bg-zinc-200 rounded-sm" />
                            <div className="flex items-center gap-1 pt-1">
                              <div className="w-14 h-1 bg-zinc-800 rounded-sm" />
                              <div className="flex-1 h-[0.5px] bg-zinc-300" />
                            </div>
                            <div className="flex gap-1">
                              <div className="w-6 h-1.5 bg-zinc-200 rounded-sm" />
                              <div className="w-6 h-1.5 bg-zinc-200 rounded-sm" />
                              <div className="w-6 h-1.5 bg-zinc-200 rounded-sm" />
                            </div>
                          </div>
                        </div>
                      )}

                      {tpl.id === 'classic' && (
                        <div className="h-full flex flex-col justify-between p-2 text-[6px]">
                          {/* Centered serif title */}
                          <div className="text-center pb-1 border-b border-zinc-800">
                            <div className="w-20 h-1.5 bg-zinc-900 rounded-sm mx-auto mb-1" />
                            <div className="w-28 h-1 bg-zinc-400 rounded-sm mx-auto" />
                          </div>
                          {/* Classic horizontal rules & columns */}
                          <div className="space-y-1.5 flex-1 pt-1.5">
                            <div className="w-14 h-1 bg-zinc-900 rounded-sm" />
                            <div className="w-full h-[0.5px] bg-zinc-300" />
                            <div className="w-full h-1 bg-zinc-200 rounded-sm" />
                            <div className="w-5/6 h-1 bg-zinc-200 rounded-sm" />
                            <div className="w-12 h-1 bg-zinc-900 rounded-sm pt-1" />
                            <div className="w-full h-[0.5px] bg-zinc-300" />
                            <div className="w-3/4 h-1 bg-zinc-200 rounded-sm" />
                          </div>
                        </div>
                      )}

                      {tpl.id === 'minimal' && (
                        <div className="h-full flex text-[6px]">
                          {/* Dark left sidebar */}
                          <div className="w-1/3 bg-zinc-900 text-white p-1.5 flex flex-col justify-between rounded-l-sm">
                            <div className="w-10 h-1.5 bg-white rounded-sm mb-1.5" />
                            <div className="space-y-1">
                              <div className="w-8 h-1 bg-zinc-500 rounded-sm" />
                              <div className="w-6 h-1 bg-zinc-600 rounded-sm" />
                            </div>
                            <div className="space-y-1 pt-2">
                              <div className="w-8 h-1 bg-zinc-500 rounded-sm" />
                              <div className="w-7 h-1 bg-zinc-600 rounded-sm" />
                            </div>
                          </div>
                          {/* Right main column */}
                          <div className="flex-1 p-2 space-y-1.5 bg-white">
                            <div className="w-14 h-1 bg-zinc-800 rounded-sm" />
                            <div className="w-full h-[0.5px] bg-zinc-200" />
                            <div className="w-full h-1 bg-zinc-200 rounded-sm" />
                            <div className="w-4/5 h-1 bg-zinc-200 rounded-sm" />
                            <div className="w-12 h-1 bg-zinc-800 rounded-sm pt-1" />
                            <div className="w-full h-[0.5px] bg-zinc-200" />
                            <div className="w-3/4 h-1 bg-zinc-200 rounded-sm" />
                          </div>
                        </div>
                      )}

                      {/* Locked badge overlay */}
                      {locked && (
                        <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center">
                          <span className="bg-zinc-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow">
                            PRO ⚡
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Template details */}
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-zinc-900">{tpl.label}</span>
                      {isSelected && (
                        <span className="text-[10px] font-bold text-zinc-900 bg-zinc-200 px-1.5 py-0.2 rounded">
                          ✓ Selected
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-normal">{tpl.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/dashboard" className="btn-secondary text-xs">
            Cancel
          </Link>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="btn-primary text-xs flex items-center gap-2 px-6 py-2.5"
          >
            {loading ? (
              <>
                <LoadingSpinner size={14} color="white" />
                <span>
                  {method === 'wizard' ? 'Starting Guided Builder...' : 'Generating Resume with AI...'}
                </span>
              </>
            ) : (
              <span>
                {method === 'wizard'
                  ? 'Start Guided Builder →'
                  : '⚡ Generate Resume from Description →'}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
