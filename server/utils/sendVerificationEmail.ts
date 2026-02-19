import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { User } from "~/generated/prisma/client";

export const sendVerificationEmail = async (user: User) => {
  // Generate a verification token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "1d" },
  );

  // Configure the email transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Send the verification email
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Verify Your Email - BeatStack",
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
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
                      <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: bold; color: #ffffff;">Welcome to BeatStack! 🎉</h2>
                      <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #9ca3af;">Thank you for signing up! We're excited to have you on board. To get started, please verify your email address by clicking the button below.</p>
                    </td>
                  </tr>
                  
                  <!-- Button Section -->
                  <tr>
                    <td align="center" style="padding: 0 40px 40px 40px;">
                      <table role="presentation" style="border-collapse: collapse;">
                        <tr>
                          <td style="border-radius: 8px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
                            <a href="http://localhost:3000/api/verify?token=${token}" style="display: inline-block; padding: 14px 32px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px;">Verify Email Address</a>
                          </td>
                        </tr>
                      </table>
                      <p style="margin: 24px 0 0 0; font-size: 14px; color: #6b7280;">Or copy and paste this link into your browser:</p>
                      <p style="margin: 8px 0 0 0; font-size: 13px; color: #3b82f6; word-break: break-all;">http://localhost:3000/api/verify?token=${token}</p>
                    </td>
                  </tr>
                  
                  <!-- Footer Section -->
                  <tr>
                    <td style="padding: 24px 40px; border-top: 1px solid #2d3748;">
                      <p style="margin: 0 0 8px 0; font-size: 13px; color: #6b7280;">This verification link will expire in 24 hours.</p>
                      <p style="margin: 0; font-size: 13px; color: #6b7280;">If you didn't create an account with BeatStack, you can safely ignore this email.</p>
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

  return token; // Return the token in case it's needed
};
