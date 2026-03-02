export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");

    if (!id) {
      throw createError({
        statusCode: 400,
        message: "Producer ID is required",
      });
    }

    // Fetch producer profile
    const producer = await prisma.profile.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        bio: true,
        role: true,
        profilePicture: true,
      },
    });

    if (!producer) {
      throw createError({
        statusCode: 404,
        message: "Producer not found",
      });
    }

    // Fetch all beats by this producer
    const beats = await prisma.beat.findMany({
      where: {
        producerId: id,
        isPublished: true,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format beats for frontend
    const formattedBeats = beats.map((beat) => {
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
        price: beat.priceBasic,
        priceBasic: beat.priceBasic,
        pricePremium: beat.pricePremium,
        priceExclusive: beat.priceExclusive,
        duration: formattedDuration,
        coverImage: beat.coverImage,
      };
    });

    return {
      producer,
      beats: formattedBeats,
    };
  } catch (error) {
    console.error("Error fetching producer beats:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch producer beats",
    });
  }
});
