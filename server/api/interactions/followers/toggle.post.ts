export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { followerProfileId, followingProfileId } = body;

  if (!followerProfileId || !followingProfileId) {
    throw createError({
      statusCode: 400,
      message: "followerProfileId and followingProfileId are required",
    });
  }

  if (followerProfileId === followingProfileId) {
    throw createError({ statusCode: 400, message: "Cannot follow yourself" });
  }

  const existing = await prisma.follow.findUnique({
    where: {
      followerProfileId_followingProfileId: {
        followerProfileId,
        followingProfileId,
      },
    },
  });

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
    return { following: false };
  } else {
    await prisma.follow.create({
      data: { followerProfileId, followingProfileId },
    });

    // Create notification for the followed user (deduplicated)
    try {
      const existing = await prisma.notification.findFirst({
        where: {
          recipientId: followingProfileId,
          actorId: followerProfileId,
          type: "FOLLOW",
        },
      });
      if (!existing) {
        await prisma.notification.create({
          data: {
            recipientId: followingProfileId,
            actorId: followerProfileId,
            type: "FOLLOW",
          },
        });
      } else {
        await prisma.notification.update({
          where: { id: existing.id },
          data: { isRead: false, createdAt: new Date() },
        });
      }
    } catch (e) {
      console.error("Failed to create follow notification:", e);
    }

    return { following: true };
  }
});
