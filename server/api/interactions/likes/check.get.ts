export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { beatId, profileId } = query;

  if (!beatId || !profileId) {
    throw createError({
      statusCode: 400,
      message: "Missing required parameters: beatId and profileId",
    });
  }

  try {
    const like = await prisma.like.findUnique({
      where: {
        profileId_beatId: {
          profileId: profileId as string,
          beatId: beatId as string,
        },
      },
    });

    return {
      liked: !!like,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: "Failed to check like status",
    });
  }
});
