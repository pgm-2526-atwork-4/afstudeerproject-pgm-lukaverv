export default defineEventHandler(async (event) => {
  const profileId = getRouterParam(event, "profileId");

  if (!profileId) {
    throw createError({ statusCode: 400, message: "Profile ID is required" });
  }

  try {
    const likes = await prisma.like.findMany({
      where: { profileId },
      orderBy: { createdAt: "desc" },
      include: {
        beat: {
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
              },
            },
          },
        },
      },
    });

    const filteredBeats = likes
      .filter(
        (like) =>
          like.beat && like.beat.isPublished && !like.beat.isExclusiveSold,
      )
      .map(({ beat }) => beat);

    return { beats: formatBeatsResponse(filteredBeats) };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to fetch liked beats",
    });
  }
});
