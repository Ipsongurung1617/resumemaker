import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { rewriteBullet } from '@/lib/openrouter';

// ── POST /api/ai/rewrite ─────────────────────────────────────────────────────
// Rewrites a single resume bullet point using AI.
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
          error: 'AI features require a Pro plan. Upgrade to unlock unlimited AI rewrites.',
          upgradeRequired: true,
        },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { bullet, jobTitle } = body as {
      bullet?: string;
      jobTitle?: string;
    };

    if (!bullet || typeof bullet !== 'string' || bullet.trim().length === 0) {
      return NextResponse.json({ success: false, message: 'Bullet point text is required' }, { status: 400 });
    }

    if (bullet.trim().length > 1000) {
      return NextResponse.json({ success: false, message: 'Bullet point text exceeds 1,000 characters limit' }, { status: 400 });
    }

    const rewritten = await rewriteBullet(bullet.trim(), (jobTitle || '').trim());

    return NextResponse.json({ success: true, data: { rewritten } }, { status: 200 });
  } catch (error) {
    console.error('[AI REWRITE]', error);
    return NextResponse.json({ success: false, message: 'AI rewrite failed. Please try again.' }, { status: 500 });
  }
}
