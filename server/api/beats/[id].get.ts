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
      },
    });

    if (!beat) {
      throw createError({
        statusCode: 404,
        message: "Beat not found",
      });
    }

    // Format duration to MM:SS
    const minutes = Math.floor(beat.duration / 60);
    const seconds = beat.duration % 60;
    const formattedDuration = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

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
      coverImage: beat.coverImage,
      audioFile: beat.audioFile,
      isPublished: beat.isPublished,
      isExclusiveSold: beat.isExclusiveSold,
    };
  } catch (error) {
    console.error("Error fetching beat:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch beat",
    });
  }
});
