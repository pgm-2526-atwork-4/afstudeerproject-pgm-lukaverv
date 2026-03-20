export default defineEventHandler(async (event) => {
  const beatId = getRouterParam(event, "beatId");

  if (!beatId) {
    throw createError({
      statusCode: 400,
      message: "Beat ID is required",
    });
  }

  try {
    // Count total likes for this beat
    const likesCount = await prisma.like.count({
      where: {
        beatId,
      },
    });

    return {
      beatId,
      count: likesCount,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: "Failed to get likes count",
    });
  }
});
