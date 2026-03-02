import jwt from "jsonwebtoken";
import { getToken } from "#auth";

export default defineEventHandler(async (event) => {
  // Try OAuth session first (GitHub/Google login)
  const token = await getToken({ event });

  if (token?.email) {
    const oauthUser = await prisma.user.findUnique({
      where: { email: token.email as string },
      select: {
        id: true,
        email: true,
        isVerified: true,
      },
    });
    if (oauthUser) return oauthUser;
  }

  // Fallback to JWT token (manual email/password login)
  const authToken = getCookie(event, "auth_token");
  if (!authToken) return null;

  try {
    const decoded = jwt.verify(
      authToken,
      process.env.JWT_SECRET || "your-secret-key",
    ) as { id: string; email: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        isVerified: true,
      },
    });

    return user;
  } catch (error) {
    return null;
  }
});
