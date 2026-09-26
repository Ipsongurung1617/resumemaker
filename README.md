# ATSResumeBuilder — AI-Powered Resume Builder

> Build ATS-friendly, professional resumes in minutes with the power of AI. The best free resume maker online with AI suggestions, LinkedIn import, and one-click PDF export.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)](https://www.prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css)](https://tailwindcss.com)

---

## ✨ Features

### Free Plan
- 📝 Create up to **3 resumes**
- 🎨 Choose from **3 professional templates** (Modern, Classic, Minimal)
- 📄 **PDF export** with one click
- 💾 Auto-save and resume management dashboard
- 🔐 Secure authentication with email & password

### Pro Plan ($9.99/month)
- ♾️ **Unlimited resumes**
- 🤖 **AI Bullet Rewriter** — Turn weak bullets into impactful, quantified achievements
- 🎯 **AI Job Tailoring** — Paste any JD and get 5 specific improvement suggestions
- 🔗 **LinkedIn Import** — Paste your LinkedIn profile text and auto-populate all fields
- 🚀 Priority support

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| Database | SQLite via Prisma ORM |
| Auth | NextAuth.js v4 (Credentials Provider) |
| AI | OpenRouter API (Google Gemini 2.0 Flash) |
| PDF Export | jsPDF + html2canvas |
| UI Primitives | Radix UI |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm

### 1. Clone the repository
```bash
git clone https://github.com/your-username/ATSResumeBuilder-ai.git
cd ATSResumeBuilder-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env.local
```
Then edit `.env.local` with your values (see [Environment Variables](#-environment-variables)).

### 4. Set up the database
```bash
npm run db:push
```
This creates the SQLite database at `prisma/dev.db` and runs all migrations.

### 5. Start the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXTAUTH_URL` | Full URL of your app (e.g. `http://localhost:3000`) | ✅ |
| `NEXTAUTH_SECRET` | Random secret for JWT signing. Generate with `openssl rand -base64 32` | ✅ |
| `OPENROUTER_API_KEY` | Your OpenRouter API key from [openrouter.ai](https://openrouter.ai) | ✅ |
| `DATABASE_URL` | Path to SQLite file, e.g. `file:./prisma/dev.db` | ✅ |

---

## 📁 Project Structure

```
resumeMaker/
├── prisma/
│   └── schema.prisma        # Database schema (User, Resume, Session, Account)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/route.ts   # NextAuth handler
│   │   │   │   └── register/route.ts        # User registration
│   │   │   ├── resume/
│   │   │   │   ├── route.ts                 # GET all / POST create
│   │   │   │   └── [id]/route.ts            # GET / PUT / DELETE by ID
│   │   │   ├── ai/
│   │   │   │   ├── rewrite/route.ts         # AI bullet rewriter
│   │   │   │   ├── tailor/route.ts          # AI JD tailoring
│   │   │   │   └── linkedin/route.ts        # LinkedIn profile import
│   │   │   └── user/
│   │   │       └── plan/route.ts            # Plan upgrade (simulated)
│   │   ├── auth/
│   │   │   ├── login/page.tsx               # Login page
│   │   │   └── register/page.tsx            # Registration page
│   │   ├── dashboard/page.tsx               # Resume dashboard
│   │   ├── editor/[id]/page.tsx             # Resume editor
│   │   ├── layout.tsx                       # Root layout
│   │   └── page.tsx                         # Landing page
│   ├── components/                          # Reusable React components
│   ├── lib/
│   │   ├── auth.ts                          # NextAuth configuration
│   │   ├── db.ts                            # Prisma singleton
│   │   └── openrouter.ts                    # OpenRouter AI client
│   └── types/
│       └── resume.ts                        # TypeScript interfaces
├── .env.example
├── .env.local
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🌐 API Routes

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Create new account | ❌ |
| `POST` | `/api/auth/[...nextauth]` | NextAuth sign-in | ❌ |
| `GET` | `/api/auth/[...nextauth]` | NextAuth session | ❌ |

### Resumes
| Method | Endpoint | Description | Plan |
|--------|----------|-------------|------|
| `GET` | `/api/resume` | List all user resumes | Free |
| `POST` | `/api/resume` | Create new resume (max 3 on free) | Free |
| `GET` | `/api/resume/:id` | Get single resume | Free |
| `PUT` | `/api/resume/:id` | Update resume | Free |
| `DELETE` | `/api/resume/:id` | Delete resume | Free |

### AI Features (Pro only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/ai/rewrite` | Rewrite a single bullet point |
| `POST` | `/api/ai/tailor` | Get 5 JD-tailored improvement suggestions |
| `POST` | `/api/ai/linkedin` | Parse LinkedIn text → ResumeData |

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/user/plan` | Upgrade plan (simulated) |

---

## 🧪 Example API Usage

### Register a new user
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"securepass"}'
```

### AI Bullet Rewrite (Pro)
```bash
curl -X POST http://localhost:3000/api/ai/rewrite \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{"bullet":"Helped improve sales","jobTitle":"Senior Sales Manager"}'
```

### Upgrade to Pro (simulated)
```bash
curl -X POST http://localhost:3000/api/user/plan \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{"plan":"pro"}'
```

---

## 🚢 Deploy on Vercel

1. Push your code to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add all environment variables in Vercel dashboard:
   - `NEXTAUTH_URL` → your production URL (e.g. `https://ATSResumeBuilder.ai`)
   - `NEXTAUTH_SECRET` → generate with `openssl rand -base64 32`
   - `OPENROUTER_API_KEY` → your OpenRouter key
   - `DATABASE_URL` → for production, switch to PostgreSQL (update `schema.prisma` provider)
4. Click **Deploy**

> **Note:** SQLite is not suitable for Vercel's serverless environment. For production, migrate to **PostgreSQL** (e.g. Neon, Supabase) by changing `provider = "postgresql"` in `prisma/schema.prisma` and updating the `DATABASE_URL`.

---

## 🔒 Security Notes

- Passwords are hashed with **bcrypt** (10 salt rounds)
- All resume endpoints verify ownership before read/write/delete
- AI endpoints are gated behind plan checks server-side
- `.env.local` is git-ignored — never commit secrets
- Replace the default `NEXTAUTH_SECRET` before deploying

---

## 📈 Pricing Plans

| Feature | Free | Pro |
|---------|------|-----|
| Resumes | 3 | Unlimited |
| Templates | 3 | 3 |
| PDF Export | ✅ | ✅ |
| AI Bullet Rewriter | ❌ | ✅ |
| AI Job Tailoring | ❌ | ✅ |
| LinkedIn Import | ❌ | ✅ |
| Price | Free | $9.99/mo |

---

## 🏷️ Keywords

free resume maker online · online resume maker free · AI resume builder · ATS-friendly resume · resume generator · CV maker · resume builder with AI · professional resume template · job application resume · LinkedIn to resume converter

---

## 📄 License

MIT © 2024 ATSResumeBuilder
