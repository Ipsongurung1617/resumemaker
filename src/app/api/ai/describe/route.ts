import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { parseUserDescription } from '@/lib/openrouter';

// ── POST /api/ai/describe ───────────────────────────────────────────────────
// Converts raw user description / notes into structured resume sections.
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { description, targetRole } = body as {
      description?: string;
      targetRole?: string;
    };

    if (!description || typeof description !== 'string' || description.trim().length < 15) {
      return NextResponse.json(
        { success: false, message: 'Please provide at least a brief career description or background notes.' },
        { status: 400 },
      );
    }

    const structuredData = await parseUserDescription(description.trim(), (targetRole || '').trim());

    return NextResponse.json({ success: true, data: { resumeData: structuredData } }, { status: 200 });
  } catch (error) {
    console.error('[AI DESCRIBE]', error);
    return NextResponse.json({ success: false, message: 'Failed to process career description.' }, { status: 500 });
  }
}
