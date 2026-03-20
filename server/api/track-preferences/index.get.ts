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
          genre: null,
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
    throw error;
  }
});
