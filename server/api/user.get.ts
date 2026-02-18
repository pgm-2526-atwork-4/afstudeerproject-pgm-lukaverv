import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  // Get the token from the Authorization header
  const authHeader = getHeader(event, "authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    // Verify the JWT token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key",
    ) as { id: number; email: string };

    // Fetch user info from the database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        isVerified: true,
      },
    });

    if (!user) {
      throw createError({ statusCode: 404, message: "User not found" });
    }

    return user;
  } catch (error) {
    throw createError({ statusCode: 401, message: "Invalid or expired token" });
  }
});
