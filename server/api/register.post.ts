import { prisma } from "../utils/db";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "../utils/sendVerificationEmail";

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

    // Use the utility function to send the verification email
    const token = await sendVerificationEmail(user);

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
