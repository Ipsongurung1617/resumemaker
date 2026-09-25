import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import type { ResumeData, ResumeTemplate } from '@/types/resume';

const FREE_PLAN_LIMIT = 3;

// ── GET /api/resume ──────────────────────────────────────────────────────────
// Returns all resumes owned by the authenticated user.
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resumes = await db.resume.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
    });

    const parsed = resumes.map((r) => ({
      ...r,
      data: JSON.parse(r.data) as ResumeData,
    }));

    return NextResponse.json({ success: true, data: parsed }, { status: 200 });
  } catch (error) {
    console.error('[RESUME GET]', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch resumes' },
      { status: 500 },
    );
  }
}

// ── POST /api/resume ─────────────────────────────────────────────────────────
// Creates a new resume for the authenticated user.
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, data, template } = body as {
      title?: string;
      data?: ResumeData;
      template?: ResumeTemplate;
    };

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Resume title is required' },
        { status: 400 },
      );
    }

    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { error: 'Resume data is required' },
        { status: 400 },
      );
    }

    // Enforce free plan resume limit
    if (session.user.plan === 'free') {
      const count = await db.resume.count({
        where: { userId: session.user.id },
      });
      if (count >= FREE_PLAN_LIMIT) {
        return NextResponse.json(
          {
            error: `Free plan allows a maximum of ${FREE_PLAN_LIMIT} resumes. Upgrade to Pro for unlimited resumes.`,
            limitReached: true,
          },
          { status: 403 },
        );
      }
    }

    const validTemplates: ResumeTemplate[] = ['modern', 'classic', 'minimal'];
    const resolvedTemplate: ResumeTemplate =
      template && validTemplates.includes(template) ? template : 'modern';

    const resume = await db.resume.create({
      data: {
        title: title.trim(),
        data: JSON.stringify(data),
        template: resolvedTemplate,
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      { success: true, data: { ...resume, data } },
      { status: 201 },
    );
  } catch (error) {
    console.error('[RESUME POST]', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create resume' },
      { status: 500 },
    );
  }
}
