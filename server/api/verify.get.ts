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

    // Redirect to the verify page with success or error status
    return sendRedirect(event, `/auth/verify?status=success`);
  } catch {
    return sendRedirect(event, `/auth/verify?status=error`);
  }
});
