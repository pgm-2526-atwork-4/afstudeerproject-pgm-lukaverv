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
    subject: "Verify Your Email",
    html: `
      <h1>Welcome to BeatStack!</h1>
      <p>Please verify your email by clicking the link below:</p>
      <a href="http://localhost:3000/api/verify?token=${token}">Verify Email</a>
    `,
  });

  return token; // Return the token in case it's needed
};
