import { prisma } from "../utils/db";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { email, password } = body;

  // Validate input
  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: "Email and password are required",
    });
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    throw createError({
      statusCode: 409,
      message: "User already exists",
    });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Create the user in the database
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

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
      to: email,
      subject: "Verify Your Email",
      html: `
        <h1>Welcome to BeatStack!</h1>
        <p>Please verify your email by clicking the link below:</p>
        <a href="http://localhost:3000/auth/verify?token=${token}">Verify Email</a>
      `,
    });

    return {
      message:
        "User registered successfully. Please verify your email before logging in.",
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "An error occurred while registering the user",
    });
  }
});
