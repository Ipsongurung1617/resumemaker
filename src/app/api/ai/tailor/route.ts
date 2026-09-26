import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { tailorResume } from '@/lib/openrouter';
import type { ResumeData } from '@/types/resume';

// ── POST /api/ai/tailor ──────────────────────────────────────────────────────
// Analyzes a resume against a target job description and returns ATS matching insights.
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please sign in to scan Job Match.' },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { resumeData, jobDescription } = body as {
      resumeData?: ResumeData;
      jobDescription?: string;
    };

    if (!resumeData || typeof resumeData !== 'object') {
      return NextResponse.json(
        { success: false, message: 'Resume data is missing or invalid.' },
        { status: 400 },
      );
    }

    if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length < 20) {
      return NextResponse.json(
        { success: false, message: 'Please paste a job description with at least 20 characters.' },
        { status: 400 },
      );
    }

    const analysis = await tailorResume(resumeData, jobDescription.trim());

    return NextResponse.json(
      {
        success: true,
        data: {
          suggestions: analysis.suggestions,
          score: analysis.score,
          matchedKeywords: analysis.matchedKeywords,
          missingKeywords: analysis.missingKeywords,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('[AI TAILOR]', error);
    const message = error instanceof Error ? error.message : 'Job description analysis failed. Please try again.';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
