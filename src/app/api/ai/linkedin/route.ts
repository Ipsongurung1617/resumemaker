import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { parseLinkedIn, fetchLinkedInProfile } from '@/lib/openrouter';
import type { ResumeData } from '@/types/resume';

// ── POST /api/ai/linkedin ────────────────────────────────────────────────────
// Automatically pulls information from LinkedIn (via URL or profile text)
// and structures it into complete ResumeData.
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    // Allow logged-in users to pull from LinkedIn for resume creation;
    // PDF exports and watermarks remain gated by the Pro plan.

    const body = await req.json();
    const { linkedinUrl, linkedinText, existingData, mode = 'replace' } = body as {
      linkedinUrl?: string;
      linkedinText?: string;
      existingData?: ResumeData;
      mode?: 'merge' | 'replace';
    };

    let textToParse = (linkedinText || '').trim();

    // 1. If a LinkedIn URL or username is provided, automatically pull from LinkedIn
    const urlCandidate = (linkedinUrl || '').trim() || (textToParse.includes('linkedin.com/in/') ? textToParse : '');

    if (urlCandidate && (urlCandidate.includes('linkedin.com') || !urlCandidate.includes(' '))) {
      try {
        console.log(`[AI LINKEDIN] Automatically pulling profile from: ${urlCandidate}`);
        const pulledData = await fetchLinkedInProfile(urlCandidate);
        textToParse = `${pulledData}\n\n${textToParse}`;
      } catch (fetchErr: any) {
        console.warn(`[AI LINKEDIN] Automatic URL pull warning: ${fetchErr?.message}`);
        // If no additional text was provided, throw friendly error
        if (textToParse.length < 50) {
          return NextResponse.json(
            {
              success: false,
              message:
                'Unable to automatically pull public profile (it may be set to private). Please copy your profile text or PDF export text and paste it below.',
            },
            { status: 400 },
          );
        }
      }
    }

    if (!textToParse || textToParse.length < 40) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please provide your LinkedIn profile URL or paste your profile text.',
        },
        { status: 400 },
      );
    }

    const result = await parseLinkedIn(textToParse, existingData, mode);

    return NextResponse.json({
      success: true,
      data: {
        resumeData: result.parsedData,
        summary: result.analysisSummary,
        skillsCount: result.extractedSkillsCount,
        rolesCount: result.extractedRolesCount,
      },
    }, { status: 200 });
  } catch (error) {
    console.error('[AI LINKEDIN]', error);
    const message = error instanceof Error ? error.message : 'LinkedIn analysis failed. Please try again.';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
