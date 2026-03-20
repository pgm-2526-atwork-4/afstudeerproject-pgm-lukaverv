export default defineEventHandler(async (event) => {
  try {
    const userId = await requireAuthUserId(event);

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

    // Validate genre if provided
    const validGenres = [
      "Hip-Hop",
      "Trap",
      "R&B",
      "Drill",
      "Pop",
      "Lo-Fi",
      "Boom Bap",
      "Afrobeat",
      "UK Drill",
      "Latin Trap",
    ];
    if (body.genre && !validGenres.includes(body.genre)) {
      throw createError({
        statusCode: 400,
        message: "Invalid genre",
      });
    }

    // Update or create track preferences
    const preferences = await prisma.trackPreference.upsert({
      where: { profileId: profile.id },
      update: {
        description:
          body.description !== undefined ? body.description : undefined,
        genre: body.genre !== undefined ? body.genre : undefined,
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
        genre: body.genre || null,
        priceBasic: body.priceBasic || 29.99,
        pricePremium: body.pricePremium || 49.99,
        priceExclusive: body.priceExclusive || 199.99,
        isPublished: body.isPublished !== undefined ? body.isPublished : true,
        tags: body.tags || [],
      },
    });

    return preferences;
  } catch (error: any) {
    throw error;
  }
});
