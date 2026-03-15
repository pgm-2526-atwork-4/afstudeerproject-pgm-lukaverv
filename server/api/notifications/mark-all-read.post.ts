export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { profileId } = body;

  if (!profileId) {
    throw createError({
      statusCode: 400,
      message: "profileId is required",
    });
  }

  try {
    await prisma.notification.updateMany({
      where: {
        recipientId: profileId,
        isRead: false,
      },
      data: { isRead: true },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Mark all read error:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to mark all notifications as read",
    });
  }
});
