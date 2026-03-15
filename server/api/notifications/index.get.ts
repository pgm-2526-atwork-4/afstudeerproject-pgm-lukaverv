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
    const notifications = await prisma.notification.findMany({
      where: { recipientId: profileId },
      include: {
        actor: {
          select: {
            id: true,
            userId: true,
            username: true,
            profilePicture: true,
          },
        },
        beat: {
          select: { id: true, title: true, coverImage: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return notifications;
  } catch (error: any) {
    console.error("Fetch notifications error:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch notifications",
    });
  }
});
