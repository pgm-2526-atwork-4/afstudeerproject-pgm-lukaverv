import jwt from "jsonwebtoken";
import { getToken } from "#auth";

export default defineEventHandler(async (event) => {
  try {
    let userId: string | null = null;

    // Try OAuth session first (GitHub/Google login)
    const token = await getToken({ event });

    if (token?.email) {
      const oauthUser = await prisma.user.findUnique({
        where: { email: token.email as string },
        select: {
          id: true,
        },
      });
      if (oauthUser) {
        userId = oauthUser.id;
      }
    }

    // Fallback to JWT token (manual email/password login)
    if (!userId) {
      const authToken = getCookie(event, "auth_token");
      if (authToken) {
        try {
          const decoded = jwt.verify(
            authToken,
            process.env.JWT_SECRET || "your-secret-key",
          ) as { id: string; email: string };
          userId = decoded.id;
        } catch (error) {
          // Invalid token
        }
      }
    }

    if (!userId) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    // Get user's profile to check role
    const profile = await prisma.profile.findUnique({
      where: { userId: userId },
      select: { id: true, role: true },
    });

    if (!profile) {
      throw createError({
        statusCode: 404,
        message: "Profile not found",
      });
    }

    // Only producers can have track preferences
    if (profile.role !== "PRODUCER") {
      throw createError({
        statusCode: 403,
        message: "Only producers can access track preferences",
      });
    }

    // Get or create track preferences
    let preferences = await prisma.trackPreference.findUnique({
      where: { profileId: profile.id },
    });

    // If no preferences exist, create default ones
    if (!preferences) {
      preferences = await prisma.trackPreference.create({
        data: {
          profileId: profile.id,
          description: "",
          priceBasic: 29.99,
          pricePremium: 49.99,
          priceExclusive: 199.99,
          isPublished: true,
          tags: [],
        },
      });
    }

    return preferences;
  } catch (error: any) {
    console.error("Error fetching track preferences:", error);
    throw error;
  }
});
