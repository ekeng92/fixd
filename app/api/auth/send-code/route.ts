import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationCode } from '@/lib/twilio';

/**
 * POST /api/auth/send-code
 * Send a verification code to a phone number
 */
export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Validate phone number format (basic check)
    if (!/^\+\d{1,3}\d{4,14}$/.test(phoneNumber)) {
      return NextResponse.json(
        { error: 'Invalid phone number format. Use +1234567890' },
        { status: 400 }
      );
    }

    // Send verification code
    const result = await sendVerificationCode(phoneNumber);

    if (!result.success) {
      console.error('Twilio error:', result.error);
      return NextResponse.json(
        { error: result.error || 'Failed to send verification code' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code sent successfully',
      sid: result.sid,
    });
  } catch (error) {
    console.error('Error in send-code route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
