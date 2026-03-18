import { formatDuration } from "~~/server/utils/formatters";

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

    const beats = likes
      .filter(
        (like) =>
          like.beat && like.beat.isPublished && !like.beat.isExclusiveSold,
      )
      .map(({ beat }) => ({
        id: beat.id,
        title: beat.title,
        producer: beat.producer.username,
        producerId: beat.producer.id,
        producerUserId: beat.producer.userId,
        bpm: beat.bpm,
        key: beat.key,
        genre: beat.genre,
        tags: beat.tags,
        price: beat.priceBasic,
        priceBasic: beat.priceBasic,
        pricePremium: beat.pricePremium,
        priceExclusive: beat.priceExclusive,
        duration: formatDuration(beat.duration),
        durationSeconds: beat.duration,
        coverImage: beat.coverImage,
        audioUrl: beat.audioFileMp3,
        likesCount: beat._count.likes,
        commentsCount: beat._count.comments,
      }));

    return { beats };
  } catch (error) {
    console.error("Error fetching liked beats:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch liked beats",
    });
  }
});
