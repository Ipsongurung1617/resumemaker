import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

const ADMIN_EMAIL = 'ipsongrg221@gmail.com';

async function checkAdminAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    return false;
  }
  return true;
}

// ── GET /api/admin/users ─────────────────────────────────────────────────────
export async function GET() {
  try {
    const isAuthorized = await checkAdminAuth();
    if (!isAuthorized) {
      return NextResponse.json({ success: false, message: 'Access denied: Admin only.' }, { status: 403 });
    }

    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
        createdAt: true,
        _count: {
          select: { resumes: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = users.map(u => ({
      id: u.id,
      name: u.name || 'Anonymous',
      email: u.email,
      plan: u.plan,
      createdAt: u.createdAt,
      resumesCount: u._count.resumes,
    }));

    return NextResponse.json({ success: true, data: { users: formatted } }, { status: 200 });
  } catch (error) {
    console.error('[ADMIN USERS GET]', error);
    return NextResponse.json({ success: false, message: 'Failed to retrieve users' }, { status: 500 });
  }
}

// ── PATCH /api/admin/users ───────────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const isAuthorized = await checkAdminAuth();
    if (!isAuthorized) {
      return NextResponse.json({ success: false, message: 'Access denied: Admin only.' }, { status: 403 });
    }

    const body = await req.json();
    const { userId, plan } = body as { userId?: string; plan?: string };

    if (!userId || !plan || !['free', 'pro'].includes(plan)) {
      return NextResponse.json({ success: false, message: 'Invalid userId or plan' }, { status: 400 });
    }

    const updated = await db.user.update({
      where: { id: userId },
      data: { plan },
      select: { id: true, email: true, plan: true },
    });

    return NextResponse.json({ success: true, data: { user: updated } }, { status: 200 });
  } catch (error) {
    console.error('[ADMIN USERS PATCH]', error);
    return NextResponse.json({ success: false, message: 'Failed to update user plan' }, { status: 500 });
  }
}

// ── DELETE /api/admin/users ──────────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const isAuthorized = await checkAdminAuth();
    if (!isAuthorized) {
      return NextResponse.json({ success: false, message: 'Access denied: Admin only.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Missing userId parameter' }, { status: 400 });
    }

    const targetUser = await db.user.findUnique({ where: { id: userId } });
    if (!targetUser) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    if (targetUser.email === ADMIN_EMAIL) {
      return NextResponse.json({ success: false, message: 'The primary admin account cannot be deleted.' }, { status: 400 });
    }

    await db.user.delete({ where: { id: userId } });

    return NextResponse.json({ success: true, message: 'User deleted' }, { status: 200 });
  } catch (error) {
    console.error('[ADMIN USERS DELETE]', error);
    return NextResponse.json({ success: false, message: 'Failed to delete user' }, { status: 500 });
  }
}
