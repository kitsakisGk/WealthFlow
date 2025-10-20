import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, verificationToken: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${verificationToken}`;

  try {
    const result = await resend.emails.send({
      from: 'WealthFlow <onboarding@resend.dev>',
      to: email,
      subject: 'Verify your WealthFlow account',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .container {
                background: #ffffff;
                border-radius: 8px;
                padding: 40px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .logo {
                text-align: center;
                margin-bottom: 30px;
              }
              .logo h1 {
                color: #059669;
                margin: 0;
                font-size: 32px;
              }
              .button {
                display: inline-block;
                background: #059669;
                color: #ffffff !important;
                padding: 14px 32px;
                text-decoration: none;
                border-radius: 6px;
                margin: 20px 0;
                font-weight: 600;
              }
              .footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                color: #6b7280;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="logo">
                <h1>💰 WealthFlow</h1>
              </div>

              <h2 style="color: #111827; margin-bottom: 16px;">Welcome to WealthFlow!</h2>

              <p>Thank you for signing up. Please verify your email address to get started with managing your finances.</p>

              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </div>

              <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                If you didn't create an account with WealthFlow, you can safely ignore this email.
              </p>

              <p style="color: #6b7280; font-size: 14px;">
                Or copy and paste this link into your browser:<br>
                <a href="${verificationUrl}" style="color: #059669; word-break: break-all;">${verificationUrl}</a>
              </p>

              <div class="footer">
                <p>© 2025 WealthFlow. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log('✅ Verification email sent successfully to:', email);
    console.log('Email ID:', result.data?.id);
    return { success: true, data: result.data };
  } catch (error) {
    console.error('❌ Failed to send verification email:', error);
    return { success: false, error };
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;

  try {
    await resend.emails.send({
      from: 'WealthFlow <onboarding@resend.dev>',
      to: email,
      subject: 'Reset your WealthFlow password',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .container {
                background: #ffffff;
                border-radius: 8px;
                padding: 40px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .logo {
                text-align: center;
                margin-bottom: 30px;
              }
              .logo h1 {
                color: #059669;
                margin: 0;
                font-size: 32px;
              }
              .button {
                display: inline-block;
                background: #059669;
                color: #ffffff !important;
                padding: 14px 32px;
                text-decoration: none;
                border-radius: 6px;
                margin: 20px 0;
                font-weight: 600;
              }
              .warning {
                background: #fef3c7;
                border-left: 4px solid #f59e0b;
                padding: 12px 16px;
                margin: 20px 0;
                border-radius: 4px;
              }
              .footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                color: #6b7280;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="logo">
                <h1>💰 WealthFlow</h1>
              </div>

              <h2 style="color: #111827; margin-bottom: 16px;">Reset Your Password</h2>

              <p>We received a request to reset your password. Click the button below to create a new password:</p>

              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>

              <div class="warning">
                <strong>⚠️ Security Notice:</strong> This link will expire in 1 hour for security reasons.
              </div>

              <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>

              <p style="color: #6b7280; font-size: 14px;">
                Or copy and paste this link into your browser:<br>
                <a href="${resetUrl}" style="color: #059669; word-break: break-all;">${resetUrl}</a>
              </p>

              <div class="footer">
                <p>© 2025 WealthFlow. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log('✅ Password reset email sent successfully to:', email);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error);
    return { success: false, error };
  }
}
