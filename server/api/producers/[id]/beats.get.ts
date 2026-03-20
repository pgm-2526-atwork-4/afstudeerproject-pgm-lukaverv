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

    return {
      producer,
      beats: formatBeatsResponse(beats),
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to fetch producer beats",
    });
  }
});
