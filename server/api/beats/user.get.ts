export default defineEventHandler(async (event) => {
  try {
    const userId = await requireAuthUserId(event);

    // Get the producer profile for the authenticated user
    const profile = await prisma.profile.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!profile) {
      throw createError({
        statusCode: 404,
        statusMessage: "Profile not found",
      });
    }

    // Fetch all beats created by this producer (including unpublished)
    const beats = await prisma.beat.findMany({
      where: {
        producerId: profile.id,
      },
      include: {
        producer: {
          select: {
            id: true,
            userId: true,
            username: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            plays: true,
            orderItems: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format beats with additional fields for user dashboard
    const formattedBeats = formatBeatsResponse(beats).map((beat, index) => ({
      _id: beat.id,
      ...beat,
      artworkUrl: beat.coverImage,
      audioUrlWav: beats[index]!.audioFileWav,
    }));

    return formattedBeats;
  } catch (error) {
    // If it's already a createError, rethrow it
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch beats",
    });
  }
});
