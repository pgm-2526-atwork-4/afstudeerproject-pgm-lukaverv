import { prisma } from "../utils/db";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  // Extract the token from the query parameters
  const token = getQuery(event).token as string;

  if (!token) {
    throw createError({
      statusCode: 400,
      message: "Token is required",
    });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key",
    ) as { id: number };

    // Update the user's isVerified field
    await prisma.user.update({
      where: { id: decoded.id },
      data: { isVerified: true },
    });

    // Redirect the user to the Discover page after successful verification
    return sendRedirect(event, "/discover");
  } catch {
    throw createError({
      statusCode: 400,
      message: "Invalid or expired token",
    });
  }
});
