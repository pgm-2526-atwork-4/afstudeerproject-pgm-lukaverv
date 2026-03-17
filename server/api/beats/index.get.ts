import { formatDuration } from "~~/server/utils/formatters";

export default defineEventHandler(async (event) => {
  try {
    const beats = await prisma.beat.findMany({
      where: {
        isPublished: true,
        isExclusiveSold: false,
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
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format beats for frontend (convert duration to MM:SS format)
    const formattedBeats = beats.map((beat) => {
      const formattedDuration = formatDuration(beat.duration);

      return {
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
        duration: formattedDuration,
        durationSeconds: beat.duration,
        coverImage: beat.coverImage,
        audioUrl: beat.audioFileMp3,
        likesCount: beat._count.likes,
        commentsCount: beat._count.comments,
      };
    });

    return formattedBeats;
  } catch (error) {
    console.error("Error fetching beats:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch beats",
    });
  }
});
