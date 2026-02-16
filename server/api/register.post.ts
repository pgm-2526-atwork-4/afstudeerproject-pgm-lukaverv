import { prisma } from "../utils/db";
import bcrypt from "bcrypt"; // Use import instead of require

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { email, password } = body;

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
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return {
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
      },
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "An error occurred while registering the user",
    });
  }
});
