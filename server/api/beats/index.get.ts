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
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format beats for frontend (convert duration to MM:SS format)
    const formattedBeats = beats.map((beat) => {
      const minutes = Math.floor(beat.duration / 60);
      const seconds = beat.duration % 60;
      const formattedDuration = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

      return {
        id: beat.id,
        title: beat.title,
        producer: beat.producer.username,
        producerId: beat.producer.id,
        bpm: beat.bpm,
        key: beat.key,
        genre: beat.genre,
        tags: beat.tags,
        price: beat.priceBasic,
        duration: formattedDuration,
        coverImage: beat.coverImage,
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
