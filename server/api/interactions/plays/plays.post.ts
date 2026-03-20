export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { beatId, profileId: clientProfileId } = body;

    if (!beatId) {
      throw createError({
        statusCode: 400,
        message: "Beat ID is required",
      });
    }

    // Try to get profileId from various sources
    let profileId: string | null = null;

    // 1. If client sent profileId (for logged-in users)
    if (clientProfileId) {
      profileId = clientProfileId;
    } else {
      // 2. Try to get from auth token
      const userId = await getAuthUserId(event);

      // Get profile from userId
      if (userId) {
        const profile = await prisma.profile.findUnique({
          where: { userId },
          select: { id: true },
        });
        profileId = profile?.id || null;
      }
    }

    // Cooldown period: 5 minutes (300 seconds)
    const cooldownMinutes = 5;
    const cooldownDate = new Date(Date.now() - cooldownMinutes * 60 * 1000);

    // Check if this user/guest has played this beat recently
    if (profileId) {
      // For logged-in users: check by profileId
      const recentPlay = await prisma.play.findFirst({
        where: {
          beatId,
          profileId,
          createdAt: {
            gte: cooldownDate,
          },
        },
      });

      if (recentPlay) {
        // Return existing play ID instead of error - allows continued duration tracking
        return {
          success: true,
          playId: recentPlay.id,
        };
      }
    }
    // Note: For anonymous users, we don't enforce cooldown since we can't track them
    // This is acceptable as anonymous plays are less valuable than authenticated plays

    // Register the play
    const play = await prisma.play.create({
      data: {
        beatId,
        profileId,
      },
    });

    return {
      success: true,
      playId: play.id,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to register play",
    });
  }
});
