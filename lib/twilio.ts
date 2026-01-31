import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

// Initialize Twilio client
const client = twilio(accountSid, authToken);

/**
 * Send a verification code via SMS using Twilio Verify API
 * @param phoneNumber - Phone number in E.164 format (e.g., +14155551234)
 * @returns Promise with verification result
 */
export async function sendVerificationCode(phoneNumber: string): Promise<{
  success: boolean;
  sid?: string;
  error?: string;
}> {
  try {
    if (!verifyServiceSid) {
      throw new Error('TWILIO_VERIFY_SERVICE_SID not configured');
    }

    const verification = await client.verify.v2
      .services(verifyServiceSid)
      .verifications.create({
        to: phoneNumber,
        channel: 'sms',
      });

    return {
      success: true,
      sid: verification.sid,
    };
  } catch (error) {
    console.error('Error sending verification code:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send verification code',
    };
  }
}

/**
 * Verify a code sent to a phone number
 * @param phoneNumber - Phone number in E.164 format
 * @param code - The 6-digit code from SMS
 * @returns Promise with verification status
 */
export async function verifyCode(
  phoneNumber: string,
  code: string
): Promise<{
  success: boolean;
  status?: string;
  error?: string;
}> {
  try {
    if (!verifyServiceSid) {
      throw new Error('TWILIO_VERIFY_SERVICE_SID not configured');
    }

    const verificationCheck = await client.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({
        to: phoneNumber,
        code: code,
      });

    return {
      success: verificationCheck.status === 'approved',
      status: verificationCheck.status,
    };
  } catch (error) {
    console.error('Error verifying code:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify code',
    };
  }
}

/**
 * Send a custom SMS message
 * @param to - Recipient phone number in E.164 format
 * @param message - SMS message content
 * @returns Promise with send result
 */
export async function sendSMS(
  to: string,
  message: string
): Promise<{
  success: boolean;
  sid?: string;
  error?: string;
}> {
  try {
    if (!twilioPhoneNumber) {
      throw new Error('TWILIO_PHONE_NUMBER not configured');
    }

    const sms = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: to,
    });

    return {
      success: true,
      sid: sms.sid,
    };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send SMS',
    };
  }
}

/**
 * Send SMS to multiple recipients
 * @param recipients - Array of phone numbers
 * @param message - SMS message content
 * @returns Promise with results for each recipient
 */
export async function sendSMSBatch(
  recipients: string[],
  message: string
): Promise<{
  success: boolean;
  results: {
    to: string;
    success: boolean;
    sid?: string;
    error?: string;
  }[];
  error?: string;
}> {
  try {
    const results = await Promise.all(
      recipients.map(async (to) => {
        const result = await sendSMS(to, message);
        return {
          to,
          success: result.success,
          sid: result.sid,
          error: result.error,
        };
      })
    );

    return {
      success: results.every((r) => r.success),
      results,
    };
  } catch (error) {
    console.error('Error sending SMS batch:', error);
    return {
      success: false,
      results: [],
      error: error instanceof Error ? error.message : 'Failed to send SMS batch',
    };
  }
}
