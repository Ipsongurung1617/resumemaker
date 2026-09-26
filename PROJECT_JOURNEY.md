# 📜 Project Journey & Complete Architecture Context

> **Project:** Resume Now / ATSResumeBuilder  
> **Repository:** [https://github.com/Ipsongurung1617/resumemaker](https://github.com/Ipsongurung1617/resumemaker)  
> **Stack:** Next.js 14 (App Router) • TypeScript • Tailwind CSS • Prisma ORM • Supabase PostgreSQL • NextAuth.js • OpenRouter & NVIDIA AI • jsPDF / html2canvas  
> **Design Philosophy:** Minimalist Editorial Design System (5-Token Strict Palette)

---

## 1. How We Started & Original Goals

### 1.1 The Vision
The objective was to create a modern, high-converting, ATS-friendly resume maker that replaces generic, cluttered AI tools with high-end editorial typography, genuine utility, and structured career formatting.

### 1.2 Core Product Pillars
1. **Two Creation Pathways:**
   - **Guided Step-by-Step Wizard:** A structured 7-step flow (*Header → Experience → Education → Skills → Summary → Additional Details → Finalize*) with live highlight previews and wayfinding cues.
   - **One-Shot Career Description Parser:** Users paste unstructured career history, past job duties, or raw notes; AI automatically structures it into executive resume sections.
2. **AI Optimization Suite:**
   - Action-verb and quantified metric bullet rewriting.
   - Job Description (JD) keyword tailoring and ATS score matching.
3. **Pixel-Perfect Vector PDF Downloads:**
   - Off-screen 300 DPI vector rendering with zero UI artifacts, watermarks, or scaling distortion for Pro users.
4. **Tiered Access (Free vs. Pro):**
   - Free: 3 resumes, 2 standard templates, PDF downloads.
   - Pro ($9/mo): Unlimited documents, Tech Mono engineering template, AI bullet rewriter, JD tailoring, and priority exports.
5. **Admin Access Control:**
   - Specialized `/admin` route restricted exclusively to `ipsongrg221@gmail.com` to inspect user metrics and manage plan tiers.

---

## 2. Chronological Milestones & Evolution

### Milestone 1: Core Foundation & Database Modeling
* Initialized Next.js 14 App Router project with TypeScript and Tailwind CSS.
* Defined standard database schema with Prisma (`User`, `Resume`, `Account`, `Session`, `VerificationToken`).
* Built NextAuth.js credentials provider with bcrypt password hashing and session tokens.

### Milestone 2: AI Engine Integration & API Endpoints
* Configured OpenRouter (`google/gemini-2.0-flash-exp:free`) and NVIDIA AI Vision APIs.
* Built modular API endpoints:
  - `POST /api/auth/register` — User signup & validation.
  - `GET / POST /api/resume` — Resume CRUD operations & plan limit enforcement.
  - `GET / PUT / DELETE /api/resume/[id]` — Single resume operations.
  - `POST /api/ai/rewrite` — Bullet enhancement.
  - `POST /api/ai/describe` — Career text parsing.
  - `POST /api/ai/tailor` — Job description matching.
  - `POST /api/user/plan` — Subscription upgrade handler.
  - `GET / PUT /api/admin/users` — Role and subscription management.

### Milestone 3: PDF Generation & Protection Engine
* Built `src/lib/pdf.ts` using `html2canvas` and `jspdf`.
* Implemented offscreen DOM cloning at 1:1 unscaled dimensions (`794px × 1123px` A4 ISO 216 standard) to ensure printed PDFs are crystal-sharp, removing any interactive focus rings or edit overlays.

### Milestone 4: Complete Senior Product Designer Overhaul
Eliminated generic AI tropes (neon gradients, floaty bubbles, excessive rounded corners) and established an **Editorial Design System**:
* **Color System:**
  - `--ink: #1A1A16` — Primary text, icons, sidebar background.
  - `--paper: #FDFCF9` — App and page backgrounds.
  - `--surface: #FFFFFF` — Cards, input fields, and paper document sheets.
  - `--accent: #2F5D3A` — Deep forest green brand accent (primary buttons, active steps, progress bars, focus rings).
  - `--line: rgba(26, 26, 22, 0.12)` — Subtle hairline borders.
  - `--muted: rgba(26, 26, 22, 0.55)` — Secondary and helper text.
  - `--faint: rgba(26, 26, 22, 0.08)` — Active state tints and highlight fills.
* **Typography Scale:**
  - `Display/H1`: 40px / 700, `-0.02em` tracking
  - `H2`: 28px / 600
  - `H3`: 20px / 600
  - `Body`: 16px / 400
  - `Breadcrumb`: 14px / 600 (`--accent`)
  - `Micro`: 13px / 500 uppercase
  - *Serif font reserved strictly for simulated resume paper.*
* **Unified Across 5 Key Screens:**
  1. Marketing Landing Page (`src/app/page.tsx`)
  2. Sign-Up & Login Pages (`src/app/(auth)/register/page.tsx`, `login/page.tsx`)
  3. Dashboard & Sidebar (`src/app/(dashboard)/dashboard/page.tsx`, `layout.tsx`)
  4. Two-Column Editor with Accordions & Live Preview (`src/app/resume/[id]/edit/page.tsx`)
  5. Multi-Step Guided Wizard (`src/app/wizard/experience/page.tsx`)

### Milestone 5: Database Upgrade to Supabase PostgreSQL
* Upgraded Prisma datasource from local SQLite to **Supabase PostgreSQL**.
* Configured connection pooler (`DATABASE_URL` with transaction pooling on port `6543`) and direct connection (`DIRECT_URL` on port `5432`).
* Generated PostgreSQL Prisma Client (`npx prisma generate`).

### Milestone 6: GitHub Integration & Vercel Deployment Hardening
* Initialized Git repository, staged all source code with clean `.gitignore`.
* Pushed to remote repository: `https://github.com/Ipsongurung1617/resumemaker.git`.
* Added `"postinstall": "prisma generate"` to `package.json` for seamless Vercel builds.
* Implemented built-in fallback secret in `src/lib/auth.ts` to prevent NextAuth `500 [NO_SECRET]` runtime errors.

---

## 3. Directory Structure & File Map

```
resumeMaker/
├── .env.local                    # Local environment secrets (ignored by git)
├── .gitignore                    # Protects node_modules, .env, build files
├── next.config.js                # Next.js optimization and worker thread tuning
├── package.json                  # Scripts & dependencies (Next 14, Prisma, Lucide)
├── postcss.config.js             # PostCSS Tailwind plugins
├── tailwind.config.ts            # Tailwind custom extensions
├── tsconfig.json                 # TypeScript compiler options & @/* aliases
│
├── prisma/
│   └── schema.prisma             # PostgreSQL database entities and relations
│
├── src/
│   ├── types/
│   │   └── resume.ts             # Core interfaces: ResumeData, PersonalInfo, etc.
│   │
│   ├── lib/
│   │   ├── auth.ts               # NextAuth configuration & callbacks
│   │   ├── db.ts                 # Global PrismaClient singleton
│   │   ├── openrouter.ts         # AI prompts & completions client
│   │   ├── pdf.ts                # 300 DPI client-side PDF export engine
│   │   └── utils.ts              # cn(), debounce(), emptyResumeData(), etc.
│   │
│   ├── components/
│   │   ├── providers/
│   │   │   └── SessionWrapper.tsx # Client NextAuth session provider
│   │   │
│   │   ├── resume/
│   │   │   ├── ResumePreview.tsx # Live A4 paper container with zoom & shield
│   │   │   └── templates/
│   │   │       ├── ModernTemplate.tsx   # Modern Corporate template
│   │   │       ├── ClassicTemplate.tsx  # Minimalist Serif template
│   │   │       └── MinimalTemplate.tsx  # Tech Mono template
│   │   │
│   │   └── ui/
│   │       ├── LoadingSpinner.tsx       # Minimalist SVG spinner
│   │       ├── Modal.tsx                # Accessible Radix modal
│   │       ├── PaymentModal.tsx         # Pro upgrade activation modal
│   │       └── ProBadge.tsx             # Pro tier badge
│   │
│   └── app/
│       ├── globals.css           # Design tokens (--ink, --paper, --accent) & base styles
│       ├── layout.tsx            # Root HTML layout with font and metadata
│       ├── not-found.tsx         # Editorial 404 error page
│       ├── page.tsx              # (1) Marketing Landing Page
│       │
│       ├── (auth)/
│       │   ├── login/page.tsx    # Sign-In Screen
│       │   └── register/page.tsx # (2) Sign-Up Screen
│       │
│       ├── (dashboard)/
│       │   ├── layout.tsx        # Dashboard shell with flat --ink sidebar
│       │   ├── dashboard/page.tsx # (3) "My Resumes" document grid
│       │   └── admin/page.tsx    # Admin user management panel
│       │
│       ├── resume/
│       │   ├── new/page.tsx      # Creation format selector (Wizard vs. Description)
│       │   └── [id]/edit/page.tsx # (4) Full 2-Column Accordion Editor & Preview
│       │
│       ├── wizard/
│       │   └── experience/page.tsx # (5) Multi-Step Guided Wizard (Step 2)
│       │
│       ├── pricing/page.tsx      # Pricing tiers and FAQ
│       │
│       └── api/                  # Serverless Route Handlers
│           ├── auth/[...nextauth]/route.ts
│           ├── auth/register/route.ts
│           ├── resume/route.ts
│           ├── resume/[id]/route.ts
│           ├── ai/rewrite/route.ts
│           ├── ai/describe/route.ts
│           ├── ai/tailor/route.ts
│           ├── ai/linkedin/route.ts
│           ├── user/plan/route.ts
│           └── admin/users/route.ts
```

---

## 4. Resume Data Schema Definition

The application uses a unified, structured TypeScript interface ([`src/types/resume.ts`](file:///C:/Users/User/Desktop/resumeMaker/src/types/resume.ts)):

```typescript
export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
  summary: string;
}

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  graduationDate: string;
  gpa?: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: SkillGroup[];
  certifications: Certification[];
  projects: Project[];
}
```

---

## 5. Environment Variables Reference

| Variable | Description | Example / Recommended Value |
| :--- | :--- | :--- |
| `NEXTAUTH_URL` | Canonical app URL for redirects & callbacks | `http://localhost:3000` (Local) / `https://atsresumebuilder.vercel.app` (Vercel) |
| `NEXTAUTH_SECRET` | Secret key for signing JWT cookies | `ATSResumeBuilder-ai-secret-key-change-in-production-2024` |
| `DATABASE_URL` | Supabase transaction pooler connection | `postgresql://postgres.xxx:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true` |
| `DIRECT_URL` | Supabase direct connection for migrations | `postgresql://postgres.xxx:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres` |
| `OPENROUTER_API_KEY` | OpenRouter API Key for AI text generation | `sk-or-v1-your-openrouter-key` |
| `NVIDIA_API_KEY` | NVIDIA Vision/AI model access key | `nvapi-your-nvidia-key` |
| `NVIDIA_MODEL` | Default NVIDIA model name | `meta/llama-3.2-11b-vision-instruct` |

---

## 6. How to Run, Test, and Deploy

### Local Development:
```bash
# 1. Install dependencies
npm install

# 2. Push schema to Supabase (after setting password in .env.local)
npx prisma db push

# 3. Start local development server
npm run dev
```

### Production Build Verification:
```bash
# Typecheck
npx tsc --noEmit

# Production Build
npm run build
```

### Vercel Deployment Steps:
1. Push any updates to GitHub (`git push origin main`).
2. In the Vercel Dashboard, go to **Settings → Environment Variables** and add:
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `OPENROUTER_API_KEY`
   - `NVIDIA_API_KEY`
3. Redeploy or trigger automatic build upon commit.
