import { NextRequest, NextResponse } from 'next/server';
import { verifyCode } from '@/lib/twilio';
import { getUserByPhone, createUser } from '@/actions/userActions';
import { setSession } from '@/lib/auth';

/**
 * POST /api/auth/verify-code
 * Verify a code and create/retrieve user session
 */
export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, code } = await request.json();

    if (!phoneNumber || !code) {
      return NextResponse.json(
        { error: 'Phone number and code are required' },
        { status: 400 }
      );
    }

    // Verify the code with Twilio
    const result = await verifyCode(phoneNumber, code);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 401 }
      );
    }

    // Check if user exists
    let user = await getUserByPhone(phoneNumber);

    if (!user) {
      // User doesn't exist - this is first login
      // Return response indicating user needs to register
      return NextResponse.json({
        success: true,
        isNewUser: true,
        phoneNumber: phoneNumber,
        message: 'Code verified. Please complete registration.',
      });
    }

    // User exists - set session
    await setSession(user as any);

    return NextResponse.json({
      success: true,
      isNewUser: false,
      user: {
        uid: user.id,
        name: user.name,
        role: user.role,
        phoneNumber: user.phoneNumber,
        isVerified: user.isVerified,
      },
      message: 'Logged in successfully',
    });
  } catch (error) {
    console.error('Error in verify-code route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
