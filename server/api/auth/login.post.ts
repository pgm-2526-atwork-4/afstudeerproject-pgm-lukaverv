import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { email, password, rememberMe } = body;

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: "Email and password are required",
    });
  }

  // Find the user in the database
  const user = await prisma.user.findUnique({
    where: { email },
    include: { profile: true },
  });

  if (!user || !user.password) {
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

  // Generate a JWT token with appropriate expiration
  const tokenExpiry = rememberMe ? "30d" : "1h";
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: tokenExpiry },
  );

  // Set the token as an httpOnly cookie
  const cookieMaxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60; // 30 days or 1 hour
  setCookie(event, "auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: cookieMaxAge,
  });

  return {
    message: "Login successful",
    user: {
      id: user.id,
      email: user.email,
      hasProfile: !!user.profile, // ensure this is a boolean indicating if the user has a profile or not 
    },
  };
});
