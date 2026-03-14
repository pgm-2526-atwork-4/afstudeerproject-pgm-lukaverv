import { formatDuration } from "~~/server/utils/formatters";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");

    if (!id) {
      throw createError({
        statusCode: 400,
        message: "Beat ID is required",
      });
    }

    const beat = await prisma.beat.findUnique({
      where: {
        id: id,
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
          },
        },
      },
    });

    if (!beat) {
      throw createError({
        statusCode: 404,
        message: "Beat not found",
      });
    }

    // Format duration to MM:SS
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
      description: beat.description,
      priceBasic: beat.priceBasic,
      pricePremium: beat.pricePremium,
      priceExclusive: beat.priceExclusive,
      duration: formattedDuration,
      durationSeconds: beat.duration,
      coverImage: beat.coverImage,
      audioUrl: beat.audioFile,
      isPublished: beat.isPublished,
      isExclusiveSold: beat.isExclusiveSold,
      likesCount: beat._count.likes,
      commentsCount: beat._count.comments,
      playsCount: beat._count.plays,
      createdAt: beat.createdAt,
    };
  } catch (error) {
    console.error("Error fetching beat:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch beat",
    });
  }
});
