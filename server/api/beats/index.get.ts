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

    return formatBeatsResponse(beats);
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to fetch beats",
    });
  }
});
