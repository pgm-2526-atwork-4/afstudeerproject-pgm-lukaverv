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

    // Only producers can update track preferences
    if (profile.role !== "PRODUCER") {
      throw createError({
        statusCode: 403,
        message: "Only producers can update track preferences",
      });
    }

    // Get request body
    const body = await readBody(event);

    // Validate prices if provided
    if (body.priceBasic !== undefined && body.priceBasic < 0) {
      throw createError({
        statusCode: 400,
        message: "Basic price must be a positive number",
      });
    }
    if (body.pricePremium !== undefined && body.pricePremium < 0) {
      throw createError({
        statusCode: 400,
        message: "Premium price must be a positive number",
      });
    }
    if (body.priceExclusive !== undefined && body.priceExclusive < 0) {
      throw createError({
        statusCode: 400,
        message: "Exclusive price must be a positive number",
      });
    }

    // Validate tags if provided
    if (body.tags && !Array.isArray(body.tags)) {
      throw createError({
        statusCode: 400,
        message: "Tags must be an array",
      });
    }

    // Update or create track preferences
    const preferences = await prisma.trackPreference.upsert({
      where: { profileId: profile.id },
      update: {
        description:
          body.description !== undefined ? body.description : undefined,
        priceBasic: body.priceBasic !== undefined ? body.priceBasic : undefined,
        pricePremium:
          body.pricePremium !== undefined ? body.pricePremium : undefined,
        priceExclusive:
          body.priceExclusive !== undefined ? body.priceExclusive : undefined,
        isPublished:
          body.isPublished !== undefined ? body.isPublished : undefined,
        tags: body.tags !== undefined ? body.tags : undefined,
      },
      create: {
        profileId: profile.id,
        description: body.description || "",
        priceBasic: body.priceBasic || 29.99,
        pricePremium: body.pricePremium || 49.99,
        priceExclusive: body.priceExclusive || 199.99,
        isPublished: body.isPublished !== undefined ? body.isPublished : true,
        tags: body.tags || [],
      },
    });

    return preferences;
  } catch (error: any) {
    console.error("Error updating track preferences:", error);
    throw error;
  }
});
