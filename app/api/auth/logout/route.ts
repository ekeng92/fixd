import { NextRequest, NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth';

/**
 * POST /api/auth/logout
 * Destroy user session
 */
export async function POST(request: NextRequest) {
  try {
    await destroySession();

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Error in logout route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
