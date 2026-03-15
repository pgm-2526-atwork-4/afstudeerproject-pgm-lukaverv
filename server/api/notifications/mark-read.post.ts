export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { notificationId, profileId, isRead = true } = body;

  if (!notificationId || !profileId) {
    throw createError({
      statusCode: 400,
      message: "notificationId and profileId are required",
    });
  }

  try {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw createError({ statusCode: 404, message: "Notification not found" });
    }

    if (notification.recipientId !== profileId) {
      throw createError({ statusCode: 403, message: "Not authorized" });
    }

    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead },
    });

    return { success: true };
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error("Mark read error:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to update notification",
    });
  }
});
