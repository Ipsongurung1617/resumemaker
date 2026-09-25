import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { tailorResume } from '@/lib/openrouter';
import type { ResumeData } from '@/types/resume';

// ── POST /api/ai/tailor ──────────────────────────────────────────────────────
// Analyses a resume against a job description and returns improvement suggestions.
// Requires Pro plan.
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.plan !== 'pro') {
      return NextResponse.json(
        {
          error: 'AI tailoring requires a Pro plan. Upgrade to get personalised JD matching.',
          upgradeRequired: true,
        },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { resumeData, jobDescription } = body as {
      resumeData?: ResumeData;
      jobDescription?: string;
    };

    if (!resumeData || typeof resumeData !== 'object') {
      return NextResponse.json(
        { error: 'Resume data is required' },
        { status: 400 },
      );
    }

    if (
      !jobDescription ||
      typeof jobDescription !== 'string' ||
      jobDescription.trim().length < 50
    ) {
      return NextResponse.json(
        { error: 'Job description must be at least 50 characters' },
        { status: 400 },
      );
    }

    const suggestions = await tailorResume(resumeData, jobDescription.trim());

    return NextResponse.json({ success: true, data: { suggestions } }, { status: 200 });
  } catch (error) {
    console.error('[AI TAILOR]', error);
    return NextResponse.json({ success: false, message: 'AI tailoring failed. Please try again.' }, { status: 500 });
  }
}
