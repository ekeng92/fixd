import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

/**
 * GET /api/auth/check
 * Check if user is authenticated and return current user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: session.user,
    });
  } catch (error) {
    console.error('Error in check route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
