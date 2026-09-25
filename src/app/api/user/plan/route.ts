import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// ── POST /api/user/plan ──────────────────────────────────────────────────────
// Updates the authenticated user's plan and registers chosen payment method option.
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { plan, paymentMethod, billingCycle } = body as {
      plan?: string;
      paymentMethod?: string;
      billingCycle?: string;
    };

    const validPlans = ['free', 'pro'];

    if (!plan || !validPlans.includes(plan)) {
      return NextResponse.json(
        { success: false, message: `Invalid plan. Must be one of: ${validPlans.join(', ')}` },
        { status: 400 },
      );
    }

    await db.user.update({
      where: { id: session.user.id },
      data: { plan },
    });

    console.log(`[USER PLAN] User ${session.user.id} upgraded to ${plan} via ${paymentMethod || 'standard'} (${billingCycle || 'monthly'})`);

    return NextResponse.json(
      {
        success: true,
        message: `Successfully updated to ${plan.toUpperCase()} plan via ${paymentMethod || 'selected payment method'}!`,
        plan,
        paymentMethod,
        billingCycle,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('[USER PLAN]', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update plan. Please try again.' },
      { status: 500 },
    );
  }
}
