import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtpEmail(
  email: string,
  otp: string,
  type: 'email-verification' | 'forget-password'
) {
  const isVerification = type === 'email-verification';
  const subject = isVerification
    ? 'Verify your email address'
    : 'Reset your password';
  const title = isVerification ? 'Email Verification' : 'Password Reset';
  const purposeText = isVerification
    ? 'to verify your email address'
    : 'to reset your password';

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@montra.com',
      to: email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">${title}</h2>
          <p style="font-size: 16px; color: #666; text-align: center;">
            Your verification code ${purposeText} is:
          </p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 30px 0; border-radius: 8px;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #333;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #999; text-align: center;">
            This code will expire in 1 minute.
          </p>
          <p style="font-size: 14px; color: #999; text-align: center;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Failed to send OTP email:', error);
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    throw error;
  }
}
