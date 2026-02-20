import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { email, password } = body;

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: "Email and password are required",
    });
  }

  // Find the user in the database
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Invalid credentials",
    });
  }

  // Check if the user is verified
  if (!user.isVerified) {
    throw createError({
      statusCode: 403,
      message: "Please verify your email before logging in",
    });
  }

  // Verify the password
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw createError({
      statusCode: 401,
      message: "Invalid credentials",
    });
  }

  // Generate a JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "1h" },
  );

  // Set the token as an httpOnly cookie
  setCookie(event, "auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });

  return {
    message: "Login successful",
    user: {
      id: user.id,
      email: user.email,
    },
  };
});
