# ATSResumeBuilder — Enterprise-Grade AI Resume Builder

> ATS-optimized, beautifully typeset professional resumes in minutes. Features dual-engine AI bullet rewriting, LinkedIn profile extraction, real-time live preview with non-destructive watermark protection, and pixel-perfect vector PDF generation.

[![Next.js](https://img.shields.io/badge/Next.js-14_App_Router-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)](https://www.prisma.io)
[![PostgreSQL](https://img.shields.io/badge/Database-Supabase_PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css)](https://tailwindcss.com)

---

## 1. Feature Purpose & Overview

ATSResumeBuilder eliminates the friction of designing, formatting, and wording resumes for modern Applicant Tracking Systems (ATS).

### Core Features
- **Deterministic 1:1 Live Preview**: What you edit in the form matches the rendered document canvas down to the millimeter.
- **Dual-Engine AI Intelligence**: Primary requests routed through NVIDIA NIM (`meta/llama-3.2-11b-vision-instruct`) with zero-downtime automated failover to OpenRouter (`google/gemini-2.0-flash-exp:free`).
- **Plan-Tiered Resume Allocations**:
  - **Free Tier**: 1 active resume document, 2 core templates (Modern, Classic), on-canvas diagonal anti-screenshot watermark during draft preview (automatically stripped upon high-res PDF generation).
  - **Pro Tier ($9/month)**: 10 active resume documents, all templates (including Tech Mono/Minimalist), zero preview watermarks, AI bullet rewriter, and AI job description tailor.
- **SSRF-Protected LinkedIn Ingestion**: Parses public LinkedIn profile URLs or raw text directly into structured resume fields.
- **Client-Side High-Res PDF Engine**: Clones the DOM off-screen at native 794px × 1123px (A4), strips preview-only UI markers, and generates print-ready 300 DPI PDFs.

---

## 2. Architecture & Data Flow

```
User Request
  │
  ▼
Next.js App Router (Client / Server Components)
  │
  ├─► NextAuth.js Session Layer (JWT + Database Verification)
  │
  ├─► API Route Handlers (/api/resume, /api/ai/*, /api/auth/*)
  │     │
  │     ├─► Business Logic & LLM Orchestrator (src/lib/openrouter.ts)
  │     │     │
  │     │     ├─► NVIDIA NIM API (Primary)
  │     │     └─► OpenRouter Gemini 2.0 Flash (Fallback)
  │     │
  │     └─► Prisma Client Singleton (src/lib/db.ts)
  │           │
  │           ├─► Transaction Pooler :6543 (Runtime Queries)
  │           └─► Direct Session Pooler :5432 (Migrations & Schema Push)
  │                 │
  │                 ▼
  │           Supabase PostgreSQL Database
  │
  └─► Client-Side PDF Generator (html2canvas + jsPDF)
```

### Data Flow Breakdown
1. **Authentication Flow**: User registers via `/api/auth/register` with bcrypt-hashed credentials (salt rounds: 10). NextAuth issues a signed JWT containing user ID and subscription tier (`plan`).
2. **Resume Modification & Auto-Save Flow**: Keystrokes in `/resume/[id]/edit` trigger a 500ms debounced `PUT /api/resume/[id]`. The handler verifies document ownership (`userId === session.user.id`) before updating the record in PostgreSQL.
3. **AI Generation Flow**: Gated server-side by checking `session.user.plan === 'pro'`. Prompts enforce strict JSON responses with regex sanitization to strip markdown fences before client delivery.
4. **PDF Export Flow**: When export is triggered, the DOM node `#resume-preview` is cloned off-screen, classes `.preview-watermark` and `.preview-protection-overlay` are removed from the clone, and `html2canvas` captures the pristine clean canvas into an A4 PDF document.

---

## 3. Directory & File Explanation

```
resumeMaker/
├── prisma/
│   └── schema.prisma          # PostgreSQL schema with User, Resume, Account, Session models
├── public/
│   └── favicon.svg            # Custom geometric SVG logo & browser favicon
├── scripts/
│   └── set-pro.js             # Administrative script to manage user tiers
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/         # Sign-in screen with token validation & error handling
│   │   │   └── register/      # Sign-up screen with client & server-side validation
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx     # Dashboard shell with persistent sidebar & plan badge
│   │   │   └── dashboard/     # Resume overview grid with miniature visual previews
│   │   ├── api/
│   │   │   ├── ai/
│   │   │   │   ├── linkedin/  # LinkedIn profile scraper & parser (SSRF-protected)
│   │   │   │   ├── rewrite/   # AI bullet enhancer (Pro-gated)
│   │   │   │   └── tailor/    # Job description resume tailoring (Pro-gated)
│   │   │   ├── auth/          # Registration & NextAuth catch-all handler
│   │   │   ├── resume/        # Resume CRUD endpoints with plan limit validation
│   │   │   └── user/plan/     # Subscription upgrade handler
│   │   ├── resume/
│   │   │   ├── new/           # Guided multi-option resume creation flow
│   │   │   └── [id]/edit/     # Split-screen live editor with accordion controls
│   │   ├── globals.css        # Strict 5-token color palette & keyframe animations
│   │   ├── layout.tsx         # Root HTML layout with SEO metadata & JSON-LD
│   │   └── page.tsx           # High-conversion marketing landing page
│   ├── components/
│   │   ├── providers/         # NextAuth SessionProvider wrapper
│   │   ├── resume/
│   │   │   ├── ResumePreview.tsx   # Document canvas with diagonal watermark & bottom bar
│   │   │   └── templates/          # Modern, Classic, and Minimalist document designs
│   │   └── ui/                # Accessible Modals, Badges, and Loading Spinners
│   ├── lib/
│   │   ├── auth.ts            # NextAuth configuration and session augmentation
│   │   ├── db.ts              # PrismaClient singleton for Next.js hot-reloading
│   │   ├── openrouter.ts      # LLM orchestrator (NVIDIA NIM + OpenRouter failover)
│   │   ├── pdf.ts             # Off-screen DOM cloner and PDF compiler
│   │   └── utils.ts           # ID generator, date formatting, and debouncing
│   └── types/
│       └── resume.ts          # Typed domain contracts for all resume entities
├── .env                       # Prisma CLI environment variables
├── .env.local                 # Next.js local runtime environment variables
└── package.json               # Dependencies and build lifecycle hooks
```

---

## 4. API Endpoints Specification

### Authentication
- `POST /api/auth/register`
  - **Body**: `{ name: string, email: string, password: string (>= 8 chars) }`
  - **Response (201)**: `{ success: true, message: "Account created successfully" }`
  - **Errors**: `400` (Validation), `409` (Email exists), `500` (Server error)

### Resumes
- `GET /api/resume`
  - **Auth**: Required
  - **Response (200)**: `{ success: true, data: Resume[] }`
- `POST /api/resume`
  - **Auth**: Required
  - **Quota**: Free = max 1 resume; Pro = max 10 resumes
  - **Body**: `{ title: string, data: ResumeData, template?: string }`
  - **Response (201)**: `{ success: true, data: Resume }`
  - **Errors**: `401` (Unauthorized), `403` (Quota limit exceeded)
- `GET /api/resume/:id`
  - **Auth**: Required (Ownership enforced)
  - **Response (200)**: `{ success: true, data: Resume }`
- `PUT /api/resume/:id`
  - **Auth**: Required (Ownership enforced)
  - **Body**: `{ title?: string, data?: ResumeData, template?: string }`
  - **Response (200)**: `{ success: true, data: Resume }`
- `DELETE /api/resume/:id`
  - **Auth**: Required (Ownership enforced)
  - **Response (200)**: `{ success: true, message: "Resume deleted successfully" }`

### AI Endpoints (Pro Tier Required)
- `POST /api/ai/rewrite`
  - **Body**: `{ bullet: string (<= 1000 chars), jobTitle?: string }`
  - **Response (200)**: `{ success: true, data: { rewritten: string } }`
  - **Errors**: `403` (Pro subscription required)
- `POST /api/ai/tailor`
  - **Body**: `{ resumeData: ResumeData, jobDescription: string (>= 50 chars) }`
  - **Response (200)**: `{ success: true, data: { suggestions: string[] } }`
- `POST /api/ai/linkedin`
  - **Body**: `{ linkedinUrl?: string, linkedinText?: string, existingData?: ResumeData, mode?: 'merge' | 'replace' }`
  - **Protection**: Strict HTTPS hostname validation against `linkedin.com` and `www.linkedin.com` prevents SSRF.
  - **Response (200)**: `{ success: true, data: { resumeData: ResumeData, summary: string, ... } }`

---

## 5. Design System Tokens

The application follows an uncompromising 5-token design system:
```css
:root {
  --ink: #1A1A16;                       /* Primary typography, dark elements */
  --paper: #FDFCF9;                     /* Natural background */
  --surface: #FFFFFF;                   /* Card & input backgrounds */
  --accent: #2F5D3A;                    /* Signature brand forest green */
  --line: rgba(26, 26, 22, 0.12);       /* Subtle hairline borders */
  --muted: rgba(26, 26, 22, 0.55);      /* Secondary typography */
  --faint: rgba(26, 26, 22, 0.08);      /* Hover states & subtle tints */
}
```

---

## 6. Testing & Verification Steps

1. **Verify Database Sync**:
   ```bash
   npx prisma db push
   ```
2. **Type Check**:
   ```bash
   npx tsc --noEmit
   ```
3. **Verify Local Development**:
   ```bash
   npm run dev
   ```
4. **User Registration & Quota Test**:
   - Register a new account at `/register`.
   - Create 1 resume at `/resume/new`.
   - Attempt to create a 2nd resume → verify the 403 quota modal prevents creation.
5. **Watermark & PDF Export Verification**:
   - On the Free plan, open `/resume/[id]/edit`.
   - Observe repeating diagonal `ATSRESUMEBUILDER.COM · FREE` watermarks on the live preview canvas.
   - Click **Download PDF** → open the exported file and verify all watermarks and protection banners are removed.
6. **AI Tier Enforcement**:
   - As a Free user, trigger **AI Rewrite** → verify upgrade modal appears with 403 response.
   - Switch user to Pro via `node scripts/set-pro.js` → verify AI transforms bullet points immediately.

---

## 📄 License

MIT © 2026 ATSResumeBuilder
