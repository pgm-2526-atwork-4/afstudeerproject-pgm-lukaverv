export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { beatId, profileId, text } = body;

  if (!beatId || !profileId || !text?.trim()) {
    throw createError({
      statusCode: 400,
      message: "beatId, profileId and text are required",
    });
  }

  const comment = await prisma.comment.create({
    data: {
      beatId,
      profileId,
      text: text.trim(),
    },
    include: {
      profile: {
        select: { id: true, username: true, profilePicture: true },
      },
    },
  });

  // Create notification for the beat producer
  try {
    const beat = await prisma.beat.findUnique({
      where: { id: beatId },
      select: { producerId: true },
    });
    if (beat && beat.producerId !== profileId) {
      await prisma.notification.create({
        data: {
          recipientId: beat.producerId,
          actorId: profileId,
          type: "COMMENT",
          beatId,
        },
      });
    }
  } catch (e) {
    console.error("Failed to create comment notification:", e);
  }

  return {
    id: comment.id,
    text: comment.text,
    createdAt: comment.createdAt,
    profileId: comment.profileId,
    author: comment.profile.username,
    authorPicture: comment.profile.profilePicture,
  };
});
