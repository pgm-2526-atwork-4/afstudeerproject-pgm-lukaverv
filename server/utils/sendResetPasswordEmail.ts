import nodemailer from "nodemailer";

export const sendResetPasswordEmail = async (
  email: string,
  resetLink: string,
) => {
  // Configure the email transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Send the reset password email
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Password - BeatStack",
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #0a0e27 0%, #0d1230 50%, #0a0e27 100%); min-height: 100vh;">
          <table role="presentation" style="width: 100%; border-collapse: collapse; min-height: 100vh;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #161b33; border-radius: 16px; border: 1px solid #2d3748; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);">
                  <!-- Logo Section -->
                  <tr>
                    <td align="center" style="padding: 40px 40px 20px 40px;">
                      <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
                        <span style="font-size: 32px;">🎵</span>
                      </div>
                      <h1 style="margin: 20px 0 0 0; font-size: 28px; font-weight: bold; color: #ffffff; letter-spacing: -0.5px;">BeatStack</h1>
                    </td>
                  </tr>
                  
                  <!-- Content Section -->
                  <tr>
                    <td style="padding: 20px 40px;">
                      <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: bold; color: #ffffff;">Reset Your Password 🔒</h2>
                      <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #9ca3af;">We received a request to reset your password. Click the button below to create a new password for your BeatStack account.</p>
                    </td>
                  </tr>
                  
                  <!-- Button Section -->
                  <tr>
                    <td align="center" style="padding: 0 40px 40px 40px;">
                      <table role="presentation" style="border-collapse: collapse;">
                        <tr>
                          <td style="border-radius: 8px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
                            <a href="${resetLink}" style="display: inline-block; padding: 14px 32px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px;">Reset Password</a>
                          </td>
                        </tr>
                      </table>
                      <p style="margin: 24px 0 0 0; font-size: 14px; color: #6b7280;">Or copy and paste this link into your browser:</p>
                      <p style="margin: 8px 0 0 0; font-size: 13px; color: #3b82f6; word-break: break-all;">${resetLink}</p>
                    </td>
                  </tr>
                  
                  <!-- Warning Section -->
                  <tr>
                    <td style="padding: 24px 40px; border-top: 1px solid #2d3748; background-color: rgba(239, 68, 68, 0.1); border-radius: 8px; margin: 0 40px;">
                      <p style="margin: 0 0 8px 0; font-size: 14px; color: #ef4444; font-weight: 600;">⚠️ Security Notice</p>
                      <p style="margin: 0 0 8px 0; font-size: 13px; color: #9ca3af;">This password reset link will expire in 15 minutes for security reasons.</p>
                      <p style="margin: 0; font-size: 13px; color: #9ca3af;">If you didn't request a password reset, please ignore this email or contact support if you have concerns about your account security.</p>
                    </td>
                  </tr>
                  
                  <!-- Branding Footer -->
                  <tr>
                    <td align="center" style="padding: 20px 40px 40px 40px;">
                      <p style="margin: 0; font-size: 12px; color: #4b5563;">&copy; 2026 BeatStack. All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });
};
