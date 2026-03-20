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
            orderItems: true,
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

    return formatBeatResponse(beat);
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to fetch beat",
    });
  }
});
