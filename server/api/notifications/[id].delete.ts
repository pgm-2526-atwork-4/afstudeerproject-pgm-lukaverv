export default defineEventHandler(async (event) => {
  const notificationId = getRouterParam(event, "id");
  const query = getQuery(event);
  const profileId = query.profileId as string;

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
    if (!notification)
      throw createError({ statusCode: 404, message: "Notification not found" });
    if (notification.recipientId !== profileId)
      throw createError({ statusCode: 403, message: "Not authorized" });

    await prisma.notification.delete({ where: { id: notificationId } });
    return { success: true };
  } catch (error: any) {
    if (error.statusCode) throw error;
    throw createError({
      statusCode: 500,
      message: "Failed to delete notification",
    });
  }
});
