export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const profileId = query.profileId as string;

  if (!profileId) {
    throw createError({
      statusCode: 400,
      message: "profileId is required",
    });
  }

  try {
    const count = await prisma.notification.count({
      where: {
        recipientId: profileId,
        isRead: false,
      },
    });

    return { count };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: "Failed to get unread count",
    });
  }
});
