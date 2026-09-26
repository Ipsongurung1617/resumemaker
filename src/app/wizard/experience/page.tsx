'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ResumeNowExperienceStep() {
  const [isSaved, setIsSaved] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  return (
    <div
      className="min-h-screen flex flex-col font-sans selection:bg-[#2F5D3A] selection:text-[#FDFCF9]"
      style={{
        backgroundColor: '#FDFCF9',
        color: '#1A1A16',
      }}
    >
      {/* ─── Persistent Progress Indicator at the Very Top ─── */}
      <header
        className="w-full sticky top-0 z-30"
        style={{
          backgroundColor: '#FDFCF9',
          borderBottom: '1px solid rgba(26, 26, 22, 0.12)',
        }}
      >
        {/* Full-width thin progress bar */}
        <div
          className="w-full h-1"
          style={{ backgroundColor: 'rgba(26, 26, 22, 0.08)' }}
        >
          <div
            className="h-full transition-all duration-300"
            style={{
              width: '28.57%',
              backgroundColor: '#2F5D3A',
            }}
          />
        </div>

        {/* Top bar info */}
        <div className="max-w-7xl mx-auto px-6 h-11 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span
              className="font-medium"
              style={{ color: 'rgba(26, 26, 22, 0.70)' }}
            >
              Step 2 of 7
            </span>
            <span style={{ color: 'rgba(26, 26, 22, 0.12)' }}>•</span>
            <span
              className="font-semibold"
              style={{ color: '#2F5D3A' }}
            >
              29% Complete
            </span>
          </div>

          {/* Autosave status indicator (Item 7) */}
          <div className="flex items-center gap-1.5 font-medium" style={{ color: '#2F5D3A' }}>
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="#2F5D3A"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>Saved</span>
          </div>
        </div>
      </header>

      {/* ─── Main 2-Column Wizard Layout ─── */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* ─── Left Sidebar (Item 1) ─── */}
        <aside
          className="w-full md:w-64 lg:w-72 shrink-0 p-8 flex flex-col justify-between"
          style={{ backgroundColor: '#1A1A16' }}
        >
          <div>
            {/* Logo */}
            <div className="flex items-center gap-2 mb-12">
              <svg
                className="w-6 h-6"
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
              <span className="text-xl font-bold tracking-tight" style={{ color: '#FDFCF9' }}>
                ATSResumeBuilder
              </span>
            </div>

            {/* Stepper Navigation List */}
            <nav className="space-y-6 relative">
              {/* Stepper vertical track line */}
              <div
                className="absolute left-[13px] top-4 bottom-4 w-px pointer-events-none"
                style={{ backgroundColor: 'rgba(253, 252, 249, 0.20)' }}
              />

              {/* Step 1: Header (Completed with checkmark) */}
              <div className="relative flex items-center gap-3.5 z-10">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: '#2F5D3A',
                    color: '#FDFCF9',
                  }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-[15px] font-medium"
                    style={{ color: '#FDFCF9' }}
                  >
                    Header
                  </span>
                  <span
                    className="text-[11px] font-mono px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: 'rgba(47, 93, 58, 0.20)',
                      color: '#FDFCF9',
                    }}
                  >
                    Done
                  </span>
                </div>
              </div>

              {/* Step 2: Experience (Active current step) */}
              <div
                className="relative flex items-center gap-3.5 z-10 p-2.5 -ml-2.5 rounded-lg"
                style={{ backgroundColor: 'rgba(253, 252, 249, 0.08)' }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
                  style={{
                    backgroundColor: '#2F5D3A',
                    color: '#FDFCF9',
                  }}
                >
                  2
                </div>
                <span
                  className="text-[15px] font-medium"
                  style={{ color: '#FDFCF9' }}
                >
                  Experience
                </span>
              </div>

              {/* Step 3: Education */}
              <div className="relative flex items-center gap-3.5 z-10">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: '#1A1A16',
                    border: '1.5px solid rgba(253, 252, 249, 0.40)',
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: 'rgba(253, 252, 249, 0.40)' }}
                  />
                </div>
                <span
                  className="text-[15px] font-medium"
                  style={{ color: 'rgba(253, 252, 249, 0.55)' }}
                >
                  Education
                </span>
              </div>

              {/* Step 4: Skills */}
              <div className="relative flex items-center gap-3.5 z-10">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: '#1A1A16',
                    border: '1.5px solid rgba(253, 252, 249, 0.40)',
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: 'rgba(253, 252, 249, 0.40)' }}
                  />
                </div>
                <span
                  className="text-[15px] font-medium"
                  style={{ color: 'rgba(253, 252, 249, 0.55)' }}
                >
                  Skills
                </span>
              </div>

              {/* Step 5: Summary */}
              <div className="relative flex items-center gap-3.5 z-10">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: '#1A1A16',
                    border: '1.5px solid rgba(253, 252, 249, 0.40)',
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: 'rgba(253, 252, 249, 0.40)' }}
                  />
                </div>
                <span
                  className="text-[15px] font-medium"
                  style={{ color: 'rgba(253, 252, 249, 0.55)' }}
                >
                  Summary
                </span>
              </div>

              {/* Step 6: Additional Details */}
              <div className="relative flex items-center gap-3.5 z-10">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: '#1A1A16',
                    border: '1.5px solid rgba(253, 252, 249, 0.40)',
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: 'rgba(253, 252, 249, 0.40)' }}
                  />
                </div>
                <span
                  className="text-[15px] font-medium"
                  style={{ color: 'rgba(253, 252, 249, 0.55)' }}
                >
                  Additional Details
                </span>
              </div>

              {/* Step 7: Finalize */}
              <div className="relative flex items-center gap-3.5 z-10">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: '#1A1A16',
                    border: '1.5px solid rgba(253, 252, 249, 0.40)',
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: 'rgba(253, 252, 249, 0.40)' }}
                  />
                </div>
                <span
                  className="text-[15px] font-medium"
                  style={{ color: 'rgba(253, 252, 249, 0.55)' }}
                >
                  Finalize
                </span>
              </div>
            </nav>
          </div>

          {/* Footer in sidebar */}
          <div
            className="pt-6 mt-8 text-xs font-mono"
            style={{
              borderTop: '1px solid rgba(253, 252, 249, 0.12)',
              color: 'rgba(253, 252, 249, 0.55)',
            }}
          >
            Step 2 of 7 • Experience
          </div>
        </aside>

        {/* ─── Center Content Area: Step 2 Experience ─── */}
        <main className="flex-1 px-8 lg:px-14 py-12 flex flex-col justify-between">
          <div className="max-w-xl">
            {/* Step label breadcrumb */}
            <div
              className="text-[14px] font-semibold mb-3 tracking-wide"
              style={{ color: '#2F5D3A' }}
            >
              Step 2 of 7 → Experience
            </div>

            {/* Headline H1 (40px / 700, -0.02em tracking, no decorative underline) */}
            <h1
              className="text-[40px] font-bold leading-tight mb-8 tracking-[-0.02em]"
              style={{
                color: '#1A1A16',
              }}
            >
              Add details about your work experience
            </h1>

            {/* AI Writing Card (Sparkle icon in --accent, no colored emoji, no orange highlight) */}
            <div
              className="p-5 rounded-[12px] mb-10 flex items-start gap-4 transition-all"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(26, 26, 22, 0.12)',
                boxShadow: '0 1px 3px rgba(26, 26, 22, 0.08)',
              }}
            >
              {/* Restyled Sparkle / Magic Wand Icon in --accent */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: 'rgba(47, 93, 58, 0.08)',
                  color: '#2F5D3A',
                }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="#2F5D3A"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" />
                  <path d="M5 3v4" />
                  <path d="M19 17v4" />
                  <path d="M3 5h4" />
                  <path d="M17 19h4" />
                </svg>
              </div>

              <div>
                <h3
                  className="text-[15px] font-semibold mb-1"
                  style={{ color: '#1A1A16' }}
                >
                  Our AI now makes writing easier!
                </h3>
                <p
                  className="text-[14px] leading-relaxed"
                  style={{ color: 'rgba(26, 26, 22, 0.70)' }}
                >
                  With writing help you can fix mistakes or rephrase sentences to suit your needs.
                </p>
              </div>
            </div>

            {/* Helper Prompt Copy */}
            <p
              className="text-[16px] leading-relaxed mb-8"
              style={{ color: 'rgba(26, 26, 22, 0.70)' }}
            >
              Start with your most recent position. You can add job titles, company names, locations, and achievements.
            </p>
          </div>

          {/* Action Row: Back button (plain text link) & Continue button (--accent solid fill, 8px radius) */}
          <div className="pt-8 flex items-center gap-6" style={{ borderTop: '1px solid rgba(26, 26, 22, 0.12)' }}>
            {/* Back button (Item 5: plain text link in --ink at 70% opacity with left arrow, no button chrome) */}
            <Link
              href="/dashboard"
              className="text-[15px] font-medium transition-opacity hover:opacity-100 flex items-center gap-1.5"
              style={{ color: 'rgba(26, 26, 22, 0.70)' }}
            >
              <span>←</span>
              <span>Back</span>
            </Link>

            {/* Continue button (Item 5: --accent solid fill, --paper text, 8px radius, no gradient, no doodle) */}
            <button
              type="button"
              onClick={() => {
                setIsSaved(true);
              }}
              className="px-8 py-3.5 text-[15px] font-semibold rounded-[8px] transition-all active:scale-[0.99] focus:outline-none"
              style={{
                backgroundColor: '#2F5D3A',
                color: '#FDFCF9',
                boxShadow: '0 1px 2px rgba(26, 26, 22, 0.08)',
              }}
            >
              Continue
            </button>
          </div>
        </main>

        {/* ─── Right Column: Live Reactive A4 Document Preview (Item 6) ─── */}
        <section
          className="w-full md:w-[380px] lg:w-[440px] shrink-0 p-8 flex flex-col items-center justify-start"
          style={{
            backgroundColor: '#FDFCF9',
            borderLeft: '1px solid rgba(26, 26, 22, 0.12)',
          }}
        >
          {/* Persistent label above preview (Item 6) */}
          <div
            className="w-full text-left text-[13px] font-medium mb-3"
            style={{ color: 'rgba(26, 26, 22, 0.55)' }}
          >
            Live preview — updates as you type
          </div>

          {/* Simulated Resume Paper */}
          <div
            className="relative w-full rounded-sm p-6 text-[10px] leading-snug font-serif shadow-sm transition-transform origin-top"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(26, 26, 22, 0.12)',
              minHeight: '520px',
              color: '#1A1A16',
              transform: `scale(${zoomLevel})`,
            }}
          >
            {/* Header: Name & Contact Info */}
            <div className="text-center pb-4 mb-3 border-b" style={{ borderColor: 'rgba(26, 26, 22, 0.12)' }}>
              <h2
                className="text-lg font-bold tracking-wider uppercase mb-1 font-serif"
                style={{ color: '#1A1A16' }}
              >
                IPSON GURUNG
              </h2>
              <p style={{ color: 'rgba(26, 26, 22, 0.70)' }}>
                San Francisco, CA • (415) 555-0142 • ipson.gurung721@gmail.com
              </p>
            </div>

            {/* Summary */}
            <div className="mb-3">
              <h3
                className="text-[10px] font-bold uppercase tracking-wider font-sans mb-1"
                style={{ color: '#1A1A16' }}
              >
                Summary
              </h3>
              <p style={{ color: 'rgba(26, 26, 22, 0.70)' }}>
                Results-driven professional with 7+ years of experience in high-growth operational roles and team leadership.
              </p>
            </div>

            {/* Skills */}
            <div className="mb-3">
              <h3
                className="text-[10px] font-bold uppercase tracking-wider font-sans mb-1"
                style={{ color: '#1A1A16' }}
              >
                Skills
              </h3>
              <p style={{ color: 'rgba(26, 26, 22, 0.70)' }}>
                Cross-Functional Leadership • Financial Modeling • Process Automation • Team Mentorship
              </p>
            </div>

            {/* EXPERIENCE (Currently Editing — Highlight box in --accent at 8% fill + 1px border) */}
            <div
              className="p-2.5 rounded mb-3 transition-all"
              style={{
                backgroundColor: 'rgba(47, 93, 58, 0.08)',
                border: '1px solid #2F5D3A',
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <h3
                  className="text-[10px] font-bold uppercase tracking-wider font-sans"
                  style={{ color: '#2F5D3A' }}
                >
                  Experience
                </h3>
                <span
                  className="text-[8px] font-sans font-semibold px-1 py-0.2 rounded"
                  style={{
                    backgroundColor: '#2F5D3A',
                    color: '#FDFCF9',
                  }}
                >
                  Editing
                </span>
              </div>

              <div className="font-sans font-semibold text-[9px] flex justify-between" style={{ color: '#1A1A16' }}>
                <span>Operations Director</span>
                <span style={{ color: 'rgba(26, 26, 22, 0.70)' }}>2021 – Present</span>
              </div>
              <div className="text-[9px] italic mb-1" style={{ color: 'rgba(26, 26, 22, 0.70)' }}>
                Apex Systems • San Francisco, CA
              </div>
              <ul className="list-disc pl-3 space-y-1" style={{ color: 'rgba(26, 26, 22, 0.70)' }}>
                <li>Directed operations team scaling throughput by 42% year-over-year.</li>
                <li>Introduced standardized data review processes across 4 regional branches.</li>
              </ul>
            </div>

            {/* Education */}
            <div>
              <h3
                className="text-[10px] font-bold uppercase tracking-wider font-sans mb-1"
                style={{ color: '#1A1A16' }}
              >
                Education
              </h3>
              <div className="font-sans font-semibold text-[9px] flex justify-between" style={{ color: '#1A1A16' }}>
                <span>B.S. in Business Administration</span>
                <span style={{ color: 'rgba(26, 26, 22, 0.70)' }}>2018</span>
              </div>
              <div className="text-[9px]" style={{ color: 'rgba(26, 26, 22, 0.70)' }}>
                San Francisco State University
              </div>
            </div>

            {/* Zoom Control on preview (Item 8: --ink circular button with --paper icon) */}
            <button
              type="button"
              aria-label="Toggle Zoom Preview"
              onClick={() => setZoomLevel(prev => (prev === 1 ? 1.05 : 1))}
              className="absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm focus:outline-none"
              style={{
                backgroundColor: '#1A1A16',
                color: '#FDFCF9',
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="#FDFCF9" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 8v6M8 11h6" />
              </svg>
            </button>
          </div>

          {/* 4-Word Caption Under Preview (Item 6) */}
          <div
            className="w-full text-center text-[12px] font-medium mt-3"
            style={{ color: 'rgba(26, 26, 22, 0.70)' }}
          >
            Currently editing: Experience
          </div>

          {/* "Change template" link below preview (Item 9: --accent text, underlined, no button chrome) */}
          <button
            type="button"
            className="text-[13px] font-semibold underline underline-offset-4 mt-2 transition-opacity hover:opacity-80 focus:outline-none"
            style={{ color: '#2F5D3A' }}
          >
            Change template
          </button>
        </section>
      </div>
    </div>
  );
}
