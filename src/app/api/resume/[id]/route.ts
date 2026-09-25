import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import type { ResumeData, ResumeTemplate } from '@/types/resume';

type RouteParams = { params: { id: string } };

// ── Helper: fetch and verify ownership ──────────────────────────────────────
async function getOwnedResume(id: string, userId: string) {
  const resume = await db.resume.findUnique({ where: { id } });
  if (!resume) return { resume: null, error: 'Resume not found', status: 404 };
  if (resume.userId !== userId)
    return { resume: null, error: 'Forbidden', status: 403 };
  return { resume, error: null, status: 200 };
}

// ── GET /api/resume/[id] ─────────────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { resume, error, status } = await getOwnedResume(
      params.id,
      session.user.id,
    );
    if (!resume) return NextResponse.json({ success: false, message: error }, { status });

    return NextResponse.json(
      { success: true, data: { ...resume, data: JSON.parse(resume.data) as ResumeData } },
      { status: 200 },
    );
  } catch (error) {
    console.error('[RESUME GET BY ID]', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch resume' }, { status: 500 });
  }
}

// ── PUT /api/resume/[id] ─────────────────────────────────────────────────────
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const { resume, error, status } = await getOwnedResume(
      params.id,
      session.user.id,
    );
    if (!resume) return NextResponse.json({ success: false, message: error }, { status });

    const body = await req.json();
    const { title, data, template } = body as {
      title?: string;
      data?: ResumeData;
      template?: ResumeTemplate;
    };

    const validTemplates: ResumeTemplate[] = ['modern', 'classic', 'minimal'];

    const updated = await db.resume.update({
      where: { id: params.id },
      data: {
        ...(title && { title: title.trim() }),
        ...(data && { data: JSON.stringify(data) }),
        ...(template && validTemplates.includes(template) && { template }),
      },
    });

    return NextResponse.json(
      { success: true, data: { ...updated, data: JSON.parse(updated.data) as ResumeData } },
      { status: 200 },
    );
  } catch (error) {
    console.error('[RESUME PUT]', error);
    return NextResponse.json({ success: false, message: 'Failed to update resume' }, { status: 500 });
  }
}

// ── DELETE /api/resume/[id] ──────────────────────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { resume, error, status } = await getOwnedResume(
      params.id,
      session.user.id,
    );
    if (!resume) return NextResponse.json({ error }, { status });

    await db.resume.delete({ where: { id: params.id } });

    return NextResponse.json(
      { success: true, message: 'Resume deleted successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('[RESUME DELETE]', error);
    return NextResponse.json({ error: 'Failed to delete resume' }, { status: 500 });
  }
}
