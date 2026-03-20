export default defineEventHandler(async (event) => {
  try {
    const period = (getQuery(event).period as Period) || "week";

    // Auth
    const userId = await requireAuthUserId(event);
    const profileId = await getProfileIdFromUserId(userId);

    const { startDate, buckets, labels, getKey } = buildChartConfig(period);

    // Fetch all four metrics in parallel
    const [plays, likes, comments, follows, sales] = await Promise.all([
      prisma.play.findMany({
        where: {
          beat: { producerId: profileId },
          createdAt: { gte: startDate },
        },
        select: { createdAt: true },
      }),
      prisma.like.findMany({
        where: {
          beat: { producerId: profileId },
          createdAt: { gte: startDate },
        },
        select: { createdAt: true },
      }),
      prisma.comment.findMany({
        where: {
          beat: { producerId: profileId },
          createdAt: { gte: startDate },
        },
        select: { createdAt: true },
      }),
      prisma.follow.findMany({
        where: { followingProfileId: profileId, createdAt: { gte: startDate } },
        select: { createdAt: true },
      }),
      prisma.orderItem.findMany({
        where: {
          beat: { producerId: profileId },
          order: { status: "COMPLETED" },
          createdAt: { gte: startDate },
        },
        select: { createdAt: true },
      }),
    ]);

    return {
      labels,
      plays: toCounts(
        plays.map((p) => p.createdAt),
        buckets,
        getKey,
      ),
      likes: toCounts(
        likes.map((l) => l.createdAt),
        buckets,
        getKey,
      ),
      comments: toCounts(
        comments.map((c) => c.createdAt),
        buckets,
        getKey,
      ),
      follows: toCounts(
        follows.map((f) => f.createdAt),
        buckets,
        getKey,
      ),
      sales: toCounts(
        sales.map((s) => s.createdAt),
        buckets,
        getKey,
      ),
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to fetch chart data",
    });
  }
});
