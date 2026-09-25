'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div
      className="min-h-screen font-sans selection:bg-[#2F5D3A] selection:text-[#FDFCF9]"
      style={{ backgroundColor: 'var(--paper)', color: 'var(--ink)' }}
    >
      {/* ─── Header / Navigation ─── */}
      <header
        className="sticky top-0 z-30"
        style={{
          backgroundColor: 'var(--paper)',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo / Wordmark (Solid --ink, pixel-identical across screens) */}
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
            <span
              className="text-lg font-bold tracking-tight"
              style={{ color: 'var(--ink)' }}
            >
              Resume Now.
            </span>
          </Link>

          {/* Center-Right Nav */}
          <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium" style={{ color: 'var(--muted)' }}>
            <a href="#how-it-works" className="hover:text-[#1A1A16] transition-colors">How it works</a>
            <a href="#templates" className="hover:text-[#1A1A16] transition-colors">Templates</a>
            <a href="#pricing" className="hover:text-[#1A1A16] transition-colors">Pricing</a>
          </nav>

          {/* Auth Actions (Sign In text link + single solid --accent CTA) */}
          <div className="flex items-center gap-5">
            <Link
              href="/login"
              className="text-[14px] font-medium transition-colors hover:text-[#2F5D3A]"
              style={{ color: 'var(--ink)' }}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="btn-primary"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Hero Section (Asymmetric Two-Column) ─── */}
      <section className="py-20 lg:py-28" style={{ borderBottom: '1px solid var(--line)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column (~55% width) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Wayfinding micro label */}
              <div
                className="text-[13px] font-medium uppercase tracking-[0.04em]"
                style={{ color: 'var(--accent)' }}
              >
                Editorial ATS Resume Builder
              </div>

              {/* Display / H1: 40px / 700, -0.02em tracking, --ink, no decorative underline */}
              <h1
                className="text-[40px] font-bold leading-[1.15] tracking-[-0.02em]"
                style={{ color: 'var(--ink)' }}
              >
                The clear, professional standard for modern resume creation
              </h1>

              {/* One sentence of --muted supporting copy */}
              <p
                className="text-[16px] leading-[1.6]"
                style={{ color: 'var(--muted)' }}
              >
                Construct applicant-tracking-system-approved resumes with structured typography, immediate PDF export, and guided precision.
              </p>

              {/* Action row: Single primary CTA + plain-text secondary link */}
              <div className="pt-2 flex flex-wrap items-center gap-6">
                <Link
                  href="/register"
                  className="btn-primary"
                  style={{ padding: '12px 24px' }}
                >
                  Create My Resume — It&apos;s Free
                </Link>

                <a
                  href="#templates"
                  className="text-[14px] font-medium transition-colors hover:underline"
                  style={{ color: 'var(--ink)' }}
                >
                  Explore executive templates →
                </a>
              </div>

              {/* Trust statement */}
              <div
                className="pt-4 text-[13px] font-medium flex items-center gap-2"
                style={{ color: 'var(--muted)' }}
              >
                <span>No credit card required</span>
                <span>•</span>
                <span>300 DPI vector PDF export</span>
                <span>•</span>
                <span>Free forever tier</span>
              </div>
            </div>

            {/* Right Column: Real product mockup (not skeleton bars), one shadow token */}
            <div className="lg:col-span-5">
              <div
                className="p-6 rounded-[12px] transition-transform"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--line)',
                  boxShadow: '0 1px 3px rgba(26, 26, 22, 0.08)',
                }}
              >
                {/* Simulated Real Resume Document */}
                <div
                  className="p-5 font-serif text-[11px] leading-relaxed rounded-[8px]"
                  style={{
                    backgroundColor: 'var(--paper)',
                    border: '1px solid var(--line)',
                    color: 'var(--ink)',
                  }}
                >
                  {/* Document Header */}
                  <div className="text-center pb-3 mb-3 border-b" style={{ borderColor: 'var(--line)' }}>
                    <div className="text-[15px] font-bold tracking-wider uppercase font-serif" style={{ color: 'var(--ink)' }}>
                      IPSON GURUNG
                    </div>
                    <div className="text-[10px] mt-0.5" style={{ color: 'var(--muted)' }}>
                      San Francisco, CA • (415) 555-0142 • ipson.gurung721@gmail.com
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="mb-3">
                    <div className="text-[10px] font-sans font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--ink)' }}>
                      Summary
                    </div>
                    <p style={{ color: 'var(--muted)' }}>
                      Operations leader with 7+ years of track record optimizing operational pipelines, reducing administrative friction, and leading cross-functional teams.
                    </p>
                  </div>

                  {/* Experience highlight */}
                  <div
                    className="p-2.5 rounded-[8px] mb-3"
                    style={{
                      backgroundColor: 'rgba(47, 93, 58, 0.08)',
                      border: '1px solid var(--accent)',
                    }}
                  >
                    <div className="flex justify-between font-sans font-semibold text-[10px]">
                      <span style={{ color: 'var(--ink)' }}>Operations Director</span>
                      <span style={{ color: 'var(--muted)' }}>2021 – Present</span>
                    </div>
                    <div className="text-[9px] italic mb-1" style={{ color: 'var(--muted)' }}>
                      Apex Systems • San Francisco, CA
                    </div>
                    <ul className="list-disc pl-3 text-[9px] space-y-0.5" style={{ color: 'var(--muted)' }}>
                      <li>Standardized nationwide quarterly review procedures across 4 regional branches.</li>
                      <li>Increased operational throughput by 42% within the first year of tenure.</li>
                    </ul>
                  </div>

                  {/* Education */}
                  <div>
                    <div className="text-[10px] font-sans font-bold uppercase tracking-wider mb-0.5" style={{ color: 'var(--ink)' }}>
                      Education
                    </div>
                    <div className="font-sans font-semibold text-[10px]" style={{ color: 'var(--ink)' }}>
                      B.S. in Business Administration
                    </div>
                    <div className="text-[9px]" style={{ color: 'var(--muted)' }}>
                      San Francisco State University • 2018
                    </div>
                  </div>
                </div>

                {/* Sub caption */}
                <div className="mt-3 flex items-center justify-between text-[12px]" style={{ color: 'var(--muted)' }}>
                  <span>Modern Executive Preview</span>
                  <span className="font-medium" style={{ color: 'var(--accent)' }}>98% ATS Parsed</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── How it Works ─── */}
      <section id="how-it-works" className="py-20" style={{ borderBottom: '1px solid var(--line)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <h2
              className="text-[28px] font-semibold tracking-[-0.01em] mb-2"
              style={{ color: 'var(--ink)' }}
            >
              How it works
            </h2>
            <p className="text-[16px]" style={{ color: 'var(--muted)' }}>
              A disciplined, three-step methodology built for verifiable hiring outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Enter background details',
                desc: 'Add past employers, responsibilities, degrees, and core competencies into guided fields or paste existing notes.',
              },
              {
                step: '02',
                title: 'Refine with editorial precision',
                desc: 'Audit bullet impact, select typography templates, and preview changes live on a true A4 document sheet.',
              },
              {
                step: '03',
                title: 'Download verified PDF',
                desc: 'Export a razor-sharp, ATS-compliant PDF ready for recruiter inboxes and corporate job portals.',
              },
            ].map(item => (
              <div
                key={item.step}
                className="card flex flex-col justify-between"
              >
                <div>
                  <div
                    className="text-[13px] font-mono font-semibold mb-4"
                    style={{ color: 'var(--accent)' }}
                  >
                    Step {item.step}
                  </div>
                  <h3
                    className="text-[20px] font-semibold mb-2"
                    style={{ color: 'var(--ink)' }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-[16px] leading-[1.6]"
                    style={{ color: 'var(--muted)' }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Templates Section ─── */}
      <section id="templates" className="py-20" style={{ borderBottom: '1px solid var(--line)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <h2
              className="text-[28px] font-semibold tracking-[-0.01em] mb-2"
              style={{ color: 'var(--ink)' }}
            >
              Executive templates
            </h2>
            <p className="text-[16px]" style={{ color: 'var(--muted)' }}>
              Typeset layouts engineered to pass ATS scanners and respect recruiter time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Modern Corporate',
                tag: 'Standard',
                desc: 'Crisp sans-serif hierarchy with subtle divider rules and categorized skill tags.',
              },
              {
                title: 'Minimalist Serif',
                tag: 'Traditional',
                desc: 'Timeless single-column typography with centered small-caps headers and hairline dividers.',
              },
              {
                title: 'Tech Mono',
                tag: 'Engineering',
                desc: 'Technical structure with bracketed metadata, monospace details, and tabular alignment.',
              },
            ].map(tpl => (
              <div
                key={tpl.title}
                className="card flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3
                      className="text-[20px] font-semibold"
                      style={{ color: 'var(--ink)' }}
                    >
                      {tpl.title}
                    </h3>
                    <span
                      className="text-[13px] font-medium uppercase tracking-[0.04em]"
                      style={{ color: 'var(--muted)' }}
                    >
                      {tpl.tag}
                    </span>
                  </div>
                  <p
                    className="text-[16px] leading-[1.6]"
                    style={{ color: 'var(--muted)' }}
                  >
                    {tpl.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t" style={{ borderColor: 'var(--line)' }}>
                  <Link
                    href="/register"
                    className="text-[14px] font-medium hover:underline inline-flex items-center gap-1"
                    style={{ color: 'var(--accent)' }}
                  >
                    Start with this template →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing Section ─── */}
      <section id="pricing" className="py-20" style={{ borderBottom: '1px solid var(--line)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <h2
              className="text-[28px] font-semibold tracking-[-0.01em] mb-2"
              style={{ color: 'var(--ink)' }}
            >
              Straightforward pricing
            </h2>
            <p className="text-[16px]" style={{ color: 'var(--muted)' }}>
              Core resume builder tools are free. Upgrade only when you require unlimited versions and automated tailoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            {/* Free Tier */}
            <div className="card flex flex-col justify-between">
              <div>
                <h3 className="text-[20px] font-semibold mb-1" style={{ color: 'var(--ink)' }}>
                  Free Tier
                </h3>
                <p className="text-[14px] mb-6" style={{ color: 'var(--muted)' }}>
                  Essential formatting for initial job searches
                </p>

                <div className="text-[40px] font-bold tracking-tight mb-6" style={{ color: 'var(--ink)' }}>
                  $0
                  <span className="text-[14px] font-normal" style={{ color: 'var(--muted)' }}> / forever</span>
                </div>

                <ul className="space-y-3 text-[14px]" style={{ color: 'var(--ink)' }}>
                  <li className="flex items-center gap-2">
                    <span style={{ color: 'var(--accent)' }}>✓</span>
                    <span>Up to 3 resume versions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span style={{ color: 'var(--accent)' }}>✓</span>
                    <span>Modern Corporate and Minimalist Serif templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span style={{ color: 'var(--accent)' }}>✓</span>
                    <span>Standard PDF exports</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--line)' }}>
                <Link
                  href="/register"
                  className="btn-secondary w-full"
                >
                  Get Started Free
                </Link>
              </div>
            </div>

            {/* Pro Tier (Single primary button in --accent on this screen) */}
            <div className="card flex flex-col justify-between relative">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-[20px] font-semibold" style={{ color: 'var(--ink)' }}>
                    Pro Tier
                  </h3>
                  <span
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-[8px]"
                    style={{
                      backgroundColor: 'rgba(47, 93, 58, 0.08)',
                      color: 'var(--accent)',
                    }}
                  >
                    All Features
                  </span>
                </div>
                <p className="text-[14px] mb-6" style={{ color: 'var(--muted)' }}>
                  For active candidates targeting competitive roles
                </p>

                <div className="text-[40px] font-bold tracking-tight mb-6" style={{ color: 'var(--ink)' }}>
                  $9
                  <span className="text-[14px] font-normal" style={{ color: 'var(--muted)' }}> / month</span>
                </div>

                <ul className="space-y-3 text-[14px]" style={{ color: 'var(--ink)' }}>
                  <li className="flex items-center gap-2">
                    <span style={{ color: 'var(--accent)' }}>✓</span>
                    <span>Unlimited resume documents</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span style={{ color: 'var(--accent)' }}>✓</span>
                    <span>All templates including Tech Mono</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span style={{ color: 'var(--accent)' }}>✓</span>
                    <span>AI bullet point optimization</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span style={{ color: 'var(--accent)' }}>✓</span>
                    <span>Job description keyword tailoring</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--line)' }}>
                <Link
                  href="/pricing"
                  className="btn-primary w-full"
                >
                  Upgrade to Pro
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-12" style={{ backgroundColor: 'var(--paper)' }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[14px]">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1A1A16"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span style={{ color: 'var(--muted)' }}>
              © {new Date().getFullYear()} Resume Now. Minimal, ATS-optimized resume creation.
            </span>
          </div>

          <div className="flex items-center gap-6" style={{ color: 'var(--muted)' }}>
            <Link href="/login" className="hover:text-[#1A1A16] transition-colors">
              Sign In
            </Link>
            <Link href="/pricing" className="hover:text-[#1A1A16] transition-colors">
              Pricing
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
